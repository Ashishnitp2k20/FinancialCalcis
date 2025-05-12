import React, { useState, useRef, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

const calculatorList = [
  { name: 'GST Calculator', href: '#gst' },
  { name: 'EMI Calculator', href: '#emi' },
  { name: 'Tax Estimator', href: '#tax' },
  { name: 'PAN Validator', href: '#pan' },
  { name: 'Loan Eligibility', href: '#eligibility' },
  { name: 'Loan Comparison', href: '#compare' },
  { name: 'FD/RD Calculator', href: '#fdrd' },
  { name: 'PPF/EPF Calculator', href: '#ppfepf' },
];

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownClick = () => setDropdownOpen((open) => !open);
  const handleCalculatorClick = (href: string) => {
    setDropdownOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white border-b border-gst-light-purple/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg gst-gradient">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gst-purple to-gst-secondary-purple bg-clip-text text-transparent">
                  Fincalci Pro
                </span>
              </div>
            </div>
          </div>

          {/* Calculators Dropdown */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gst-purple hover:bg-gst-light-purple/20 flex items-center"
              onClick={handleDropdownClick}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculators
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gst-light-purple/30 rounded-lg shadow-lg z-50">
                {calculatorList.map((calc) => (
                  <button
                    key={calc.name}
                    className="w-full text-left px-4 py-2 hover:bg-gst-light-purple/20 text-gray-700"
                    onClick={() => handleCalculatorClick(calc.href)}
                  >
                    {calc.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 