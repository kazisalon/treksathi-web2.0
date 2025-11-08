'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapPin, Tag, BadgePercent, CheckCircle, XCircle, Plus, LogIn } from 'lucide-react';
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
  const [sortKey, setSortKey] = useState<'relevance' | 'newest' | 'priceLow' | 'priceHigh'>('relevance');
  const displayed = React.useMemo(() => {
    const arr = [...filtered];
    switch (sortKey) {
      case 'newest': {
        // Safely sort by dateCreated if available
        return arr.sort((a, b) => {
          const ad = a.dateCreated || '';
          const bd = b.dateCreated || '';
          return bd.localeCompare(ad);
        });
      }
      case 'priceLow':
        return arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case 'priceHigh':
        return arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      default:
        return arr;
    }
  }, [filtered, sortKey]);
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
    <section className="py-16 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">Marketplace</h2>
          <p className="mt-2 text-slate-600 text-sm md:text-base">
            Find great gear and local deals from trekkers
          </p>

          {/* Create Listing CTA */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowCreate((v) => !v)}
              className="px-5 py-2.5 rounded-full bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition"
            >
              {showCreate ? 'Close' : 'Create Listing'}
            </button>
          </div>

          {/* Filters + Sort */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex gap-2 bg-white rounded-full shadow-sm p-1 border border-slate-200">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('sale')}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  filterType === 'sale' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                For Sale
              </button>
              <button
                onClick={() => setFilterType('rent')}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  filterType === 'rent' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                For Rent
              </button>
            </div>

            <div className="inline-flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-1 border border-slate-200">
              <span className="text-xs font-medium text-slate-600">Sort</span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
          </div>
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

        {/* Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="relative h-56">
                  <Image
                     src={item.primaryImageUrl || ''}
                     alt={item.title}
                     fill
                     className="object-cover"
                     sizes="(max-width: 768px) 100vw, 33vw"
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
                     <span
                       className={`inline-flex items-center gap-1 text-xs ${item.isAvailable ? 'text-green-700' : 'text-red-700'}`}
                     >
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
                     <span>{item.ownerName || 'Owner'}</span>
                   </div>
                   <div className="pt-2 flex gap-2">
                     <button className="flex-1 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm">View</button>
                     <button className="px-4 py-2 rounded-lg bg-white border text-slate-700 text-sm">Save</button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         )}
      </div>
    </section>
  );
};

export default Marketplace;