'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { Role, Permission, RoleType } from '@/types/roles';
import { DEFAULT_PERMISSIONS } from '@/types/roles';

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'super-admin',
    displayName: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: DEFAULT_PERMISSIONS['super-admin'],
    isSystem: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'admin',
    displayName: 'Administrator',
    description: 'Most administrative functions',
    permissions: DEFAULT_PERMISSIONS['admin'],
    isSystem: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '3',
    name: 'moderator',
    displayName: 'Moderator',
    description: 'Content moderation and user management',
    permissions: DEFAULT_PERMISSIONS['moderator'],
    isSystem: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
];

const allPermissions: Permission[] = [
  'view_dashboard',
  'view_users',
  'edit_users',
  'delete_users',
  'view_orders',
  'edit_orders',
  'approve_orders',
  'view_merchants',
  'edit_merchants',
  'view_products',
  'edit_products',
  'delete_products',
  'view_reviews',
  'moderate_reviews',
  'view_analytics',
  'view_reports',
  'create_reports',
  'view_drivers',
  'manage_drivers',
  'view_commissions',
  'edit_commissions',
  'view_payouts',
  'approve_payouts',
  'manage_coupons',
  'manage_banners',
  'manage_notifications',
  'view_settings',
  'edit_settings',
  'manage_admins',
  'view_fraud_alerts',
  'investigate_fraud',
];

const permissionGroups = {
  Dashboard: ['view_dashboard'],
  'User Management': ['view_users', 'edit_users', 'delete_users'],
  'Order Management': ['view_orders', 'edit_orders', 'approve_orders'],
  'Merchant Management': ['view_merchants', 'edit_merchants'],
  'Product Management': ['view_products', 'edit_products', 'delete_products'],
  'Review Management': ['view_reviews', 'moderate_reviews'],
  Analytics: ['view_analytics', 'view_reports', 'create_reports'],
  'Driver Management': ['view_drivers', 'manage_drivers'],
  'Commission & Payouts': ['view_commissions', 'edit_commissions', 'view_payouts', 'approve_payouts'],
  'Marketing & Promotions': ['manage_coupons', 'manage_banners', 'manage_notifications'],
  'System Administration': ['view_settings', 'edit_settings', 'manage_admins'],
  'Fraud & Security': ['view_fraud_alerts', 'investigate_fraud'],
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0]);
  const [editMode, setEditMode] = useState(false);

  const handlePermissionToggle = (permission: Permission) => {
    if (!selectedRole || selectedRole.isSystem) return;

    setSelectedRole({
      ...selectedRole,
      permissions: selectedRole.permissions.includes(permission)
        ? selectedRole.permissions.filter((p) => p !== permission)
        : [...selectedRole.permissions, permission],
    });
  };

  const handleSaveRole = () => {
    if (!selectedRole) return;
    setRoles(roles.map((r) => (r.id === selectedRole.id ? selectedRole : r)));
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Role Management</h1>
          <p className="text-muted-foreground">Configure roles and permissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Roles</h2>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role);
                    setEditMode(false);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${selectedRole?.id === role.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                    }`}
                >
                  <div className="font-medium text-sm">{role.displayName}</div>
                  <div className="text-xs mt-1 opacity-75 truncate">{role.description}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-3">
          {selectedRole && (
            <Card className="p-6">
              <div className="mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedRole.displayName}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{selectedRole.description}</p>
                  </div>
                  {!selectedRole.isSystem && (
                    <div className="flex gap-2">
                      {!editMode ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditMode(true)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button size="sm" onClick={handleSaveRole}>
                            Save Changes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditMode(false)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {selectedRole.isSystem && (
                <div className="mb-4 p-3 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium">
                  System roles cannot be edited directly.
                </div>
              )}

              {/* Permissions Grid */}
              <div className="space-y-4">
                {Object.entries(permissionGroups).map(([group, permissions]) => (
                  <div key={group}>
                    <h3 className="font-semibold text-sm text-foreground mb-3">{group}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-3">
                      {permissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedRole.permissions.includes(permission as Permission)}
                            disabled={selectedRole.isSystem || !editMode}
                            onCheckedChange={() => handlePermissionToggle(permission as Permission)}
                          />
                          <span className="text-sm text-foreground">
                            {permission
                              .split('_')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Permissions:</span>
                  <Badge variant="secondary">{selectedRole.permissions.length} / {allPermissions.length}</Badge>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
