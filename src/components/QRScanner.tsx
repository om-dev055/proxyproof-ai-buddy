import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onSuccess: (qrToken: string) => void;
  onBack: () => void;
}

const QRScanner = ({ onSuccess, onBack }: QRScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScanned = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      if (!containerRef.current || hasScanned.current) return;

      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (hasScanned.current) return;
            hasScanned.current = true;
            
            // Stop scanner and call success
            scanner.stop().then(() => {
              if (mounted) {
                onSuccess(decodedText);
              }
            }).catch(console.error);
          },
          () => {
            // QR code not found - this is normal, keep scanning
          }
        );

        if (mounted) {
          setIsStarting(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Unable to access camera. Please allow camera permissions and try again.');
          setIsStarting(false);
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onSuccess]);

  const handleBack = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
    }
    onBack();
  };

  return (
    <div className="min-h-screen gradient-bg-hero p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Scanner Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-square max-w-xs mb-8"
        >
          <div 
            id="qr-reader" 
            ref={containerRef}
            className="w-full h-full rounded-3xl overflow-hidden bg-muted"
          />

          {/* Loading overlay */}
          {isStarting && !error && (
            <div className="absolute inset-0 bg-muted rounded-3xl flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3 animate-pulse" />
                <p className="text-sm text-muted-foreground">Starting camera...</p>
              </div>
            </div>
          )}

          {/* Scanning Frame Overlay */}
          {!error && !isStarting && (
            <div className="absolute inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
            </div>
          )}
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
                <span className="font-semibold text-sm">{error}</span>
              </div>
              <Button onClick={handleBack} variant="outline">
                Go Back
              </Button>
            </div>
          ) : (
            <>
              <p className="font-semibold text-foreground mb-2">
                {isStarting ? 'Initializing camera...' : 'Scan the QR code'}
              </p>
              <p className="text-sm text-muted-foreground">
                Point your camera at the teacher's QR code
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QRScanner;
