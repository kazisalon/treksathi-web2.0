'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Calendar, User, Star, Eye, MoreHorizontal, Plus, X, Upload, Camera, Lock, LogIn, Compass, Plane, Mountain, Sun, CloudRain, Route, BadgeCheck, Clock, Navigation } from 'lucide-react';
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
      <div className="mb-12 max-w-3xl mx-auto">
        {isAuthenticated ? (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-white border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-3xl p-8 transition-all duration-300 group shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8" />
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-slate-800 block mb-1">Share Your Journey</span>
                <p className="text-slate-500 text-sm font-medium">Inspire fellow travelers with your authentic stories and photos</p>
              </div>
            </div>
          </button>
        ) : (
          <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-800 block mb-1">Join the Community</span>
                <p className="text-slate-500 text-sm font-medium">Log in to share your amazing experiences with the world</p>
              </div>
            </div>
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
  const router = useRouter();
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

  // Map API comment shape to UI Comment interface
  const mapApiComments = (apiComments: any[] | undefined | null): Comment[] => {
    if (!Array.isArray(apiComments)) return [];
    return apiComments.map((c: any) => ({
      id: c.id || c._id || `c-${Date.now()}-${Math.random()}`,
      text: c.text || c.content || c.comment || '',
      userName: c.userName || c.username || c.user?.name || 'Anonymous',
      userId: c.userId || c.user?.id || '',
      dateCreated: c.dateCreated || c.createdAt || c.created || new Date().toISOString(),
    }));
  };

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

  // Re-init liked set whenever auth status changes (preserve likes when logged out)
  useEffect(() => {
    const fromStorage = loadLikedFromStorage(session?.user?.id);
    setLikedPosts(fromStorage);
  }, [status]);

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
        id: String(post.id || post._id || `temp-${Date.now()}-${Math.random()}`),
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

      // cache posts for offline/timeout fallback
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cache:posts', JSON.stringify(normalizedPosts));
        }
      } catch { }

      // Initialize liked posts state from storage for both auth and guest
      const storageSet = loadLikedFromStorage(session?.user?.id);
      setLikedPosts(storageSet);

      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);

      // Fallback to cached posts if available
      try {
        const raw = localStorage.getItem('cache:posts');
        if (raw) {
          const cached = JSON.parse(raw);
          if (Array.isArray(cached) && cached.length) {
            setPosts(cached);
            setError(null);
            showToast('Showing cached posts due to network timeout', 'info');
          } else {
            setError('Failed to load posts. Please try again later.');
          }
        } else {
          setError('Failed to load posts. Please try again later.');
        }
      } catch {
        setError('Failed to load posts. Please try again later.');
      }
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

  // Ensure likes count never shows 0 when user has liked (Instagram-like UX)
  const getDisplayLikesCount = (postId: string, likesCount?: number) => {
    const base = typeof likesCount === 'number' ? likesCount : 0;
    return likedPosts.has(postId) ? Math.max(base, 1) : base;
  };

  // Premium UI tokens
  const cardOuterClass =
    'relative rounded-3xl p-[1px] bg-gradient-to-br from-slate-200/50 to-slate-300/30 shadow-sm transition-all duration-500';
  const cardInnerClass =
    'rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-[0_8px_20px_-8px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.15)] transition-all duration-300';
  const imageWrapClass =
    'relative overflow-hidden group aspect-[16/10]';
  const imageClass =
    'w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700';
  const imageOverlayClass =
    'absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300';
  const avatarRingClass =
    'ring-2 ring-white bg-slate-100 overflow-hidden';
  const countPillClass =
    'text-xs font-semibold text-slate-500';
  const metaChip =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-100';
  const dividerClass = 'hidden'; // Removed visual divider

  // Aliases for travel-specific class tokens
  const travelMetaChip = metaChip;

  // Local storage helpers for liked posts (per user)
  const likedStorageKey = (uid?: string) => `likedPosts:${uid || 'guest'}`;
  const likedLastKey = 'likedPosts:last';

  const loadLikedFromStorage = (uid?: string): Set<string> => {
    try {
      const key = uid ? likedStorageKey(uid) : likedLastKey;
      const rawPrimary = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      if (rawPrimary) {
        const arr = JSON.parse(rawPrimary);
        return new Set(Array.isArray(arr) ? arr : []);
      }
      // Fallback to guest storage if last snapshot not available
      const rawGuest = typeof window !== 'undefined' ? localStorage.getItem(likedStorageKey()) : null;
      const arrGuest = rawGuest ? JSON.parse(rawGuest) : [];
      return new Set(Array.isArray(arrGuest) ? arrGuest : []);
    } catch {
      return new Set();
    }
  };
  const saveLikedToStorage = (uid: string | undefined, set: Set<string>) => {
    try {
      if (typeof window !== 'undefined') {
        // Save to user/guest specific key
        localStorage.setItem(likedStorageKey(uid), JSON.stringify(Array.from(set)));
        // Always also save a "last seen" snapshot for logout/guest view
        localStorage.setItem(likedLastKey, JSON.stringify(Array.from(set)));
      }
    } catch { }
  };

  // Initialize comments for a specific post (fetch from API)
  const initializeComments = async (postId: string) => {
    if (loadingComments.has(postId)) return;

    setLoadingComments(prev => {
      const next = new Set(prev);
      next.add(postId);
      return next;
    });

    try {
      const postData = await TravelGuideAPI.getPostById(postId);
      const mapped = mapApiComments(postData?.comments);

      setPostComments(prev => ({
        ...prev,
        [postId]: mapped,
      }));

      // Ensure the counter reflects backend data
      setPosts(prev =>
        prev.map(p => (p.id === postId ? { ...p, commentCount: mapped.length } : p))
      );
    } catch (err) {
      console.error('Failed to fetch comments for post:', postId, err);
      if (!postComments[postId]) {
        setPostComments(prev => ({ ...prev, [postId]: [] }));
      }
    } finally {
      setLoadingComments(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
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

    const prevWasLiked = likedPosts.has(postId);
    const optimisticIsLiked = !prevWasLiked;

    // Optimistic update: liked set and likes count immediately
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (optimisticIsLiked) next.add(postId);
      else next.delete(postId);
      saveLikedToStorage(session?.user?.id, next);
      return next;
    });

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, likesCount: Math.max(0, (p.likesCount || 0) + (optimisticIsLiked ? 1 : -1)) }
          : p
      )
    );

    try {
      const response = await TravelGuideAPI.likePost(postId);

      // Server flags if available
      const serverIsLiked =
        typeof response?.isLiked === 'boolean' ? response.isLiked : optimisticIsLiked;
      const serverCount =
        typeof response?.likesCount === 'number'
          ? response.likesCount
          : typeof response?.likeCount === 'number'
            ? response.likeCount
            : undefined;

      // Update liked set from server flag
      setLikedPosts(prev => {
        const next = new Set(prev);
        if (serverIsLiked) next.add(postId);
        else next.delete(postId);
        saveLikedToStorage(session?.user?.id, next);
        return next;
      });

      // Reconcile count: prefer optimistic unless server provides a definitive number
      setPosts(prev =>
        prev.map(p => {
          if (p.id !== postId) return p;
          const current = p.likesCount || 0; // already includes optimistic change
          if (serverCount === undefined) {
            // No server count -> keep optimistic
            return { ...p, likesCount: current };
          }
          if (serverIsLiked && serverCount <= 0) {
            // Server returned 0 while liked -> keep at least optimistic 1
            return { ...p, likesCount: Math.max(current, 1) };
          }
          // Server provided a definitive count -> trust it
          return { ...p, likesCount: Math.max(0, serverCount) };
        })
      );

      showToast(serverIsLiked ? '❤️ Post liked!' : '💔 Post unliked', 'success');
    } catch (error: any) {
      console.error('=== LIKE ERROR ===', error);

      // Revert on failure
      setLikedPosts(prev => {
        const next = new Set(prev);
        if (prevWasLiked) next.add(postId);
        else next.delete(postId);
        saveLikedToStorage(session?.user?.id, next);
        return next;
      });

      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, likesCount: Math.max(0, (p.likesCount || 0) + (prevWasLiked ? 1 : -1)) }
            : p
        )
      );

      if (error?.response?.status === 401) {
        showToast('🔒 Authentication failed. Please log in again.', 'error');
      } else if (error?.response?.status === 404) {
        showToast('❌ Post not found.', 'error');
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

    // Sync with API, then refresh from backend to reflect authoritative state
    try {
      await TravelGuideAPI.addComment(postId, comment);
      await initializeComments(postId);
      console.log('Comment synced and refreshed from API');
    } catch (error) {
      console.error('Failed to sync comment with API:', error);
      // Comment remains visible from optimistic update
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

  // Travel-specific helpers
  const getSeasonLabel = (dateString?: string | null) => {
    try {
      if (!dateString) return 'Season';
      const m = new Date(dateString).getMonth(); // 0-11
      if ([11, 0, 1].includes(m)) return 'Winter';
      if ([2, 3, 4].includes(m)) return 'Spring';
      if ([5, 6, 7].includes(m)) return 'Monsoon';
      return 'Autumn';
    } catch {
      return 'Season';
    }
  };

  const getSeasonIcon = (season: string): React.ReactNode => {
    if (season.toLowerCase() === 'monsoon') {
      return <CloudRain className="w-3 h-3 text-sky-600" />;
    }
    return <Sun className="w-3 h-3 text-amber-500" />;
  };

  const getTripTraits = (text?: string) => {
    const t = (text || '').toLowerCase();
    const traits: string[] = [];
    if (/(trek|hike|trail|mountain|peak)/.test(t)) traits.push('Trek');
    if (/(temple|culture|heritage|festival)/.test(t)) traits.push('Culture');
    if (/(lake|view|scenic|sunrise|sunset|nature)/.test(t)) traits.push('Scenic');
    if (/(food|cafe|restaurant|tea|coffee)/.test(t)) traits.push('Food');
    if (traits.length === 0) traits.push('Explore');
    return traits.slice(0, 3);
  };

  const traitIcon = (trait: string): React.ReactNode => {
    switch (trait) {
      case 'Trek':
        return <Mountain className="w-3 h-3 text-indigo-600" />;
      case 'Culture':
        return <BadgeCheck className="w-3 h-3 text-pink-600" />;
      case 'Scenic':
        return <Star className="w-3 h-3 text-amber-500" />;
      case 'Food':
        return <Share2 className="w-3 h-3 text-rose-600" />;
      default:
        return <Compass className="w-3 h-3 text-slate-600" />;
    }
  };

  if (loading) {
    return (
      <section ref={sectionRef} className="py-20">
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
      <section ref={sectionRef} className="py-20">
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
    <section ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        {/* Professional Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
            <Compass className="w-3 h-3" />
            <span>Community Stories</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Travel Stories
          </h2>

          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
            Discover authentic perspectives and firsthand experiences shared by adventurers exploring the heart of Nepal and beyond.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-bold text-slate-700">{posts.length} Stories Shared</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              <Navigation className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-slate-700">Verified Experiences</span>
            </div>
          </div>
        </div>

        {/* Create Post Component */}
        <CreatePost onPostCreated={refreshPosts} />

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.filter(post => post && post.id && post.title).map((post, index) => {
            const season = getSeasonLabel(post.dateCreated);
            const seasonIconEl = getSeasonIcon(season);
            const traits = getTripTraits(`${post.title || ''} ${post.description || ''}`);

            return (
              <div key={post.id} className={cardOuterClass} style={{ transitionDelay: `${index * 100}ms` }}>
                <div className={cardInnerClass}>
                  {/* Header */}
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-full ${avatarRingClass} flex items-center justify-center`}>
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 leading-none mb-1">{post.userName || 'Explorer'}</span>
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                          <Clock className="w-3 h-3" />
                          {formatDate(post.dateCreated)}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Image section */}
                  <div className={imageWrapClass}>
                    <Image
                      src={getImageUrl(post.imageUrls) || '/images/placeholder.jpg'}
                      alt={post.title}
                      width={800}
                      height={450}
                      className={imageClass}
                    />
                    <div className={imageOverlayClass} />
                    {post.location && post.location.trim() && (
                      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full border border-white/20 text-white pointer-events-none">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{post.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 pb-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title || 'Adventure Story'}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                      {post.description || 'Discover the details of this amazing journey...'}
                    </p>

                    {/* Metadata chips - simplified */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={metaChip}>
                        {seasonIconEl} {season}
                      </span>
                      {traits.slice(0, 2).map((t) => (
                        <span key={t} className={metaChip}>
                          {traitIcon(t)} {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons - Professionalized */}
                  <div className="px-5 py-4 flex items-center justify-between border-t border-slate-50 mt-2">
                    <div className="flex items-center gap-6">
                      {/* Like */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`group flex items-center gap-2 transition-colors ${likedPosts.has(post.id) ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                          }`}
                      >
                        <Heart
                          className={`w-5 h-5 transition-transform group-active:scale-125 ${likedPosts.has(post.id) ? 'fill-current' : ''
                            }`}
                        />
                        <span className={countPillClass}>{getDisplayLikesCount(post.id, post.likesCount)}</span>
                      </button>

                      {/* Comment */}
                      <button
                        onClick={async () => {
                          if (status !== 'authenticated') {
                            showToast('🔒 Please log in to comment', 'info');
                          } else {
                            const isOpening = activeCommentPost !== post.id;
                            setActiveCommentPost(isOpening ? post.id : null);
                            if (isOpening) await initializeComments(post.id);
                          }
                        }}
                        className="group flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className={countPillClass}>{post.commentCount || 0}</span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(post)}
                        className="text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Save */}
                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`transition-colors ${bookmarkedPosts.has(post.id) ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
                        }`}
                    >
                      <Bookmark className={`w-5 h-5 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Comments */}
                  {activeCommentPost === post.id && (
                    <div className="px-4 pb-4">
                      <div className="mt-2 space-y-3 max-h-60 overflow-y-auto">
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
                                    <span className="text-xs text-gray-500">{formatDate(comment.dateCreated)}</span>
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

                      <div className="flex items-start space-x-3 mt-3">
                        <div className={`w-8 h-8 ${avatarRingClass} rounded-full flex items-center justify-center shadow-lg`}>
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <textarea
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Write a thoughtful comment…"
                              className="w-full p-3 pr-16 border bg-white/70 rounded-2xl resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-sm"
                              rows={1}
                              style={{ minHeight: '44px' }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleCommentSubmit(post.id);
                                }
                              }}
                              onInput={(e) => {
                                const target = (e.target as HTMLTextAreaElement);
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
              </div>
            );
          })}
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
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-in slide-in-from-top duration-300 ${toast.type === 'success' ? 'bg-green-500' :
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