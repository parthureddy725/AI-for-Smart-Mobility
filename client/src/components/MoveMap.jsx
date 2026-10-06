import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function MoveMap({
  vehicles = [],
  routes = [],
  selectedRouteIndex = 0,
  congestionZones = [],
  center = [17.4435, 78.3772],
  zoom = 12,
  onVehicleClick
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      attributionControl: false
    });

    // Dark Basemap (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers, polylines, congestion zones dynamically
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const map = mapInstanceRef.current;
    const layer = layerGroupRef.current;
    layer.clearLayers();

    const bounds = [];

    // 1. Render Congestion Risk Hotspots
    if (congestionZones && congestionZones.length > 0) {
      congestionZones.forEach(zone => {
        const circleColor = zone.severity === 'High' ? '#f43f5e' : zone.severity === 'Medium' ? '#f59e0b' : '#10b981';
        const circle = L.circle([zone.lat || 17.44, zone.lng || 78.38], {
          color: circleColor,
          fillColor: circleColor,
          fillOpacity: 0.18,
          radius: 950,
          weight: 1.5,
          dashArray: '4, 6'
        }).addTo(layer);

        circle.bindPopup(`
          <div style="font-family: Inter, sans-serif; color: #0d1527; padding: 4px;">
            <b style="color: ${circleColor}">⚠️ ${zone.zone || 'Congestion Zone'}</b><br/>
            <small style="color: #475569">${zone.reason || 'Peak hour traffic throttle'}</small><br/>
            <span style="font-weight: 600; font-size: 11px;">Delay: +${zone.delayMin || 10} mins</span>
          </div>
        `);
      });
    }

    // 2. Render Vehicle markers
    if (vehicles && vehicles.length > 0) {
      vehicles.forEach(v => {
        if (!v.location || !v.location.lat) return;
        const isEV = v.fuelType === 'Electric';
        const statusColor = v.status === 'Active' ? '#10b981' : v.status === 'Maintenance' ? '#f43f5e' : '#38bdf8';

        const customIcon = L.divIcon({
          className: 'custom-vehicle-marker',
          html: `
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #0d1527;
              border: 2px solid ${statusColor};
              border-radius: 8px;
              color: #f1f5f9;
              font-size: 11px;
              font-weight: 700;
              padding: 3px 7px;
              box-shadow: 0 0 14px ${statusColor}88;
              cursor: pointer;
              transform: translate(-50%, -50%);
              white-space: nowrap;
            ">
              <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${statusColor}; margin-right:5px;"></span>
              ${v.id} ${isEV ? '⚡' : '🚛'}
            </div>
          `,
          iconSize: [60, 26],
          iconAnchor: [30, 13]
        });

        const marker = L.marker([v.location.lat, v.location.lng], { icon: customIcon }).addTo(layer);
        bounds.push([v.location.lat, v.location.lng]);

        marker.on('click', () => {
          if (onVehicleClick) onVehicleClick(v);
        });

        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; color: #0f172a; min-width: 170px;">
            <div style="font-weight: 700; font-size: 13px; color: #0284c7;">${v.name} (${v.id})</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${v.vehicleNumber} • ${v.type}</div>
            <div style="display:flex; justify-content:space-between; font-size: 11px; margin-bottom: 4px;">
              <span>Driver:</span> <b>${v.driver?.name}</b>
            </div>
            <div style="display:flex; justify-content:space-between; font-size: 11px; margin-bottom: 4px;">
              <span>Charge/Fuel:</span> <b>${v.batteryOrFuelPct}%</b>
            </div>
            <div style="display:flex; justify-content:space-between; font-size: 11px; margin-bottom: 4px;">
              <span>Payload:</span> <b>${v.currentPayloadKg}/${v.capacityKg} kg</b>
            </div>
            <div style="margin-top: 6px; padding: 3px 6px; border-radius: 4px; background: #e0f2fe; color: #0369a1; font-size: 10px; font-weight:600;">
              Status: ${v.status}
            </div>
          </div>
        `);
      });
    }

    // 3. Render Route Polylines
    if (routes && routes.length > 0) {
      routes.forEach((route, idx) => {
        if (!route.waypoints || route.waypoints.length === 0) return;
        const isSelected = idx === selectedRouteIndex;
        const color = isSelected ? '#00f2fe' : '#64748b';
        const weight = isSelected ? 5 : 3;
        const opacity = isSelected ? 0.95 : 0.45;

        const polyline = L.polyline(route.waypoints, {
          color: color,
          weight: weight,
          opacity: opacity,
          lineJoin: 'round',
          dashArray: isSelected ? null : '6, 8'
        }).addTo(layer);

        route.waypoints.forEach(pt => bounds.push(pt));

        // Start & End markers for the selected route
        if (isSelected && route.waypoints.length > 1) {
          const startPt = route.waypoints[0];
          const endPt = route.waypoints[route.waypoints.length - 1];

          // Start Marker
          L.marker(startPt, {
            icon: L.divIcon({
              className: 'route-start-marker',
              html: `<div style="background:#10b981; color:#fff; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold; box-shadow:0 0 12px #10b981;">A</div>`,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            })
          }).addTo(layer).bindPopup("<b>Route Origin</b>");

          // End Marker
          L.marker(endPt, {
            icon: L.divIcon({
              className: 'route-end-marker',
              html: `<div style="background:#f43f5e; color:#fff; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold; box-shadow:0 0 12px #f43f5e;">B</div>`,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            })
          }).addTo(layer).bindPopup("<b>Route Destination</b>");
        }
      });
    }

    // Auto-fit bounds if markers exist
    if (bounds.length > 1) {
      try {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [vehicles, routes, selectedRouteIndex, congestionZones]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '380px', position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: 500,
        background: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '11px',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span><span style={{ color: '#10b981' }}>●</span> Active Fleet</span>
        <span><span style={{ color: '#00f2fe' }}>―</span> AI Route</span>
        <span><span style={{ color: '#f43f5e' }}>●</span> Congestion</span>
      </div>
    </div>
  );
}
