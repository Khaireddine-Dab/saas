'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Search, Plus, X,
  Mail, MapPin, Calendar, Clock,
  ShieldBan, UserCircle2, ChevronRight,
  Activity, MessageSquare,
  ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'analyst' | 'user';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  joinDate: Date;
  activityScore: number;
  location?: string;
  lastLogin?: Date;
  reviews?: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockUsers: User[] = [
  { id: '1', name: 'Mohammed Al-Mansoori', email: 'mohammed@example.com', role: 'user',      status: 'active',    joinDate: new Date('2023-01-15'), activityScore: 95, location: 'Tunis, Tunisia',   lastLogin: new Date(),                                     reviews: 12 },
  { id: '2', name: 'Layla Al-Kaabi',       email: 'layla@example.com',    role: 'user',      status: 'active',    joinDate: new Date('2023-03-20'), activityScore: 78, location: 'Sfax, Tunisia',    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), reviews: 7  },
  { id: '3', name: 'Fatima Al-Mazrouei',   email: 'fatima@example.com',   role: 'user',      status: 'suspended', joinDate: new Date('2022-06-10'), activityScore: 45, location: 'Sousse, Tunisia',                                                              reviews: 3  },
  { id: '4', name: 'Ahmed Al-Mansouri',    email: 'ahmed@example.com',    role: 'user',      status: 'active',    joinDate: new Date('2023-09-05'), activityScore: 82, location: 'Tunis, Tunisia',   lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000),     reviews: 9  },
  { id: '5', name: 'Noor Al-Mazrouei',     email: 'noor@example.com',     role: 'user',      status: 'banned',    joinDate: new Date('2022-11-20'), activityScore: 12, location: 'Bizerte, Tunisia',                                                             reviews: 1  },
  { id: '6', name: 'Hassan Al-Mansoori',   email: 'hassan@example.com',   role: 'user',      status: 'active',    joinDate: new Date('2024-01-10'), activityScore: 68, location: 'Tunis, Tunisia',   lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000),      reviews: 5  },
  { id: '7', name: 'Sara Ben Salah',       email: 'sara@example.com',     role: 'moderator', status: 'active',    joinDate: new Date('2023-05-14'), activityScore: 91, location: 'Tunis, Tunisia',   lastLogin: new Date(Date.now() - 30 * 60 * 1000),          reviews: 0  },
  { id: '8', name: 'Youssef Gharbi',       email: 'youssef@example.com',  role: 'analyst',   status: 'inactive',  joinDate: new Date('2023-08-22'), activityScore: 34, location: 'Nabeul, Tunisia',  lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),reviews: 2  },
];

