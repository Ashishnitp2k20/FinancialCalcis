import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator, Info, UserCheck } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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

// Add job categories and relaxations
const jobCategories = [
  {
    name: 'UPSC Civil Services',
    code: 'upsc',
    base: { min: 21, max: 32 },
    relaxations: { OBC: 3, 'SC/ST': 5, PWD: 10 },
  },
  {
    name: 'SSC CGL',
    code: 'ssc',
    base: { min: 18, max: 27 },
    relaxations: { OBC: 3, 'SC/ST': 5, PWD: 10 },
  },
  {
    name: 'Bank PO',
    code: 'bank',
    base: { min: 20, max: 30 },
    relaxations: { OBC: 3, 'SC/ST': 5, PWD: 10 },
  },
  // Add more as needed
];
const casteOptions = [
  { label: 'General', value: 'GEN' },
  { label: 'OBC', value: 'OBC' },
  { label: 'SC/ST', value: 'SC/ST' },
  { label: 'PWD', value: 'PWD' },
];

const jobPresets = [
  { label: 'UPSC Civil Services', min: 21, max: 32, relaxOBC: 3, relaxSCST: 5 },
  { label: 'SSC CGL', min: 18, max: 27, relaxOBC: 3, relaxSCST: 5 },
  { label: 'Bank PO', min: 20, max: 30, relaxOBC: 3, relaxSCST: 5 },
];

const PROFILE_KEY = 'ageCalcUserProfile';
const SESSION_KEY = 'ageCalcSession';

const errorMessageStyle = {
  animation: 'blink 1.5s infinite',
  backgroundColor: 'rgba(220, 38, 38, 0.1)', // dark red background
  border: '1px solid rgb(220, 38, 38)',
  borderRadius: '0.375rem',
  padding: '0.75rem',
  marginTop: '0.5rem',
  color: 'rgb(220, 38, 38)',
  fontWeight: '500',
};

