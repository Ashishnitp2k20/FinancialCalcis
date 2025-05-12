import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calculator } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';

const PpfEpfCalculator = () => {
  // PPF State
  const [ppfContribution, setPpfContribution] = useState('');
  const [ppfRate, setPpfRate] = useState('7.1');
  const [ppfTenure, setPpfTenure] = useState('15');
  const [ppfResult, setPpfResult] = useState<any[]>([]);
  // EPF State
  const [epfSalary, setEpfSalary] = useState('');
  const [epfEmpPercent, setEpfEmpPercent] = useState('12');
  const [epfErPercent, setEpfErPercent] = useState('12');
  const [epfRate, setEpfRate] = useState('8.1');
  const [epfYears, setEpfYears] = useState('15');
  const [epfResult, setEpfResult] = useState<any[]>([]);
  // Tab
  const [activeTab, setActiveTab] = useState('ppf');

  // PPF Calculation
  const calculatePPF = () => {
    const yearly = parseFloat(ppfContribution);
    const rate = parseFloat(ppfRate) / 100;
    const years = parseInt(ppfTenure);
    if (!yearly || !rate || !years) return setPpfResult([]);
    let corpus = 0;
    let total = 0;
    let interest = 0;
    const result = [];
    for (let y = 1; y <= years; y++) {
      corpus = (corpus + yearly) * (1 + rate);
      total += yearly;
      interest = corpus - total;
      result.push({ year: y, corpus, total, interest });
    }
    setPpfResult(result);
  };

  // EPF Calculation
  const calculateEPF = () => {
    const salary = parseFloat(epfSalary);
    const empPct = parseFloat(epfEmpPercent) / 100;
    const erPct = parseFloat(epfErPercent) / 100;
    const rate = parseFloat(epfRate) / 100;
    const years = parseInt(epfYears);
    if (!salary || !empPct || !erPct || !rate || !years) return setEpfResult([]);
    let corpus = 0;
    let total = 0;
    let interest = 0;
    const result = [];
    for (let y = 1; y <= years; y++) {
      const yearlyContribution = salary * 12 * (empPct + erPct);
      corpus = (corpus + yearlyContribution) * (1 + rate);
      total += yearlyContribution;
      interest = corpus - total;
      result.push({ year: y, corpus, total, interest });
    }
    setEpfResult(result);
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
            <h2 className="text-2xl font-bold text-gray-800">PPF/EPF Calculator</h2>
            <p className="text-gray-600 mt-2">Calculate corpus growth for PPF & EPF</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full grid grid-cols-2">
              <TabsTrigger value="ppf">PPF Calculator</TabsTrigger>
              <TabsTrigger value="epf">EPF Calculator</TabsTrigger>
            </TabsList>
            <TabsContent value="ppf">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Annual Contribution</Label>
                  <Input type="number" value={ppfContribution} onChange={e => setPpfContribution(e.target.value)} placeholder="Enter annual contribution" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input type="number" value={ppfRate} onChange={e => setPpfRate(e.target.value)} placeholder="Interest rate" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Tenure (years)</Label>
                  <Input type="number" value={ppfTenure} onChange={e => setPpfTenure(e.target.value)} placeholder="Tenure (default 15)" className="input-focus-effect" />
                </div>
                <Button className="w-full bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90" onClick={calculatePPF}>Calculate PPF</Button>
                {ppfResult.length > 0 && (
                  <div className="overflow-x-auto mt-6">
                    <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
                      <thead className="bg-gst-light-purple/40">
                        <tr>
                          <th className="px-4 py-2">Year</th>
                          <th className="px-4 py-2">Corpus</th>
                          <th className="px-4 py-2">Total Contribution</th>
                          <th className="px-4 py-2">Interest Earned</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ppfResult.map((r: any) => (
                          <tr key={r.year} className="border-b last:border-0">
                            <td className="px-4 py-2">{r.year}</td>
                            <td className="px-4 py-2 font-semibold">₹{r.corpus.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-4 py-2">₹{r.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-4 py-2">₹{r.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 p-4 bg-gst-light-purple/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Final Maturity Amount:</span>
                        <span className="font-semibold text-gst-purple">₹{ppfResult[ppfResult.length-1].corpus.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Contribution:</span>
                        <span className="font-semibold text-gst-purple">₹{ppfResult[ppfResult.length-1].total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Interest Earned:</span>
                        <span className="font-semibold text-gst-purple">₹{ppfResult[ppfResult.length-1].interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="epf">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Monthly Salary</Label>
                  <Input type="number" value={epfSalary} onChange={e => setEpfSalary(e.target.value)} placeholder="Enter monthly salary" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Employee Contribution (%)</Label>
                  <Input type="number" value={epfEmpPercent} onChange={e => setEpfEmpPercent(e.target.value)} placeholder="Employee % (default 12)" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Employer Contribution (%)</Label>
                  <Input type="number" value={epfErPercent} onChange={e => setEpfErPercent(e.target.value)} placeholder="Employer % (default 12)" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input type="number" value={epfRate} onChange={e => setEpfRate(e.target.value)} placeholder="Interest rate (default 8.1)" className="input-focus-effect" />
                </div>
                <div className="space-y-2">
                  <Label>Number of Years</Label>
                  <Input type="number" value={epfYears} onChange={e => setEpfYears(e.target.value)} placeholder="Years" className="input-focus-effect" />
                </div>
                <Button className="w-full bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90" onClick={calculateEPF}>Calculate EPF</Button>
                {epfResult.length > 0 && (
                  <div className="overflow-x-auto mt-6">
                    <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
                      <thead className="bg-gst-light-purple/40">
                        <tr>
                          <th className="px-4 py-2">Year</th>
                          <th className="px-4 py-2">Corpus</th>
                          <th className="px-4 py-2">Total Contribution</th>
                          <th className="px-4 py-2">Interest Earned</th>
                        </tr>
                      </thead>
                      <tbody>
                        {epfResult.map((r: any) => (
                          <tr key={r.year} className="border-b last:border-0">
                            <td className="px-4 py-2">{r.year}</td>
                            <td className="px-4 py-2 font-semibold">₹{r.corpus.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-4 py-2">₹{r.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-4 py-2">₹{r.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 p-4 bg-gst-light-purple/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Final Maturity Amount:</span>
                        <span className="font-semibold text-gst-purple">₹{epfResult[epfResult.length-1].corpus.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Contribution:</span>
                        <span className="font-semibold text-gst-purple">₹{epfResult[epfResult.length-1].total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Interest Earned:</span>
                        <span className="font-semibold text-gst-purple">₹{epfResult[epfResult.length-1].interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
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

export default PpfEpfCalculator; 