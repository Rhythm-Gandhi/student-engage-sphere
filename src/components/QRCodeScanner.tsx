
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { SwitchCamera } from 'lucide-react';

interface QRCodeScannerProps {
  onScan: (data: string) => Promise<void>;
}

export function QRCodeScanner({ onScan }: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  
  const handleScan = async (result: any) => {
    if (result) {
      try {
        setScanning(false);
        await onScan(result?.text);
      } catch (error) {
        console.error('Error processing QR code:', error);
        setScanError('Failed to process QR code. Please try again.');
        toast({
          title: "Scan Error",
          description: "Failed to process QR code. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner error:', error);
    setScanError('Failed to access camera. Please check permissions.');
    setScanning(false);
    toast({
      title: "Camera Error",
      description: "Failed to access camera. Please check permissions.",
      variant: "destructive",
    });
  };

  const toggleFacingMode = () => {
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Event Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        {scanning ? (
          <div className="space-y-4">
            <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-lg">
              <QrReader
                scanDelay={300}
                onResult={handleScan}
                constraints={{ facingMode }}
                containerStyle={{ width: '100%' }}
                videoStyle={{ width: '100%' }}
              />
            </div>
            <Button
              onClick={toggleFacingMode}
              variant="outline"
              className="mx-auto flex items-center"
            >
              <SwitchCamera className="mr-2 h-4 w-4" />
              Switch Camera
            </Button>
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="mb-4">Scan an event QR code to check in and earn points!</p>
            {scanError && (
              <p className="text-destructive mb-4">{scanError}</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={() => {
            setScanning(!scanning);
            setScanError(null);
          }}
          variant={scanning ? "destructive" : "default"}
        >
          {scanning ? "Cancel Scanning" : "Start Scanning"}
        </Button>
      </CardFooter>
    </Card>
  );
}
