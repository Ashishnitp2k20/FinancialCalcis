import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calculator } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';

const compoundingOptions = [
  { label: 'Yearly', value: 1 },
  { label: 'Half-Yearly', value: 2 },
  { label: 'Quarterly', value: 4 },
  { label: 'Monthly', value: 12 },
];

const FdRdCalculator = () => {
  // FD State
  const [fdPrincipal, setFdPrincipal] = useState('');
  const [fdRate, setFdRate] = useState('');
  const [fdTenure, setFdTenure] = useState('');
  const [fdCompounding, setFdCompounding] = useState(1);
  const [fdResult, setFdResult] = useState<{ maturity: number; invested: number; interest: number } | null>(null);
  // RD State
  const [rdDeposit, setRdDeposit] = useState('');
  const [rdRate, setRdRate] = useState('');
  const [rdTenure, setRdTenure] = useState('');
  const [rdResult, setRdResult] = useState<{ maturity: number; invested: number; interest: number } | null>(null);
  // Tab
  const [activeTab, setActiveTab] = useState('fd');

  // FD Calculation
  const calculateFD = () => {
    const P = parseFloat(fdPrincipal);
    const r = parseFloat(fdRate) / 100;
    const n = fdCompounding;
    const t = parseFloat(fdTenure);
    if (!P || !r || !n || !t) return setFdResult(null);
    const maturity = P * Math.pow(1 + r / n, n * t);
    const invested = P;
    const interest = maturity - invested;
    setFdResult({ maturity, invested, interest });
  };

  // RD Calculation
  const calculateRD = () => {
    const P = parseFloat(rdDeposit);
    const r = parseFloat(rdRate) / 100 / 12;
    const n = parseFloat(rdTenure) * 12;
    if (!P || !r || !n) return setRdResult(null);
    const maturity = P * n + P * n * (n + 1) / 2 * r;
    const invested = P * n;
    const interest = maturity - invested;
    setRdResult({ maturity, invested, interest });
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
            <h2 className="text-2xl font-bold text-gray-800">FD/RD Calculator</h2>
            <p className="text-gray-600 mt-2">Calculate maturity for Fixed & Recurring Deposits</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full grid grid-cols-2">
              <TabsTrigger value="fd">Fixed Deposit (FD)</TabsTrigger>
              <TabsTrigger value="rd">Recurring Deposit (RD)</TabsTrigger>
            </TabsList>
            <TabsContent value="fd">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Principal Amount</Label>
                  <Input type="number" value={fdPrincipal} onChange={e => setFdPrincipal(e.target.value)} placeholder="Enter principal" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Annual Interest Rate (%)</Label>
                  <Input type="number" value={fdRate} onChange={e => setFdRate(e.target.value)} placeholder="Enter rate" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Tenure (years)</Label>
                  <Input type="number" value={fdTenure} onChange={e => setFdTenure(e.target.value)} placeholder="Enter tenure" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Compounding Frequency</Label>
                  <select value={fdCompounding} onChange={e => setFdCompounding(Number(e.target.value))} className="input-focus-effect w-full rounded-md border px-3 py-2">
                    {compoundingOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <Button className="w-full bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90" onClick={calculateFD}>Calculate FD</Button>
                {fdResult && (
                  <div className="mt-6 space-y-4 p-4 bg-gst-light-purple/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Maturity Amount:</span>
                      <span className="font-semibold text-gst-purple">₹{fdResult.maturity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Investment:</span>
                      <span className="font-semibold text-gst-purple">₹{fdResult.invested.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Interest Earned:</span>
                      <span className="font-semibold text-gst-purple">₹{fdResult.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="rd">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Monthly Deposit</Label>
                  <Input type="number" value={rdDeposit} onChange={e => setRdDeposit(e.target.value)} placeholder="Enter monthly deposit" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Annual Interest Rate (%)</Label>
                  <Input type="number" value={rdRate} onChange={e => setRdRate(e.target.value)} placeholder="Enter rate" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Tenure (years)</Label>
                  <Input type="number" value={rdTenure} onChange={e => setRdTenure(e.target.value)} placeholder="Enter tenure" className="input-focus-effect" />
                </div>
                <Button className="w-full bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90" onClick={calculateRD}>Calculate RD</Button>
                {rdResult && (
                  <div className="mt-6 space-y-4 p-4 bg-gst-light-purple/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Maturity Amount:</span>
                      <span className="font-semibold text-gst-purple">₹{rdResult.maturity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Investment:</span>
                      <span className="font-semibold text-gst-purple">₹{rdResult.invested.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Interest Earned:</span>
                      <span className="font-semibold text-gst-purple">₹{rdResult.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FdRdCalculator; 