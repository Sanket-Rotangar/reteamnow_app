import express from 'express';
import {
  getAllCompetitions,
  getCompetitionById,
  createCompetition,
  getPostsForCompetition,
  createPost,
  reactToPost,
  addCommentToPost,
  getCommentsForPost
} from '../controllers/eventController_new.js';

const router = express.Router();

// Public routes for competitions
router.get('/competitions', getAllCompetitions);
router.get('/competitions/:competitionId', getCompetitionById);
router.get('/competitions/:competitionId/posts', getPostsForCompetition);

// Post-related routes
router.post('/competitions/:competitionId/posts', createPost);
router.post('/posts/:postId/react', reactToPost);
router.post('/posts/:postId/comments', addCommentToPost);
router.get('/posts/:postId/comments', getCommentsForPost);

// Admin routes (can be secured later)
router.post('/admin/competitions', createCompetition);

export default router;