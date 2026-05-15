'use client';

import { useState, useCallback, useMemo } from 'react';
import { authApi } from '@/lib/api';
import type { User, CreateUserInput, UpdateUserInput, UserMetrics } from '@/types/user';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  metrics: UserMetrics;
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserInput) => Promise<User>;
  updateUser: (userId: string, userData: UpdateUserInput) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'banned' | 'inactive') => Promise<User>;
  addUser: (userData: CreateUserInput) => Promise<User>;
  getUser: (userId: string) => User | undefined;
  getUsersByRole: (role: string) => User[];
  getUsersByStatus: (status: string) => User[];
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs';
      setError(message);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create user (same as addUser, for consistency)
  const createUser = useCallback(async (userData: CreateUserInput): Promise<User> => {
    setError(null);
    try {
      const response = await authApi.addUser(userData);
      const newUser = response.user || response;
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de l\'utilisateur';
      setError(message);
      throw err;
    }
  }, []);

  // Add user (alias for createUser, matches backend endpoint)
  const addUser = useCallback(async (userData: CreateUserInput): Promise<User> => {
    return createUser(userData);
  }, [createUser]);

  // Update user
  const updateUser = useCallback(async (userId: string, userData: UpdateUserInput): Promise<User> => {
    setError(null);
    try {
      const response = await authApi.updateUser(userId, userData);
      const updatedUser = response.user || response;
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'utilisateur';
      setError(message);
      throw err;
    }
  }, []);

  // Update user status
  const updateUserStatus = useCallback(async (userId: string, status: 'active' | 'suspended' | 'banned' | 'inactive'): Promise<User> => {
    return updateUser(userId, { status });
  }, [updateUser]);

  // Delete user
  const deleteUser = useCallback(async (userId: string) => {
    setError(null);
    try {
      await authApi.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'utilisateur';
      setError(message);
      throw err;
    }
  }, []);

  // Get single user
  const getUser = useCallback((userId: string): User | undefined => {
    return users.find(u => u.id === userId);
  }, [users]);

  // Get users by role
  const getUsersByRole = useCallback((role: string): User[] => {
    return users.filter(u => u.role === role);
  }, [users]);

  // Get users by status
  const getUsersByStatus = useCallback((status: string): User[] => {
    return users.filter(u => u.status === status);
  }, [users]);

  // Calculate metrics
  const metrics: UserMetrics = useMemo(() => ({
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    bannedUsers: users.filter(u => u.status === 'banned').length,
    clientUsers: users.filter(u => u.role === 'CLIENT').length,
    proUsers: users.filter(u => u.role === 'PRO').length,
    adminUsers: users.filter(u => u.role === 'ADMIN').length,
  }), [users]);

  return {
    users,
    isLoading,
    error,
    metrics,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    addUser,
    getUser,
    getUsersByRole,
    getUsersByStatus,
  };
}
