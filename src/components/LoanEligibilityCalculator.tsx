import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';

const LoanEligibilityCalculator = () => {
  const [income, setIncome] = useState('');
  const [existingEmi, setExistingEmi] = useState('');
  const [tenure, setTenure] = useState('');
  const [rate, setRate] = useState('');
  const [eligibleEmi, setEligibleEmi] = useState<number | null>(null);
  const [eligibleLoan, setEligibleLoan] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateEligibility = () => {
    const monthlyIncome = parseFloat(income);
    const currentEmi = parseFloat(existingEmi) || 0;
    const loanTenure = parseInt(tenure) || 0;
    const annualRate = parseFloat(rate);
    if (!monthlyIncome || !loanTenure || !annualRate) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    // 40% rule
    const maxEmi = monthlyIncome * 0.4 - currentEmi;
    setEligibleEmi(maxEmi > 0 ? maxEmi : 0);
    // Reducing balance EMI formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    // Rearranged to get P (principal):
    // P = EMI * [ (1+r)^n - 1 ] / [ r * (1+r)^n ]
    const r = annualRate / 12 / 100;
    const n = loanTenure * 12;
    if (maxEmi > 0 && r > 0 && n > 0) {
      const numerator = Math.pow(1 + r, n) - 1;
      const denominator = r * Math.pow(1 + r, n);
      const maxLoan = maxEmi * (numerator / denominator);
      setEligibleLoan(maxLoan);
    } else {
      setEligibleLoan(0);
    }
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
            <h2 className="text-2xl font-bold text-gray-800">Loan Eligibility Calculator</h2>
            <p className="text-gray-600 mt-2">Check your maximum eligible loan amount</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Monthly Income</Label>
              <Input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="Enter monthly income" className="input-focus-effect" />
            </div>
            <div className="space-y-2">
              <Label>Existing EMIs (per month)</Label>
              <Input type="number" value={existingEmi} onChange={e => setExistingEmi(e.target.value)} placeholder="Enter total existing EMIs" className="input-focus-effect" />
            </div>
            <div className="space-y-2">
              <Label>Loan Tenure (years)</Label>
              <Input type="number" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="Enter tenure in years" className="input-focus-effect" />
            </div>
            <div className="space-y-2">
              <Label>Interest Rate (annual %)</Label>
              <Input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="Enter annual interest rate" className="input-focus-effect" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="w-full bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90" onClick={calculateEligibility}>Calculate Eligibility</Button>
            {eligibleEmi !== null && eligibleLoan !== null && (
              <div className="mt-6 space-y-4 p-4 bg-gst-light-purple/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Eligible EMI:</span>
                  <span className="font-semibold text-gst-purple">₹{eligibleEmi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Eligible Loan Amount:</span>
                  <span className="font-semibold text-gst-purple">₹{eligibleLoan.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanEligibilityCalculator; 