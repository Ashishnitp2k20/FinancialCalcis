import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

const STORAGE_KEY = 'timeDurationCalcState';

const TimeDurationCalculator = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [duration, setDuration] = useState<{
    years: number;
    months: number;
    days: number;
  }>({ years: 0, months: 0, days: 0 });
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setStartDate(state.startDate || '');
        setEndDate(state.endDate || '');
        setDuration(state.duration || { years: 0, months: 0, days: 0 });
        setShowResult(state.showResult || false);
      } catch (e) {
        console.error('Error loading saved state:', e);
      }
    }
  }, []);

  // Save state when it changes
  useEffect(() => {
    const state = {
      startDate,
      endDate,
      duration,
      showResult,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [startDate, endDate, duration, showResult]);

  const calculateDuration = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      setShowResult(false);
      setDuration({ years: 0, months: 0, days: 0 });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Invalid date format');
      setShowResult(false);
      setDuration({ years: 0, months: 0, days: 0 });
      return;
    }

    if (end < start) {
      setError('End date cannot be before start date');
      setShowResult(false);
      setDuration({ years: 0, months: 0, days: 0 });
      return;
    }

    // Calculate the difference in years, months, and days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setDuration({ years, months, days });
    setError('');
    setShowResult(true);
  };

  useEffect(() => {
    if (startDate && endDate) {
      calculateDuration();
    } else {
      setShowResult(false);
      setDuration({ years: 0, months: 0, days: 0 });
      setError('');
    }
  }, [startDate, endDate]);

  const reset = () => {
    setStartDate('');
    setEndDate('');
    setDuration({ years: 0, months: 0, days: 0 });
    setShowResult(false);
    setError('');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Time Duration Calculator Result', 14, 20);
    doc.setFontSize(12);
    doc.text(`Start Date: ${startDate}`, 14, 35);
    doc.text(`End Date: ${endDate}`, 14, 45);
    doc.text(`Duration: ${duration.years} years, ${duration.months} months, ${duration.days} days`, 14, 55);
    doc.save('Time-Duration-Calculator-Result.pdf');
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <CalculatorBanner />
      <div className="w-full max-w-xl">
        <Card className="rounded-2xl shadow-md border border-gray-100 bg-white">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-8">
              {/* Section: Title */}
              <div className="text-center mb-2 animate-fade-in">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 mb-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Time Duration Calculator</h1>
                <p className="text-gray-600">Calculate your experience duration</p>
              </div>

              {/* Section: Select Dates */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Select Dates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                    <div className="relative flex items-center">
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={`pr-10 ${error && !startDate ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        aria-invalid={!!error && !startDate}
                        aria-describedby="startDate-error"
                      />
                      <Calendar className="absolute right-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  {/* End Date */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                    <div className="relative flex items-center">
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={`pr-10 ${error && !endDate ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        aria-invalid={!!error && !endDate}
                        aria-describedby="endDate-error"
                      />
                      <Calendar className="absolute right-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Result */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Duration</h2>
                {showResult && !error && (
                  <>
                  <div
                    className="mt-2 p-5 rounded-2xl bg-green-50 border border-green-100 shadow-sm animate-fade-in"
                    style={{ transition: 'opacity 0.5s' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-2">
                      <span className="text-2xl font-bold text-green-700">
                        {duration.years} <span className="font-normal text-base">{duration.years === 1 ? 'year' : 'years'}</span>
                      </span>
                      <span className="text-2xl font-bold text-green-700">
                        {duration.months} <span className="font-normal text-base">{duration.months === 1 ? 'month' : 'months'}</span>
                      </span>
                      <span className="text-2xl font-bold text-green-700">
                        {duration.days} <span className="font-normal text-base">{duration.days === 1 ? 'day' : 'days'}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button type="button" variant="outline" onClick={reset}>Reset</Button>
                    <Button type="button" variant="secondary" onClick={handleExportPDF}>Export as PDF</Button>
                  </div>
                  </>
                )}
                {error && (
                  <div className="mt-2 p-5 rounded-2xl bg-red-50 border border-red-100 shadow-sm animate-fade-in">
                    <p className="text-red-600 text-base font-medium" id="startDate-error">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeDurationCalculator; 