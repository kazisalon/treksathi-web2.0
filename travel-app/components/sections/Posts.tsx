'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Calendar, User, Star, Eye, MoreHorizontal, Plus, X, Upload, Camera, Lock, LogIn, Compass, Plane, Mountain, Sun, CloudRain, Route, BadgeCheck, Clock, Navigation, TrendingUp, Award, Globe } from 'lucide-react';
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
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    description: '',
    location: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const MAX_IMAGES = 0;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Authentication check
  if (!session) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-100 shadow-lg">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <LogIn className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Share Your Adventure</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Sign in to share your incredible travel stories and inspire others to explore Nepal.
          </p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} is too large. Max size is 5MB.`);
        return false;
      }
      return true;
    });

    if (formData.images.length + validFiles.length > MAX_IMAGES) {
      setError(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }));
    setError('');
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setUploadProgress(0);

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    setUploadProgress(30);

    try {
      const reqBody: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
      };

      setUploadProgress(60);

      const response = await TravelGuideAPI.posts.create(reqBody);

      setUploadProgress(100);

      if (response && response.id) {
        setIsSuccess(true);
        setTimeout(() => {
          resetForm();
          setIsOpen(false);
          setIsSuccess(false);
          onPostCreated();
        }, 2000);
      } else {
        throw new Error(response?.message || 'Failed to create post');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', location: '', images: [] });
    setImagePreviews([]);
    setError('');
  };

  if (!isOpen) {
    return (
      <div className="mb-8">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-6 h-6" />
          Share Your Nepal Adventure
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Create Post</h3>
            <p className="text-blue-100 text-sm">Share your adventure with the world</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            resetForm();
          }}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8">
        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <BadgeCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-bold text-green-900 text-lg">Success!</h4>
              <p className="text-green-700">Your adventure has been shared with the community.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-center gap-3">
            <X className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Give your adventure a catchy title..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Where did you go? (e.g., Everest Base Camp)"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Tell us about your experience... What made it special?"
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none text-gray-900"
            disabled={isSubmitting}
            required
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-500">Minimum 10 characters</span>
            <span className={`${formData.description.length < 10 ? 'text-red-500' : 'text-green-600'} font-medium`}>
              {formData.description.length} characters
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {uploadProgress > 0 && (
          <div className="mb-6">
            <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            disabled={isSubmitting || formData.description.length < 10}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Publish Adventure
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Posts Component
const Posts: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // UI state
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [activeComments, setActiveComments] = useState<{ [key: string]: Comment[] }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Initialize comments for a post (local state only since API doesn't support GET)
  const initializeCommentsState = (postId: string) => {
    if (!activeComments[postId]) {
      setActiveComments(prev => ({
        ...prev,
        [postId]: []
      }));
    }
  };

  // Map API comment shape to UI Comment interface
  const mapApiComments = (apiComments: any[] | undefined | null): Comment[] => {
    if (!apiComments || !Array.isArray(apiComments)) return [];
    return apiComments.map((c: any) => ({
      id: c.id || Math.random().toString(36).substr(2, 9),
      text: c.text || c.comment || '',
      userName: c.userName || c.username || 'Anonymous',
      userId: c.userId || '',
      dateCreated: c.dateCreated || new Date().toISOString()
    }));
  };

  // Load liked posts on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = loadLikedFromStorage(session?.user?.id);
        setLikedPosts(stored);
      } catch (err) {
        console.error('Failed to load liked posts:', err);
      }
    }
  }, [session]);

  // Update storage whenever likedPosts changes
  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user?.id) {
      try {
        saveLikedToStorage(session.user.id, likedPosts);
      } catch (err) {
        console.error('Failed to save liked posts:', err);
      }
    }
  }, [likedPosts, session]);

  // Load bookmarked posts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bookmarked_posts');
      if (stored) {
        setBookmarked(new Set(JSON.parse(stored)));
      }
    }
  }, []);

  // Fetch posts function (Instagram-like behavior)
  const fetchPosts = async () => {
    try {
      setIsLoadingMore(page > 1);
      const response = await TravelGuideAPI.posts.getAll();

      if (response && Array.isArray(response)) {
        const mapped = response.map((p: any) => ({
          id: p.id,
          title: p.title || 'Untitled',
          description: p.description || '',
          imageUrls: p.imageUrls || [],
          likesCount: p.likesCount || 0,
          commentCount: p.commentCount || 0,
          location: p.location || 'Unknown',
          userId: p.userId || '',
          userName: p.userName || 'Anonymous',
          dateCreated: p.dateCreated || new Date().toISOString(),
          comments: mapApiComments(p.comments)
        }));

        if (page === 1) {
          setPosts(mapped);
        } else {
          setPosts(prev => [...prev, ...mapped]);
        }

        setHasMore(mapped.length >= 10);
      } else {
        if (page === 1) setPosts([]);
        setHasMore(false);
      }
    } catch (err) {
      showToast('Failed to load posts', 'error');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Refresh posts after creating a new one
  const refreshPosts = () => {
    setPage(1);
    setIsLoading(true);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Ensure likes count never shows 0 when user has liked (Instagram-like UX)
  const getDisplayLikesCount = (postId: string, likesCount?: number) => {
    const isLiked = likedPosts.has(postId);
    return isLiked && (likesCount === 0 || likesCount === undefined) ? 1 : (likesCount || 0);
  };

  // Local storage helpers for liked posts (per user)
  const likedStorageKey = (uid?: string) =>
    uid ? `liked_posts_${uid}` : 'liked_posts_guest';

  const loadLikedFromStorage = (uid?: string): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    try {
      const key = likedStorageKey(uid);
      const stored = localStorage.getItem(key);
      if (stored) {
        const arr = JSON.parse(stored);
        return new Set(arr);
      }
    } catch (e) {
      console.error('Error loading liked posts:', e);
    }
    return new Set();
  };

  const saveLikedToStorage = (uid: string | undefined, set: Set<string>) => {
    if (typeof window === 'undefined') return;
    try {
      const key = likedStorageKey(uid);
      const arr = Array.from(set);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
      console.error('Error saving liked posts:', e);
    }
  };

  // Initialize comments for a specific post (fetch from API)
  const initializeComments = async (postId: string) => {
    if (activeComments[postId]) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (post?.comments) {
        setActiveComments(prev => ({
          ...prev,
          [postId]: post.comments || []
        }));
      } else {
        setActiveComments(prev => ({
          ...prev,
          [postId]: []
        }));
      }
    } catch (err) {
      setActiveComments(prev => ({
        ...prev,
        [postId]: []
      }));
    }
  };

  // Handle like (optimistic UI update + API call)
  const handleLike = async (postId: string) => {
    const isCurrentlyLiked = likedPosts.has(postId);
    const currentPost = posts.find(p => p.id === postId);

    // Optimistic UI update
    const updatedLiked = new Set(likedPosts);
    if (isCurrentlyLiked) {
      updatedLiked.delete(postId);
      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, likesCount: Math.max(0, (p.likesCount || 0) - 1) }
          : p
      ));
    } else {
      updatedLiked.add(postId);
      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, likesCount: (p.likesCount || 0) + 1 }
          : p
      ));
    }
    setLikedPosts(updatedLiked);

    // Call API
    try {
      if (isCurrentlyLiked) {
        await TravelGuideAPI.posts.unlike(postId);
      } else {
        await TravelGuideAPI.posts.like(postId);
      }
    } catch (err) {
      // Revert on error
      setLikedPosts(likedPosts);
      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, likesCount: currentPost?.likesCount || 0 }
          : p
      ));
      showToast('Failed to update like', 'error');
    }
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentText[postId]?.trim();
    if (text) {
      handleComment(postId, text);
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    if (!comment.trim()) return;

    const optimisticComment: Comment = {
      id: `temp_${Date.now()}`,
      text: comment,
      userName: session.user.name || 'You',
      userId: session.user.id || '',
      dateCreated: new Date().toISOString()
    };

    setActiveComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), optimisticComment]
    }));
    setCommentText(prev => ({ ...prev, [postId]: '' }));

    try {
      await TravelGuideAPI.posts.addComment(postId, comment);
      showToast('Comment added!', 'success');
    } catch (err) {
      showToast('Failed to add comment', 'error');
      setActiveComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(c => c.id !== optimisticComment.id)
      }));
    }
  };

  const handleShare = async (post: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href
        });
        showToast('Shared successfully!', 'success');
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${post.title}\n${window.location.href}`);
        showToast('Link copied to clipboard!', 'success');
      } catch (err) {
        showToast('Failed to share', 'error');
      }
    }
  };

  const handleBookmark = (postId: string) => {
    const updated = new Set(bookmarked);
    if (bookmarked.has(postId)) {
      updated.delete(postId);
      showToast('Removed from bookmarks', 'info');
    } else {
      updated.add(postId);
      showToast('Added to bookmarks', 'success');
    }
    setBookmarked(updated);
    localStorage.setItem('bookmarked_posts', JSON.stringify(Array.from(updated)));
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  const getImageUrl = (imageUrls: string[] | undefined | null) => {
    if (!imageUrls || imageUrls.length === 0) {
      return 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop';
    }
    return imageUrls[0];
  };

  // Travel-specific helpers
  const getSeasonLabel = (dateString?: string | null) => {
    if (!dateString) return 'Any Season';
    const month = new Date(dateString).getMonth();
    if (month >= 2 && month <= 4) return 'Spring Trek';
    if (month >= 5 && month <= 7) return 'Monsoon';
    if (month >= 8 && month <= 10) return 'Autumn Trek';
    return 'Winter Trek';
  };

  const getSeasonIcon = (season: string): React.ReactNode => {
    if (season.includes('Spring')) return <Flower className="w-4 h-4" />;
    if (season.includes('Monsoon')) return <CloudRain className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };

  const getTripTraits = (text?: string) => {
    const traits = [];
    if (text?.toLowerCase().includes('trek')) traits.push('Trekking');
    if (text?.toLowerCase().includes('mountain')) traits.push('Mountains');
    if (text?.toLowerCase().includes('culture')) traits.push('Cultural');
    return traits.slice(0, 2);
  };

  const traitIcon = (trait: string): React.ReactNode => {
    switch (trait) {
      case 'Trekking': return <Mountain className="w-3 h-3" />;
      case 'Mountains': return <Navigation className="w-3 h-3" />;
      case 'Cultural': return <Globe className="w-3 h-3" />;
      default: return <Compass className="w-3 h-3" />;
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-5">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-100 px-5 py-2.5 rounded-full border-2 border-gray-200">
              <TrendingUp className="w-4 h-4" />
              Community Stories
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-5 tracking-tight">
            Discover Nepal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Share your adventures, connect with fellow travelers, and discover inspiring stories from across Nepal.
          </p>
        </div>

        {/* Create Post */}
        <CreatePost onPostCreated={refreshPosts} />

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border-2 flex items-center gap-3 animate-in slide-in-from-top ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
            {toast.type === 'success' && <BadgeCheck className="w-5 h-5" />}
            {toast.type === 'error' && <X className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}

        {/* Posts Grid */}
        {isLoading && page === 1 ? (
          <div className="grid gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
                <div className="h-96 bg-gray-200 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mountain className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Be the first to share your Nepal adventure!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => {
              const isLiked = likedPosts.has(post.id);
              const isBookmarked = bookmarked.has(post.id);
              const commentsVisible = showComments[post.id] || false;
              const comments = activeComments[post.id] || [];
              const season = getSeasonLabel(post.dateCreated);
              const traits = getTripTraits(post.description);

              return (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-400 hover:-translate-y-1"
                >
                  {/* Post Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{post.userName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{post.location}</span>
                            <span className="text-gray-300">•</span>
                            <span>{formatDate(post.dateCreated)}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Post Image */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <Image
                      src={getImageUrl(post.imageUrls)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {/* Season Badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg border border-white/50">
                      {getSeasonIcon(season)}
                      <span className="text-sm font-bold text-gray-800">{season}</span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                        >
                          <Heart
                            className={`w-6 h-6 transition-all duration-200 ${isLiked
                              ? 'fill-red-500 text-red-500 scale-110'
                              : 'text-gray-600 hover:text-red-500 hover:scale-110'
                              }`}
                          />
                          <span className={`text-sm font-semibold ${isLiked ? 'text-red-500' : 'text-gray-700'}`}>
                            {getDisplayLikesCount(post.id, post.likesCount)}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            if (!commentsVisible) initializeComments(post.id);
                            setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }));
                          }}
                          className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200"
                        >
                          <MessageCircle className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
                          <span className="text-sm font-semibold text-gray-700">
                            {comments.length || post.commentCount || 0}
                          </span>
                        </button>
                        <button
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-2 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200"
                        >
                          <Share2 className="w-6 h-6 text-gray-600 hover:text-green-600 transition-colors" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleBookmark(post.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      >
                        <Bookmark
                          className={`w-6 h-6 transition-all duration-200 ${isBookmarked ? 'fill-amber-600 text-amber-600 scale-110' : 'text-gray-600 hover:text-amber-600 hover:scale-110'
                            }`}
                        />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-800 transition-colors">{post.title}</h3>
                      <p className="text-base text-gray-600 leading-relaxed line-clamp-3">{post.description}</p>
                    </div>

                    {/* Traits */}
                    {traits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {traits.map((trait, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 hover:shadow-sm transition-shadow"
                          >
                            {traitIcon(trait)}
                            <span>{trait}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comments Section */}
                    {commentsVisible && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4">Comments</h4>

                        {/* Comment Input */}
                        {session ? (
                          <div className="flex gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={commentText[post.id] || ''}
                                onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                                placeholder="Share your thoughts..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 text-gray-900"
                              />
                              <button
                                onClick={() => handleCommentSubmit(post.id)}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => router.push('/auth/signin')}
                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <LogIn className="w-4 h-4" />
                            Sign in to comment
                          </button>
                        )}

                        {/* Comments List */}
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {comments.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No comments yet. Be the first!</p>
                          ) : (
                            comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900 text-sm">{comment.userName}</span>
                                    <span className="text-xs text-gray-500">{formatDate(comment.dateCreated)}</span>
                                  </div>
                                  <p className="text-gray-700 text-sm">{comment.text}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {hasMore && !isLoading && posts.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={isLoadingMore}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  Load More Adventures
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Posts;