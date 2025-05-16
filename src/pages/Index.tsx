import React, { useRef, useState, useEffect } from 'react';
import GstCalculator from '@/components/GstCalculator';
import GstTypesTable from '@/components/GstTypesTable';
import LoanEmiCalculator from '@/components/LoanEmiCalculator';
import IncomeTaxEstimator from '@/components/IncomeTaxEstimator';
import PanValidator from '@/components/PanValidator';
import Navbar from '@/components/Navbar';
import FAQ from '@/components/FAQ';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, IndianRupee, CreditCard, FileCheck, ChevronLeft, ChevronRight, Percent, Clock, UserCheck, Award } from 'lucide-react';
import LoanEligibilityCalculator from '@/components/LoanEligibilityCalculator';
import LoanComparisonTool from '@/components/LoanComparisonTool';
import FdRdCalculator from '@/components/FdRdCalculator';
import PpfEpfCalculator from '@/components/PpfEpfCalculator';
import PercentageCalculator from '@/components/PercentageCalculator';
import TimeDurationCalculator from '@/components/TimeDurationCalculator';
import AgeEligibilityCalculator from '@/components/AgeEligibilityCalculator';
import MeritCalculator from '@/components/MeritCalculator';
import { Helmet } from 'react-helmet';

const TAB_KEY = 'fincalciActiveTab';

