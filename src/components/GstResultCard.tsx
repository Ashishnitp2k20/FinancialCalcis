
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clipboard, Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import jsPDF from 'jspdf';

interface GstResultCardProps {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  gstRate: number;
  isInclusive: boolean;
}

const GstResultCard: React.FC<GstResultCardProps> = ({
  baseAmount,
  gstAmount,
  totalAmount,
  gstRate,
  isInclusive
}) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Copy results to clipboard
  const copyToClipboard = () => {
    const resultText = `
Actual Amount: ${formatCurrency(baseAmount)}
GST (${gstRate}%): ${formatCurrency(gstAmount)}
Total Amount: ${formatCurrency(totalAmount)}
GST Type: ${isInclusive ? 'Inclusive' : 'Exclusive'}
    `.trim();

    navigator.clipboard.writeText(resultText)
      .then(() => {
        toast.success('Results copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy results');
      });
  };

  // Generate and download PDF report
  const downloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Add title and styling
    pdf.setFillColor(155, 135, 245); // Light purple background
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255); // White text
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GST Calculation Report', pageWidth / 2, 25, { align: 'center' });
    
    // Reset text color for content
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    // Add date
    const currentDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Date: ${currentDate}`, 20, 50);
    
    // Add calculation details
    pdf.setFont('helvetica', 'bold');
    pdf.text('Calculation Details:', 20, 65);
    pdf.setFont('helvetica', 'normal');
    
    const startY = 75;
    const lineHeight = 10;
    
    pdf.text(`Actual Amount: ${formatCurrency(baseAmount)}`, 30, startY);
    pdf.text(`GST Rate: ${gstRate}%`, 30, startY + lineHeight);
    pdf.text(`GST Amount: ${formatCurrency(gstAmount)}`, 30, startY + 2 * lineHeight);
    pdf.text(`Total Amount: ${formatCurrency(totalAmount)}`, 30, startY + 3 * lineHeight);
    pdf.text(`Calculation Type: ${isInclusive ? 'GST Inclusive' : 'GST Exclusive'}`, 30, startY + 4 * lineHeight);
    
    // Add footer
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text('Generated using GST Calculator', pageWidth / 2, 270, { align: 'center' });
    
    // Save the PDF
    pdf.save('GST-Calculation-Report.pdf');
    
    toast.success('PDF report downloaded!');
  };

  return (
    <Card className="w-full result-card shadow-lg border border-gst-light-purple/50 animate-scale-in">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Calculation Results</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="text-gst-secondary-purple border-gst-light-purple hover:bg-gst-light-purple/50"
            >
              <Clipboard className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadPDF}
              className="text-gst-secondary-purple border-gst-light-purple hover:bg-gst-light-purple/50"
            >
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gst-light-purple/30">
            <span className="text-gray-600">Actual Amount:</span>
            <span className="font-medium">{formatCurrency(baseAmount)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gst-light-purple/30">
            <span className="text-gray-600">GST ({gstRate}%):</span>
            <span className="font-medium text-gst-secondary-purple">{formatCurrency(gstAmount)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gst-light-purple/30">
            <span className="text-gray-600">Calculation Type:</span>
            <span className="px-2 py-1 bg-gst-light-purple/50 text-gst-secondary-purple text-xs rounded-full">
              {isInclusive ? 'Inclusive' : 'Exclusive'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-3 mt-2">
            <span className="text-gray-800 font-semibold">Total Amount:</span>
            <span className="text-lg font-bold text-gst-purple">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GstResultCard;
