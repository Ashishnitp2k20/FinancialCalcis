import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

const initialOffer = { amount: '', rate: '', tenure: '' };

function calculateEMI(P: number, r: number, n: number) {
  // r: annual rate in %, n: years
  const monthlyRate = r / 12 / 100;
  const months = n * 12;
  if (monthlyRate === 0) return P / months;
  return (
    P * monthlyRate * Math.pow(1 + monthlyRate, months)
  ) / (Math.pow(1 + monthlyRate, months) - 1);
}

const LoanComparisonTool = () => {
  const [offers, setOffers] = useState([{ ...initialOffer }]);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleChange = (idx: number, field: string, value: string) => {
    const updated = offers.map((offer, i) =>
      i === idx ? { ...offer, [field]: value } : offer
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
      if (!P || !r || !n) return null;
      const emi = calculateEMI(P, r, n);
      const totalPayment = emi * n * 12;
      const totalInterest = totalPayment - P;
      return { ...offer, emi, totalPayment, totalInterest };
    });
    if (calcResults.some((r) => r === null)) {
      setError('Please fill all fields for each offer.');
      setResults([]);
      return;
    }
    setResults(calcResults as any[]);
  };

  // Find lowest EMI and total cost
  const minEmi = results.length ? Math.min(...results.map(r => r.emi)) : null;
  const minTotal = results.length ? Math.min(...results.map(r => r.totalPayment)) : null;

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
              <div className="flex items-center mt-2 md:mt-0">
                {offers.length > 1 && (
                  <Button variant="destructive" size="icon" onClick={() => removeOffer(idx)} title="Remove offer">×</Button>
                )}
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addOffer} className="w-full md:w-auto">+ Add Another Offer</Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button className="w-full bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90" onClick={handleCompare}>Compare Loans</Button>
          {results.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
                <thead className="bg-gst-light-purple/40">
                  <tr>
                    <th className="px-4 py-2">Offer</th>
                    <th className="px-4 py-2">Loan Amount</th>
                    <th className="px-4 py-2">Interest Rate</th>
                    <th className="px-4 py-2">Tenure (years)</th>
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
                      <td className={`px-4 py-2 font-semibold ${r.emi === minEmi ? 'text-green-700 bg-green-100 rounded' : ''}`}>₹{r.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="px-4 py-2">₹{r.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className={`px-4 py-2 font-semibold ${r.totalPayment === minTotal ? 'text-blue-700 bg-blue-100 rounded' : ''}`}>₹{r.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanComparisonTool; 