import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';

const IncomeTaxEstimator = () => {
  const [annualIncome, setAnnualIncome] = useState<string>('');
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
  } | null>(null);

  const calculateTax = () => {
    const income = parseFloat(annualIncome);
    if (!income) return;

    // Standard deduction (₹50,000)
    let taxableIncome = income - (deductions.standardDeduction ? 50000 : 0);

    // Calculate tax based on slabs
    const slabs = [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 0.05 },
      { limit: 900000, rate: 0.1 },
      { limit: 1200000, rate: 0.15 },
      { limit: 1500000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ];

    let totalTax = 0;
    let remainingIncome = taxableIncome;
    const taxSlabs = [];

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

    const effectiveRate = (totalTax / income) * 100;

    setTaxDetails({
      totalTax,
      effectiveRate,
      taxSlabs,
    });
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
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Income Tax Estimator</h2>
            <p className="text-gray-600 mt-2">Calculate your tax liability for FY 2024-25</p>
          </div>

          <div className="space-y-6">
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

            <Button
              onClick={calculateTax}
              className="w-full bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90"
            >
              Calculate Tax
            </Button>

            {/* Results */}
            {taxDetails && (
              <div className="mt-6 space-y-4 p-4 bg-gst-light-purple/20 rounded-lg">
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