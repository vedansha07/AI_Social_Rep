import Draft from '../models/Draft.js';

// @desc    Get all drafts for user
// @route   GET /api/drafts
// @access  Private
export const getDrafts = async (req, res) => {
  try {
    const drafts = await Draft.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: drafts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single draft
// @route   GET /api/drafts/:id
// @access  Private
export const getDraft = async (req, res) => {
  try {
    const draft = await Draft.findOne({ _id: req.params.id, userId: req.user._id });

    if (!draft) {
      return res.status(404).json({ success: false, message: 'Draft not found' });
    }

    res.json({ success: true, data: draft });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create draft
// @route   POST /api/drafts
// @access  Private
export const createDraft = async (req, res) => {
  try {
    const { title, idea, caption, script, platform } = req.body;

    if (!title || !idea || !platform) {
      return res.status(400).json({ success: false, message: 'Please provide title, idea, and platform' });
    }

    const draft = await Draft.create({
      userId: req.user._id,
      title,
      idea,
      caption: caption || '',
      script: script || '',
      platform,
      status: 'draft',
    });

    res.status(201).json({ success: true, data: draft });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update draft
// @route   PUT /api/drafts/:id
// @access  Private
export const updateDraft = async (req, res) => {
  try {
    const { title, idea, caption, script, platform, status } = req.body;

    const draft = await Draft.findOne({ _id: req.params.id, userId: req.user._id });

    if (!draft) {
      return res.status(404).json({ success: false, message: 'Draft not found' });
    }

    if (title !== undefined) draft.title = title;
    if (idea !== undefined) draft.idea = idea;
    if (caption !== undefined) draft.caption = caption;
    if (script !== undefined) draft.script = script;
    if (platform !== undefined) draft.platform = platform;
    if (status !== undefined) draft.status = status;

    await draft.save();

    res.json({ success: true, data: draft });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete draft
// @route   DELETE /api/drafts/:id
// @access  Private
export const deleteDraft = async (req, res) => {
  try {
    const draft = await Draft.findOne({ _id: req.params.id, userId: req.user._id });

    if (!draft) {
      return res.status(404).json({ success: false, message: 'Draft not found' });
    }

    await draft.deleteOne();

    res.json({ success: true, data: { id: req.params.id }, message: 'Draft deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

