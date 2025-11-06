'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapPin, Tag, BadgePercent, CheckCircle, XCircle } from 'lucide-react';
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

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Marketplace</h2>
          <p className="mt-2 text-slate-600">Find great gear and local deals from trekkers</p>

          {/* Filters */}
          <div className="mt-6 inline-flex gap-2 bg-white rounded-full shadow-sm p-1 border">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full text-sm ${
                filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('sale')}
              className={`px-4 py-2 rounded-full text-sm ${
                filterType === 'sale' ? 'bg-slate-900 text-white' : 'text-slate-700'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setFilterType('rent')}
              className={`px-4 py-2 rounded-full text-sm ${
                filterType === 'rent' ? 'bg-slate-900 text-white' : 'text-slate-700'
              }`}
            >
              For Rent
            </button>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="text-center text-slate-600">Loading marketplace items…</div>
        )}
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
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