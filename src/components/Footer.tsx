import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { financeQuotes } from './WelcomeLoader';

const Footer = () => {
  const [currentQuote, setCurrentQuote] = useState(() => 
    financeQuotes[Math.floor(Math.random() * financeQuotes.length)]
  );

  // Change quote every 24 hours
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(financeQuotes[Math.floor(Math.random() * financeQuotes.length)]);
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-white border-t border-gst-light-purple/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quote Section */}
          <div className="md:col-span-2">
            <div className="bg-gst-light-purple/20 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <Quote className="w-6 h-6 text-gst-purple mt-1 flex-shrink-0" />
                <div>
                  <blockquote className="text-lg font-medium text-gray-700 mb-2">
                    "{currentQuote.quote}"
                  </blockquote>
                  <p className="text-sm text-gray-500">
                    — {currentQuote.author}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gst-purple transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#calculators" className="text-gray-600 hover:text-gst-purple transition-colors">
                  Calculators
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-600 hover:text-gst-purple transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gst-light-purple/30 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Fincalci Pro. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for better financial planning</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 