const Index = () => {
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem(TAB_KEY) || 'gst');

  useEffect(() => {
    localStorage.setItem(TAB_KEY, activeTab);
  }, [activeTab]);

  // Scroll handler for arrows
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = 120;
      tabsListRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Tab options
  const tabOptions = [
    { value: 'gst', label: 'GST Calculator', icon: <Calculator className="h-4 w-4" /> },
    { value: 'emi', label: 'EMI Calculator', icon: <CreditCard className="h-4 w-4" /> },
    { value: 'tax', label: 'Tax Estimator', icon: <IndianRupee className="h-4 w-4" /> },
    { value: 'pan', label: 'PAN Validator', icon: <FileCheck className="h-4 w-4" /> },
    { value: 'eligibility', label: 'Loan Eligibility', icon: <Calculator className="h-4 w-4" /> },
    { value: 'compare', label: 'Loan Comparison', icon: <Calculator className="h-4 w-4" /> },
    { value: 'fdrd', label: 'FD/RD Calculator', icon: <Calculator className="h-4 w-4" /> },
    { value: 'ppfepf', label: 'PPF/EPF Calculator', icon: <Calculator className="h-4 w-4" /> },
    { value: 'percentage', label: 'Percentage Calculator', icon: <Percent className="h-4 w-4" /> },
    { value: 'duration', label: 'Time Duration', icon: <Clock className="h-4 w-4" /> },
    { value: 'age', label: 'Age Eligibility', icon: <UserCheck className="h-4 w-4" /> },
    { value: 'merit', label: 'Merit Calculator', icon: <Award className="h-4 w-4" /> },
  ];

  return (
    <>
      <Helmet>
        <title>Fincalci Pro - Free Financial Calculators for India</title>
        <meta name="description" content="Fincalci Pro offers GST, EMI, Tax, Percentage, Merit, and more calculators for India. Fast, accurate, and mobile-friendly financial tools." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/" />
        <meta property="og:title" content="Fincalci Pro - Financial Calculator Suite" />
        <meta property="og:description" content="All-in-one suite for GST, EMI, Tax, Percentage, Merit, and more calculators. Free, accurate, and easy to use." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fincalci Pro - Financial Calculator Suite" />
        <meta name="twitter:description" content="All-in-one suite for GST, EMI, Tax, Percentage, Merit, and more calculators. Free, accurate, and easy to use." />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Fincalci Pro",
          "url": "https://yourdomain.com/",
          "logo": "https://yourdomain.com/og-image.png",
          "sameAs": [
            "https://twitter.com/yourprofile",
            "https://www.linkedin.com/in/yourprofile/"
          ],
          "description": "All-in-one suite for GST, EMI, Tax, Percentage, Merit, and more calculators. Free, accurate, and easy to use."
        }` }} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-white to-gst-soft-gray">
        <nav aria-label="Main navigation">
          <Navbar />
        </nav>
        {/* Go to Bottom Button: under nav, right-aligned; on mobile, absolutely top right in nav */}
        <div className="relative">
          <div className="hidden sm:flex justify-end w-full px-4 pt-2">
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="px-4 py-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold flex items-center gap-1 shadow transition-all animate-bounce"
              aria-label="Go to Bottom"
            >
              <svg className="h-5 w-5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-label="Down Arrow"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              Go to Bottom
            </button>
          </div>
          <div className="sm:hidden">
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="absolute right-4 top-2 z-50 px-4 py-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold flex items-center gap-1 shadow transition-all animate-bounce"
              aria-label="Go to Bottom"
            >
              <svg className="h-5 w-5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-label="Down Arrow"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              Go to Bottom
            </button>
          </div>
        </div>
        <main>
          <div className="py-8 px-4">
            <div className="max-w-5xl mx-auto">
              <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Fincalci Pro</h1>
                <p className="text-gray-600 text-lg">Your All-in-One Financial Calculator Suite</p>
              </header>
              <section aria-label="Calculator Tabs">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Hamburger for mobile */}
                  <div className="relative w-full mb-8 flex items-center">
                    <button
                      className="sm:hidden ml-auto p-2 rounded-md border border-gray-200 bg-white shadow"
                      aria-label="Open menu"
                      onClick={() => setMobileMenuOpen((open) => !open)}
                      type="button"
                    >
                      {/* Hamburger icon */}
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    {/* TabsList for desktop/tablet */}
                    <TabsList
                      ref={tabsListRef}
                      className="hidden sm:grid w-full grid-cols-4 gap-0 rounded-md bg-muted p-1 text-muted-foreground"
                    >
                      {tabOptions.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="flex items-center gap-2 whitespace-nowrap"
                        >
                          {tab.icon}
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  {/* Mobile dropdown menu */}
                  {mobileMenuOpen && (
                    <div className="sm:hidden w-full mb-4 bg-white rounded-lg shadow border border-gray-200 z-20 absolute left-0">
                      {tabOptions.map((tab) => (
                        <button
                          key={tab.value}
                          className={`w-full flex items-center gap-2 px-4 py-3 text-left text-gray-700 hover:bg-gst-light-purple/30 ${activeTab === tab.value ? 'font-bold bg-gst-light-purple/20' : ''}`}
                          onClick={() => {
                            setActiveTab(tab.value);
                            setMobileMenuOpen(false);
                          }}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <TabsContent value="gst">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <GstCalculator />
                      </div>
                    </div>
                    <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gst-light-purple/20">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">GST- Goods and Services Tax</h2>
                      <p className="mb-4 text-gray-700">
                        GST or the Goods and Services Tax is an indirect tax that came into effect in India on the 1st of July, 2017. 
                        GST is levied on goods and services and has replaced other indirect taxes that were in effect before it came into use.
                      </p>
                      <h3 className="text-xl font-semibold text-gst-secondary-purple mb-3 mt-6">How can you calculate GST with this tool?</h3>
                      <p className="mb-4 text-gray-700">
                        With the free GST calculator, you can calculate the tax amount in three simple steps. 
                        The tool provides you with three fields that have to be filled, and it calculates GST automatically based on what you fill in.
                      </p>
                      <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700 pl-4">
                        <li>Enter the price of the goods or services in the Amount field.</li>
                        <li>Enter the percentage of GST, or the slab that the product comes under, in the GST % field.</li>
                        <li>Choose if the price that you entered is inclusive or exclusive of tax in the Tax field.</li>
                      </ol>
                      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 pl-4">
                        <li>If the price you've entered is inclusive of tax, the tool automatically calculates, and displays the original price of the goods or service after subtracting the GST.</li>
                        <li>If the price you've entered is exclusive of tax, the tool automatically calculates, and displays the gross price after adding the GST.</li>
                      </ul>
                      <h3 className="text-xl font-semibold text-gst-secondary-purple mb-3 mt-6">Types of GST in India</h3>
                      <p className="mb-4 text-gray-700">
                        There are four types of GST active in India, each with its own specific purpose and scope. 
                        Understanding these different types is crucial for proper tax compliance and business operations.
                      </p>
                      <div className="mt-6">
                        <GstTypesTable />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="emi">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <LoanEmiCalculator />
                      </div>
                    </div>
                    
                    {/* EMI Calculator Information Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gst-light-purple/20">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">EMI Calculator</h2>
                      
                      <p className="mb-4 text-gray-700">
                        An EMI (Equated Monthly Installment) calculator helps you determine the monthly payments you'll need to make on a loan. 
                        It's an essential tool for planning your finances and understanding the total cost of borrowing.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gst-secondary-purple mb-3 mt-6">How to use the EMI Calculator</h3>
                      
                      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 pl-4">
                        <li>Enter the loan amount you wish to borrow</li>
                        <li>Specify the loan tenure in years</li>
                        <li>Input the annual interest rate offered by the lender</li>
                        <li>The calculator will show your monthly EMI and total interest payable</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="tax">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <IncomeTaxEstimator />
                      </div>
                    </div>
                    
                    {/* Tax Estimator Information Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gst-light-purple/20">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Income Tax Estimator</h2>
                      
                      <p className="mb-4 text-gray-700">
                        The Income Tax Estimator helps you calculate your tax liability for the financial year 2024-25. 
                        It considers the latest tax slabs and common deductions to give you an accurate estimate of your tax burden.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gst-secondary-purple mb-3 mt-6">Key Features</h3>
                      
                      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 pl-4">
                        <li>Calculates tax based on the latest income tax slabs</li>
                        <li>Includes common deductions like HRA, standard deduction, and NPS</li>
                        <li>Shows tax slab-wise breakdown of your liability</li>
                        <li>Calculates effective tax rate for better financial planning</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="pan">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <PanValidator />
                      </div>
                    </div>
                    
                    {/* PAN Validator Information Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gst-light-purple/20">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">PAN Validator</h2>
                      
                      <p className="mb-4 text-gray-700">
                        The PAN (Permanent Account Number) Validator helps you verify if a PAN number follows the correct format. 
                        It's a useful tool for validating PAN numbers before using them in official documents or transactions.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gst-secondary-purple mb-3 mt-6">PAN Number Format</h3>
                      
                      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 pl-4">
                        <li>Must be 10 characters long</li>
                        <li>First 5 characters are letters (A-Z)</li>
                        <li>Next 4 characters are numbers (0-9)</li>
                        <li>Last character is a letter (A-Z)</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="eligibility">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <LoanEligibilityCalculator />
                      </div>
                    </div>
                    
                    {/* Loan Eligibility Information Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gst-light-purple/20">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Loan Eligibility Calculator</h2>
                      
                      <p className="mb-4 text-gray-700">
                        The Loan Eligibility Calculator helps you determine how much loan amount you can get based on your income, 
                        existing obligations, and other factors. It's a crucial tool for planning your loan applications.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gst-secondary-purple mb-3 mt-6">Required Information</h3>
                      
                      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 pl-4">
                        <li>Monthly income from all sources</li>
                        <li>Existing monthly EMI obligations</li>
                        <li>Desired loan tenure in years</li>
                        <li>Expected interest rate on the loan</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="compare">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <LoanComparisonTool />
                      </div>
                    </div>
                    
                    {/* Loan Comparison Information Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gst-light-purple/20">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Loan Comparison Tool</h2>
                      
                      <p className="mb-4 text-gray-700">
                        The Loan Comparison Tool helps you compare different loan options side by side. 
                        It enables you to make informed decisions by analyzing various loan parameters and their impact on your finances.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gst-secondary-purple mb-3 mt-6">What to Compare</h3>
                      
                      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 pl-4">
                        <li>Monthly EMI amounts for different loan options</li>
                        <li>Total interest payable over the loan tenure</li>
                        <li>Total cost of the loan (principal + interest)</li>
                        <li>Impact of different interest rates and tenures</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="fdrd">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <FdRdCalculator />
                      </div>
                    </div>
                    
                    {/* FD/RD Calculator Information Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gst-light-purple/20">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">FD/RD Calculator</h2>
                      
                      <p className="mb-4 text-gray-700">
                        The Fixed Deposit (FD) and Recurring Deposit (RD) Calculator helps you plan your investments 
                        by calculating the maturity amount and interest earned on your deposits.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gst-secondary-purple mb-3 mt-6">Features</h3>
                      
                      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 pl-4">
                        <li>Calculate returns on Fixed Deposits with different tenures</li>
                        <li>Plan Recurring Deposits with monthly contributions</li>
                        <li>Compare interest earnings between FD and RD</li>
                        <li>View detailed breakdown of investment and returns</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="ppfepf">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <PpfEpfCalculator />
                      </div>
                    </div>
                    
                    {/* PPF/EPF Calculator Information Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gst-light-purple/20">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">PPF/EPF Calculator</h2>
                      
                      <p className="mb-4 text-gray-700">
                        The Public Provident Fund (PPF) and Employee Provident Fund (EPF) Calculator helps you plan your 
                        retirement savings by calculating the maturity amount and interest earned on your contributions.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gst-secondary-purple mb-3 mt-6">Key Benefits</h3>
                      
                      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 pl-4">
                        <li>Calculate returns on PPF investments with tax benefits</li>
                        <li>Plan EPF contributions and track employer matching</li>
                        <li>Compare different contribution scenarios</li>
                        <li>Understand the power of compound interest in long-term savings</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="percentage">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <PercentageCalculator />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="duration">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <TimeDurationCalculator />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="age">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <AgeEligibilityCalculator />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="merit">
                    <div className="flex flex-col md:flex-row md:gap-6">
                      <div className="flex-1 mb-6 md:mb-0">
                        <MeritCalculator />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>
            </div>
          </div>
        </main>
        <footer className="mt-10 w-full bg-gradient-to-t from-white via-purple-50 to-transparent shadow-t-lg px-2 sm:px-0" aria-label="Site footer">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-2 py-3 relative">
            <span className="text-purple-700 font-semibold text-base animate-fade-in">✨ Empower your finances, one calculation at a time!</span>
            <span className="text-xs text-gray-500">Copyright &copy; 2025 Fincalci Pro</span>
            <span className="text-xs text-purple-700 font-bold animate-pulse ml-1">by Ashish Kumar</span>
            {/* Go to Top button: always bottom-right in the footer */}
            <div className="w-full flex justify-end absolute bottom-4 right-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 py-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold flex items-center gap-1 shadow transition-all animate-bounce"
                aria-label="Go to Top"
              >
                <svg className="h-5 w-5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-label="Up Arrow"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                Go to Top
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
