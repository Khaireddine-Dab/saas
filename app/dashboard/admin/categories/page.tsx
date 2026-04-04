'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus, Edit2, Trash2, Search, X, Check,
  ChevronRight, ChevronDown, FolderOpen, Folder,
  Layers, Package, Tag, Hash, Calendar,
  Eye, EyeOff, ChevronRight as ArrowRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent?: string;
  productsCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  order: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockCategories: Category[] = [
  {
    id: '1', name: 'Electronics', slug: 'electronics',
    description: 'Electronic devices and gadgets', icon: '📱',
    productsCount: 2450, status: 'active', createdAt: new Date('2023-01-01'), order: 1,
  },
  {
    id: '2', name: 'Smartphones', slug: 'smartphones',
    description: 'Mobile phones and accessories', parent: '1', icon: '📞',
    productsCount: 890, status: 'active', createdAt: new Date('2023-01-05'), order: 1,
  },
  {
    id: '3', name: 'Laptops', slug: 'laptops',
    description: 'Laptop computers and tablets', parent: '1', icon: '💻',
    productsCount: 560, status: 'active', createdAt: new Date('2023-01-10'), order: 2,
  },
  {
    id: '4', name: 'Headphones', slug: 'headphones',
    description: 'Audio equipment and accessories', parent: '1', icon: '🎧',
    productsCount: 320, status: 'active', createdAt: new Date('2023-01-12'), order: 3,
  },
  {
    id: '5', name: 'Fashion', slug: 'fashion',
    description: 'Clothing, shoes, and accessories', icon: '👕',
    productsCount: 3200, status: 'active', createdAt: new Date('2023-01-15'), order: 2,
  },
  {
    id: '6', name: 'Men\'s Clothing', slug: 'mens-clothing',
    description: 'Shirts, pants, and suits', parent: '5', icon: '👔',
    productsCount: 1100, status: 'active', createdAt: new Date('2023-01-20'), order: 1,
  },
  {
    id: '7', name: 'Women\'s Clothing', slug: 'womens-clothing',
    description: 'Dresses, tops, and more', parent: '5', icon: '👗',
    productsCount: 1400, status: 'active', createdAt: new Date('2023-01-22'), order: 2,
  },
  {
    id: '8', name: 'Home & Garden', slug: 'home-garden',
    description: 'Furniture and home items', icon: '🏠',
    productsCount: 1800, status: 'active', createdAt: new Date('2023-02-01'), order: 3,
  },
  {
    id: '9', name: 'Furniture', slug: 'furniture',
    description: 'Sofas, tables, and chairs', parent: '8', icon: '🛋️',
    productsCount: 650, status: 'active', createdAt: new Date('2023-02-05'), order: 1,
  },
  {
    id: '10', name: 'Kitchen', slug: 'kitchen',
    description: 'Appliances and cookware', parent: '8', icon: '🍳',
    productsCount: 480, status: 'inactive', createdAt: new Date('2023-02-10'), order: 2,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const catColors = [
  'from-indigo-500/20 to-violet-500/20 border-indigo-500/30 text-indigo-300',
  'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300',
  'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-300',
  'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-300',
];
const getCatColor = (id: string) =>
  catColors[(parseInt(id.replace(/\D/g, '')) || 0) % catColors.length];

// ─── Inline input ─────────────────────────────────────────────────────────────
function InlineInput({
  placeholder, onConfirm, onCancel,
}: { placeholder: string; onConfirm: (v: string) => void; onCancel: () => void }) {
  const [val, setVal] = useState('');
  const ref = useRef<HTMLInputElement>(null!);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="flex items-center gap-1.5 mt-2" onClick={e => e.stopPropagation()}>
      <input
        ref={ref}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') onConfirm(val);
          if (e.key === 'Escape') onCancel();
        }}
        placeholder={placeholder}
        className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition"
      />
      <button
        onClick={() => onConfirm(val)}
        className="w-6 h-6 flex items-center justify-center rounded-md bg-green-500/15 text-green-400 hover:bg-green-500/25 transition"
      >
        <Check className="w-3 h-3" />
      </button>
      <button
        onClick={onCancel}
        className="w-6 h-6 flex items-center justify-center rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Category detail panel ────────────────────────────────────────────────────
function CategoryPanel({
  category, children, onClose,
}: { category: Category; children: Category[]; onClose: () => void }) {
  const gradient = getCatColor(category.id);
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category Details</span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

        {/* Identity */}
        <div className="px-5 pb-5 border-b border-gray-800">
          <div className="flex flex-col items-center text-center gap-3">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} border-2 flex items-center justify-center shadow-lg text-3xl`}>
              {category.icon ?? '📦'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{category.name}</h3>
              {category.description && (
                <p className="text-xs text-gray-400 mt-0.5">{category.description}</p>
              )}
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  category.status === 'active'
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${category.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  {category.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Details</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Package,  label: 'Products',    value: category.productsCount,          color: 'text-blue-400',   bg: 'bg-blue-500/8' },
              { icon: Layers,   label: 'Sub-cats',    value: children.length,                 color: 'text-purple-400', bg: 'bg-purple-500/8' },
              { icon: Hash,     label: 'Slug',        value: category.slug,                   color: 'text-cyan-400',   bg: 'bg-cyan-500/8' },
              { icon: Calendar, label: 'Created',     value: category.createdAt.toLocaleDateString(), color: 'text-gray-400', bg: 'bg-gray-700/30' },
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

        {/* Sub-categories */}
        {children.length > 0 && (
          <div className="px-5 py-4 border-b border-gray-800">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">
              Sub-categories ({children.length})
            </p>
            <div className="space-y-1.5">
              {children.map(child => (
                <div key={child.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getCatColor(child.id)} border flex items-center justify-center text-xs flex-shrink-0`}>
                    {child.icon ?? '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{child.name}</p>
                    <p className="text-[10px] text-gray-500">{child.productsCount} products</p>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                    child.status === 'active'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>{child.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-5 py-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Actions</p>
          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all group active:scale-[0.98] shadow-lg shadow-indigo-900/30">
            <Edit2 className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Edit Category</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white text-xs font-bold transition-all group active:scale-[0.98]`}>
            {category.status === 'active' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="flex-1 text-left">{category.status === 'active' ? 'Deactivate' : 'Activate'}</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-gray-700/80 bg-transparent hover:bg-red-500/10 hover:border-red-500/30 text-red-400 text-xs font-bold transition-all group active:scale-[0.98]">
            <Trash2 className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Delete Category</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="h-3" />
      </div>
    </div>
  );
}

// ─── Category tree row ────────────────────────────────────────────────────────
function CategoryRow({
  category,
  children,
  isSelected,
  isExpanded,
  onSelect,
  onToggle,
  onAddChild,
  onDelete,
  onDeleteChild,
}: {
  category: Category;
  children: Category[];
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (c: Category) => void;
  onToggle: (id: string) => void;
  onAddChild: (parentId: string, name: string) => void;
  onDelete: (id: string) => void;
  onDeleteChild: (id: string) => void;
}) {
  const [addingChild, setAddingChild] = useState(false);
  const gradient = getCatColor(category.id);

  return (
    <div className={`rounded-xl overflow-hidden border transition-all duration-150 ${
      isSelected ? 'border-indigo-500/40 shadow-lg shadow-indigo-900/10' : 'border-border'
    }`}>
      {/* Parent row */}
      <div
        onClick={() => onSelect(category)}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 group ${
          isSelected
            ? 'bg-indigo-500/10 border-l-[3px] border-l-indigo-500'
            : 'bg-card hover:bg-muted/40 border-l-[3px] border-l-transparent'
        }`}
      >
        {/* Expand toggle */}
        <button
          onClick={e => { e.stopPropagation(); onToggle(category.id); }}
          className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
        >
          {children.length > 0 ? (
            isExpanded
              ? <ChevronDown className="w-3.5 h-3.5" />
              : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
          )}
        </button>

        {/* Folder icon */}
        {isExpanded && children.length > 0
          ? <FolderOpen className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-amber-400'}`} />
          : <Folder className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-amber-400/80'}`} />
        }

        {/* Emoji icon */}
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} border flex items-center justify-center flex-shrink-0 text-base`}>
          {category.icon ?? '📦'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-bold ${isSelected ? 'text-indigo-300' : 'text-foreground'}`}>
              {category.name}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
              category.status === 'active'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            }`}>{category.status}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[11px] text-muted-foreground font-mono">{category.slug}</span>
            <span className="text-[11px] text-muted-foreground">{category.productsCount} products</span>
            {children.length > 0 && (
              <span className="text-[11px] text-muted-foreground">{children.length} sub-categories</span>
            )}
          </div>
        </div>

        {/* Hover actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setAddingChild(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
            title="Add sub-category"
          >
            <Plus className="w-3 h-3" /> Sub-cat
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inline add sub-category input */}
      {addingChild && (
        <div className="px-4 pb-3 bg-card border-t border-border/50">
          <InlineInput
            placeholder="Sub-category name…"
            onConfirm={name => { if (name.trim()) onAddChild(category.id, name.trim()); setAddingChild(false); }}
            onCancel={() => setAddingChild(false)}
          />
        </div>
      )}

      {/* Children */}
      {isExpanded && children.length > 0 && (
        <div className="border-t border-border/50 divide-y divide-border/30 bg-muted/10">
          {children.map(child => (
            <div
              key={child.id}
              className="flex items-center gap-3 pl-12 pr-4 py-2.5 group hover:bg-muted/40 transition-colors"
            >
              {/* Tree connector */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-px h-3 bg-border/60 ml-1" />
                <div className="w-3 h-px bg-border/60" />
                <Layers className="w-3.5 h-3.5 text-muted-foreground/60" />
              </div>

              {/* Child icon */}
              <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getCatColor(child.id)} border flex items-center justify-center flex-shrink-0 text-xs`}>
                {child.icon ?? '📦'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{child.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                    child.status === 'active'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>{child.status}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground font-mono">{child.slug}</span>
                  <span className="text-[10px] text-muted-foreground">{child.productsCount} products</span>
                </div>
              </div>

              {/* Child actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDeleteChild(child.id)}
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const [categories,   setCategories]   = useState<Category[]>(mockCategories);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [expanded,     setExpanded]     = useState<Record<string, boolean>>({});
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [addingCat,    setAddingCat]    = useState(false);

  // ── derived data ──────────────────────────────────────────────────────────
  const parentCategories = categories.filter(c => !c.parent);
  const getChildren      = (id: string) => categories.filter(c => c.parent === id);

  const filteredParents = parentCategories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getChildren(c.id).some(ch =>
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredFlat = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total:         categories.length,
    active:        categories.filter(c => c.status === 'active').length,
    totalProducts: categories.reduce((s, c) => s + c.productsCount, 0),
    subCats:       categories.filter(c => c.parent).length,
  };

  const selectedCategory = categories.find(c => c.id === selectedId) ?? null;

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleToggle = (id: string) => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const handleSelect = (c: Category) => setSelectedId(p => p === c.id ? null : c.id);

  const handleAddCategory = (name: string) => {
    if (!name.trim()) return;
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
    setCategories(prev => [...prev, {
      id: `cat-${Date.now()}`, name: name.trim(), slug,
      productsCount: 0, status: 'active',
      createdAt: new Date(), order: prev.length + 1,
    }]);
    setAddingCat(false);
  };

  const handleAddSubCategory = (parentId: string, name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    setCategories(prev => [...prev, {
      id: `cat-${Date.now()}`, name, slug, parent: parentId,
      productsCount: 0, status: 'active',
      createdAt: new Date(), order: 1,
    }]);
    setExpanded(e => ({ ...e, [parentId]: true }));
  };

  const handleDelete = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id && c.parent !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleDeleteChild = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleExpandAll  = () => setExpanded(Object.fromEntries(parentCategories.map(c => [c.id, true])));
  const handleCollapseAll = () => setExpanded({});

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Organize and manage product categories</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setAddingCat(true)}>
          <Plus className="w-4 h-4" /> New Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Categories',  value: stats.total,                                        color: 'text-foreground' },
          { label: 'Parent Categories', value: parentCategories.length,                            color: 'text-indigo-400' },
          { label: 'Sub-categories',    value: stats.subCats,                                      color: 'text-purple-400' },
          { label: 'Total Products',    value: `${(stats.totalProducts / 1000).toFixed(1)}K`,     color: 'text-blue-400' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="p-4">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</div>
          </Card>
        ))}
      </div>

      {/* ── Flat table (kept intact from original) ── */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search categories…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {['Name', 'Slug', 'Products', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} className={`px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFlat.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">No categories found</td>
                  </tr>
                ) : filteredFlat.map(cat => (
                  <tr key={cat.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cat.icon && <span className="text-xl">{cat.icon}</span>}
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-2">
                            {cat.name}
                            {cat.parent && (
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                                sub-cat
                              </span>
                            )}
                          </div>
                          {cat.description && <div className="text-xs text-muted-foreground">{cat.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{cat.slug}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{cat.productsCount}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cat.status === 'active'
                        ? 'bg-green-500/20 text-green-500 border-green-500/40'
                        : 'bg-muted text-muted-foreground border-border'
                      }>
                        {cat.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => setEditingId(cat.id)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── Category Hierarchy — replaced with interactive tree ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Category Hierarchy</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Click a category to view details · hover to see actions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExpandAll}>Expand All</Button>
            <Button variant="outline" size="sm" onClick={handleCollapseAll}>Collapse All</Button>
          </div>
        </div>

        <div className="flex gap-4 items-start">

          {/* Tree */}
          <div className="flex-1 min-w-0 space-y-2">

            {/* Inline add category */}
            {addingCat && (
              <Card className="p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Folder className="w-4 h-4 text-amber-400" /> New Category
                </div>
                <InlineInput
                  placeholder="Category name…"
                  onConfirm={handleAddCategory}
                  onCancel={() => setAddingCat(false)}
                />
              </Card>
            )}

            {filteredParents.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No categories found</p>
              </Card>
            ) : filteredParents.map(parent => (
              <CategoryRow
                key={parent.id}
                category={parent}
                children={getChildren(parent.id)}
                isSelected={selectedId === parent.id}
                isExpanded={!!expanded[parent.id]}
                onSelect={handleSelect}
                onToggle={handleToggle}
                onAddChild={handleAddSubCategory}
                onDelete={handleDelete}
                onDeleteChild={handleDeleteChild}
              />
            ))}

            {filteredParents.length > 0 && (
              <p className="text-xs text-muted-foreground text-center pt-1">
                {filteredParents.length} parent{filteredParents.length !== 1 ? 's' : ''} · {stats.subCats} sub-categories
              </p>
            )}
          </div>

          {/* Detail panel */}
          {selectedCategory && (
            <div
              className="w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl sticky top-4"
              style={{ background: '#0f1117', border: '1px solid #1e2330' }}
            >
              <CategoryPanel
                category={selectedCategory}
                children={getChildren(selectedCategory.id)}
                onClose={() => setSelectedId(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}