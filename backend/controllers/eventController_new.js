
import mongoose from 'mongoose';
import Event, { EventPhoto } from '../models/Events.model.js';
import User from '../models/user-model.js';

/**
 * Get all competitions with optional status filter
 */
export const getAllCompetitions = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const competitions = await Event.find(query)
      .select('title description status createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Transform to match frontend interface
    const formattedCompetitions = competitions.map(comp => ({
      _id: comp._id,
      name: comp.title,
      description: comp.description,
      status: comp.status,
      start_date: comp.createdAt
    }));

    res.status(200).json({
      success: true,
      data: formattedCompetitions
    });
  } catch (error) {
    console.error('Error fetching competitions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch competitions',
      error: error.message
    });
  }
};

/**
 * Get a single competition by ID
 */
export const getCompetitionById = async (req, res) => {
  try {
    const { competitionId } = req.params;
    
    const competition = await Event.findById(competitionId)
      .select('title description status createdAt')
      .lean();

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    // Transform to match frontend interface
    const formattedCompetition = {
      _id: competition._id,
      name: competition.title,
      description: competition.description,
      status: competition.status,
      start_date: competition.createdAt
    };

    res.status(200).json({
      success: true,
      data: formattedCompetition
    });
  } catch (error) {
    console.error('Error fetching competition:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch competition',
      error: error.message
    });
  }
};

/**
 * Create a new competition
 */
export const createCompetition = async (req, res) => {
  try {
    const { name, description, status, start_date, location, maxCapacity } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }

    const newCompetition = new Event({
      title: name,
      description,
      status: status || 'active',
      location: location || 'Office',
      maxCapacity: maxCapacity || null,
      createdBy: req.user?._id || new mongoose.Types.ObjectId(), // Use actual user in real app
    });

    const savedCompetition = await newCompetition.save();

    // Transform to match frontend interface
    const formattedCompetition = {
      _id: savedCompetition._id,
      name: savedCompetition.title,
      description: savedCompetition.description,
      status: savedCompetition.status,
      start_date: savedCompetition.createdAt
    };

    res.status(201).json({
      success: true,
      data: formattedCompetition,
      message: 'Competition created successfully'
    });
  } catch (error) {
    console.error('Error creating competition:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create competition',
      error: error.message
    });
  }
};

/**
 * Fetches all posts for a specific competition.
 */
export const getPostsForCompetition = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const currentUserId = req.user?._id || null;

    console.log('Fetching posts for competition:', competitionId);

    const posts = await EventPhoto.find({ event: competitionId })
      .populate('user', 'username userLogo')
      .sort({ createdAt: -1 })
      .lean();

    console.log('Found posts:', posts.length);
    console.log('Posts with null users:', posts.filter(post => !post.user).length);

    // Transform to match frontend interface
    const formattedPosts = posts
      .filter(post => post.user) // Filter out posts with null users
      .map(post => {
        const hasLiked = currentUserId ? post.likes.includes(currentUserId) : false;
        
        return {
          _id: post._id,
          competition_id: post.event,
          user: {
            _id: post.user._id,
            username: post.user.username || 'Unknown User',
            profile_picture: post.user.userLogo || 'https://placehold.co/100x100/A0B2C8/FFFFFF?text=U'
          },
          media_url: post.imageUrl,
          caption: post.caption,
          likes_count: post.likeCount,
          comments_count: post.commentCount,
          created_at: post.createdAt,
          has_liked: hasLiked
        };
      });

    res.status(200).json({
      success: true,
      data: formattedPosts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
};

/**
 * Create a new post for a competition
 */
export const createPost = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const { media_url, caption, user_id } = req.body;

    console.log('Create post request:', { competitionId, media_url, caption, user_id });

    if (!media_url) {
      return res.status(400).json({
        success: false,
        message: 'Media URL is required'
      });
    }

    // Check if competition exists
    const competition = await Event.findById(competitionId);
    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    // Validate user_id if provided
    let finalUserId = user_id || req.user?._id;
    if (!finalUserId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if user exists
    const userExists = await User.findById(finalUserId);
    if (!userExists) {
      console.log('User not found with ID:', finalUserId);
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    const newPost = new EventPhoto({
      event: competitionId,
      user: finalUserId,
      imageUrl: media_url,
      caption: caption || '',
    });

    const savedPost = await newPost.save();
    await savedPost.populate('user', 'username userLogo');

    // Check if populate worked
    if (!savedPost.user) {
      console.error('User population failed for post:', savedPost._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to populate user data'
      });
    }

    // Transform to match frontend interface
    const formattedPost = {
      _id: savedPost._id,
      competition_id: savedPost.event,
      user: {
        _id: savedPost.user._id,
        username: savedPost.user.username,
        profile_picture: savedPost.user.userLogo || 'https://placehold.co/100x100/A0B2C8/FFFFFF?text=U'
      },
      media_url: savedPost.imageUrl,
      caption: savedPost.caption,
      likes_count: savedPost.likeCount,
      comments_count: savedPost.commentCount,
      created_at: savedPost.createdAt,
      has_liked: false
    };

    res.status(201).json({
      success: true,
      data: formattedPost,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
};

/**
 * Toggles a like/reaction on a post.
 */
export const reactToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await EventPhoto.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const hasLiked = post.likes.includes(userIdObj);

    if (hasLiked) {
      // Remove like
      post.likes = post.likes.filter(id => !id.equals(userIdObj));
    } else {
      // Add like
      post.likes.push(userIdObj);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? 'Reaction removed' : 'Reaction added',
      data: { 
        newLikesCount: post.likeCount, 
        hasLiked: !hasLiked 
      }
    });
  } catch (error) {
    console.error('Error reacting to post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to react to post',
      error: error.message
    });
  }
};

/**
 * Adds a new comment to a post.
 */
export const addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const post = await EventPhoto.findById(postId).populate('user', 'username profile_picture');
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const newComment = {
      user: new mongoose.Types.ObjectId(userId),
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();
    
    // Populate the newly added comment
    await post.populate('comments.user', 'username profile_picture');
    const addedComment = post.comments[post.comments.length - 1];

    // Transform to match frontend interface
    const formattedComment = {
      _id: addedComment._id,
      user: {
        _id: addedComment.user._id,
        username: addedComment.user.username,
        profile_picture: addedComment.user.profile_picture || 'https://placehold.co/100x100/A0B2C8/FFFFFF?text=U'
      },
      text: addedComment.text,
      created_at: addedComment.createdAt
    };

    res.status(201).json({
      success: true,
      data: formattedComment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

/**
 * Get all comments for a post
 */
export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await EventPhoto.findById(postId)
      .populate('comments.user', 'username profile_picture')
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Transform to match frontend interface
    const formattedComments = post.comments.map(comment => ({
      _id: comment._id,
      user: {
        _id: comment.user._id,
        username: comment.user.username,
        profile_picture: comment.user.profile_picture || 'https://placehold.co/100x100/A0B2C8/FFFFFF?text=U'
      },
      text: comment.text,
      created_at: comment.createdAt
    }));

    res.status(200).json({
      success: true,
      data: formattedComments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};