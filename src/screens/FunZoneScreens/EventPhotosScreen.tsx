import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Image,
  TextInput,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { Post, getPostsForCompetition, reactToPost, addCommentToPost, getCommentsForPost, Comment } from '../../services/eventService';

// --- PostItem Component (Consolidated) ---
interface PostItemProps {
  post: Post;
  onLikePress: (postId: string, hasLiked: boolean) => void;
  onCommentPress: (postId: string) => void;
  onSharePress: (post: Post) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onLikePress, onCommentPress, onSharePress }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Load comments when the component mounts if there are any
  useEffect(() => {
    if (post.comments_count > 0) {
      loadComments();
    }
  }, [post._id]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const fetchedComments = await getCommentsForPost(post._id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const result = await addCommentToPost(post._id, commentText.trim());
      
      if (result) {
        setCommentText('');
        setShowCommentInput(false);
        await loadComments(); // Reload comments to show the new one
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Comment added successfully!',
        });
      } else {
        Alert.alert('Error', 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentPress = () => {
    setShowCommentInput(!showCommentInput);
    onCommentPress(post._id);
  };

  const renderCommentItem = (comment: Comment) => (
    <View key={comment._id} style={postStyles.commentItem}>
      <Image
        source={{ uri: comment.user.profile_picture }}
        style={postStyles.commentProfileImage}
      />
      <View style={postStyles.commentContent}>
        <Text style={postStyles.commentUsername}>{comment.user.username}</Text>
        <Text style={postStyles.commentText}>{comment.text}</Text>
      </View>
    </View>
  );

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);
  const hasMoreComments = comments.length > 2 && !showAllComments;

  return (
    <View style={postStyles.postContainer}>
      {/* Post Header (User Info) */}
      <View style={postStyles.postHeader}>
        <Image
          source={{ uri: post.user.profile_picture }}
          style={postStyles.profileImage}
        />
        <Text style={postStyles.username}>{post.user.username}</Text>
      </View>

      {/* Post Image */}
      <Image
        source={{ uri: post.media_url }}
        style={postStyles.postImage}
      />

      {/* Post Actions */}
      <View style={postStyles.postActions}>
        <TouchableOpacity onPress={() => onLikePress(post._id, post.has_liked || false)}>
          <Icon
            name={post.has_liked ? 'heart' : 'heart-outline'}
            size={24}
            color={post.has_liked ? '#FF3B30' : '#1D1D1F'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCommentPress}>
          <Icon name="chatbubble-outline" size={22} color="#1D1D1F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSharePress(post)}>
          <Icon name="share-outline" size={22} color="#1D1D1F" />
        </TouchableOpacity>
      </View>

      {/* Post Metadata (Likes and Comments) */}
      <View style={postStyles.postMetadata}>
        <Text style={postStyles.metadataText}>
          <Text style={postStyles.boldText}>{post.likes_count} likes</Text> and{' '}
          <Text style={postStyles.boldText}>{post.comments_count} comments</Text>
        </Text>
      </View>

      {/* Post Caption */}
      <View style={postStyles.postCaption}>
        <Text style={postStyles.captionText}>
          <Text style={postStyles.boldText}>{post.user.username}</Text> {post.caption}
        </Text>
      </View>

      {/* Comments Section */}
      {comments.length > 0 && (
        <View style={postStyles.commentsSection}>
          {loadingComments ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <>
              {displayedComments.map(renderCommentItem)}
              {hasMoreComments && (
                <TouchableOpacity 
                  onPress={() => setShowAllComments(true)}
                  style={postStyles.viewAllCommentsButton}
                >
                  <Text style={postStyles.viewAllCommentsText}>
                    View all {comments.length} comments
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      )}

      {/* Comment Input */}
      {showCommentInput && (
        <View style={postStyles.commentInputContainer}>
          <TextInput
            style={postStyles.commentInput}
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={300}
          />
          <View style={postStyles.commentActions}>
            <TouchableOpacity
              style={postStyles.cancelButton}
              onPress={() => {
                setShowCommentInput(false);
                setCommentText('');
              }}
            >
              <Text style={postStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[postStyles.submitButton, isSubmittingComment && postStyles.disabledButton]}
              onPress={handleCommentSubmit}
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={postStyles.submitButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

interface Props {
  navigation: any;
  route: { params: { competitionId: string, competitionTitle: string } };
}

// Empty component moved outside render
const EmptyListComponent = () => (
  <View style={styles.emptyContainer}>
    <Icon name="images-outline" size={48} color="#8E8E93" />
    <Text style={styles.emptyTitle}>No Photos Yet</Text>
    <Text style={styles.emptySubtitle}>
      Be the first to share your photo for this competition!
    </Text>
  </View>
);

const CompetitionDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { competitionId, competitionTitle } = route.params;

  // ===== STATE MANAGEMENT =====
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ===== DATA FETCHING =====
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getPostsForCompetition(competitionId);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Fetch posts error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load posts.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [competitionId]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  // ===== LIFECYCLE =====
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ===== EVENT HANDLERS =====
  const handleLikePress = useCallback(async (postId: string, hasLiked: boolean) => {
    try {
      // Prevent multiple rapid clicks
      if (hasLiked) {
        Toast.show({
          type: 'info',
          text1: 'Already Liked',
          text2: 'You have already liked this post',
        });
        return;
      }

      // Optimistically update the UI
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes_count: post.likes_count + 1,
                has_liked: true,
              }
            : post,
        ),
      );

      // Call the API
      const result = await reactToPost(postId);
      
      if (!result) {
        // Revert the optimistic update if API call failed
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId
              ? {
                  ...post,
                  likes_count: post.likes_count - 1,
                  has_liked: false,
                }
              : post,
          ),
        );
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to like post',
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Liked!',
          text2: 'You liked this post',
        });
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
      // Revert the optimistic update
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes_count: hasLiked ? post.likes_count + 1 : post.likes_count - 1,
                has_liked: hasLiked,
              }
            : post,
        ),
      );
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to like post',
      });
    }
  }, []);

  const handleCommentPress = useCallback((postId: string) => {
    // Navigate to a new screen or show a modal for comments
    // navigation.navigate('CommentsModal', { postId });
    Toast.show({
      type: 'info',
      text1: 'Comments',
      text2: `Opening comments for post: ${postId}`,
    });
  }, []);

  const handleSharePress = useCallback(async (post: Post) => {
    try {
      const message = `Check out this post from ${post.user.username}: ${post.caption}`;
      const shareOptions = {
        message: message,
        url: post.media_url, // This will include the image URL
        title: 'Shared from Fun Zone',
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing post:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to share post',
      });
    }
  }, []);
  
  const handleCreatePost = () => {
    // Navigate to the create post screen
    navigation.navigate('CreatePost', { 
      competitionId,
      competitionTitle,
      onPostCreated: fetchPosts // Callback to refresh posts after creation
    });
  };

  // ===== MAIN RENDER =====
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{competitionTitle}</Text>
          <Text style={styles.headerSubtitle}>Photo Feed</Text>
        </View>
        <TouchableOpacity
          style={styles.headerActions}
          onPress={handleCreatePost}
        >
          <Icon name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content using FlatList */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PostItem
              post={item}
              onLikePress={handleLikePress}
              onCommentPress={handleCommentPress}
              onSharePress={handleSharePress}
            />
          )}
          contentContainerStyle={styles.postListContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={EmptyListComponent}
        />
      )}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  headerActions: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  postListContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

// PostItem Styles
const postStyles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  postMetadata: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  metadataText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  boldText: {
    fontWeight: '700',
    color: '#1D1D1F',
  },
  postCaption: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1D1D1F',
  },
  commentInputContainer: {
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    padding: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 40,
    maxHeight: 100,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    minWidth: 60,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#8E8E93',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Comments section styles
  commentsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentProfileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 13,
    color: '#1D1D1F',
    lineHeight: 18,
  },
  viewAllCommentsButton: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  viewAllCommentsText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
  },
});

export default CompetitionDetailsScreen;
