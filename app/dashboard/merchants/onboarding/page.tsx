'use client';

import { useState } from 'react';
import { CheckCircle, Clock, XCircle, Download, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MerchantVerification } from '@/components/admin/merchant-verification';

const mockOnboardingQueue = Array.from({ length: 8 }, (_, i) => ({
  id: `onboarding-${i + 1}`,
  merchantId: `merchant-${i + 1}`,
  storeName: `New Store ${i + 1}`,
  ownerName: `Owner ${i + 1}`,
  ownerEmail: `owner${i + 1}@example.com`,
  businessType: ['restaurant', 'grocery', 'pharmacy'][i % 3],
  status: ['submitted', 'submitted', 'submitted', 'verified'][i % 4] as any,
  submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  steps: [
    { step: 1, title: 'Business Info', completed: true },
    { step: 2, title: 'Owner Details', completed: true },
    { step: 3, title: 'Bank Account', completed: true },
    { step: 4, title: 'Documents', completed: true },
    { step: 5, title: 'Review', completed: i % 4 === 3 ? true : false },
  ] as any,
  kyc: {
    businessName: `Store ${i + 1}`,
    businessType: ['restaurant', 'grocery', 'pharmacy'][i % 3],
    rne: `RNE-${String(i + 1).padStart(8, '0')}`,
    registrationNumber: `REG-${String(i + 1).padStart(6, '0')}`,
    ownerName: `Owner ${i + 1}`,
    ownerEmail: `owner${i + 1}@example.com`,
    ownerPhone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
    businessAddress: {
      street: `${Math.floor(Math.random() * 999) + 1} Business St`,
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    bankAccount: {
      accountName: `Store ${i + 1} Account`,
      accountNumber: `****${String(Math.floor(Math.random() * 9000) + 1000)}`,
      bankName: 'City Bank',
      ifscCode: 'CITY0000001',
    },
    documents: [
      {
        id: `doc-1-${i}`,
        type: 'business_license' as const,
        fileName: `License_${i + 1}.pdf`,
        fileUrl: '#',
        uploadedAt: new Date(),
        verificationStatus: 'approved' as const,
      },
      {
        id: `doc-2-${i}`,
        type: 'tax_id' as const,
        fileName: `RNE_${i + 1}.pdf`,
        fileUrl: '#',
        uploadedAt: new Date(),
        verificationStatus: ['approved', 'pending'][i % 2] as any,
      },
      {
        id: `doc-3-${i}`,
        type: 'bank_account' as const,
        fileName: `BankDetails_${i + 1}.pdf`,
        fileUrl: '#',
        uploadedAt: new Date(),
        verificationStatus: 'approved' as const,
      },
    ],
    kycStatus: 'pending' as const,
    merchantId: `merchant-${i + 1}`,
  },
}));

const statusIcons = {
  submitted: <Clock className="w-5 h-5 text-yellow-500" />,
  verified: <CheckCircle className="w-5 h-5 text-green-500" />,
  rejected: <XCircle className="w-5 h-5 text-red-500" />,
};

const statusColors = {
  submitted: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function MerchantOnboardingPage() {
  const [selectedMerchant, setSelectedMerchant] = useState(mockOnboardingQueue[0]);
  const [queue, setQueue] = useState(mockOnboardingQueue);

  const handleApprove = () => {
    setQueue(queue.map(m =>
      m.id === selectedMerchant.id ? { ...m, status: 'verified' } : m
    ));
    setSelectedMerchant({ ...selectedMerchant, status: 'verified' });
  };

  const handleReject = (reason: string) => {
    setQueue(queue.map(m =>
      m.id === selectedMerchant.id ? { ...m, status: 'rejected' } : m
    ));
    alert(`Rejected: ${reason}`);
  };

  const pendingCount = queue.filter(m => m.status === 'submitted').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Merchant Onboarding</h1>
        <p className="text-muted-foreground">Review and verify new merchants</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-xs text-neutral-400 mt-1">Awaiting verification</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Verified</div>
          <div className="text-2xl font-bold text-green-600">
            {queue.filter(m => m.status === 'verified').length}
          </div>
          <div className="text-xs text-neutral-400 mt-1">This month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Rejected</div>
          <div className="text-2xl font-bold text-red-600">
            {queue.filter(m => m.status === 'rejected').length}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Need revision</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue */}
        <Card className="lg:col-span-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Onboarding Queue</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {queue.map(merchant => (
              <button
                key={merchant.id}
                onClick={() => setSelectedMerchant(merchant)}
                className={`w-full text-left p-4 border-b border-border hover:bg-muted/50 transition-colors ${selectedMerchant.id === merchant.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{merchant.storeName}</p>
                    <p className="text-xs text-neutral-600">{merchant.ownerName}</p>
                  </div>
                  {statusIcons[merchant.status as keyof typeof statusIcons]}
                </div>
                <Badge className={`mt-2 text-xs ${statusColors[merchant.status as keyof typeof statusColors]}`}>
                  {merchant.status}
                </Badge>
              </button>
            ))}
          </div>
        </Card>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selectedMerchant && (
            <MerchantVerification
              kyc={selectedMerchant.kyc}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </div>
      </div>
    </div>
  );
}