const AgeEligibilityCalculator = () => {
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [directAge, setDirectAge] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState(jobCategories[0].code);
  const [selectedCaste, setSelectedCaste] = useState('GEN');
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
  const [referenceDate, setReferenceDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [savedChecks, setSavedChecks] = useState<any[]>([]);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyWhatsApp, setNotifyWhatsApp] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [jobName, setJobName] = useState('');
  const [lowerLimit, setLowerLimit] = useState<number | ''>('');
  const [upperLimit, setUpperLimit] = useState<number | ''>('');
  const [includeRelax, setIncludeRelax] = useState(false);
  const [relaxType, setRelaxType] = useState<'GEN' | 'OBC' | 'SC/ST'>('GEN');
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);

  // Helper to get current job config
  const getJobConfig = () => jobCategories.find(j => j.code === selectedJob)!;
  // Helper to get min/max with relaxation
  const getLimits = () => {
    const job = getJobConfig();
    let min = job.base.min;
    let max = job.base.max;
    if (selectedCaste !== 'GEN' && job.relaxations[selectedCaste]) {
      max += job.relaxations[selectedCaste];
    }
    return { min, max };
  };

  const calculateAge = () => {
    // Validate required fields before calculation
    if (!jobName) {
      setError('Please select a job category');
      return;
    }
    if (typeof lowerLimit !== 'number' || typeof upperLimit !== 'number') {
      setError('Please set both lower and upper age limits');
      return;
    }
    if (!referenceDate) {
      setError('Please set a reference date');
      return;
    }

    if (inputMethod === 'dob') {
      if (!dateOfBirth) {
        setError('Please select your date of birth');
        return;
      }
      const birthDate = new Date(dateOfBirth);
      const refDate = new Date(referenceDate);
      if (isNaN(birthDate.getTime()) || isNaN(refDate.getTime())) {
        setError('Invalid date format');
        return;
      }
      if (birthDate > refDate) {
        setError('Date of birth cannot be after reference date');
        return;
      }
      // Calculate age as of reference date
      let years = refDate.getFullYear() - birthDate.getFullYear();
      let months = refDate.getMonth() - birthDate.getMonth();
      let days = refDate.getDate() - birthDate.getDate();
      if (days < 0) {
        months--;
        const lastMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 0);
        days += lastMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      checkEligibilityStrict(years, months, days);
    } else {
      if (!directAge) {
        setError('Please enter your age');
        return;
      }
      const age = parseInt(directAge);
      if (isNaN(age) || age < 0) {
        setError('Please enter a valid age');
        return;
      }
      checkEligibilityStrict(age, 0, 0);
    }
  };

  // Strict eligibility: reject if over by even 1 day
  const checkEligibilityStrict = (years: number, months: number, days: number) => {
    if (typeof lowerLimit !== 'number' || typeof upperLimit !== 'number' || isNaN(lowerLimit) || isNaN(upperLimit)) {
      setError('Please enter both lower and upper age limits');
      setAgeDetails({ years: 0, months: 0, days: 0, isEligible: false, message: '' });
      return;
    }
    let isEligible = true;
    if (years < lowerLimit) isEligible = false;
    if (
      years > upperLimit ||
      (years === upperLimit && (months > 0 || days > 0))
    ) {
      isEligible = false;
    }
    const message = isEligible
      ? `You are eligible for ${jobName || 'this job'} (${relaxType}${includeRelax && relaxType !== 'GEN' ? ' with relaxation' : ''})`
      : `You are not eligible for ${jobName || 'this job'} (${relaxType}${includeRelax && relaxType !== 'GEN' ? ' with relaxation' : ''}). Age limit: ${lowerLimit}-${upperLimit} years`;
    setAgeDetails({ years, months, days, isEligible, message });
    setError('');
  };

  const resetCalculator = () => {
    setDateOfBirth('');
    setDirectAge('');
    setSelectedJob(jobCategories[0].code);
    setSelectedCaste('GEN');
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

  // Add validation before saving a check
  const handleSaveCheck = () => {
    // Validate required fields
    if (!dateOfBirth && !directAge) {
      setError('Please enter either date of birth or direct age');
      return;
    }
    if (typeof lowerLimit !== 'number' || typeof upperLimit !== 'number') {
      setError('Please set both lower and upper age limits');
      return;
    }
    if (!ageDetails.years && !ageDetails.months && !ageDetails.days) {
      setError('Please calculate age before saving');
      return;
    }
    if (!jobName) {
      setError('Please select a job category');
      return;
    }
    if (!referenceDate) {
      setError('Please set a reference date');
      return;
    }

    // Clear any existing errors
    setError('');
    
    // Proceed with saving if validation passes
    setSavedChecks(prev => [
      ...prev,
      {
        job: getJobConfig().name,
        caste: selectedCaste,
        referenceDate,
        dob: dateOfBirth,
        age: `${ageDetails.years}y ${ageDetails.months}m ${ageDetails.days}d`,
        eligible: ageDetails.isEligible ? 'Eligible' : 'Not Eligible',
        range: `${getLimits().min}-${getLimits().max}`
      }
    ]);
  };
  // Remove a saved check
  const handleRemoveCheck = (idx: number) => {
    setSavedChecks(prev => prev.filter((_, i) => i !== idx));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Age Eligibility Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Job: ${getJobConfig().name}`, 14, 35);
    doc.text(`Category: ${selectedCaste}`, 14, 45);
    doc.text(`Reference Date: ${referenceDate}`, 14, 55);
    doc.text(`Date of Birth: ${dateOfBirth}`, 14, 65);
    doc.text(`Age: ${ageDetails.years} years, ${ageDetails.months} months, ${ageDetails.days} days`, 14, 75);
    doc.text(`Required Age Range: ${getLimits().min}-${getLimits().max} years`, 14, 85);
    doc.text(`Status: ${ageDetails.isEligible ? 'Eligible' : 'Not Eligible'}`, 14, 95);
    doc.text(ageDetails.message, 14, 110);
    doc.save('Age-Eligibility-Report.pdf');
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifyOpen(false);
      setNotifySuccess(false);
      setNotifyEmail('');
      setNotifyWhatsApp('');
    }, 1500);
  };

  // When jobName changes, auto-fill limits if preset
  useEffect(() => {
    const preset = jobPresets.find(p => p.label.toLowerCase() === jobName.toLowerCase());
    if (preset) {
      setLowerLimit(preset.min);
      let max = preset.max;
      if (includeRelax && relaxType !== 'GEN') {
        max += relaxType === 'OBC' ? preset.relaxOBC : preset.relaxSCST;
      }
      setUpperLimit(max);
    }
  }, [jobName, includeRelax, relaxType]);

  // Load session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const session = JSON.parse(saved);
        if (session.jobName) setJobName(session.jobName);
        if (session.lowerLimit !== undefined && session.lowerLimit !== '') setLowerLimit(session.lowerLimit);
        if (session.upperLimit !== undefined && session.upperLimit !== '') setUpperLimit(session.upperLimit);
        if (session.includeRelax !== undefined) setIncludeRelax(session.includeRelax);
        if (session.relaxType) setRelaxType(session.relaxType);
        if (session.inputMethod) setInputMethod(session.inputMethod);
        if (session.dateOfBirth) setDateOfBirth(session.dateOfBirth);
        if (session.directAge) setDirectAge(session.directAge);
        if (session.referenceDate) setReferenceDate(session.referenceDate);
        if (session.ageDetails) setAgeDetails(session.ageDetails);
      } catch {}
    }
    setRestoredFromStorage(true);
  }, []);

  // Improve auto-calculation effect with validation
  useEffect(() => {
    if (!restoredFromStorage) return;
    
    // Only calculate if all required fields are present
    const hasRequiredInput = (dateOfBirth || directAge) && 
      typeof lowerLimit === 'number' && 
      typeof upperLimit === 'number' && 
      referenceDate &&
      jobName;

    if (hasRequiredInput) {
      // Validate dates if using date of birth
      if (inputMethod === 'dob' && dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const refDate = new Date(referenceDate);
        if (isNaN(birthDate.getTime()) || isNaN(refDate.getTime())) {
          setError('Invalid date format');
          return;
        }
        if (birthDate > refDate) {
          setError('Date of birth cannot be after reference date');
          return;
        }
      }
      
      // Validate direct age if using that method
      if (inputMethod === 'direct' && directAge) {
        const age = parseInt(directAge);
        if (isNaN(age) || age < 0) {
          setError('Please enter a valid age');
          return;
        }
      }

      calculateAge();
    } else {
      // Clear results if required fields are missing
      setAgeDetails({
        years: 0,
        months: 0,
        days: 0,
        isEligible: false,
        message: ''
      });
    }
  }, [dateOfBirth, directAge, jobName, lowerLimit, upperLimit, includeRelax, relaxType, inputMethod, referenceDate, restoredFromStorage]);

  // Save profile to localStorage
  const handleSaveProfile = () => {
    const profile = {
      jobName,
      lowerLimit,
      upperLimit,
      includeRelax,
      relaxType,
      inputMethod,
      dateOfBirth,
      directAge,
      referenceDate,
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  };

  // Save all input state and result to localStorage on change
  useEffect(() => {
    const session = {
      jobName,
      lowerLimit,
      upperLimit,
      includeRelax,
      relaxType,
      inputMethod,
      dateOfBirth,
      directAge,
      referenceDate,
      ageDetails,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [jobName, lowerLimit, upperLimit, includeRelax, relaxType, inputMethod, dateOfBirth, directAge, referenceDate, ageDetails]);

  const styles = `
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.6; }
      100% { opacity: 1; }
    }
  `;

  return (
    <div className="flex flex-col items-center w-full gap-4 p-2 md:p-6">
      <style>{styles}</style>
      <CalculatorBanner />
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center text-center mb-4 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gst-light-purple/20 mb-2">
            <UserCheck className="h-8 w-8 text-gst-purple" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Age Eligibility Calculator</h1>
          <p className="text-gray-600 text-base">Check your eligibility for government jobs</p>
        </div>
        <Card className="shadow-lg border border-gray-100">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              {/* Job Category Input with Datalist */}
              <div>
                <Label className="text-sm font-medium">Job Category</Label>
                <input
                  className="input-focus-effect w-full rounded-md border px-3 py-2 mt-1"
                  list="job-presets"
                  value={jobName}
                  onChange={e => setJobName(e.target.value)}
                  placeholder="Type or select a job category"
                />
                <datalist id="job-presets">
                  {jobPresets.map(p => (
                    <option key={p.label} value={p.label} />
                  ))}
                </datalist>
              </div>
              {/* Lower/Upper Age Limit Inputs */}
              <div className="flex gap-2 w-full">
                <div className="flex-1">
                  <Label className="text-xs text-gray-500">Lower Limit</Label>
                  <Input
                    type="number"
                    value={lowerLimit}
                    onChange={e => setLowerLimit(e.target.value ? parseInt(e.target.value) : '')}
                    min={0}
                    placeholder="Min age"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-500">Upper Limit</Label>
                  <Input
                    type="number"
                    value={upperLimit}
                    onChange={e => setUpperLimit(e.target.value ? parseInt(e.target.value) : '')}
                    min={0}
                    placeholder="Max age"
                  />
                </div>
              </div>
              {/* Relaxation Toggle */}
              <div className="flex items-center gap-2">
                <Label className="text-sm">Include Relaxation</Label>
                <input
                  type="checkbox"
                  checked={includeRelax}
                  onChange={e => setIncludeRelax(e.target.checked)}
                  className="h-4 w-4"
                />
                <select
                  className="ml-2 border rounded px-2 py-1"
                  value={relaxType}
                  onChange={e => setRelaxType(e.target.value as any)}
                  disabled={!includeRelax}
                >
                  <option value="GEN">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC/ST">SC/ST</option>
                </select>
              </div>
              {/* Reference Date Input */}
              <div>
                <Label htmlFor="referenceDate" className="text-sm font-medium">Reference Date (Cutoff)</Label>
                <Input
                  id="referenceDate"
                  type="date"
                  value={referenceDate}
                  onChange={e => setReferenceDate(e.target.value)}
                />
              </div>
              {/* Input Method Selection */}
              <div>
                <Label className="text-sm font-medium">Input Method</Label>
                <div className="flex gap-2 mt-1">
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
                <div>
                  <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                    className={error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                  />
                </div>
              )}
              {/* Direct Age Input */}
              {inputMethod === 'direct' && (
                <div>
                  <Label htmlFor="age" className="text-sm font-medium">Age (in years)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={directAge}
                    onChange={e => setDirectAge(e.target.value)}
                    className={error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                    min="0"
                  />
                </div>
              )}
              {/* Save & Compare Buttons, Summary, etc. (unchanged) */}
              <div className="flex gap-2">
                <Button onClick={handleSaveCheck} variant="secondary" className="flex-1">Save This Check</Button>
                <Button variant="outline" onClick={resetCalculator} className="flex-1">Reset Calculator</Button>
              </div>
              <div className="mt-6 p-4 rounded-lg relative" style={{ background: ageDetails.isEligible ? 'rgba(155, 135, 245, 0.08)' : 'rgba(255, 0, 0, 0.05)' }}>
                {/* Export as PDF button in top right */}
                <Button onClick={handleExportPDF} variant="outline" className="absolute top-3 right-3">Export as PDF</Button>
                <h3 className="font-bold text-lg mb-2">Summary</h3>
                <div className="mb-2 text-gray-700">
                  Your age: <b>{ageDetails.years}</b> years, <b>{ageDetails.months}</b> months, <b>{ageDetails.days}</b> days
                </div>
                <div className="mb-2 text-gray-700">
                  Required age range: {lowerLimit}-{upperLimit} years
                </div>
                <div className={ageDetails.isEligible ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  Status: {ageDetails.isEligible ? '✅ Eligible' : '❌ Not Eligible'}
                </div>
                <div className="mt-2 text-gray-600 text-sm">{ageDetails.message}</div>
              </div>
              {savedChecks.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold mb-2">Saved Eligibility Checks</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border rounded-lg">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1">Job</th>
                          <th className="px-2 py-1">Category</th>
                          <th className="px-2 py-1">Reference Date</th>
                          <th className="px-2 py-1">DOB</th>
                          <th className="px-2 py-1">Age</th>
                          <th className="px-2 py-1">Range</th>
                          <th className="px-2 py-1">Status</th>
                          <th className="px-2 py-1">Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedChecks.map((row, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="px-2 py-1">{row.job}</td>
                            <td className="px-2 py-1">{row.caste}</td>
                            <td className="px-2 py-1">{row.referenceDate}</td>
                            <td className="px-2 py-1">{row.dob}</td>
                            <td className="px-2 py-1">{row.age}</td>
                            <td className="px-2 py-1">{row.range}</td>
                            <td className={row.eligible === 'Eligible' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{row.eligible}</td>
                            <td className="px-2 py-1">
                              <Button size="sm" variant="ghost" onClick={() => handleRemoveCheck(idx)}>Remove</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {error && (
                <div style={errorMessageStyle} role="alert">
                  {error}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notify Me for Upcoming Jobs</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whatsapp" className="text-right">
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                value={notifyWhatsApp}
                onChange={(e) => setNotifyWhatsApp(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleNotifySubmit}>Notify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgeEligibilityCalculator; 