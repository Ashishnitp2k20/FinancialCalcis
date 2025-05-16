import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';
import jsPDF from 'jspdf';

const MODES = [
  {
    key: 'percentOf',
    label: 'What is X% of Y?',
    summary: (x: string, y: string, result: string) => `${x}% of ${y} = ${result}`,
  },
  {
    key: 'isWhatPercent',
    label: 'X is what percent of Y?',
    summary: (x: string, y: string, result: string) => `${x} is ${result}% of ${y}`,
  },
  {
    key: 'increaseDecrease',
    label: 'What is the % increase/decrease from X to Y?',
    summary: (x: string, y: string, result: string) => `Change from ${x} to ${y} = ${result}`,
  },
];

const STORAGE_KEY = 'percentageCalcState';

const PercentageCalculator = () => {
  const [mode, setMode] = useState('percentOf');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [result, setResult] = useState<string>('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setMode(state.mode || 'percentOf');
        setInput1(state.input1 || '');
        setInput2(state.input2 || '');
        setResult(state.result || '');
        setSummary(state.summary || '');
        setShowResult(state.showResult || false);
      } catch (e) {
        console.error('Error loading saved state:', e);
      }
    }
  }, []);

  // Save state when it changes
  useEffect(() => {
    const state = {
      mode,
      input1,
      input2,
      result,
      summary,
      showResult,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [mode, input1, input2, result, summary, showResult]);

  const reset = () => {
    setInput1('');
    setInput2('');
    setResult('');
    setSummary('');
    setError('');
    setShowResult(false);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResult(false);
    let x = parseFloat(input1);
    let y = parseFloat(input2);
    if (isNaN(x) || isNaN(y)) {
      setError('Please enter valid numbers.');
      return;
    }
    if (x < 0 || y < 0) {
      setError('Values must be non-negative.');
      return;
    }
    let res = '';
    let sum = '';
    if (mode === 'percentOf') {
      res = (y * x / 100).toFixed(2);
      sum = MODES[0].summary(x.toString(), y.toString(), res);
    } else if (mode === 'isWhatPercent') {
      if (y === 0) {
        setError('Cannot divide by zero.');
        return;
      }
      res = ((x / y) * 100).toFixed(2);
      sum = MODES[1].summary(x.toString(), y.toString(), res);
    } else if (mode === 'increaseDecrease') {
      if (x === 0) {
        setError('Cannot divide by zero.');
        return;
      }
      const percent = ((y - x) / Math.abs(x)) * 100;
      res = `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
      sum = MODES[2].summary(x.toString(), y.toString(), res);
    }
    setResult(res);
    setSummary(sum);
    setShowResult(true);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Percentage Calculator Result', 14, 20);
    doc.setFontSize(12);
    doc.text(`Mode: ${MODES.find(m => m.key === mode)?.label || ''}`, 14, 35);
    doc.text(`Input 1: ${input1}`, 14, 45);
    doc.text(`Input 2: ${input2}`, 14, 55);
    doc.text(`Result: ${result}`, 14, 65);
    doc.text(`Summary: ${summary}`, 14, 75);
    doc.save('Percentage-Calculator-Result.pdf');
  };

  // Dynamic input placeholders and labels
  const getInputs = () => {
    switch (mode) {
      case 'percentOf':
        return [
          {
            label: 'What is',
            value: input1,
            onChange: (e: any) => setInput1(e.target.value),
            placeholder: 'X (percent)',
            after: '% of',
          },
          {
            label: '',
            value: input2,
            onChange: (e: any) => setInput2(e.target.value),
            placeholder: 'Y (value)',
            after: '?',
          },
        ];
      case 'isWhatPercent':
        return [
          {
            label: '',
            value: input1,
            onChange: (e: any) => setInput1(e.target.value),
            placeholder: 'X (value)',
            after: 'is what percent of',
          },
          {
            label: '',
            value: input2,
            onChange: (e: any) => setInput2(e.target.value),
            placeholder: 'Y (value)',
            after: '?',
          },
        ];
      case 'increaseDecrease':
        return [
          {
            label: 'What is the percentage increase/decrease',
            value: input1,
            onChange: (e: any) => setInput1(e.target.value),
            placeholder: 'From (X)',
            after: 'to',
          },
          {
            label: '',
            value: input2,
            onChange: (e: any) => setInput2(e.target.value),
            placeholder: 'To (Y)',
            after: '?',
          },
        ];
      default:
        return [];
    }
  };

  const inputFields = getInputs();

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <CalculatorBanner />
      <div className="w-full max-w-xl">
        <Card className="shadow-md border border-gray-100 rounded-2xl bg-white">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-8">
              {/* Title */}
              <div className="text-center animate-fade-in">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Percentage Calculator</h1>
                <p className="text-gray-600">Quickly solve all your percentage problems</p>
              </div>

              {/* Mode Selector */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center w-full">
                {MODES.map((m) => (
                  <button
                    key={m.key}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 border text-sm sm:text-base w-full sm:w-auto
                      ${mode === m.key ? 'bg-blue-600 text-white shadow' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50'}`}
                    onClick={() => {
                      setMode(m.key);
                      reset();
                    }}
                    type="button"
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Calculator Form */}
              <form onSubmit={handleCalculate} className="space-y-6 transition-all duration-300">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap sm:flex-row flex-row items-center gap-2 sm:gap-4 w-full justify-center">
                    {/* Input 1 */}
                    {inputFields[0] && (
                      <>
                        {inputFields[0].label && (
                          <span className="text-gray-700 text-base sm:text-lg whitespace-nowrap mb-1 sm:mb-0">{inputFields[0].label}</span>
                        )}
                        <Input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={inputFields[0].value}
                          onChange={inputFields[0].onChange}
                          placeholder={inputFields[0].placeholder}
                          className="w-24 sm:w-32 text-center flex-shrink"
                        />
                        {inputFields[0].after && (
                          <span className="text-gray-700 text-base sm:text-lg whitespace-nowrap mb-1 sm:mb-0">{inputFields[0].after}</span>
                        )}
                      </>
                    )}
                    {/* Input 2 */}
                    {inputFields[1] && (
                      <>
                        <Input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={inputFields[1].value}
                          onChange={inputFields[1].onChange}
                          placeholder={inputFields[1].placeholder}
                          className="w-24 sm:w-32 text-center flex-shrink"
                        />
                        {inputFields[1].after && (
                          <span className="text-gray-700 text-base sm:text-lg whitespace-nowrap mb-1 sm:mb-0">{inputFields[1].after}</span>
                        )}
                      </>
                    )}
                    <Button
                      type="submit"
                      className="w-full sm:w-auto mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200"
                    >
                      CALCULATE
                    </Button>
                  </div>
                </div>
              </form>

              {/* Result & Summary */}
              <div className="min-h-[60px] transition-all duration-300">
                {showResult && !error && (
                  <div className={`p-4 mt-2 rounded-xl text-center shadow-sm transition-all duration-300
                    ${mode === 'increaseDecrease' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}
                  >
                    <div className="text-2xl font-bold">{result}</div>
                    <div className="text-base mt-1 text-gray-700">{summary}</div>
                  </div>
                )}
                {error && (
                  <div className="p-4 mt-2 rounded-xl text-center bg-red-50 text-red-700 font-medium shadow-sm animate-fade-in">
                    {error}
                  </div>
                )}
                {/* New Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={reset}>Reset</Button>
                  <Button type="button" variant="secondary" onClick={handleExportPDF}>Export as PDF</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PercentageCalculator; 