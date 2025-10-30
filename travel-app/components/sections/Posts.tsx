'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Calendar, User, Star, Eye, MoreHorizontal, Plus, X, Upload, Camera, Lock, LogIn } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TravelGuideAPI } from '../../lib/api';

// Comment interface
interface Comment {
  id: string;
  text: string;
  userName: string;
  userId: string;
  dateCreated: string;
}

// Post interface based on your API response
interface Post {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  likesCount: number;
  commentCount: number;
  location: string;
  userId: string;
  userName: string;
  dateCreated: string;
  comments?: Comment[];
}

// Create Post interface
interface CreatePostData {
  title: string;
  description: string;
  location: string;
  images: File[];
}

// Create Post Component
const CreatePost: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    description: '',
    location: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is authenticated
  const isAuthenticated = status === 'authenticated' && session?.user;

  // Sync NextAuth token with localStorage for API compatibility
  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem('authToken', session.accessToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [session?.accessToken]);

  // Note: Toast functionality is handled by the parent Posts component

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files].slice(0, 5) // Max 5 images
      }));

      // Create preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImages(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check authentication first
    if (!isAuthenticated) {
      setError('You must be logged in to create a post');
      return;
    }

    // Validate form data
    if (!formData.title.trim()) {
      setError('Please enter a title for your post');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description for your post');
      return;
    }
    if (formData.images.length === 0) {
      setError('Please add at least one image to your post');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!session?.accessToken) {
        setError('Authentication token not found. Please log out and log in again.');
        return;
      }

      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('location', formData.location.trim());
      
      // Add user information if available
      if (session?.user?.id) {
        submitData.append('userId', session.user.id);
      }
      
      formData.images.forEach((image) => {
        submitData.append('images', image);
      });

      const result = await TravelGuideAPI.createPost(submitData);
      
      // Reset form on success
      setFormData({ title: '', description: '', location: '', images: [] });
      setPreviewImages([]);
      setIsOpen(false);
      setError(null);
      onPostCreated();
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
      successMessage.textContent = '✅ Post created successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);
      
    } catch (error: any) {
      console.error('Error creating post:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => router.push('/auth/signin'), 2000);
      } else if (error.response?.status === 413) {
        setError('Images are too large. Please use smaller images (max 10MB each).');
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.message || 'Invalid data. Please check your inputs.');
      } else if (error.message?.includes('Network Error')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to create post. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', location: '', images: [] });
    setPreviewImages([]);
    setError(null);
    setIsOpen(false);
  };

  return (
    <>
      {/* Create Post Button */}
      <div className="mb-8">
        {isAuthenticated ? (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-3">
              <Plus className="w-6 h-6" />
              <span className="text-lg font-semibold">Share Your Travel Experience</span>
            </div>
            <p className="text-blue-100 mt-2 text-sm">Create a new post to inspire fellow travelers</p>
          </button>
        ) : (
          <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Lock className="w-6 h-6 text-gray-500" />
              <span className="text-lg font-semibold text-gray-700">Want to Share Your Story?</span>
            </div>
            <p className="text-gray-600 mb-4">Join our community to share your amazing travel experiences</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push('/auth/signin')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Post
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-red-800 font-medium">Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your post an amazing title..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Where was this taken?"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Share your travel story, tips, or experiences..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Images * (Max 5)
                </label>
                
                {/* Upload Button */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Click to upload images</p>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB each</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 py-3 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};



const Posts: React.FC = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [postComments, setPostComments] = useState<{ [postId: string]: Comment[] }>({});

  // Initialize comments for a post (local state only since API doesn't support GET)
  const initializeCommentsState = (postId: string) => {
    if (!postComments[postId]) {
      setPostComments(prev => ({
        ...prev,
        [postId]: []
      }));
    }
  };
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  // Sync NextAuth token with localStorage for API compatibility
  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem('authToken', session.accessToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [session?.accessToken]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch posts function (Instagram-like behavior)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      console.log('=== POSTS FETCH DEBUG ===');
      console.log('User authenticated:', status === 'authenticated');
      console.log('User session:', session?.user);
      console.log('Auth token:', localStorage.getItem('authToken'));
      
      // Try to get posts with user data first (Instagram approach)
      let fetchedPosts;
      if (status === 'authenticated') {
        try {
          fetchedPosts = await TravelGuideAPI.getPostsWithUserData();
          console.log('Fetched posts with user data:', fetchedPosts);
        } catch (userDataError) {
          console.log('Failed to get posts with user data, falling back to regular posts');
          fetchedPosts = await TravelGuideAPI.getAllPosts();
        }
      } else {
        fetchedPosts = await TravelGuideAPI.getAllPosts();
      }
      
      console.log('Final fetched posts:', fetchedPosts);
      console.log('First post structure:', fetchedPosts[0]);
      
      // Normalize posts data to ensure all required fields exist
              const normalizedPosts = fetchedPosts.map((post: any) => ({
                ...post,
                id: post.id || post._id || `temp-${Date.now()}-${Math.random()}`,
                title: post.title || 'Untitled Post',
                description: post.description || post.content || '',
                likesCount: post.likesCount || post.likes || post.likeCount || 0,
                commentCount: post.commentCount || post.comments || post.commentsCount || post.commentLength || 0,
                imageUrls: post.imageUrls || post.images || (post.imageUrl ? [post.imageUrl] : []),
                userName: post.userName || post.username || post.user?.name || post.user?.username || 'Anonymous',
                userId: post.userId || post.user?.id || post.authorId || '',
                location: post.location || '',
                dateCreated: post.dateCreated || post.createdAt || post.created || new Date().toISOString()
              }));
      
      console.log('Normalized posts:', normalizedPosts);
      console.log('First normalized post:', normalizedPosts[0]);
      
      setPosts(normalizedPosts);
      
      // Initialize liked posts state (Instagram-like persistence)
      if (status === 'authenticated') {
        try {
          const userLikedPosts = new Set<string>();
          
          // Method 1: Check if posts include like status (preferred)
          fetchedPosts.forEach((post: any) => {
            // Check various possible field names for like status
            if (post.isLiked || post.likedByUser || post.isLikedByCurrentUser || 
                post.liked || post.userLiked || post.hasLiked) {
              userLikedPosts.add(post.id);
              console.log(`Post ${post.id} is liked by user`);
            }
          });
          
          // Method 2: If no like status in posts, fetch separately
          if (userLikedPosts.size === 0) {
            console.log('No like status in posts, fetching user likes separately...');
            const likedPostIds = await TravelGuideAPI.getUserLikedPosts();
            console.log('Fetched user liked post IDs:', likedPostIds);
            
            if (Array.isArray(likedPostIds)) {
              likedPostIds.forEach((postId: string) => {
                if (postId) userLikedPosts.add(postId);
              });
            }
          }
          
          console.log('Final user liked posts:', Array.from(userLikedPosts));
          setLikedPosts(userLikedPosts);
          
        } catch (likeError) {
          console.error('Error fetching user liked posts:', likeError);
          // Continue without like status - user can still interact
          setLikedPosts(new Set());
        }
      } else {
        // Clear liked posts for unauthenticated users
        setLikedPosts(new Set());
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh posts after creating a new one
  const refreshPosts = () => {
    fetchPosts();
  };

  // Fetch posts on component mount
  useEffect(() => {
    if (isVisible) {
      fetchPosts();
    }
  }, [isVisible]);

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // Initialize comments for a specific post (local state only)
  const initializeComments = (postId: string) => {
    initializeCommentsState(postId);
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLike = async (postId: string) => {
    if (status !== 'authenticated') {
      showToast('🔒 Please log in to like posts', 'info');
      return;
    }

    // Prevent multiple rapid clicks
    const wasLiked = likedPosts.has(postId);
    
    try {
      console.log('=== LIKE DEBUG ===');
      console.log('Post ID:', postId);
      console.log('Current like state:', wasLiked ? 'liked' : 'not liked');
      console.log('User ID:', session?.user?.id);
      console.log('Auth token:', localStorage.getItem('authToken'));
      
      // Make API call first (Instagram-like: server is source of truth)
      const response = await TravelGuideAPI.likePost(postId);
      console.log('Like API response:', response);
      
      // Update UI based on server response
      // The API should return the new like status and count
      if (response && typeof response === 'object') {
        // If API returns like status and count, use that
        if (response.isLiked !== undefined) {
          setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (response.isLiked) {
              newSet.add(postId);
            } else {
              newSet.delete(postId);
            }
            return newSet;
          });
        } else {
          // Fallback: toggle based on previous state
          setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (wasLiked) {
              newSet.delete(postId);
            } else {
              newSet.add(postId);
            }
            return newSet;
          });
        }

        // Update like count from server response or calculate
        const newLikeCount = response.likesCount || response.likeCount || (wasLiked ? -1 : 1);
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likesCount: typeof newLikeCount === 'number' ? newLikeCount : 
                           (wasLiked ? post.likesCount - 1 : post.likesCount + 1)
              }
            : post
        ));
      }

      // Show success message
      showToast(wasLiked ? '💔 Post unliked' : '❤️ Post liked!', 'success');
      
    } catch (error: any) {
      console.error('=== LIKE ERROR ===');
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Specific error handling
      if (error.response?.status === 401) {
        showToast('🔒 Authentication failed. Please log in again.', 'error');
      } else if (error.response?.status === 404) {
        showToast('❌ Post not found. Please refresh the page.', 'error');
      } else {
        showToast('❌ Failed to like post. Please try again.', 'error');
      }
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentText.trim()) {
      showToast('❌ Please enter a comment', 'error');
      return;
    }
    
    await handleComment(postId, commentText.trim());
  };

  const handleComment = async (postId: string, comment: string) => {
    if (status !== 'authenticated') {
      showToast('🔒 Please log in to comment', 'info');
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random()}`,
      text: comment,
      userName: session?.user?.name || session?.user?.email || 'You',
      userId: session?.user?.id || '',
      dateCreated: new Date().toISOString()
    };

    // Add comment to local state immediately for instant UI feedback
    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    // Update post comment count
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, commentCount: (post.commentCount || 0) + 1 }
        : post
    ));
    
    // Reset comment input
    setCommentText('');
    
    showToast('💬 Comment added successfully!', 'success');

    // Try to sync with API in background (non-blocking)
    try {
      await TravelGuideAPI.addComment(postId, comment);
      console.log('Comment synced with API successfully');
    } catch (error) {
      console.error('Failed to sync comment with API:', error);
      // Comment is still visible in UI, just not persisted to backend
    }
  };

  const handleShare = async (post: Post) => {
    try {
      if (navigator.share) {
        // Use native share API if available (mobile)
        await navigator.share({
          title: post.title,
          text: `Check out this amazing travel post: ${post.title}`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        const shareText = `Check out this amazing travel post: ${post.title}\n${post.description}\n\n${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        
        const successPrompt = document.createElement('div');
        successPrompt.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successPrompt.innerHTML = '🔗 Link copied to clipboard!';
        document.body.appendChild(successPrompt);
        setTimeout(() => document.body.removeChild(successPrompt), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      const errorPrompt = document.createElement('div');
      errorPrompt.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorPrompt.innerHTML = '❌ Failed to share';
      document.body.appendChild(errorPrompt);
      setTimeout(() => document.body.removeChild(errorPrompt), 2000);
    }
  };

  const handleBookmark = (postId: string) => {
    if (status !== 'authenticated') {
      const loginPrompt = document.createElement('div');
      loginPrompt.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      loginPrompt.innerHTML = '🔒 Please log in to bookmark posts';
      document.body.appendChild(loginPrompt);
      setTimeout(() => document.body.removeChild(loginPrompt), 3000);
      return;
    }

    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    const action = bookmarkedPosts.has(postId) ? 'removed from' : 'added to';
    const successPrompt = document.createElement('div');
    successPrompt.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successPrompt.innerHTML = `📌 Post ${action} bookmarks`;
    document.body.appendChild(successPrompt);
    setTimeout(() => document.body.removeChild(successPrompt), 3000);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getImageUrl = (imageUrls: string[] | undefined | null) => {
    if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
      const imageUrl = imageUrls[0];
      // Ensure imageUrl is a string before calling startsWith
      if (typeof imageUrl === 'string' && imageUrl.trim()) {
        // Handle relative URLs from your API
        if (imageUrl.startsWith('/')) {
          return `https://travelguide-rttu.onrender.com${imageUrl}`;
        }
        return imageUrl;
      }
    }
    // Fallback image
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
  };

  if (loading) {
    return (
      <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl animate-pulse"></div>
              <Heart className="relative w-10 h-10 text-white animate-pulse" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">🌟 Loading Travel Stories</h3>
              <p className="text-lg text-blue-700 font-semibold">Discovering amazing adventures shared by travelers...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-red-900">Unable to Load Posts</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto px-4">
        {/* Premium Section Header */}
        <div className={`text-center space-y-8 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-4 tracking-tight leading-none">
              Travel Stories
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
              Discover authentic travel experiences shared by fellow adventurers
            </p>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              Real stories, stunning photos, and insider tips from travelers exploring Nepal and beyond
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">{posts.length} Stories</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50 shadow-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Updates</span>
            </div>
          </div>
        </div>

        {/* Create Post Component */}
        <CreatePost onPostCreated={refreshPosts} />

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.filter(post => post && post.id && post.title).map((post, index) => (
            <div
              key={post.id}
              className={`group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50/80 to-white/90 backdrop-blur-sm border-b border-gray-100/60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm tracking-tight">
                      {post.userName || 'Travel Explorer'}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-gray-500">{formatDate(post.dateCreated)}</span>
                      {post.location && post.location.trim() && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-indigo-600 font-medium flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {post.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-100 rounded-full p-2">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Post Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={getImageUrl(post.imageUrls)}
                  alt={post.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-lg font-bold mb-1 tracking-tight line-clamp-2">
                    {post.title || 'Untitled Post'}
                  </h2>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6 bg-gradient-to-b from-white to-gray-50/30">
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.description || 'No description available'}
                </p>

                {/* Engagement */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 transition-all duration-300 hover:scale-110 active:scale-95 ${
                        likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 transition-all duration-300 ${
                          likedPosts.has(post.id) 
                            ? 'fill-current animate-pulse' 
                            : 'hover:fill-red-100'
                        }`} 
                      />
                      <span className="text-sm font-semibold">{post.likesCount || 0}</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (status !== 'authenticated') {
                          const loginPrompt = document.createElement('div');
                          loginPrompt.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                          loginPrompt.innerHTML = '🔒 Please log in to comment';
                          document.body.appendChild(loginPrompt);
                          setTimeout(() => document.body.removeChild(loginPrompt), 3000);
                        } else {
                          const isOpening = activeCommentPost !== post.id;
                          setActiveCommentPost(isOpening ? post.id : null);
                          setCommentText('');
                          
                          // Initialize comments when opening the comment section
                          if (isOpening) {
                            initializeComments(post.id);
                          }
                        }
                      }}
                      className={`flex items-center space-x-1 transition-all duration-200 hover:scale-105 ${
                        activeCommentPost === post.id ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                      }`}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-semibold">{post.commentCount || 0}</span>
                    </button>
                    <button 
                      onClick={() => handleShare(post)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-emerald-500 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`transition-all duration-200 hover:scale-110 ${
                      bookmarkedPosts.has(post.id) ? 'text-amber-500' : 'text-gray-600 hover:text-amber-500'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Comment Input Section - Instagram Style */}
                {activeCommentPost === post.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200/60 animate-in slide-in-from-top duration-300">
                    {/* Comments Display */}
                    <div className="mb-4 space-y-3 max-h-60 overflow-y-auto">
                      {(() => {
                        const comments = postComments[post.id] || [];
                        
                        return comments.length > 0 ? (
                          comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-semibold text-gray-900">{comment.userName}</span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(comment.dateCreated)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 break-words">{comment.text}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-3 pr-16 border-0 bg-gray-50 rounded-2xl resize-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200 text-sm"
                            rows={1}
                            style={{ minHeight: '44px' }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleCommentSubmit(post.id);
                              }
                            }}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                            }}
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                            {commentText.trim() && (
                              <button
                                onClick={() => handleCommentSubmit(post.id)}
                                className="text-blue-500 hover:text-blue-600 font-semibold text-sm transition-colors"
                              >
                                Post
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">Press Enter to post</span>
                          <button
                            onClick={() => {
                              setActiveCommentPost(null);
                              setCommentText('');
                            }}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Premium Bottom Accent */}
              <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 max-w-2xl mx-auto border border-gray-200">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto">
                  <Heart className="w-10 h-10 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-gray-900">No Stories Yet</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Be the first to share your travel adventure! Create a post and inspire others.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification - Instagram Style */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-in slide-in-from-top duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 
          toast.type === 'error' ? 'bg-red-500' : 
          'bg-blue-500'
        }`}>
          {toast.message}
        </div>
      )}
    </section>
  );
};

export default Posts;