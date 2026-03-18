'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus, Edit2, Trash2, Search, ExternalLink,
  ChevronRight, ChevronDown, Building2, Layers,
  Star, Globe, Package, X, Check, MoreVertical,
  FolderOpen, Folder,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SubBrand {
  id: string;
  name: string;
  logo?: string;
  productsCount: number;
  status: 'active' | 'inactive';
}

interface Brand {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  country?: string;
  productsCount: number;
  status: 'active' | 'inactive';
  featured: boolean;
  createdAt: Date;
  subBrands: SubBrand[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockBrands: Brand[] = [
  {
    id: '1', name: 'Apple', logo: '🍎', website: 'apple.com', country: 'USA',
    productsCount: 456, status: 'active', featured: true, createdAt: new Date('2023-01-01'),
    subBrands: [
      { id: '1-1', name: 'iPhone',   logo: '📱', productsCount: 180, status: 'active' },
      { id: '1-2', name: 'MacBook',  logo: '💻', productsCount: 120, status: 'active' },
      { id: '1-3', name: 'AirPods',  logo: '🎧', productsCount: 56,  status: 'active' },
    ],
  },
  {
    id: '2', name: 'Samsung', logo: '📱', website: 'samsung.com', country: 'South Korea',
    productsCount: 389, status: 'active', featured: true, createdAt: new Date('2023-01-05'),
    subBrands: [
      { id: '2-1', name: 'Galaxy',   logo: '🌌', productsCount: 210, status: 'active' },
      { id: '2-2', name: 'QLED TV',  logo: '📺', productsCount: 89,  status: 'active' },
      { id: '2-3', name: 'Bespoke',  logo: '🏠', productsCount: 45,  status: 'inactive' },
    ],
  },
  {
    id: '3', name: 'Sony', logo: '🎮', website: 'sony.com', country: 'Japan',
    productsCount: 234, status: 'active', featured: true, createdAt: new Date('2023-01-10'),
    subBrands: [
      { id: '3-1', name: 'PlayStation', logo: '🎮', productsCount: 98, status: 'active' },
      { id: '3-2', name: 'Xperia',      logo: '📱', productsCount: 60, status: 'active' },
    ],
  },
  {
    id: '4', name: 'Nike', logo: '👟', website: 'nike.com', country: 'USA',
    productsCount: 567, status: 'active', featured: false, createdAt: new Date('2023-02-01'),
    subBrands: [
      { id: '4-1', name: 'Air Max',     logo: '👟', productsCount: 200, status: 'active' },
      { id: '4-2', name: 'Jordan',      logo: '🏀', productsCount: 180, status: 'active' },
      { id: '4-3', name: 'Nike Pro',    logo: '💪', productsCount: 90,  status: 'active' },
    ],
  },
  {
    id: '5', name: 'Adidas', logo: '👕', website: 'adidas.com', country: 'Germany',
    productsCount: 445, status: 'active', featured: false, createdAt: new Date('2023-02-05'),
    subBrands: [
      { id: '5-1', name: 'Originals', logo: '🌟', productsCount: 190, status: 'active' },
      { id: '5-2', name: 'Yeezy',     logo: '👟', productsCount: 80,  status: 'inactive' },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const brandColors = [
  'from-indigo-500/20 to-violet-500/20 border-indigo-500/30 text-indigo-300',
  'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300',
  'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-300',
  'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-300',
];
const getBrandColor = (id: string) =>
  brandColors[(parseInt(id.replace(/\D/g, '')) || 0) % brandColors.length];

// ─── Inline edit input ────────────────────────────────────────────────────────
function InlineInput({
  placeholder, onConfirm, onCancel,
}: { placeholder: string; onConfirm: (v: string) => void; onCancel: () => void }) {
  const [val, setVal] = useState('');
  const ref = useRef<HTMLInputElement>(null!);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="flex items-center gap-1.5 mt-1.5" onClick={e => e.stopPropagation()}>
      <input
        ref={ref}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onConfirm(val); if (e.key === 'Escape') onCancel(); }}
        placeholder={placeholder}
        className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition"
      />
      <button onClick={() => onConfirm(val)} className="w-6 h-6 flex items-center justify-center rounded-md bg-green-500/15 text-green-400 hover:bg-green-500/25 transition"><Check className="w-3 h-3" /></button>
      <button onClick={onCancel} className="w-6 h-6 flex items-center justify-center rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"><X className="w-3 h-3" /></button>
    </div>
  );
}

// ─── Brand tree row ───────────────────────────────────────────────────────────
function BrandRow({
  brand,
  isSelected,
  isExpanded,
  onSelect,
  onToggle,
  onAddSubBrand,
  onDelete,
  onDeleteSub,
}: {
  brand: Brand;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (b: Brand) => void;
  onToggle: (id: string) => void;
  onAddSubBrand: (brandId: string, name: string) => void;
  onDelete: (id: string) => void;
  onDeleteSub: (brandId: string, subId: string) => void;
}) {
  const [addingSubBrand, setAddingSubBrand] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null!);
  const gradient = getBrandColor(brand.id);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={`rounded-xl overflow-hidden border transition-all duration-150 ${
      isSelected ? 'border-indigo-500/40 shadow-lg shadow-indigo-900/10' : 'border-border hover:border-border/80'
    }`}>
      {/* Brand header row */}
      <div
        onClick={() => onSelect(brand)}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 group ${
          isSelected ? 'bg-indigo-500/10 border-l-[3px] border-l-indigo-500' : 'bg-card hover:bg-muted/40 border-l-[3px] border-l-transparent'
        }`}
      >
        {/* Expand toggle */}
        <button
          onClick={e => { e.stopPropagation(); onToggle(brand.id); }}
          className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
        >
          {brand.subBrands.length > 0 ? (
            isExpanded
              ? <ChevronDown className="w-3.5 h-3.5" />
              : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
          )}
        </button>

        {/* Folder icon */}
        {isExpanded && brand.subBrands.length > 0
          ? <FolderOpen className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-amber-400'}`} />
          : <Folder className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-amber-400/80'}`} />
        }

        {/* Logo */}
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} border flex items-center justify-center flex-shrink-0 text-sm`}>
          {brand.logo ?? getInitials(brand.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-bold ${isSelected ? 'text-indigo-300' : 'text-foreground'}`}>{brand.name}</span>
            {brand.featured && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">Featured</span>
            )}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
              brand.status === 'active'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            }`}>{brand.status}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {brand.country && <span className="text-[11px] text-muted-foreground">{brand.country}</span>}
            <span className="text-[11px] text-muted-foreground">{brand.productsCount} products</span>
            <span className="text-[11px] text-muted-foreground">{brand.subBrands.length} sub-brands</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setAddingSubBrand(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
            title="Add sub-brand"
          >
            <Plus className="w-3 h-3" /> Sub-brand
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(brand.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add sub-brand inline input */}
      {addingSubBrand && (
        <div className="px-4 pb-3 bg-card border-t border-border/50">
          <InlineInput
            placeholder="Sub-brand name…"
            onConfirm={name => { if (name.trim()) onAddSubBrand(brand.id, name.trim()); setAddingSubBrand(false); }}
            onCancel={() => setAddingSubBrand(false)}
          />
        </div>
      )}

      {/* Sub-brand rows */}
      {isExpanded && brand.subBrands.length > 0 && (
        <div className="border-t border-border/50 divide-y divide-border/30 bg-muted/10">
          {brand.subBrands.map(sub => (
            <div key={sub.id} className="flex items-center gap-3 pl-12 pr-4 py-2.5 group hover:bg-muted/40 transition-colors">
              {/* tree line */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-px h-3 bg-border/60 ml-1" />
                <div className="w-3 h-px bg-border/60" />
                <Layers className="w-3.5 h-3.5 text-muted-foreground/60" />
              </div>

              {/* sub logo */}
              <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getBrandColor(sub.id)} border flex items-center justify-center flex-shrink-0 text-xs`}>
                {sub.logo ?? getInitials(sub.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{sub.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                    sub.status === 'active'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>{sub.status}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{sub.productsCount} products</span>
              </div>

              {/* sub actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDeleteSub(brand.id, sub.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Brand detail panel ───────────────────────────────────────────────────────
function BrandPanel({ brand, onClose }: { brand: Brand; onClose: () => void }) {
  const gradient = getBrandColor(brand.id);
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-200">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Brand Details</span>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

        {/* Identity */}
        <div className="px-5 pb-5 border-b border-gray-800">
          <div className="flex flex-col items-center text-center gap-3">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} border-2 flex items-center justify-center shadow-lg text-3xl`}>
              {brand.logo ?? getInitials(brand.name)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{brand.name}</h3>
              {brand.country && <p className="text-xs text-gray-400 mt-0.5">{brand.country}</p>}
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  brand.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${brand.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  {brand.status}
                </span>
                {brand.featured && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Metrics</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Package,   label: 'Products',   value: brand.productsCount,        color: 'text-blue-400',   bg: 'bg-blue-500/8' },
              { icon: Layers,    label: 'Sub-brands', value: brand.subBrands.length,     color: 'text-purple-400', bg: 'bg-purple-500/8' },
              { icon: Globe,     label: 'Website',    value: brand.website ?? '—',        color: 'text-cyan-400',   bg: 'bg-cyan-500/8' },
              { icon: Building2, label: 'Since',      value: brand.createdAt.getFullYear(), color: 'text-gray-400', bg: 'bg-gray-700/30' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={`${bg} border border-white/[0.04] rounded-xl px-3 py-2.5`}>
                <div className="flex items-center gap-1 mb-1">
                  <Icon className={`w-3 h-3 ${color}`} />
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-wide">{label}</p>
                </div>
                <p className={`text-xs font-bold truncate ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-brands list */}
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Sub-brands ({brand.subBrands.length})</p>
          {brand.subBrands.length === 0 ? (
            <p className="text-xs text-gray-600 italic">No sub-brands yet</p>
          ) : (
            <div className="space-y-1.5">
              {brand.subBrands.map(sub => (
                <div key={sub.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getBrandColor(sub.id)} border flex items-center justify-center text-xs flex-shrink-0`}>
                    {sub.logo ?? getInitials(sub.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{sub.name}</p>
                    <p className="text-[10px] text-gray-500">{sub.productsCount} products</p>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                    sub.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>{sub.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Actions</p>
          {brand.website && (
            <a href={`https://${brand.website}`} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all group active:scale-[0.98] shadow-lg shadow-indigo-900/30">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">Visit Website</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white text-xs font-bold transition-all group active:scale-[0.98]">
            <Edit2 className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Edit Brand</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-gray-700/80 bg-transparent hover:bg-red-500/10 hover:border-red-500/30 text-red-400 text-xs font-bold transition-all group active:scale-[0.98]">
            <Trash2 className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Delete Brand</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="h-3" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BrandsPage() {
  const [brands,        setBrands]        = useState<Brand[]>(mockBrands);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [filterFeatured,setFilterFeatured]= useState(false);
  const [expanded,      setExpanded]      = useState<Record<string, boolean>>({});
  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [addingBrand,   setAddingBrand]   = useState(false);

  const filteredBrands = brands.filter(b =>
    (!searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!filterFeatured || b.featured)
  );

  const stats = {
    total:         brands.length,
    active:        brands.filter(b => b.status === 'active').length,
    featured:      brands.filter(b => b.featured).length,
    totalProducts: brands.reduce((s, b) => s + b.productsCount, 0),
    totalSubs:     brands.reduce((s, b) => s + b.subBrands.length, 0),
  };

  const selectedBrand = brands.find(b => b.id === selectedId) ?? null;

  const handleToggle = (id: string) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const handleSelect = (brand: Brand) =>
    setSelectedId(p => p === brand.id ? null : brand.id);

  const handleAddBrand = (name: string) => {
    if (!name.trim()) return;
    const id = `brand-${Date.now()}`;
    setBrands(prev => [...prev, {
      id, name: name.trim(), productsCount: 0, status: 'active',
      featured: false, createdAt: new Date(), subBrands: [],
    }]);
    setAddingBrand(false);
  };

  const handleAddSubBrand = (brandId: string, name: string) => {
    setBrands(prev => prev.map(b => b.id !== brandId ? b : {
      ...b,
      subBrands: [...b.subBrands, {
        id: `sub-${Date.now()}`, name, productsCount: 0, status: 'active',
      }],
    }));
    setExpanded(e => ({ ...e, [brandId]: true }));
  };

  const handleDeleteBrand = (id: string) => {
    setBrands(prev => prev.filter(b => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleDeleteSubBrand = (brandId: string, subId: string) => {
    setBrands(prev => prev.map(b => b.id !== brandId ? b : {
      ...b, subBrands: b.subBrands.filter(s => s.id !== subId),
    }));
  };

  const handleExpandAll  = () => setExpanded(Object.fromEntries(brands.map(b => [b.id, true])));
  const handleCollapseAll = () => setExpanded({});

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brand Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage product brands and their sub-brands</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExpandAll}>Expand All</Button>
          <Button variant="outline" size="sm" onClick={handleCollapseAll}>Collapse All</Button>
          <Button size="sm" className="gap-2" onClick={() => setAddingBrand(true)}>
            <Folder className="w-4 h-4" /> Add Brand
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Brands',   value: stats.total,                                         color: 'text-foreground' },
          { label: 'Active',         value: stats.active,                                        color: 'text-green-400' },
          { label: 'Featured',       value: stats.featured,                                      color: 'text-amber-400' },
          { label: 'Sub-brands',     value: stats.totalSubs,                                     color: 'text-indigo-400' },
          { label: 'Total Products', value: `${(stats.totalProducts / 1000).toFixed(1)}K`,       color: 'text-blue-400' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="p-4">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</div>
          </Card>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search brands…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={filterFeatured ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterFeatured(f => !f)}
          className="gap-2"
        >
          <Star className="w-4 h-4" /> Featured Only
        </Button>
      </div>

      {/* Tree + panel */}
      <div className="flex gap-4 items-start">

        {/* Tree */}
        <div className="flex-1 min-w-0 space-y-2">

          {/* Add brand inline input */}
          {addingBrand && (
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Folder className="w-4 h-4 text-amber-400" /> New Brand
              </div>
              <InlineInput
                placeholder="Brand name…"
                onConfirm={handleAddBrand}
                onCancel={() => setAddingBrand(false)}
              />
            </Card>
          )}

          {filteredBrands.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No brands found</p>
            </Card>
          ) : filteredBrands.map(brand => (
            <BrandRow
              key={brand.id}
              brand={brand}
              isSelected={selectedId === brand.id}
              isExpanded={!!expanded[brand.id]}
              onSelect={handleSelect}
              onToggle={handleToggle}
              onAddSubBrand={handleAddSubBrand}
              onDelete={handleDeleteBrand}
              onDeleteSub={handleDeleteSubBrand}
            />
          ))}

          {/* Footer hint */}
          {filteredBrands.length > 0 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''} · hover a row to see actions
            </p>
          )}
        </div>

        {/* Detail panel */}
        {selectedBrand && (
          <div
            className="w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl sticky top-4"
            style={{ background: '#0f1117', border: '1px solid #1e2330' }}
          >
            <BrandPanel brand={selectedBrand} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>
    </div>
  );
}