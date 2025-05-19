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
  const [totalMainsMarks, setTotalMainsMarks] = useState('');
  const [totalInterviewMarks, setTotalInterviewMarks] = useState('');

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
        setTotalMainsMarks(state.totalMainsMarks || '');
        setTotalInterviewMarks(state.totalInterviewMarks || '');
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
      totalMainsMarks,
      totalInterviewMarks,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [mainsScore, interviewScore, mainsWeight, interviewWeight, result, breakdown, showResult, totalMainsMarks, totalInterviewMarks]);

  const reset = () => {
    setMainsScore('');
    setInterviewScore('');
    setMainsWeight('');
    setInterviewWeight('');
    setResult('');
    setBreakdown('');
    setError('');
    setShowResult(false);
    setTotalMainsMarks('');
    setTotalInterviewMarks('');
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResult(false);
    const mains = parseFloat(mainsScore);
    const interview = parseFloat(interviewScore);
    const mainsW = parseFloat(mainsWeight);
    const interviewW = parseFloat(interviewWeight);
    const totalMains = parseFloat(totalMainsMarks);
    const totalInterview = parseFloat(totalInterviewMarks);
    if ([mains, interview, mainsW, interviewW, totalMains, totalInterview].some(x => isNaN(x) || x < 0)) {
      setError('All values must be non-negative numbers.');
      return;
    }
    if (mainsW + interviewW !== 100) {
      setError('⚠️ Weights must total 100%');
      setShowResult(false);
      return;
    }
    if (totalMains === 0 || totalInterview === 0) {
      setError('Total marks must be greater than 0.');
      return;
    }
    // Correct associative calculation
    const mainsFraction = mains / totalMains;
    const mainsWeighted = mainsFraction * mainsW;
    const interviewFraction = interview / totalInterview;
    const interviewWeighted = interviewFraction * interviewW;
    const merit = (mainsWeighted + interviewWeighted).toFixed(2);
    setResult(merit);
    setBreakdown(
      `Breakdown:` +
      `\n- Mains: (${mains} / ${totalMains}) = ${mainsFraction.toFixed(3)} × ${mainsW} = ${mainsWeighted.toFixed(2)}` +
      `\n- Interview: (${interview} / ${totalInterview}) = ${interviewFraction.toFixed(3)} × ${interviewW} = ${interviewWeighted.toFixed(2)}` +
      `\n- Final Merit Score = ${mainsWeighted.toFixed(2)} + ${interviewWeighted.toFixed(2)} = ${merit}`
    );
    setShowResult(true);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Merit Calculator Result', 14, 20);
    doc.setFontSize(12);
    doc.text(`Mains Score: ${mainsScore}`, 14, 35);
    doc.text(`Total Mains Marks: ${totalMainsMarks}`, 14, 45);
    doc.text(`Interview Score: ${interviewScore}`, 14, 55);
    doc.text(`Total Interview Marks: ${totalInterviewMarks}`, 14, 65);
    doc.text(`Mains Weight: ${mainsWeight}%`, 14, 75);
    doc.text(`Interview Weight: ${interviewWeight}%`, 14, 85);
    doc.text(`Result: ${result}`, 14, 95);
    doc.text('Breakdown:', 14, 105);
    breakdown.split('\n').forEach((line, idx) => {
      doc.text(line, 18, 115 + idx * 10);
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
                      step="any"
                      value={mainsScore}
                      onChange={e => setMainsScore(e.target.value)}
                      placeholder="Mains Score"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Total Mains Marks</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="any"
                      value={totalMainsMarks}
                      onChange={e => setTotalMainsMarks(e.target.value)}
                      placeholder="Total Mains Marks"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Interview Score</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      value={interviewScore}
                      onChange={e => setInterviewScore(e.target.value)}
                      placeholder="Interview Score"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Total Interview Marks</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="any"
                      value={totalInterviewMarks}
                      onChange={e => setTotalInterviewMarks(e.target.value)}
                      placeholder="Total Interview Marks"
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
                      <Award className="h-8 w-8 text-blue-600 animate-bounce" />
                      <span className="text-4xl font-extrabold text-blue-700 drop-shadow-lg">{result}</span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl p-6 mt-2 text-left shadow-lg border border-blue-200">
                      <div className="font-semibold text-blue-700 mb-2 text-lg flex items-center gap-2">
                        🧮 Calculation Breakdown
                      </div>
                      {breakdown.split('\n').map((line, idx) => (
                        <div key={idx} className="text-gray-800 text-base mb-1 whitespace-pre-line font-mono">{line}</div>
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