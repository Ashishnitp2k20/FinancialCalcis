import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { IndianRupee } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';

const IncomeTaxEstimator = () => {
  const [annualIncome, setAnnualIncome] = useState<string>('');
  const [taxRegime, setTaxRegime] = useState<'new' | 'old'>('new');
  const [deductions, setDeductions] = useState({
    hra: false,
    standardDeduction: true,
    nps: false,
    homeLoan: false,
    medicalInsurance: false,
  });
  const [taxDetails, setTaxDetails] = useState<{
    totalTax: number;
    effectiveRate: number;
    taxSlabs: { slab: string; tax: number }[];
    regime: 'new' | 'old';
  } | null>(null);

  const calculateTax = () => {
    const income = parseFloat(annualIncome);
    if (!income) return;

    let taxableIncome = income;
    let totalTax = 0;
    let taxSlabs = [];

    if (taxRegime === 'new') {
      // New Tax Regime FY 2025-26
      // Standard deduction of ₹75,000 for salary income
      if (deductions.standardDeduction) {
        taxableIncome -= 75000;
      }

      // NPS employer contribution (14% of basic salary)
      if (deductions.nps) {
        taxableIncome -= (income * 0.14);
      }

      const slabs = [
        { limit: 400000, rate: 0 },
        { limit: 800000, rate: 0.05 },
        { limit: 1200000, rate: 0.10 },
        { limit: 1600000, rate: 0.15 },
        { limit: 2000000, rate: 0.20 },
        { limit: 2400000, rate: 0.25 },
        { limit: Infinity, rate: 0.30 },
      ];

      let remainingIncome = taxableIncome;
      for (let i = 0; i < slabs.length; i++) {
        const currentSlab = slabs[i];
        const previousLimit = i === 0 ? 0 : slabs[i - 1].limit;
        const slabAmount = Math.min(currentSlab.limit - previousLimit, remainingIncome);
        
        if (slabAmount > 0) {
          const taxForSlab = slabAmount * currentSlab.rate;
          totalTax += taxForSlab;
          taxSlabs.push({
            slab: `₹${previousLimit.toLocaleString()} - ₹${currentSlab.limit === Infinity ? '∞' : currentSlab.limit.toLocaleString()}`,
            tax: taxForSlab,
          });
        }
        
        remainingIncome -= slabAmount;
        if (remainingIncome <= 0) break;
      }

      // Tax rebate under Section 87A for new regime
      if (taxableIncome <= 1200000) {
        const rebate = Math.min(totalTax, 60000);
        totalTax -= rebate;
      }

    } else {
      // Old Tax Regime
      // Standard deduction
      if (deductions.standardDeduction) {
        taxableIncome -= 50000;
      }

      // HRA deduction (assuming 40% of basic salary)
      if (deductions.hra) {
        taxableIncome -= (income * 0.4);
      }

      // NPS deduction under 80C
      if (deductions.nps) {
        taxableIncome -= 150000; // Maximum under 80C
        taxableIncome -= 50000;  // Additional under 80CCD(1B)
      }

      // Home loan interest
      if (deductions.homeLoan) {
        taxableIncome -= 200000; // Maximum deduction
      }

      // Medical insurance premium
      if (deductions.medicalInsurance) {
        taxableIncome -= 25000; // For individuals below 60
      }

      const slabs = [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
      ];

      let remainingIncome = taxableIncome;
      for (let i = 0; i < slabs.length; i++) {
        const currentSlab = slabs[i];
        const previousLimit = i === 0 ? 0 : slabs[i - 1].limit;
        const slabAmount = Math.min(currentSlab.limit - previousLimit, remainingIncome);
        
        if (slabAmount > 0) {
          const taxForSlab = slabAmount * currentSlab.rate;
          totalTax += taxForSlab;
          taxSlabs.push({
            slab: `₹${previousLimit.toLocaleString()} - ₹${currentSlab.limit === Infinity ? '∞' : currentSlab.limit.toLocaleString()}`,
            tax: taxForSlab,
          });
        }
        
        remainingIncome -= slabAmount;
        if (remainingIncome <= 0) break;
      }

      // Tax rebate under Section 87A for old regime
      if (taxableIncome <= 500000) {
        const rebate = Math.min(totalTax, 12500);
        totalTax -= rebate;
      }
    }

    const effectiveRate = (totalTax / income) * 100;

    setTaxDetails({
      totalTax,
      effectiveRate,
      taxSlabs,
      regime: taxRegime
    });
  };

  const reset = () => {
    setAnnualIncome('');
    setDeductions({
      hra: false,
      standardDeduction: true,
      nps: false,
      homeLoan: false,
      medicalInsurance: false,
    });
    setTaxDetails(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <CalculatorBanner />
      <Card className="w-full shadow-lg border border-gst-light-purple/50">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 rounded-full gst-gradient mb-4">
              <IndianRupee className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Income Tax Estimator</h2>
            <p className="text-gray-600 mt-2">Calculate your tax liability for FY 2025-26</p>
          </div>

          <div className="space-y-6">
            {/* Tax Regime Selection */}
            <div className="space-y-2">
              <Label>Tax Regime</Label>
              <div className="flex gap-4">
                <Button
                  variant={taxRegime === 'new' ? 'default' : 'outline'}
                  onClick={() => setTaxRegime('new')}
                  className="flex-1"
                >
                  New Regime
                </Button>
                <Button
                  variant={taxRegime === 'old' ? 'default' : 'outline'}
                  onClick={() => setTaxRegime('old')}
                  className="flex-1"
                >
                  Old Regime
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {taxRegime === 'new' 
                  ? 'New regime offers lower rates but fewer deductions'
                  : 'Old regime allows more deductions but higher rates'}
              </p>
            </div>

            {/* Annual Income Input */}
            <div className="space-y-2">
              <Label htmlFor="annualIncome">Annual Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="annualIncome"
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="Enter your annual income"
                  className="pl-8 input-focus-effect"
                />
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-4">
              <Label>Available Deductions</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="standardDeduction"
                    checked={deductions.standardDeduction}
                    onCheckedChange={(checked) => 
                      setDeductions(prev => ({ ...prev, standardDeduction: checked as boolean }))
                    }
                  />
                  <Label htmlFor="standardDeduction">Standard Deduction (₹50,000)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hra"
                    checked={deductions.hra}
                    onCheckedChange={(checked) => 
                      setDeductions(prev => ({ ...prev, hra: checked as boolean }))
                    }
                  />
                  <Label htmlFor="hra">House Rent Allowance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nps"
                    checked={deductions.nps}
                    onCheckedChange={(checked) => 
                      setDeductions(prev => ({ ...prev, nps: checked as boolean }))
                    }
                  />
                  <Label htmlFor="nps">NPS Contribution</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="homeLoan"
                    checked={deductions.homeLoan}
                    onCheckedChange={(checked) => 
                      setDeductions(prev => ({ ...prev, homeLoan: checked as boolean }))
                    }
                  />
                  <Label htmlFor="homeLoan">Home Loan Interest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medicalInsurance"
                    checked={deductions.medicalInsurance}
                    onCheckedChange={(checked) => 
                      setDeductions(prev => ({ ...prev, medicalInsurance: checked as boolean }))
                    }
                  />
                  <Label htmlFor="medicalInsurance">Medical Insurance Premium</Label>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 mt-4">
              <Button
                onClick={calculateTax}
                className="w-full md:w-auto bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90"
              >
                Calculate Tax
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                className="w-full md:w-auto"
              >
                Reset
              </Button>
            </div>

            {/* Results */}
            {taxDetails && (
              <div className="mt-6 space-y-4 p-4 bg-gst-light-purple/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tax Regime:</span>
                  <span className="font-semibold text-gst-purple">
                    {taxDetails.regime === 'new' ? 'New Regime' : 'Old Regime'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Tax:</span>
                  <span className="font-semibold text-gst-purple">{formatCurrency(taxDetails.totalTax)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Effective Tax Rate:</span>
                  <span className="font-semibold text-gst-purple">{taxDetails.effectiveRate.toFixed(2)}%</span>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Tax Slab-wise Breakdown:</h4>
                  <div className="space-y-2">
                    {taxDetails.taxSlabs.map((slab, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{slab.slab}</span>
                        <span className="font-medium text-gst-purple">{formatCurrency(slab.tax)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeTaxEstimator; 