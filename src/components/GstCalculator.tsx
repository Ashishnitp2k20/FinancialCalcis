import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { Calculator, Repeat } from 'lucide-react';
import GstResultCard from './GstResultCard';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import CalculatorBanner from './CalculatorBanner';
import jsPDF from 'jspdf';

const STORAGE_KEY = 'gstCalcState';

const GstCalculator = () => {
  const [baseAmount, setBaseAmount] = useState<string>('');
  const [gstRate, setGstRate] = useState<string>('18');
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [calculationPerformed, setCalculationPerformed] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [calculationMode, setCalculationMode] = useState<'base' | 'total'>('base');
  const [inputLabel, setInputLabel] = useState<string>('Amount');

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setBaseAmount(state.baseAmount || '');
        setGstRate(state.gstRate || '18');
        setIsInclusive(state.isInclusive || false);
        setGstAmount(state.gstAmount || 0);
        setTotalAmount(state.totalAmount || 0);
        setCalculationPerformed(state.calculationPerformed || false);
        setCalculationMode(state.calculationMode || 'base');
      } catch (e) {
        console.error('Error loading saved state:', e);
      }
    }
  }, []);

  // Save state when it changes
  useEffect(() => {
    const state = {
      baseAmount,
      gstRate,
      isInclusive,
      gstAmount,
      totalAmount,
      calculationPerformed,
      calculationMode,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [baseAmount, gstRate, isInclusive, gstAmount, totalAmount, calculationPerformed, calculationMode]);

  // Update input label when calculation mode changes
  useEffect(() => {
    setInputLabel(calculationMode === 'base' ? 'Actual Amount' : 'Total Amount (with GST)');
    // Reset calculation state when switching modes
    setBaseAmount('');
    setCalculationPerformed(false);
    setError('');
  }, [calculationMode]);

  // Validate and process the amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string or numbers only (with decimal point)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBaseAmount(value);
      setError('');
    }
  };

  // Handle rate selection
  const handleRateChange = (value: string) => {
    setGstRate(value);
    // Recalculate if there's already a valid base amount
    if (baseAmount && !isNaN(parseFloat(baseAmount)) && parseFloat(baseAmount) >= 0) {
      if (calculationMode === 'base') {
        calculateGST(parseFloat(baseAmount), parseFloat(value), isInclusive);
      } else {
        calculateBaseFromTotal(parseFloat(baseAmount), parseFloat(value));
      }
    }
  };

  // Toggle between inclusive and exclusive GST
  const handleInclusiveToggle = () => {
    const newIsInclusive = !isInclusive;
    setIsInclusive(newIsInclusive);
    
    // Only recalculate in base mode since inclusive/exclusive only applies there
    if (calculationMode === 'base' && baseAmount && !isNaN(parseFloat(baseAmount)) && parseFloat(baseAmount) >= 0) {
      calculateGST(parseFloat(baseAmount), parseFloat(gstRate), newIsInclusive);
    }
  };

  // Calculate GST and total from base amount
  const calculateGST = (base: number, rate: number, inclusive: boolean) => {
    if (isNaN(base) || base < 0) {
      setError('Please enter a valid amount');
      return;
    }

    let gst: number;
    let total: number;

    if (inclusive) {
      // If GST is inclusive, base amount already includes GST
      gst = base - (base / (1 + rate / 100));
      total = base;
    } else {
      // If GST is exclusive, calculate GST on top of base amount
      gst = base * (rate / 100);
      total = base + gst;
    }

    setGstAmount(gst);
    setTotalAmount(total);
    setCalculationPerformed(true);
    toast.success('GST calculated successfully!');
  };

  // Calculate base amount from total (reverse calculation)
  const calculateBaseFromTotal = (total: number, rate: number) => {
    if (isNaN(total) || total < 0) {
      setError('Please enter a valid amount');
      return;
    }

    // The base is always calculated as if GST is inclusive in this mode
    const baseAmount = total / (1 + (rate / 100));
    const gstAmount = total - baseAmount;

    setBaseAmount(baseAmount.toFixed(2));
    setGstAmount(gstAmount);
    setTotalAmount(total);
    setIsInclusive(true); // In reverse calculation, GST is always inclusive
    setCalculationPerformed(true);
    toast.success('Actual amount calculated successfully!');
  };

  // Handle calculate button click
  const handleCalculate = () => {
    if (!baseAmount || baseAmount === '0') {
      setError('Please enter a valid amount');
      return;
    }

    const parsedAmount = parseFloat(baseAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    if (calculationMode === 'base') {
      calculateGST(parsedAmount, parseFloat(gstRate), isInclusive);
    } else {
      calculateBaseFromTotal(parsedAmount, parseFloat(gstRate));
    }
  };

  const reset = () => {
    setBaseAmount('');
    setGstRate('18');
    setIsInclusive(false);
    setGstAmount(0);
    setTotalAmount(0);
    setCalculationPerformed(false);
    setError('');
    setCalculationMode('base');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('GST Calculator Result', 14, 20);
    doc.setFontSize(12);
    doc.text(`Calculation Mode: ${calculationMode === 'base' ? 'Actual → Total' : 'Total → Actual'}`, 14, 35);
    doc.text(`Amount: ${baseAmount}`, 14, 45);
    doc.text(`GST Rate: ${gstRate}%`, 14, 55);
    doc.text(`GST Amount: ${gstAmount.toFixed(2)}`, 14, 65);
    doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, 14, 75);
    doc.save('GST-Calculator-Result.pdf');
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <CalculatorBanner />
      <div className="w-full max-w-xl">
        <div className="p-4 md:p-6 w-full">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 rounded-full gst-gradient mb-4">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">GST Calculator</h1>
            <p className="text-gray-600">Calculate GST quickly and easily</p>
          </div>

          <Card className="shadow-lg border border-gray-100">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Calculation Mode Toggle */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Calculation Mode</Label>
                  <ToggleGroup 
                    type="single" 
                    value={calculationMode} 
                    onValueChange={(value) => value && setCalculationMode(value as 'base' | 'total')}
                    className="border rounded-lg p-1 justify-center"
                  >
                    <ToggleGroupItem 
                      value="base" 
                      className="flex-1 data-[state=on]:bg-gst-light-purple data-[state=on]:text-gst-secondary-purple"
                    >
                      Actual → Total
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="total" 
                      className="flex-1 data-[state=on]:bg-gst-light-purple data-[state=on]:text-gst-secondary-purple"
                    >
                      Total → Actual
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    {inputLabel}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <Input
                      id="amount"
                      type="text"
                      value={baseAmount}
                      onChange={handleAmountChange}
                      placeholder={`Enter ${calculationMode === 'base' ? 'actual amount' : 'total amount'}`}
                      className={`pl-8 input-focus-effect ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                {/* GST Rate */}
                <div className="space-y-2">
                  <Label htmlFor="gstRate" className="text-sm font-medium">
                    GST Rate
                  </Label>
                  <Select
                    value={gstRate}
                    onValueChange={handleRateChange}
                  >
                    <SelectTrigger id="gstRate" className="input-focus-effect">
                      <SelectValue placeholder="Select GST rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* GST Type Toggle - only show in base calculation mode */}
                {calculationMode === 'base' && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gstType" className="text-sm font-medium cursor-pointer">
                      GST Inclusive
                    </Label>
                    <Switch
                      id="gstType"
                      checked={isInclusive}
                      onCheckedChange={handleInclusiveToggle}
                    />
                  </div>
                )}

                {/* Calculate Button */}
                <div className="flex flex-col md:flex-row gap-2 mt-4">
                  <Button
                    onClick={handleCalculate}
                    className="w-full md:w-auto bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90 transition-all duration-200 shadow-md"
                  >
                    {calculationMode === 'base' ? 'Calculate' : 'Calculate Actual Amount'}
                  </Button>
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Card */}
      {calculationPerformed && (
        <div className="w-full max-w-xl mt-4">
          <GstResultCard
            baseAmount={parseFloat(calculationMode === 'base' ? baseAmount : (parseFloat(baseAmount) / (1 + parseFloat(gstRate) / 100)).toFixed(2))}
            gstAmount={gstAmount}
            totalAmount={totalAmount}
            gstRate={parseFloat(gstRate)}
            isInclusive={isInclusive}
          />
          <div className="flex gap-2 mt-4">
            <Button type="button" variant="outline" onClick={reset}>Reset</Button>
            <Button type="button" variant="secondary" onClick={handleExportPDF}>Export as PDF</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GstCalculator;
