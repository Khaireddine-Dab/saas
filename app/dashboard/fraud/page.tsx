'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { useFraudAlerts } from '@/hooks/useFraudAlerts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FraudDashboard } from '@/components/admin/fraud-dashboard';
import { FraudFilters } from '@/components/admin/fraud-filters';
import { FraudAlertsList } from '@/components/admin/fraud-alerts-list';
import { FraudAlertModal } from '@/components/admin/fraud-alert-modal';
import type { AlertSeverity, AlertStatus, AlertType, FraudAlert } from '@/types/fraud';
import { toast } from 'sonner';

export default function FraudAlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus[]>([]);
  const [selectedType, setSelectedType] = useState<AlertType[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<string[]>([]);

  const { alerts, metrics, isLoading, approveAlert, rejectAlert, reviewAlert } = useFraudAlerts();

  // Apply filters
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = searchQuery === '' || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.entityName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity.length === 0 || selectedSeverity.includes(alert.severity);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(alert.status);
    const matchesType = selectedType.length === 0 || selectedType.includes(alert.type);
    const matchesEntityType = selectedEntityType.length === 0 || selectedEntityType.includes(alert.entityType);

    return matchesSearch && matchesSeverity && matchesStatus && matchesType && matchesEntityType;
  });

  const handleSelectAlert = (alert: FraudAlert) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const handleInvestigate = async (alert: FraudAlert) => {
    try {
      await reviewAlert(alert.id, 'Investigation started by administrator');
      toast.success('Investigation started successfully');
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to start investigation');
    }
  };

  const handleApprove = async () => {
    if (!selectedAlert) return;
    try {
      await approveAlert(selectedAlert.id);
      toast.success('Alert marked as approved (False Positive)');
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve alert');
    }
  };

  const handleReject = async () => {
    if (!selectedAlert) return;
    try {
      await rejectAlert(selectedAlert.id);
      toast.success('Alert marked as rejected (Fraud Confirmed)');
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject alert');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fraud Detection System</h1>
          <p className="text-muted-foreground">Monitor and investigate suspicious marketplace activity</p>
        </div>
        <Button>
          <Shield className="w-4 h-4 mr-2" />
          Security Dashboard
        </Button>
      </div>

      {/* Dashboard */}
      <FraudDashboard />

      {/* Filters and Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <Card className="p-4 h-fit lg:col-span-1">
          <FraudFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSeverity={selectedSeverity}
            onSeverityChange={setSelectedSeverity}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedEntityType={selectedEntityType}
            onEntityTypeChange={setSelectedEntityType}
          />
        </Card>

        {/* Alerts List */}
        <div className="lg:col-span-3">
          <Card className="p-4 mb-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Showing <strong>{filteredAlerts.length}</strong> of <strong>{alerts.length}</strong> alerts
            </p>
          </Card>
          <FraudAlertsList
            alerts={filteredAlerts}
            isLoading={isLoading}
            onSelectAlert={handleSelectAlert}
            onInvestigate={handleInvestigate}
          />
        </div>
      </div>

      {/* Alert Modal */}
      <FraudAlertModal
        isOpen={showModal}
        alert={selectedAlert}
        onClose={() => setShowModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        onInvestigate={() => handleInvestigate(selectedAlert!)}
      />
    </div>
  );
}
