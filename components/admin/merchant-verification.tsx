'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MerchantKYC, MerchantDocument } from '@/types/merchant-extended';

interface MerchantVerificationProps {
  kyc: MerchantKYC;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

const statusIcons = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  approved: <CheckCircle className="w-5 h-5 text-green-500" />,
  rejected: <XCircle className="w-5 h-5 text-red-500" />,
  expired: <AlertCircle className="w-5 h-5 text-orange-500" />,
};

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  approved: 'bg-green-500/20 text-green-500 border-green-500/40',
  rejected: 'bg-red-500/20 text-red-500 border-red-500/40',
  expired: 'bg-orange-500/20 text-orange-500 border-orange-500/40',
};

export function MerchantVerification({
  kyc,
  onApprove,
  onReject,
}: MerchantVerificationProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
      setRejectReason('');
      setShowRejectForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* KYC Status Overview */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{kyc.businessName}</h3>
            <p className="text-sm text-muted-foreground">{kyc.businessType}</p>
          </div>
          <Badge className={statusColors[kyc.kycStatus]}>
            {kyc.kycStatus.charAt(0).toUpperCase() + kyc.kycStatus.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Owner</p>
            <p className="font-semibold">{kyc.ownerName}</p>
            <p className="text-sm text-muted-foreground">{kyc.ownerEmail}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">RNE</p>
            <p className="font-semibold">{kyc.rne}</p>
            <p className="text-sm text-muted-foreground">Reg: {kyc.registrationNumber}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p><strong>Address:</strong> {kyc.businessAddress.street}, {kyc.businessAddress.city}</p>
          <p><strong>Bank:</strong> {kyc.bankAccount.bankName} - {kyc.bankAccount.accountName}</p>
        </div>
      </Card>

      {/* Documents */}
      <div>
        <h4 className="font-semibold mb-4">Verification Documents</h4>
        <div className="space-y-3">
          {kyc.documents.map(doc => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {statusIcons[doc.verificationStatus]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium capitalize">{doc.type.replace('tax_id', 'RNE').replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                    {doc.rejectionReason && (
                      <p className="text-xs text-destructive mt-1">{doc.rejectionReason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[doc.verificationStatus]}>
                    {doc.verificationStatus}
                  </Badge>
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Actions */}
      {kyc.kycStatus === 'pending' && (
        <div className="flex gap-3">
          <Button
            onClick={onApprove}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve KYC
          </Button>
          <Button
            onClick={() => setShowRejectForm(!showRejectForm)}
            variant="outline"
            className="flex-1"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      )}

      {/* Reject Form */}
      {showRejectForm && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <label className="block text-sm font-semibold mb-2">Rejection Reason</label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why the KYC is being rejected..."
            className="w-full p-2 border border-border bg-background rounded mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              variant="destructive"
              className="flex-1"
            >
              Confirm Rejection
            </Button>
            <Button
              onClick={() => setShowRejectForm(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
