const { queryMobilityAssistant } = require('../services/ai.service');

const askAssistant = async (req, res) => {
  try {
    const { prompt, chatHistory } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt query is required' });
    }

    const result = await queryMobilityAssistant(prompt, chatHistory);
    return res.json({
      success: true,
      reply: result.reply,
      source: result.source,
      groundedData: result.groundedData
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  askAssistant
};
