import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import jsPDF from 'jspdf';

const STORAGE_KEY = 'meritCalcState';

const MeritCalculator = () => {
  const [mainsScore, setMainsScore] = useState('');
  const [interviewScore, setInterviewScore] = useState('');
  const [mainsWeight, setMainsWeight] = useState('');
  const [interviewWeight, setInterviewWeight] = useState('');
  const [result, setResult] = useState('');
  const [breakdown, setBreakdown] = useState('');
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setMainsScore(state.mainsScore || '');
        setInterviewScore(state.interviewScore || '');
        setMainsWeight(state.mainsWeight || '');
        setInterviewWeight(state.interviewWeight || '');
        setResult(state.result || '');
        setBreakdown(state.breakdown || '');
        setShowResult(state.showResult || false);
      } catch (e) {
        console.error('Error loading saved state:', e);
      }
    }
  }, []);

  // Save state when it changes
  useEffect(() => {
    const state = {
      mainsScore,
      interviewScore,
      mainsWeight,
      interviewWeight,
      result,
      breakdown,
      showResult,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [mainsScore, interviewScore, mainsWeight, interviewWeight, result, breakdown, showResult]);

  const reset = () => {
    setMainsScore('');
    setInterviewScore('');
    setMainsWeight('');
    setInterviewWeight('');
    setResult('');
    setBreakdown('');
    setError('');
    setShowResult(false);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResult(false);
    const mains = parseFloat(mainsScore);
    const interview = parseFloat(interviewScore);
    const mainsW = parseFloat(mainsWeight);
    const interviewW = parseFloat(interviewWeight);
    if ([mains, interview, mainsW, interviewW].some(x => isNaN(x) || x < 0)) {
      setError('All values must be non-negative numbers.');
      return;
    }
    if (mainsW + interviewW !== 100) {
      setError('⚠️ Weights must total 100%');
      setShowResult(false);
      return;
    }
    const mainsPart = mains * mainsW / 100;
    const interviewPart = interview * interviewW / 100;
    const merit = (mainsPart + interviewPart).toFixed(2);
    setResult(merit);
    setBreakdown(
      `🧮 Breakdown:\n- Mains: ${mains} × ${mainsW}% = ${mainsPart.toFixed(2)}\n- Interview: ${interview} × ${interviewW}% = ${interviewPart.toFixed(2)}\n- Final Merit Score = ${merit} / 100`
    );
    setShowResult(true);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Merit Calculator Result', 14, 20);
    doc.setFontSize(12);
    doc.text(`Mains Score: ${mainsScore}`, 14, 35);
    doc.text(`Interview Score: ${interviewScore}`, 14, 45);
    doc.text(`Mains Weight: ${mainsWeight}%`, 14, 55);
    doc.text(`Interview Weight: ${interviewWeight}%`, 14, 65);
    doc.text(`Result: ${result}`, 14, 75);
    doc.text('Breakdown:', 14, 85);
    breakdown.split('\n').forEach((line, idx) => {
      doc.text(line, 18, 95 + idx * 10);
    });
    doc.save('Merit-Calculator-Result.pdf');
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <div className="w-full max-w-xl">
        <Card className="shadow-md border border-gray-100 rounded-2xl bg-white">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-8">
              <div className="text-center animate-fade-in">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Merit Calculator</h1>
                <p className="text-gray-600">Calculate your final merit score with weights</p>
              </div>
              <form onSubmit={handleCalculate} className="space-y-6 transition-all duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Mains Score</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={mainsScore}
                      onChange={e => setMainsScore(e.target.value)}
                      placeholder="Mains Score"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Interview Score</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={interviewScore}
                      onChange={e => setInterviewScore(e.target.value)}
                      placeholder="Interview Score"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Mains Weight (%)</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="100"
                      value={mainsWeight}
                      onChange={e => setMainsWeight(e.target.value)}
                      placeholder="Mains %"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Interview Weight (%)</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="100"
                      value={interviewWeight}
                      onChange={e => setInterviewWeight(e.target.value)}
                      placeholder="Interview %"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200"
                  >
                    CALCULATE
                  </Button>
                  <Button
                    type="button"
                    onClick={reset}
                    className="w-full sm:w-auto mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200"
                  >
                    RESET
                  </Button>
                </div>
              </form>
              {/* Result Section */}
              <div className="min-h-[60px] transition-all duration-300">
                {error && (
                  <div className="flex items-center justify-center mb-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      {error}
                    </span>
                  </div>
                )}
                {showResult && !error && (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="h-8 w-8 text-blue-600" />
                      <span className="text-4xl font-extrabold text-blue-700">{result}</span>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 mt-2 text-left shadow-sm">
                      <div className="font-semibold text-gray-700 mb-2">🧮 Breakdown:</div>
                      {breakdown.split('\n').map((line, idx) => (
                        <div key={idx} className="text-gray-700 text-base mb-1 whitespace-pre-line">{line}</div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button type="button" variant="outline" onClick={reset}>Reset</Button>
                      <Button type="button" variant="secondary" onClick={handleExportPDF}>Export as PDF</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeritCalculator; 