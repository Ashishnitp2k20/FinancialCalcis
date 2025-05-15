import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Copy, FileDown, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import * as html2pdf from 'html2pdf.js';

const STORAGE_KEY = 'loanComparisonCalcState';

type InterestType = 'SI' | 'CI';

const initialOffer: LoanOffer = { 
  amount: '', 
  rate: '', 
  tenure: '', 
  interestType: 'CI' as InterestType 
};

interface LoanOffer {
  amount: string;
  rate: string;
  tenure: string;
  interestType: InterestType;
}

interface LoanResult extends LoanOffer {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

function calculateEMI(P: number, r: number, n: number, type: InterestType) {
  // r: annual rate in %, n: years
  const months = n * 12;
  if (type === 'SI') {
    // Simple Interest: EMI = (P + (P * r * n / 100)) / months
    return (P + (P * r * n / 100)) / months;
  } else {
    // Compound Interest (CI)
    const monthlyRate = r / 12 / 100;
    if (monthlyRate === 0) return P / months;
    return (
      P * monthlyRate * Math.pow(1 + monthlyRate, months)
    ) / (Math.pow(1 + monthlyRate, months) - 1);
  }
}

const LoanComparisonTool = () => {
  const [offers, setOffers] = useState<LoanOffer[]>([{ ...initialOffer }]);
  const [results, setResults] = useState<LoanResult[]>([]);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setOffers(state.offers || [{ ...initialOffer }]);
        setResults(state.results || []);
        setError(state.error || '');
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    const state = {
      offers,
      results,
      error,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [offers, results, error]);

  const handleChange = (idx: number, field: string, value: string) => {
    const updated = offers.map((offer, i) =>
      i === idx ? { 
        ...offer, 
        [field]: field === 'interestType' ? value as InterestType : value 
      } : offer
    );
    setOffers(updated);
  };

  const addOffer = () => setOffers([...offers, { ...initialOffer }]);
  const removeOffer = (idx: number) => setOffers(offers.filter((_, i) => i !== idx));

  const handleCompare = () => {
    setError('');
    const calcResults = offers.map((offer) => {
      const P = parseFloat(offer.amount);
      const r = parseFloat(offer.rate);
      const n = parseFloat(offer.tenure);
      const type = offer.interestType;
      if (!P || !r || !n) return null;
      const emi = calculateEMI(P, r, n, type);
      let totalPayment, totalInterest;
      if (type === 'SI') {
        totalPayment = emi * n * 12;
        totalInterest = totalPayment - P;
      } else {
        totalPayment = emi * n * 12;
        totalInterest = totalPayment - P;
      }
      return { ...offer, emi, totalPayment, totalInterest } as LoanResult;
    });
    if (calcResults.some((r) => r === null)) {
      setError('Please fill all fields for each offer.');
      setResults([]);
      return;
    }
    setResults(calcResults.filter((r): r is LoanResult => r !== null));
  };

  // Find lowest EMI and total cost
  const minEmi = results.length ? Math.min(...results.map(r => r.emi)) : null;
  const minTotal = results.length ? Math.min(...results.map(r => r.totalPayment)) : null;

  const resetCalculator = () => {
    setOffers([{ ...initialOffer }]);
    setResults([]);
    setError('');
  };

  const copyResults = () => {
    if (!results.length) return;
    
    const text = results.map((r, idx) => 
      `Offer ${idx + 1} (Type: ${r.interestType}):\nLoan Amount: ₹${parseFloat(r.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}\nInterest Rate: ${r.rate}%\nTenure: ${r.tenure} years\nEMI: ₹${r.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nTotal Interest: ₹${r.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nTotal Payment: ₹${r.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}\n`
    ).join('\n');
    
    navigator.clipboard.writeText(text);
    toast.success('Results copied to clipboard!');
  };

  const exportToPDF = () => {
    if (!resultRef.current) return;
    
    const element = resultRef.current;
    const opt = {
      margin: 1,
      filename: 'loan-comparison-results.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <Card className="w-full shadow-lg border border-gst-light-purple/50">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full gst-gradient mb-4">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Loan Comparison Tool</h2>
          <p className="text-gray-600 mt-2">Compare multiple loan offers side by side</p>
        </div>
        <div className="space-y-6">
          {offers.map((offer, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-end gap-4 bg-gst-light-purple/10 p-4 rounded-lg">
              <div className="flex-1 space-y-2">
                <Label>Loan Amount</Label>
                <Input type="number" value={offer.amount} onChange={e => handleChange(idx, 'amount', e.target.value)} placeholder="Amount" className="input-focus-effect" />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Interest Rate (%)</Label>
                <Input type="number" value={offer.rate} onChange={e => handleChange(idx, 'rate', e.target.value)} placeholder="Rate" className="input-focus-effect" />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Tenure (years)</Label>
                <Input type="number" value={offer.tenure} onChange={e => handleChange(idx, 'tenure', e.target.value)} placeholder="Tenure" className="input-focus-effect" />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Type of Interest</Label>
                <select
                  value={offer.interestType}
                  onChange={e => handleChange(idx, 'interestType', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gst-purple"
                >
                  <option value="CI">Compound Interest (CI)</option>
                  <option value="SI">Simple Interest (SI)</option>
                </select>
              </div>
              <div className="flex items-center mt-2 md:mt-0">
                {offers.length > 1 && (
                  <Button variant="destructive" size="icon" onClick={() => removeOffer(idx)} title="Remove offer">×</Button>
                )}
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addOffer} className="w-full md:w-auto">+ Add Another Offer</Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button 
              onClick={handleCompare}
              className="flex-1 bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90"
            >
              Compare Loans
            </Button>
            <Button 
              onClick={resetCalculator}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          {results.length > 0 && (
            <div ref={resultRef} className="overflow-x-auto mt-6">
              <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
                <thead className="bg-gst-light-purple/40">
                  <tr>
                    <th className="px-4 py-2">Offer</th>
                    <th className="px-4 py-2">Loan Amount</th>
                    <th className="px-4 py-2">Interest Rate</th>
                    <th className="px-4 py-2">Tenure (years)</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">EMI</th>
                    <th className="px-4 py-2">Total Interest</th>
                    <th className="px-4 py-2">Total Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">Offer {idx + 1}</td>
                      <td className="px-4 py-2">₹{parseFloat(r.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="px-4 py-2">{r.rate}%</td>
                      <td className="px-4 py-2">{r.tenure}</td>
                      <td className="px-4 py-2">{r.interestType}</td>
                      <td className={`px-4 py-2 font-semibold ${r.emi === minEmi ? 'text-green-700 bg-green-100 rounded' : ''}`}>₹{r.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="px-4 py-2">₹{r.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className={`px-4 py-2 font-semibold ${r.totalPayment === minTotal ? 'text-blue-700 bg-blue-100 rounded' : ''}`}>₹{r.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={copyResults}>Copy</Button>
                <Button variant="secondary" onClick={exportToPDF}>Export as PDF</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanComparisonTool; 