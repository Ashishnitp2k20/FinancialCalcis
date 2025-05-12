import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is GST and how is it calculated?",
      answer: "GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services in India. It's calculated by applying the applicable GST rate (5%, 12%, 18%, or 28%) to the base amount. Our calculator helps you compute GST both for inclusive and exclusive amounts."
    },
    {
      question: "How is EMI calculated?",
      answer: "EMI (Equated Monthly Installment) is calculated using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is the principal amount, r is the monthly interest rate, and n is the loan tenure in months. Our calculator automatically handles this complex calculation for you."
    },
    {
      question: "What are the current income tax slabs in India?",
      answer: "For FY 2024-25, the income tax slabs are: 0% for income up to ₹3 lakhs, 5% for ₹3-6 lakhs, 10% for ₹6-9 lakhs, 15% for ₹9-12 lakhs, 20% for ₹12-15 lakhs, and 30% for income above ₹15 lakhs. Our tax calculator considers these slabs and available deductions."
    },
    {
      question: "What is the correct format for a PAN number?",
      answer: "A PAN (Permanent Account Number) follows the format: ABCDE1234F, where the first 5 characters are letters (A-Z), the next 4 are numbers (0-9), and the last character is a letter (A-Z). Our PAN validator helps you verify if your PAN number follows this format."
    },
    {
      question: "What deductions can I claim on my income tax?",
      answer: "Common deductions include Standard Deduction (₹50,000), HRA, NPS contributions, Home Loan Interest, and Medical Insurance Premium under Section 80D. Our tax calculator includes these common deductions to help you estimate your tax liability accurately."
    },
    {
      question: "How do I know which GST rate applies to my product/service?",
      answer: "GST rates are determined by the government and vary based on the type of goods or services. Common rates are 5%, 12%, 18%, and 28%. Some items may be exempt (0%) or attract special rates. You can check the GST rate finder on the official GST portal or consult with a tax professional."
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium text-gray-700 hover:text-gst-purple">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ; 