// ─── Config Maps ──────────────────────────────────────────────────────────────
const statusConfig: Record<User['status'], { label: string; dot: string; badge: string }> = {
  active:    { label: 'Active',    dot: 'bg-green-500',  badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  inactive:  { label: 'Inactive',  dot: 'bg-gray-500',   badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  suspended: { label: 'Suspended', dot: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  banned:    { label: 'Banned',    dot: 'bg-red-500',    badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const roleConfig: Record<User['role'], string> = {
  admin:     'bg-purple-500/10 text-purple-400 border-purple-500/20',
  moderator: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  analyst:   'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  user:      'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const avatarGradients = [
  'from-blue-500/40 to-indigo-500/40 border-blue-500/30 text-blue-200',
  'from-purple-500/40 to-pink-500/40 border-purple-500/30 text-purple-200',
  'from-emerald-500/40 to-teal-500/40 border-emerald-500/30 text-emerald-200',
  'from-orange-500/40 to-amber-500/40 border-orange-500/30 text-orange-200',
  'from-rose-500/40 to-red-500/40 border-rose-500/30 text-rose-200',
  'from-cyan-500/40 to-sky-500/40 border-cyan-500/30 text-cyan-200',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getGradient  = (id: string) => avatarGradients[parseInt(id) % avatarGradients.length];
const getInitials  = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
const formatDate   = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const timeAgo      = (d: Date) => {
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000);
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${day}d ago`;
};

// ─── User Detail Panel ────────────────────────────────────────────────────────
function UserPanel({ user, onClose }: { user: User; onClose: () => void }) {
  const status   = statusConfig[user.status];
  const gradient = getGradient(user.id);

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-200">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <UserCircle2 className="w-4 h-4 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">User Details</span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

        {/* Identity block */}
        <div className="px-5 pb-5 border-b border-gray-800">
          <div className="flex flex-col items-center text-center gap-3">
            {/* Avatar */}
            <div className={`w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${gradient} border-2 flex items-center justify-center shadow-lg flex-shrink-0`}>
              <span className="text-2xl font-black">{getInitials(user.name)}</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-snug">{user.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              {/* Badges */}
              <div className="flex items-center justify-center gap-2 mt-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${roleConfig[user.role]}`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Information</p>
          <div className="space-y-2">
            {[
              { icon: Calendar, label: 'Joined',     value: formatDate(user.joinDate) },
              { icon: MapPin,   label: 'Location',   value: user.location ?? 'Not specified' },
              { icon: Clock,    label: 'Last Login',  value: user.lastLogin ? timeAgo(user.lastLogin) : 'Never' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-1">
                <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700/50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">{label}</p>
                  <p className="text-xs text-gray-300 font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Activity</p>
          <div className="space-y-2.5">
            {/* Score */}
            <div className="bg-gray-800/60 border border-gray-700/40 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs text-gray-400 font-medium">Activity Score</span>
                </div>
                <span className={`text-sm font-bold ${user.activityScore >= 80 ? 'text-green-400' : user.activityScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {user.activityScore}%
                </span>
              </div>
              <div className="w-full bg-gray-700/80 rounded-full h-1.5">
                <div
                  className={`rounded-full h-1.5 transition-all ${user.activityScore >= 80 ? 'bg-green-500' : user.activityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${user.activityScore}%` }}
                />
              </div>
            </div>
            {/* Reviews */}
            <div className="bg-gray-800/60 border border-gray-700/40 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-gray-400 font-medium">Reviews Written</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">{user.reviews ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 py-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Actions</p>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150 group shadow-lg shadow-indigo-900/40">
            <UserCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Visit Profile</span>
            <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150 group shadow-lg shadow-blue-900/40">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Contact User</span>
            <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/60 hover:bg-red-500/15 hover:border-red-500/40 text-red-400 hover:text-red-300 text-sm font-semibold transition-all duration-150 group active:scale-[0.98]">
            <ShieldBan className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">{user.status === 'banned' ? 'Unban User' : 'Block User'}</span>
            <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="h-2" />
      </div>
    </div>
  );
}

// ─── Sort Icon helper ─────────────────────────────────────────────────────────
function SortIcon({ col, sortKey, dir }: { col: string; sortKey: string; dir: 'asc'|'desc' }) {
  if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
  return dir === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-primary" /> : <ArrowDown className="w-3 h-3 ml-1 text-primary" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [sortKey,       setSortKey]       = useState<keyof User>('joinDate');
  const [sortDir,       setSortDir]       = useState<'asc'|'desc'>('desc');
  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState('all');
  const [selected,      setSelected]      = useState<User | null>(null);

  const handleSort = (key: keyof User) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const rows = mockUsers
    .filter(u =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
       u.email.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === 'all' || u.status === statusFilter)
    )
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null) return 1; if (bv == null) return -1;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and monitor all platform users</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: mockUsers.length,                                   color: 'text-foreground' },
          { label: 'Active',      value: mockUsers.filter(u => u.status === 'active').length,    color: 'text-green-400' },
          { label: 'Suspended',   value: mockUsers.filter(u => u.status === 'suspended').length, color: 'text-yellow-400' },
          { label: 'Banned',      value: mockUsers.filter(u => u.status === 'banned').length,    color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all','active','suspended','banned','inactive'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all capitalize ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table + panel ── */}
      <div className="flex gap-4 items-start">

        {/* Table */}
        <div className="flex-1 min-w-0 bg-card border border-border rounded-xl overflow-hidden">

          {/* Column headers */}
          <div className="grid grid-cols-12 px-4 py-3 border-b border-border bg-muted/30">
            {/* Name */}
            <button onClick={() => handleSort('name')} className="col-span-3 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Name <SortIcon col="name" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* Email */}
            <button onClick={() => handleSort('email')} className="col-span-3 hidden sm:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Email <SortIcon col="email" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* Role */}
            <span className="col-span-2 hidden md:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</span>
            {/* Status */}
            <button onClick={() => handleSort('status')} className="col-span-2 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Status <SortIcon col="status" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* Joined */}
            <button onClick={() => handleSort('joinDate')} className="col-span-1 hidden lg:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Joined <SortIcon col="joinDate" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* Activity */}
            <button onClick={() => handleSort('activityScore')} className="col-span-1 flex items-center justify-end text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Act. <SortIcon col="activityScore" sortKey={sortKey} dir={sortDir} />
            </button>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {rows.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No users found.</div>
            ) : rows.map(user => {
              const isActive = selected?.id === user.id;
              const status   = statusConfig[user.status];
              const gradient = getGradient(user.id);

              return (
                <div
                  key={user.id}
                  onClick={() => setSelected(isActive ? null : user)}
                  className={`grid grid-cols-12 px-4 py-3.5 cursor-pointer transition-all duration-150 select-none ${
                    isActive
                      ? 'bg-indigo-500/10 border-l-[3px] border-l-indigo-500'
                      : 'hover:bg-muted/40 border-l-[3px] border-l-transparent'
                  }`}
                >
                  {/* Name */}
                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border flex items-center justify-center flex-shrink-0`}>
                      <span className="text-[11px] font-black">{getInitials(user.name)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isActive ? 'text-indigo-300' : 'text-foreground'}`}>
                        {user.name}
                      </p>
                      {user.lastLogin && (
                        <p className="text-[11px] text-muted-foreground">{timeAgo(user.lastLogin)}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-3 hidden sm:flex items-center">
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>

                  {/* Role */}
                  <div className="col-span-2 hidden md:flex items-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${roleConfig[user.role]}`}>
                      {user.role}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${status.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  {/* Joined */}
                  <div className="col-span-1 hidden lg:flex items-center">
                    <span className="text-xs text-muted-foreground">{formatDate(user.joinDate)}</span>
                  </div>

                  {/* Activity */}
                  <div className="col-span-1 flex items-center justify-end gap-1.5">
                    <div className="hidden sm:block w-8 bg-muted rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 ${user.activityScore >= 80 ? 'bg-green-500' : user.activityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${user.activityScore}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${user.activityScore >= 80 ? 'text-green-400' : user.activityScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {user.activityScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{rows.length}</span> of{' '}
              <span className="font-semibold text-foreground">{mockUsers.length}</span> users
            </span>
            {selected && (
              <span className="text-xs text-indigo-400 font-medium animate-in fade-in duration-200">
                ← Click row again to close panel
              </span>
            )}
          </div>
        </div>

        {/* ── Detail panel ── */}
        {selected && (
          <div
            className="w-72 flex-shrink-0 rounded-xl shadow-2xl overflow-hidden"
            style={{ background: '#0f1117', border: '1px solid #1e2330' }}
          >
            <UserPanel user={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  );
}