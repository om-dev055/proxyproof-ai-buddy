import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelfieCaptureProps {
  onSuccess: () => void;
  onBack: () => void;
}

const SelfieCapture = ({ onSuccess, onBack }: SelfieCaptureProps) => {
  const [countdown, setCountdown] = useState(3);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!captured) {
      setCaptured(true);
      setTimeout(onSuccess, 1000);
    }
  }, [countdown, captured, onSuccess]);

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
        {/* Camera Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-[3/4] max-w-xs mb-8"
        >
          {/* Camera Preview */}
          <div className="absolute inset-0 bg-muted rounded-3xl overflow-hidden border-4 border-primary/30">
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <User className="w-24 h-24 text-muted-foreground/30" />
            </div>

            {/* Flash Effect */}
            {captured && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-foreground"
              />
            )}
          </div>

          {/* Countdown */}
          {!captured && countdown > 0 && (
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-8xl font-display font-bold gradient-text">
                {countdown}
              </span>
            </motion.div>
          )}

          {/* Face Guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-52 border-2 border-dashed border-primary/50 rounded-full" />
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Camera className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">
              {captured ? 'Photo captured!' : 'Position your face'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {captured ? 'Verifying...' : 'Look directly at the camera'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SelfieCapture;
