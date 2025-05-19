import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

export const financeQuotes = [
  {
    quote: "The best investment you can make is in yourself.",
    author: "Warren Buffett"
  },
  {
    quote: "Financial freedom is available to those who learn about it and work for it.",
    author: "Robert Kiyosaki"
  },
  {
    quote: "Wealth is not about having a lot of money; it's about having a lot of options.",
    author: "Chris Rock"
  },
  {
    quote: "The goal isn't more money. The goal is living life on your terms.",
    author: "Chris Brogan"
  },
  {
    quote: "Invest in yourself. Your career is the engine of your wealth.",
    author: "Paul Clitheroe"
  }
];

const WelcomeLoader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(() => 
    financeQuotes[Math.floor(Math.random() * financeQuotes.length)]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50"
        >
          <div className="relative w-full max-w-md px-4">
            {/* Modern Loader */}
            <div className="flex justify-center mb-8">
              <motion.div
                className="relative w-16 h-16"
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-0 border-4 border-gst-purple/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-gst-purple rounded-full"></div>
              </motion.div>
            </div>

            {/* Welcome Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome to Fincalci Pro
              </h1>
              <p className="text-gray-600 mb-6">
                Your Smart Financial Calculator
              </p>

              {/* Quote Card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gst-light-purple/50"
              >
                <Quote className="w-8 h-8 text-gst-purple mx-auto mb-4" />
                <blockquote className="text-lg font-medium text-gray-700 mb-2">
                  "{currentQuote.quote}"
                </blockquote>
                <p className="text-sm text-gray-500">
                  — {currentQuote.author}
                </p>
              </motion.div>

              {/* Loading Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-sm text-gray-500"
              >
                Loading your financial tools...
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeLoader; 