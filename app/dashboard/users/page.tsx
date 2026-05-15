'use client';

import React, { useState, useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import {
  Search, Plus, X,
  Mail, MapPin, Calendar,
  UserCircle2, ChevronRight,
} from 'lucide-react';
import type { User, UserStatus, UserRole } from '@/types/user';


// ─── Config Maps ──────────────────────────────────────────────────────────────
const statusConfig: Record<UserStatus, { label: string; dot: string; badge: string }> = {
  active:    { label: 'Actif',     dot: 'bg-green-500',  badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  inactive:  { label: 'Inactif',   dot: 'bg-gray-500',   badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  suspended: { label: 'Suspendu',  dot: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  banned:    { label: 'Bannis',    dot: 'bg-red-500',    badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const roleConfig: Record<UserRole, string> = {
  ADMIN:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  PRO:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  CLIENT: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
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
const getGradient = (id: string) => avatarGradients[id.charCodeAt(0) % avatarGradients.length];
const getInitials = (fullName?: string, email?: string) => {
  const name = fullName || email || 'U';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
};
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ─── User Detail Panel ────────────────────────────────────────────────────────
function UserPanel({ user, onClose, onStatusChange }: { user: User; onClose: () => void; onStatusChange: (status: UserStatus) => void }) {
  const status = statusConfig[user.status];
  const gradient = getGradient(user.id);

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <UserCircle2 className="w-4 h-4 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Détails Utilisateur</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Identity block */}
        <div className="px-5 pb-5 border-b border-gray-800">
          <div className="flex flex-col items-center text-center gap-3">
            {/* Avatar */}
            <div className={`w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${gradient} border-2 flex items-center justify-center shadow-lg flex-shrink-0`}>
              <span className="text-2xl font-black">{getInitials(user.full_name, user.email)}</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-snug">{user.full_name || user.email}</h3>
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
              { icon: Calendar, label: 'Créé le',     value: formatDate(user.created_at) },
              { icon: MapPin,   label: 'Ville',       value: user.city ?? 'Non spécifié' },
              { icon: Mail,     label: 'Téléphone',   value: user.phone ?? 'Non spécifié' },
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

        {/* Dates detailed */}
        <div className="px-5 py-4 border-b border-gray-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">Créé le</span>
              <span className="text-sm text-gray-300 font-medium">{formatDate(user.created_at)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">Mise à jour</span>
              <span className="text-sm text-gray-300 font-medium">{formatDate(user.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 py-4 space-y-2 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Actions</p>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150 group shadow-lg shadow-indigo-900/40">
            <UserCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Voir Profil</span>
            <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150 group shadow-lg shadow-blue-900/40">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Contacter</span>
            <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Status Actions */}
        <div className="px-5 py-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Changer le statut</p>
            {(['active', 'inactive', 'suspended', 'banned'] as const).map(st => (
              <button
                key={st}
                onClick={() => {
                  onStatusChange(st);
                  onClose();
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded border border-gray-700 transition-colors"
              >
                {statusConfig[st].label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-2" />
      </div>
    </div>
  );
}

// ─── Sort Icon helper ─────────────────────────────────────────────────────────
function SortIcon({ col, sortKey, dir }: { col: string; sortKey: string; dir: 'asc'|'desc' }) {
  if (sortKey !== col) return null;
  return null;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const { users, isLoading, error, metrics, fetchUsers, updateUserStatus } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');

  // Charger les utilisateurs au montage
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusChange = (status: UserStatus) => {
    if (selectedUser) {
      updateUserStatus(selectedUser.id, status)
        .then(() => {
          setSelectedUser(prev => prev ? { ...prev, status } : null);
        })
        .catch(err => console.error('Erreur:', err));
    }
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
            <p className="text-sm text-gray-500 mt-1">{filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>

        {/* Metrics Bar */}
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50 flex gap-4 flex-shrink-0">
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
            <p className="text-2xl font-bold text-white">{metrics.totalUsers}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-semibold">Actifs</p>
            <p className="text-2xl font-bold text-green-400">{metrics.activeUsers}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-semibold">Clients</p>
            <p className="text-2xl font-bold text-blue-400">{metrics.clientUsers}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-semibold">Pro</p>
            <p className="text-2xl font-bold text-purple-400">{metrics.proUsers}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-semibold">Admin</p>
            <p className="text-2xl font-bold text-orange-400">{metrics.adminUsers}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-800 flex gap-2 flex-shrink-0 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Rechercher par email ou nom..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tous les rôles</option>
            <option value="CLIENT">Client</option>
            <option value="PRO">Pro</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tous les statut</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
            <option value="banned">Bannis</option>
          </select>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Chargement...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 m-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {!isLoading && filteredUsers.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <UserCircle2 className="w-16 h-16 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">Aucun utilisateur trouvé</p>
              </div>
            </div>
          )}

          {!isLoading && filteredUsers.length > 0 && (
            <div>
              {filteredUsers.map(user => {
                const status = statusConfig[user.status];
                const gradient = getGradient(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="px-4 py-3 border-b border-gray-800/50 hover:bg-gray-900/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-lg border text-xs font-semibold flex-shrink-0 bg-gradient-to-br ${gradient}`}>
                        {getInitials(user.full_name, user.email)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-white truncate">{user.full_name || user.email}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded border whitespace-nowrap ${roleConfig[user.role]}`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Side Panel */}
      {selectedUser && (
        <div className="w-96 border-l border-gray-800 bg-gray-900 flex flex-col">
          <UserPanel
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
}