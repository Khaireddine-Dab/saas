'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, Loader2, X } from 'lucide-react';
import { formatDate } from '@/lib/helpers';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  joinDate: string;
  activityScore: number;
}

interface AddUserForm {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: string;
}

const defaultForm: AddUserForm = {
  email: '',
  password: '',
  full_name: '',
  phone: '',
  role: 'CLIENT',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof User>('joinDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<AddUserForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  // Side Panel state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authApi.getUsers();
      const mappedUsers: User[] = data.map((u: any) => ({
        id: u.id,
        name: u.full_name || 'Sans nom',
        email: u.email,
        role: u.role,
        status: u.status || 'active', // Backend might not have status for old users
        joinDate: u.created_at,
        activityScore: 100,
      }));
      setUsers(mappedUsers);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les utilisateurs');
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authApi.addUser(formData);
      toast.success(`Utilisateur ${formData.email} créé avec succès !`);
      setShowModal(false);
      setFormData(defaultForm);
      fetchUsers(); // Refresh list
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended' | 'banned' | 'inactive') => {
    setUpdatingStatus(true);
    try {
      await authApi.updateUserStatus(userId, newStatus);
      toast.success(`Le statut a été mis à jour avec succès.`);
      // Update local state and selected user
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aVal = a[sortKey] || '';
    const bVal = b[sortKey] || '';
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof User, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor all platform users</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <Button variant="outline" size="default">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold text-foreground">{users.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Suspended</p>
          <p className="text-2xl font-bold text-yellow-400">{users.filter(u => u.status === 'suspended').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Banned</p>
          <p className="text-2xl font-bold text-red-400">{users.filter(u => u.status === 'banned').length}</p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-medium">Chargement des utilisateurs...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive font-semibold mb-2">Une erreur est survenue</p>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button variant="outline" onClick={() => fetchUsers()}>Réessayer</Button>
        </div>
      ) : (
        <DataTable<User>
          columns={[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            {
              key: 'role',
              label: 'Role',
              sortable: true,
              render: (value) => (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                  {value}
                </span>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              render: (value) => <StatusBadge status={value} />,
            },
            {
              key: 'joinDate',
              label: 'Joined',
              sortable: true,
              render: (value) => formatDate(value),
            },
            {
              key: 'activityScore',
              label: 'Activity',
              sortable: true,
              render: (value) => (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2 w-12">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-sm text-foreground">{value}%</span>
                </div>
              ),
            },
          ]}
          data={sortedUsers}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onRowClick={(row) => setSelectedUser(row)}
        />
      )}

      {/* User Actions Side Panel */}
      {selectedUser && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedUser(null)}
          />
          {/* Side Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-background border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Détails de l'utilisateur</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <StatusBadge status={selectedUser.status} />
              </div>

              {/* Data List */}
              <div className="space-y-4 border-t border-border pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">ID</p>
                    <p className="font-medium font-mono text-xs mt-1 truncate" title={selectedUser.id}>{selectedUser.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rôle</p>
                    <p className="font-medium mt-1">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rejoint le</p>
                    <p className="font-medium mt-1">{formatDate(selectedUser.joinDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Activité</p>
                    <p className="font-medium mt-1">{selectedUser.activityScore}%</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border pt-6 space-y-3">
                <h4 className="text-sm font-semibold text-foreground mb-4">Actions</h4>

                {selectedUser.status !== 'active' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                    onClick={() => handleStatusChange(selectedUser.id, 'active')}
                    disabled={updatingStatus}
                  >
                    Réactiver l'utilisateur
                  </Button>
                )}

                {selectedUser.status !== 'suspended' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                    onClick={() => handleStatusChange(selectedUser.id, 'suspended')}
                    disabled={updatingStatus}
                  >
                    Suspendre temporairement
                  </Button>
                )}

                {selectedUser.status !== 'inactive' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200"
                    onClick={() => handleStatusChange(selectedUser.id, 'inactive')}
                    disabled={updatingStatus}
                  >
                    Désactiver le compte
                  </Button>
                )}

                {selectedUser.status !== 'banned' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => handleStatusChange(selectedUser.id, 'banned')}
                    disabled={updatingStatus}
                  >
                    Bannir définitivement
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Créer un utilisateur</h2>
              <button
                onClick={() => { setShowModal(false); setFormData(defaultForm); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email *</label>
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mot de passe *</label>
                <Input
                  type="password"
                  placeholder="Minimum 6 caractères"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nom complet</label>
                <Input
                  type="text"
                  placeholder="Prénom Nom"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Téléphone</label>
                <Input
                  type="tel"
                  placeholder="+213 ..."
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Rôle</label>
                <div className="space-y-2">
                  {[
                    { value: 'CLIENT', label: 'Client' },
                    { value: 'PRO', label: 'Business Owner' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.role === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:bg-muted'
                        }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={formData.role === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setShowModal(false); setFormData(defaultForm); }}
                >
                  Annuler
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Créer l\'utilisateur'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
