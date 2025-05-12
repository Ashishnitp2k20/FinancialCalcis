import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';

const LoanEmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTenure, setLoanTenure] = useState<number>(12);
  const [emi, setEmi] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = interestRate / 12 / 100; // Monthly interest rate
    const time = loanTenure; // Loan tenure in months

    if (principal && rate && time) {
      const emiAmount = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
      const total = emiAmount * time;
      const interest = total - principal;

      setEmi(emiAmount);
      setTotalAmount(total);
      setTotalInterest(interest);
    }
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
            <h2 className="text-2xl font-bold text-gray-800">Loan EMI Calculator</h2>
            <p className="text-gray-600 mt-2">Calculate your monthly EMI payments</p>
          </div>

          <div className="space-y-6">
            {/* Loan Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter loan amount"
                  className="pl-8 input-focus-effect"
                />
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-2">
              <Label>Interest Rate: {interestRate}%</Label>
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                min={5}
                max={20}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Loan Tenure Slider */}
            <div className="space-y-2">
              <Label>Loan Tenure: {loanTenure} months</Label>
              <Slider
                value={[loanTenure]}
                onValueChange={(value) => setLoanTenure(value[0])}
                min={12}
                max={360}
                step={12}
                className="w-full"
              />
            </div>

            <Button
              onClick={calculateEMI}
              className="w-full bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90"
            >
              Calculate EMI
            </Button>

            {/* Results */}
            {emi > 0 && (
              <div className="mt-6 space-y-4 p-4 bg-gst-light-purple/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Monthly EMI:</span>
                  <span className="font-semibold text-gst-purple">{formatCurrency(emi)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Interest:</span>
                  <span className="font-semibold text-gst-purple">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="font-semibold text-gst-purple">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanEmiCalculator; 