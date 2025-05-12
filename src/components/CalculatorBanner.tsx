import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CalculatorBannerProps {
  message?: string;
  onDismiss?: () => void;
}

const CalculatorBanner: React.FC<CalculatorBannerProps> = ({
  message = "Looking for another calculator? Tap the menu ☰ in the top-right corner!",
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className="md:hidden bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4 relative">
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="text-sm text-indigo-700 pr-6">
        {message}
      </p>
    </div>
  );
};

export default CalculatorBanner; 