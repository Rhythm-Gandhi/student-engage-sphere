
import React from 'react';
import QRCode from 'react-qr-code';
import { generateQRCodeValue } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface QRCodeDisplayProps {
  eventId: string;
}

export function QRCodeDisplay({ eventId }: QRCodeDisplayProps) {
  const qrValue = generateQRCodeValue(eventId);
  
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center">
        <h3 className="font-medium mb-4">Event Check-in QR Code</h3>
        <div className="bg-white p-3 rounded-lg">
          <QRCode 
            value={qrValue} 
            size={200}
            level="H"
            className="h-48 w-48"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Scan this code at the event to check in and earn points!
        </p>
      </CardContent>
    </Card>
  );
}
