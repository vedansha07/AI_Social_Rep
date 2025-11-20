import {
  generateCaption,
  generateScript,
  generateScheduleSuggestions,
  generateContentIdeas,
  rewriteContent,
  getOpenAIStatus,
} from '../utils/ai.js';
import User from '../models/User.js';

// @desc    Get AI service status
// @route   GET /api/ai/status
// @access  Private
export const getAIStatusHandler = async (req, res) => {
  try {
    const status = getOpenAIStatus();
    res.json({
      success: true,
      data: status,
      message: status.initialized
        ? 'OpenAI is connected and ready'
        : 'OpenAI is not configured. Please set OPENAI_API_KEY in your .env file.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Generate caption from idea
// @route   POST /api/ai/generate-caption
// @access  Private
export const generateCaptionHandler = async (req, res) => {
  try {
    const { idea, platform } = req.body;
    const user = await User.findById(req.user._id);

    if (!idea || !platform) {
      return res.status(400).json({ success: false, message: 'Please provide idea and platform' });
    }

    if (typeof idea !== 'string' || idea.length < 3 || idea.length > 2000) {
      return res.status(400).json({ success: false, message: 'Idea must be a string between 3 and 2000 characters' });
    }

    const caption = await generateCaption(idea, platform, user.tone || 'professional');
    res.json({ success: true, data: { caption } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Generate script
// @route   POST /api/ai/generate-script
// @access  Private
export const generateScriptHandler = async (req, res) => {
  try {
    const { idea, platform } = req.body;
    const user = await User.findById(req.user._id);

    if (!idea || !platform) {
      return res.status(400).json({ success: false, message: 'Please provide idea and platform' });
    }

    if (typeof idea !== 'string' || idea.length < 3 || idea.length > 5000) {
      return res.status(400).json({ success: false, message: 'Idea must be a string between 3 and 5000 characters' });
    }

    const script = await generateScript(idea, platform, user.tone || 'professional');
    res.json({ success: true, data: { script } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Generate posting schedule suggestions
// @route   POST /api/ai/schedule-suggestions
// @access  Private
export const generateScheduleHandler = async (req, res) => {
  try {
    const { platform } = req.body;
    const user = await User.findById(req.user._id);

    if (!platform) {
      return res.status(400).json({ success: false, message: 'Please provide platform' });
    }

    const suggestions = await generateScheduleSuggestions(user.niche || 'general', platform);
    res.json({ success: true, data: { suggestions } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Generate content ideas
// @route   POST /api/ai/content-ideas
// @access  Private
export const generateIdeasHandler = async (req, res) => {
  try {
    const { count } = req.body;
    const user = await User.findById(req.user._id);

    const ideas = await generateContentIdeas(user.niche || 'general', count || 10);
    res.json({ success: true, data: { ideas } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Rewrite content in user's tone
// @route   POST /api/ai/rewrite
// @access  Private
export const rewriteContentHandler = async (req, res) => {
  try {
    const { content, platform } = req.body;
    const user = await User.findById(req.user._id);

    if (!content) {
      return res.status(400).json({ success: false, message: 'Please provide content to rewrite' });
    }

    const rewritten = await rewriteContent(
      content,
      user.tone || 'professional',
      platform || 'general'
    );
    res.json({ success: true, data: { rewritten } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

