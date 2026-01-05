import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Scan, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAttendance } from '@/hooks/useSession';

interface QRScannerProps {
  onSuccess: (qrToken: string) => void;
  onBack: () => void;
}

const QRScanner = ({ onSuccess, onBack }: QRScannerProps) => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getActiveSession } = useAttendance();
  const hasScanned = useRef(false);

  useEffect(() => {
    // Prevent multiple scans
    if (hasScanned.current) return;

    const scanQR = async () => {
      // Simulate camera scanning delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Fetch active session's QR token
      const qrToken = await getActiveSession();

      if (!qrToken) {
        setError('No active class session found. Please wait for the teacher to start class.');
        setScanning(false);
        return;
      }

      hasScanned.current = true;
      setScanning(false);
      
      // Small delay before transitioning
      setTimeout(() => onSuccess(qrToken), 500);
    };

    scanQR();
  }, [getActiveSession, onSuccess]);

  return (
    <div className="min-h-screen gradient-bg-hero p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Scanner Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-square max-w-xs mb-8"
        >
          {/* Camera Preview Placeholder */}
          <div className="absolute inset-0 bg-muted rounded-3xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <Camera className="w-16 h-16 text-muted-foreground/50" />
            </div>
          </div>

          {/* Scanning Frame */}
          <div className="absolute inset-4">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />

            {/* Scanning Line */}
            {scanning && !error && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent glow-primary"
              />
            )}
          </div>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          {error ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-3 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">{error}</span>
              </div>
              <Button onClick={onBack} variant="outline">
                Go Back
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3 mb-3">
                <Scan className="w-5 h-5 text-primary animate-pulse" />
                <span className="font-semibold text-foreground">
                  {scanning ? 'Scanning for QR code...' : 'QR Code detected!'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Position the QR code within the frame
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QRScanner;
