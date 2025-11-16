'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { MapPin, Tag, BadgePercent, CheckCircle, XCircle, Plus, LogIn, LayoutGrid, List, Search, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TravelGuideAPI } from '../../lib/api';

type MarketplaceItem = {
  id: string;
  title: string;
  category: string;
  listingType: 'ForSale' | 'ForRent' | string;
  price: number;
  rentPricePerDay?: number;
  isAvailable: boolean;
  primaryImageUrl?: string;
  ownerId?: string;
  ownerName?: string;
  dateCreated?: string;
  dateModified?: string;
};

const formatPrice = (v?: number) => {
  if (typeof v !== 'number') return '—';
  return `Rs ${v.toLocaleString('en-IN')}`;
};

// Near the top, just after badgeClass
const badgeClass = 'px-2 py-0.5 text-xs rounded-full font-medium';

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [filtered, setFiltered] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'rent'>('all');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const raw = await TravelGuideAPI.getMarketplaceAll();

        const arr = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.results)
          ? raw.results
          : [];

        const normalized: MarketplaceItem[] = arr.map((it: any) => ({
          id: it.id || it._id,
          title: it.title || 'Untitled',
          category: it.category || 'General',
          listingType: it.listingType || it.type || 'ForSale',
          price: Number(it.price ?? 0),
          rentPricePerDay: Number(it.rentPricePerDay ?? 0),
          isAvailable: Boolean(it.isAvailable ?? true),
          primaryImageUrl:
            it.primaryImageUrl ||
            it.primaryImage ||
            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=60',
          ownerId: it.ownerId,
          ownerName: it.ownerName || 'Owner',
          dateCreated: it.dateCreated,
          dateModified: it.dateModified,
        }));

        setItems(normalized);
      } catch (err: any) {
        setError(err?.message || 'Failed to load marketplace');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    let next = items;
    if (filterType === 'sale') next = items.filter((i) => String(i.listingType).toLowerCase() === 'forsale');
    if (filterType === 'rent') next = items.filter((i) => String(i.listingType).toLowerCase() === 'forrent');
    setFiltered(next);
  }, [filterType, items]);

  const { data: session } = useSession();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasToken(!!localStorage.getItem('authToken'));
    }
  }, []);
  const isAuthenticated = !!session?.user || hasToken;

  // Create form state
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [listingType, setListingType] = useState<'ForSale' | 'ForRent'>('ForSale');
  const [price, setPrice] = useState<number | ''>('');
  const [rentPerDay, setRentPerDay] = useState<number | ''>('');
  const [condition, setCondition] = useState<'New' | 'Good' | 'Used' | 'Fair'>('Good');
  const [deposit, setDeposit] = useState<number | ''>('');
  const [location, setLocation] = useState('Nepal');
  const [latitude, setLatitude] = useState<number | ''>('');
  const [longitude, setLongitude] = useState<number | ''>('');
  const [tagsInput, setTagsInput] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Premium UI: sorting key and derived list
  const [sortKey, setSortKey] = useState<'recent' | 'price_asc' | 'price_desc' | 'rent_asc' | 'rent_desc'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  // NEW: Category filter, saved favorites, and pagination
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(6);
  
  useEffect(() => {
    try {
      const raw = localStorage.getItem('marketplaceSaved');
      if (raw) setSavedIds(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('marketplaceSaved', JSON.stringify(savedIds));
    } catch {}
  }, [savedIds]);
  
  const isSaved = (id: string) => savedIds.includes(id);
  const toggleSave = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const loadMore = () => setPageSize((p) => p + 6);
  
  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter(Boolean))).slice(0, 10),
    [items]
  );
  
  const displayed = useMemo(() => {
    let arr = [...filtered];
  
    if (categoryFilter !== 'all') {
      arr = arr.filter((i) => String(i.category).toLowerCase() === categoryFilter.toLowerCase());
    }
  
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (i) =>
          (i.title || '').toLowerCase().includes(q) ||
          (i.category || '').toLowerCase().includes(q)
      );
    }
  
    const byDateDesc = (a?: string, b?: string) => {
      const ta = a ? Date.parse(a) : 0;
      const tb = b ? Date.parse(b) : 0;
      return tb - ta;
    };
  
    switch (sortKey) {
      case 'price_asc':
        arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price_desc':
        arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'rent_asc':
        arr.sort((a, b) => (a.rentPricePerDay ?? 0) - (b.rentPricePerDay ?? 0));
        break;
      case 'rent_desc':
        arr.sort((a, b) => (b.rentPricePerDay ?? 0) - (a.rentPricePerDay ?? 0));
        break;
      case 'recent':
      default:
        arr.sort((a, b) => byDateDesc(a.dateCreated, b.dateCreated));
        break;
    }
  
    return arr;
  }, [filtered, search, sortKey, categoryFilter]);

  // Premium: skeleton card for loading state
  const SkeletonCard: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-56 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-slate-200 rounded" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-10 bg-slate-200 rounded flex-1" />
          <div className="h-10 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
  );

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('General');
    setListingType('ForSale');
    setPrice('');
    setRentPerDay('');
    setCondition('Good');
    setDeposit('');
    setLocation('Nepal');
    setLatitude('');
    setLongitude('');
    setTagsInput('');
    setIsAvailable(true);
    setImageFiles([]);
    setImagePreviews([]);
    setCreateError(null);
    setCreateSuccess(null);
  };

  // Add back: image file input handler
  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const parseTags = (s: string): string[] =>
    s.split(',').map((t) => t.trim()).filter(Boolean);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setCreateError('Please log in to list items in Marketplace.');
      return;
    }
    setCreating(true);
    setCreateError(null);
    setCreateSuccess(null);
    try {
      // Build multipart payload as per API
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append('Images', file)); // array files

      formData.append('Title', (title || '').trim());
      formData.append('Description', (description || '').trim());
      formData.append('Category', (category || '').trim());
      formData.append('ListingType', listingType);
      formData.append('Condition', (condition || 'Good').trim());
      formData.append('Price', String(listingType === 'ForSale' ? Number(price || 0) : 0));
      formData.append('RentPricePerDay', String(listingType === 'ForRent' ? Number(rentPerDay || 0) : 0));
      formData.append('Deposit', String(Number(deposit || 0)));
      formData.append('Location', (location || '').trim());
      formData.append('Latitude', String(Number(latitude || 0)));
      formData.append('Longitude', String(Number(longitude || 0)));
      parseTags(tagsInput).forEach((t) => formData.append('Tags', t)); // repeated key for arrays

      await TravelGuideAPI.createMarketplace(formData);
      setCreateSuccess('Item listed successfully.');
      resetForm(); // now points to the const defined above

      // Refresh grid after create
      const raw = await TravelGuideAPI.getMarketplaceAll();
      const arr = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.results) ? raw.results : [];
      const normalized = arr.map((it: any) => ({
        id: it.id || it._id,
        title: it.title || 'Untitled',
        category: it.category || 'General',
        listingType: it.listingType || it.type || 'ForSale',
        price: Number(it.price ?? 0),
        rentPricePerDay: Number(it.rentPricePerDay ?? 0),
        isAvailable: Boolean(it.isAvailable ?? true),
        primaryImageUrl: it.primaryImageUrl || it.primaryImage || '',
        ownerId: it.ownerId,
        ownerName: it.ownerName || 'Owner',
        dateCreated: it.dateCreated,
        dateModified: it.dateModified,
      }));
      setItems(normalized);
    } catch (err: any) {
      setCreateError(err?.message || 'Failed to create item.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">
            Marketplace
          </h2>
          <p className="mt-2 text-slate-600">
            Find great gear and local deals from trekkers
          </p>

          {/* Create Listing CTA */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowCreate((v) => !v)}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-50 to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              {showCreate ? 'Close' : 'Create Listing'}
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 inline-flex gap-2 bg-white/70 backdrop-blur rounded-full shadow-sm p-1 border border-white/40">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('sale')}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filterType === 'sale'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setFilterType('rent')}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filterType === 'rent'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              For Rent
            </button>
          </div>

          {/* Premium toolbar: search, sort, view toggle */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3">
            {/* Search */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full pl-9 pr-3 py-2 bg-white/80 border border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-indigo-200"
                placeholder="Search items or categories"
              />
            </div>
            {/* Sort */}
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as any)}
              className="rounded-full px-3 py-2 bg-white/80 border border-slate-200 text-slate-900 shadow-sm"
              title="Sort by"
            >
              <option value="recent">Recent</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rent_asc">Rent: Low to High</option>
              <option value="rent_desc">Rent: High to Low</option>
            </select>
            {/* View toggle */}
            <div className="inline-flex rounded-full bg-white/80 border border-slate-200 shadow-sm overflow-hidden">
              <button
                className={`px-3 py-2 text-sm flex items-center gap-1 ${
                  viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-700'
                }`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" /> Grid
              </button>
              <button
                className={`px-3 py-2 text-sm flex items-center gap-1 ${
                  viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-700'
                }`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List className="w-4 h-4" /> List
              </button>
            </div>
          </div>

          {/* Category chips */}
          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  categoryFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    categoryFilter === c ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create Item (gated) */}
        {showCreate && (
          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-white rounded-2xl border p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> List Your Item
                </h3>
                {!isAuthenticated && (
                  <button
                    onClick={() => router.push('/auth/signin')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-white text-slate-700"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </button>
                )}
              </div>
        
              {!isAuthenticated ? (
                <p className="text-slate-700 text-sm">
                  Only logged-in users can list items. Please sign in to continue.
                </p>
              ) : (
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black placeholder:text-slate-500"
                      placeholder="Offroad Bike on sale"
                  />
                </div>
        
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black placeholder:text-slate-500"
                    placeholder="Brief details about the item..."
                />
                </div>
        
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black placeholder:text-slate-500"
                    placeholder="e.g., Mountain Bike"
                />
                </div>
        
                {/* Listing Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Listing Type</label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as 'ForSale' | 'ForRent')}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black"
                >
                  <option value="ForSale">For Sale</option>
                  <option value="ForRent">For Rent</option>
                </select>
                </div>
        
                {/* Price (only for sale) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Price</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    disabled={listingType !== 'ForSale'}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black disabled:bg-slate-100 placeholder:text-slate-500"
                    placeholder="e.g., 210000"
                />
                </div>
        
                {/* Rent per day (rent) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Rent Per Day</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={rentPerDay}
                    onChange={(e) => setRentPerDay(e.target.value === '' ? '' : Number(e.target.value))}
                    disabled={listingType !== 'ForRent'}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black disabled:bg-slate-100 placeholder:text-slate-500"
                    placeholder="e.g., 1500"
                />
                </div>
        
                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as 'New' | 'Good' | 'Used' | 'Fair')}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black"
                >
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                  <option value="Fair">Fair</option>
                </select>
                </div>
        
                {/* Deposit */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Deposit</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black placeholder:text-slate-500"
                    placeholder="e.g., 5000"
                />
                </div>
        
                {/* Images: upload from computer */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFiles}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black"
                />
                {imagePreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative w-full h-24 rounded-lg overflow-hidden border">
                        <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                </div>
        
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black placeholder:text-slate-500"
                    placeholder="e.g., Nepal"
                />
                </div>
        
                {/* Latitude */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black placeholder:text-slate-500"
                    placeholder="e.g., 27.7172"
                />
                </div>
        
                {/* Longitude */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black placeholder:text-slate-500"
                    placeholder="e.g., 85.3240"
                />
                </div>
        
                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-black placeholder:text-slate-500"
                    placeholder="bike, mountain, gear"
                />
                </div>
        
                {/* Actions */}
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm disabled:opacity-50"
                  >
                    {creating ? 'Listing…' : 'Post Item'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg bg-white border text-slate-700 text-sm"
                  >
                    Reset
                  </button>
                </div>
        
                {/* Feedback */}
                {createError && <div className="md:col-span-2 text-sm text-red-600">{createError}</div>}
                {createSuccess && <div className="md:col-span-2 text-sm text-green-700">{createSuccess}</div>}
                </form>
              )}
            </div>
          </div>
        )}

        {/* Premium Grid/List and States */}
        {!loading && !error && displayed.length > 0 && (
          // In the render section where displayed items are mapped
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {displayed.slice(0, pageSize).map((item) => (
              viewMode === 'grid' ? (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:ring-1 hover:ring-indigo-200/60"
                >
                  <div className="relative h-56">
                    <Image
                      src={item.primaryImageUrl || ''}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`${badgeClass} ${
                          String(item.listingType).toLowerCase() === 'forrent'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {String(item.listingType).toLowerCase() === 'forrent' ? 'For Rent' : 'For Sale'}
                      </span>
                      <span className={`${badgeClass} bg-slate-100 text-slate-700 flex items-center gap-1`}>
                        <Tag className="w-3 h-3" />
                        {item.category}
                      </span>
                    </div>
                    {/* Favorite */}
                    <button
                      onClick={() => toggleSave(item.id)}
                      className={`absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full backdrop-blur bg-white/80 border border-white/60 shadow-sm transition-all hover:scale-105 ${
                        isSaved(item.id) ? 'text-rose-600' : 'text-slate-700'
                      }`}
                      aria-label="Save item"
                    >
                      <Heart className={`w-5 h-5 ${isSaved(item.id) ? 'fill-rose-600' : ''}`} />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        {String(item.listingType).toLowerCase() === 'forrent' ? (
                          <>
                            <BadgePercent className="w-4 h-4 text-indigo-600" />
                            <span className="font-medium">{formatPrice(item.rentPricePerDay)}</span>
                            <span className="text-xs text-slate-500">per day</span>
                          </>
                        ) : (
                          <>
                            <BadgePercent className="w-4 h-4 text-amber-600" />
                            <span className="font-medium">{formatPrice(item.price)}</span>
                          </>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs ${item.isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                        {item.isAvailable ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> Available
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Unavailable
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Nepal
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                          {initials(item.ownerName)}
                        </span>
                        {item.ownerName || 'Owner'}
                      </span>
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button className="flex-1 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition-colors">View</button>
                      <button
                        onClick={() => toggleSave(item.id)}
                        className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                          isSaved(item.id)
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {isSaved(item.id) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // LIST view: horizontal premium card
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-indigo-200/60"
                >
                  <div className="flex items-stretch">
                    <div className="relative w-48 sm:w-56 md:w-64 h-40 sm:h-44 md:h-48 shrink-0">
                      <Image
                        src={item.primaryImageUrl || ''}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span
                          className={`${badgeClass} ${
                            String(item.listingType).toLowerCase() === 'forrent'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {String(item.listingType).toLowerCase() === 'forrent' ? 'For Rent' : 'For Sale'}
                        </span>
                        <span className={`${badgeClass} bg-slate-100 text-slate-700 flex items-center gap-1`}>
                          <Tag className="w-3 h-3" />
                          {item.category}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleSave(item.id)}
                        className={`absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full backdrop-blur bg-white/80 border border-white/60 shadow-sm transition-all hover:scale-105 ${
                          isSaved(item.id) ? 'text-rose-600' : 'text-slate-700'
                        }`}
                        aria-label="Save item"
                      >
                        <Heart className={`w-5 h-5 ${isSaved(item.id) ? 'fill-rose-600' : ''}`} />
                      </button>
                    </div>
                    <div className="flex-1 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2">{item.title}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs ${item.isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                          {item.isAvailable ? (
                            <>
                              <CheckCircle className="w-3 h-3" /> Available
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Unavailable
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        {String(item.listingType).toLowerCase() === 'forrent' ? (
                          <>
                            <BadgePercent className="w-4 h-4 text-indigo-600" />
                            <span className="font-medium">{formatPrice(item.rentPricePerDay)}</span>
                            <span className="text-xs text-slate-500">per day</span>
                          </>
                        ) : (
                          <>
                            <BadgePercent className="w-4 h-4 text-amber-600" />
                            <span className="font-medium">{formatPrice(item.price)}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Nepal
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                            {initials(item.ownerName)}
                          </span>
                          {item.ownerName || 'Owner'}
                        </span>
                      </div>
                      <div className="pt-2 flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition-colors">View</button>
                        <button
                          onClick={() => toggleSave(item.id)}
                          className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                            isSaved(item.id)
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {isSaved(item.id) ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {!loading && !error && displayed.length > pageSize && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm hover:shadow-md"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Marketplace;

// Premium: small helper for owner avatar initials
const initials = (name?: string) => (name || 'U').trim().charAt(0).toUpperCase();