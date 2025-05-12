import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import CalculatorBanner from './CalculatorBanner';

const PanValidator = () => {
  const [panNumber, setPanNumber] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState<string>('');

  const validatePAN = () => {
    // PAN format: ABCDE1234F
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    if (!panNumber) {
      setIsValid(false);
      setValidationMessage('Please enter a PAN number');
      return;
    }

    if (panRegex.test(panNumber)) {
      setIsValid(true);
      setValidationMessage('Valid PAN number format');
    } else {
      setIsValid(false);
      setValidationMessage('Invalid PAN number format. Should be in format: ABCDE1234F');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setPanNumber(value);
    setIsValid(null);
    setValidationMessage('');
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <CalculatorBanner />
      <Card className="w-full shadow-lg border border-gst-light-purple/50">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 rounded-full gst-gradient mb-4">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">PAN Validator</h2>
            <p className="text-gray-600 mt-2">Validate your PAN number format</p>
          </div>

          <div className="space-y-6">
            {/* PAN Number Input */}
            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input
                id="panNumber"
                type="text"
                value={panNumber}
                onChange={handleInputChange}
                placeholder="Enter PAN number (e.g., ABCDE1234F)"
                className="uppercase input-focus-effect"
                maxLength={10}
              />
            </div>

            <Button
              onClick={validatePAN}
              className="w-full bg-gradient-to-r from-gst-purple to-gst-secondary-purple hover:opacity-90"
            >
              Validate PAN
            </Button>

            {/* Validation Result */}
            {isValid !== null && (
              <div className={`mt-4 p-4 rounded-lg ${
                isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={isValid ? 'text-green-700' : 'text-red-700'}>
                    {validationMessage}
                  </span>
                </div>
              </div>
            )}

            {/* PAN Format Information */}
            <div className="mt-6 p-4 bg-gst-light-purple/20 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">PAN Number Format:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>First 5 characters are letters (A-Z)</li>
                <li>Next 4 characters are numbers (0-9)</li>
                <li>Last character is a letter (A-Z)</li>
                <li>Example: ABCDE1234F</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PanValidator; 