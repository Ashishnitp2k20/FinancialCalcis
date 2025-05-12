import CalculatorBanner from './CalculatorBanner';

const LoanComparisonCalculator = () => {
  // ... existing state and functions ...

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <CalculatorBanner />
      <Card className="w-full shadow-lg border border-gst-light-purple/50">
        // ... rest of the component code ...
      </Card>
    </div>
  );
};

export default LoanComparisonCalculator; 