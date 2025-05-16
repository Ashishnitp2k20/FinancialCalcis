import React, { useState, useRef, useEffect } from 'react';
import { Calculator, ArrowRight, CreditCard, IndianRupee, FileCheck, Percent, Clock, UserCheck, Award, TrendingUp, PiggyBank, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const calculatorList = [
  { name: 'GST Calculator', href: '#gst', icon: <Calculator className="h-4 w-4 text-blue-500" /> },
  { name: 'EMI Calculator', href: '#emi', icon: <CreditCard className="h-4 w-4 text-green-500" /> },
  { name: 'Tax Estimator', href: '#tax', icon: <IndianRupee className="h-4 w-4 text-yellow-500" /> },
  { name: 'PAN Validator', href: '#pan', icon: <FileCheck className="h-4 w-4 text-gray-500" /> },
  { name: 'Loan Eligibility', href: '#eligibility', icon: <BarChart3 className="h-4 w-4 text-indigo-500" /> },
  { name: 'Loan Comparison', href: '#compare', icon: <TrendingUp className="h-4 w-4 text-pink-500" /> },
  { name: 'FD/RD Calculator', href: '#fdrd', icon: <PiggyBank className="h-4 w-4 text-orange-500" /> },
  { name: 'PPF/EPF Calculator', href: '#ppfepf', icon: <PiggyBank className="h-4 w-4 text-lime-500" /> },
  { name: 'Percentage Calculator', href: '#percentage', icon: <Percent className="h-4 w-4 text-purple-500" /> },
  { name: 'Time Duration Calculator', href: '#duration', icon: <Clock className="h-4 w-4 text-cyan-500" /> },
  { name: 'Age Eligibility Calculator', href: '#age', icon: <UserCheck className="h-4 w-4 text-teal-500" /> },
  { name: 'Merit Calculator', href: '#merit', icon: <Award className="h-4 w-4 text-amber-500" /> },
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

          {/* Calculators Dropdown with Indicator */}
          <div className="flex items-center space-x-3">
            {/* Blinking Arrow and Text */}
            <div className="hidden md:flex items-center mr-2">
              <span className="text-gst-purple font-medium flex items-center animate-pulse">
                Calculators we offer
                <ArrowRight className="ml-1 h-5 w-5 text-gst-purple animate-bounce-right" />
              </span>
            </div>
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
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gst-light-purple/30 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {calculatorList.map((calc) => (
                    <button
                      key={calc.name}
                      className="w-full text-left px-4 py-2 hover:bg-gst-light-purple/20 text-gray-700 flex items-center gap-2"
                      onClick={() => handleCalculatorClick(calc.href)}
                    >
                      {calc.icon}
                      {calc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 