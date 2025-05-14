import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator, Info } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const defaultAgeLimits = {
  general: { min: 18, max: 30 },
  obc: { min: 18, max: 33 },
  sc: { min: 18, max: 35 },
  st: { min: 18, max: 35 },
  pwd: { min: 18, max: 40 },
};

const categoryDescriptions = {
  general: "General category with standard age limits",
  obc: "Other Backward Classes with relaxed upper age limit",
  sc: "Scheduled Castes with relaxed upper age limit",
  st: "Scheduled Tribes with relaxed upper age limit",
  pwd: "Persons with Disabilities with maximum age relaxation",
};

const AgeEligibilityCalculator = () => {
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [directAge, setDirectAge] = useState<string>('');
  const [jobCategory, setJobCategory] = useState<string>('general');
  const [customLimits, setCustomLimits] = useState<{ min: number; max: number } | null>(null);
  const [ageDetails, setAgeDetails] = useState<{
    years: number;
    months: number;
    days: number;
    isEligible: boolean;
    message: string;
  }>({
    years: 0,
    months: 0,
    days: 0,
    isEligible: false,
    message: '',
  });
  const [error, setError] = useState<string>('');
  const [inputMethod, setInputMethod] = useState<'dob' | 'direct'>('dob');

  const calculateAge = () => {
    if (inputMethod === 'dob') {
      if (!dateOfBirth) {
        setError('Please select your date of birth');
        return;
      }

      const birthDate = new Date(dateOfBirth);
      const today = new Date();

      if (isNaN(birthDate.getTime())) {
        setError('Invalid date format');
        return;
      }

      if (birthDate > today) {
        setError('Date of birth cannot be in the future');
        return;
      }

      // Calculate age
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();

      // Adjust for negative months or days
      if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      checkEligibility(years);
    } else {
      const age = parseInt(directAge);
      if (isNaN(age) || age < 0) {
        setError('Please enter a valid age');
        return;
      }
      checkEligibility(age);
    }
  };

  const checkEligibility = (years: number) => {
    const category = jobCategory as keyof typeof defaultAgeLimits;
    const limits = customLimits || defaultAgeLimits[category];
    const isEligible = years >= limits.min && years <= limits.max;
    const message = isEligible
      ? `You are eligible for ${category.toUpperCase()} category jobs`
      : `You are not eligible for ${category.toUpperCase()} category jobs. Age limit: ${limits.min}-${limits.max} years`;

    setAgeDetails({
      years,
      months: 0,
      days: 0,
      isEligible,
      message,
    });
    setError('');
  };

  const handleCategoryChange = (value: string) => {
    setJobCategory(value);
    setCustomLimits(null); // Reset custom limits when category changes
  };

  const resetCalculator = () => {
    setDateOfBirth('');
    setDirectAge('');
    setJobCategory('general');
    setCustomLimits(null);
    setAgeDetails({
      years: 0,
      months: 0,
      days: 0,
      isEligible: false,
      message: '',
    });
    setError('');
  };

  useEffect(() => {
    if (dateOfBirth || directAge) {
      calculateAge();
    }
  }, [dateOfBirth, directAge, jobCategory, customLimits]);

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <CalculatorBanner />
      <div className="w-full max-w-xl">
        <div className="p-4 md:p-6 w-full">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-100 mb-4">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Age Eligibility Calculator</h1>
            <p className="text-gray-600">Check your eligibility for government jobs</p>
          </div>

          <Card className="shadow-lg border border-gray-100">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Input Method Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Input Method</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={inputMethod === 'dob' ? 'default' : 'outline'}
                      onClick={() => setInputMethod('dob')}
                      className="flex-1"
                    >
                      Date of Birth
                    </Button>
                    <Button
                      variant={inputMethod === 'direct' ? 'default' : 'outline'}
                      onClick={() => setInputMethod('direct')}
                      className="flex-1"
                    >
                      Direct Age
                    </Button>
                  </div>
                </div>

                {/* Date of Birth Input */}
                {inputMethod === 'dob' && (
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-sm font-medium">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className={error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                    />
                  </div>
                )}

                {/* Direct Age Input */}
                {inputMethod === 'direct' && (
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">
                      Age (in years)
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={directAge}
                      onChange={(e) => setDirectAge(e.target.value)}
                      className={error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                      min="0"
                    />
                  </div>
                )}

                {/* Category Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Job Category
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select your category to see applicable age limits</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={jobCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(defaultAgeLimits).map(([key, limits]) => (
                        <SelectItem key={key} value={key}>
                          {key.toUpperCase()} ({limits.min}-{limits.max} years)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Age Limits */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Custom Age Limits (Optional)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minAge" className="text-xs text-gray-500">
                        Lower Limit
                      </Label>
                      <Input
                        id="minAge"
                        type="number"
                        value={customLimits?.min || ''}
                        onChange={(e) => {
                          const min = parseInt(e.target.value);
                          setCustomLimits(prev => ({
                            min: min || defaultAgeLimits[jobCategory as keyof typeof defaultAgeLimits].min,
                            max: prev?.max || defaultAgeLimits[jobCategory as keyof typeof defaultAgeLimits].max
                          }));
                        }}
                        min="0"
                        placeholder={`Min: ${defaultAgeLimits[jobCategory as keyof typeof defaultAgeLimits].min}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxAge" className="text-xs text-gray-500">
                        Upper Limit
                      </Label>
                      <Input
                        id="maxAge"
                        type="number"
                        value={customLimits?.max || ''}
                        onChange={(e) => {
                          const max = parseInt(e.target.value);
                          setCustomLimits(prev => ({
                            min: prev?.min || defaultAgeLimits[jobCategory as keyof typeof defaultAgeLimits].min,
                            max: max || defaultAgeLimits[jobCategory as keyof typeof defaultAgeLimits].max
                          }));
                        }}
                        min="0"
                        placeholder={`Max: ${defaultAgeLimits[jobCategory as keyof typeof defaultAgeLimits].max}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={resetCalculator}
                  className="w-full"
                >
                  Reset Calculator
                </Button>

                {/* Result Display */}
                {ageDetails.years > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2">Summary</h3>
                      <div className="space-y-2">
                        <p className="text-lg text-purple-600">
                          Your age: <span className="font-bold">{ageDetails.years}</span> years
                          {ageDetails.months > 0 && ` ${ageDetails.months} months`}
                          {ageDetails.days > 0 && ` ${ageDetails.days} days`}
                        </p>
                        <p className="text-lg text-purple-600">
                          Required age range: <span className="font-bold">
                            {customLimits ? `${customLimits.min}-${customLimits.max}` : 
                             `${defaultAgeLimits[jobCategory as keyof typeof defaultAgeLimits].min}-${defaultAgeLimits[jobCategory as keyof typeof defaultAgeLimits].max}`}
                          </span> years
                        </p>
                        <p className="text-lg text-purple-600">
                          Status: <span className={`font-bold ${ageDetails.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                            {ageDetails.isEligible ? '✅ Eligible' : '❌ Not Eligible'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${ageDetails.isEligible ? 'bg-green-50' : 'bg-red-50'}`}>
                      <h3 className="text-lg font-semibold mb-2">
                        {ageDetails.isEligible ? 'Eligibility Status' : 'Not Eligible'}
                      </h3>
                      <p className={`text-lg ${ageDetails.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                        {ageDetails.message}
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgeEligibilityCalculator; 