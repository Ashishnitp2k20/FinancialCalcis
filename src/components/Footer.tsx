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
    <footer className="relative w-full bg-white border-t border-gray-100 pt-8 pb-4 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:justify-between items-center gap-6 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Quote Section */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start">
            <div className="bg-gst-light-purple/20 p-6 rounded-xl w-full">
              <div className="flex items-start gap-4 justify-center md:justify-start">
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
          <div className="flex flex-col items-center md:items-start">
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
      </div>
      {/* Copyright and attribution with LinkedIn */}
      <div className="w-full flex flex-col items-center justify-center mt-6 select-none">
        <div className="text-gray-500 text-sm mb-1">© {new Date().getFullYear()} Fincalci Pro. All rights reserved.</div>
        <div className="text-gray-500 text-xs mb-2">Made with ❤️ for better financial planning</div>
        <span className="flex flex-col sm:flex-row items-center justify-center text-gst-purple/70 font-medium text-lg gap-2">
          <span className="inline-block w-16 h-px bg-gst-purple/30 mr-3 sm:mr-3 sm:mb-0 mb-2"></span>
          Crafted with <span className="mx-1 text-pink-500">❤️</span> by Ashish Kumar
          <a href="https://www.linkedin.com/in/ashishkumar952/" target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center" aria-label="Ashish Kumar LinkedIn">
            <svg className="w-6 h-6 text-[#0A66C2] hover:text-[#004182] transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/>
            </svg>
          </a>
          <span className="inline-block w-16 h-px bg-gst-purple/30 ml-3 sm:ml-3 sm:mt-0 mt-2"></span>
        </span>
      </div>
    </footer>
  );
};

export default Footer; 