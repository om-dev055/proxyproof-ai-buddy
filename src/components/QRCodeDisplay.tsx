import { motion } from 'framer-motion';
import { RefreshCw, Clock } from 'lucide-react';
import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
  timer: number;
}

const QRCodeDisplay = ({ timer }: QRCodeDisplayProps) => {
  const qrValue = `proxyproof-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-foreground">Live QR Code</h3>
        <div className="flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-muted-foreground">Auto-refresh</span>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-foreground p-4 rounded-2xl mb-4">
        <QRCode
          value={qrValue}
          size={200}
          className="w-full h-auto"
          level="M"
        />
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">Refreshes in</span>
        <span className="font-mono font-bold text-foreground">{timer}s</span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full gradient-bg-primary"
          initial={{ width: '100%' }}
          animate={{ width: `${(timer / 45) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default QRCodeDisplay;
