import User from '../models/User.js';
import { validatePlatformUrl } from '../utils/urlValidator.js';

// @desc    Connect social account using URL
// @route   POST /api/social/connect
// @access  Private
export const connectAccount = async (req, res) => {
  try {
    const { platform, url } = req.body;

    if (!platform || !url) {
      return res.status(400).json({ success: false, message: 'Please provide platform and URL' });
    }

    // Validate URL
    const validation = validatePlatformUrl(url, platform);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const user = await User.findById(req.user._id);
    
    // Check if account already exists for this platform
    const existingIndex = user.connectedAccounts.findIndex(
      (acc) => acc.platform === platform
    );

    if (existingIndex !== -1) {
      // Update existing account
      user.connectedAccounts[existingIndex].url = url;
    } else {
      // Add new account
      user.connectedAccounts.push({ platform, url });
    }

    await user.save();

    res.json({ success: true, data: user.connectedAccounts, message: 'Account connected successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all connected accounts
// @route   GET /api/social/accounts
// @access  Private
export const getAccounts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('connectedAccounts');
    res.json({ success: true, data: user.connectedAccounts || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Disconnect social account
// @route   DELETE /api/social/accounts/:platform
// @access  Private
export const disconnectAccount = async (req, res) => {
  try {
    const { platform } = req.params;
    const user = await User.findById(req.user._id);

    user.connectedAccounts = user.connectedAccounts.filter(
      (acc) => acc.platform !== platform
    );

    await user.save();

    res.json({ success: true, data: user.connectedAccounts, message: 'Account disconnected successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

