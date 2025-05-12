# Financial Calculator Pro

A comprehensive financial calculator application built with React, TypeScript, and Tailwind CSS. This application provides various financial calculation tools to help users make informed financial decisions.

## Author

**Ashish Kumar**

## Features

- **GST Calculator**: Calculate GST amounts with support for both inclusive and exclusive calculations
- **EMI Calculator**: Calculate monthly EMI payments for loans
- **Tax Estimator**: Estimate income tax based on the latest tax slabs
- **PAN Validator**: Validate PAN card numbers
- **Loan Eligibility Calculator**: Check your maximum eligible loan amount
- **Loan Comparison Calculator**: Compare different loan options
- **FD/RD Calculator**: Calculate returns on Fixed and Recurring Deposits
- **PPF/EPF Calculator**: Calculate corpus growth for PPF and EPF investments

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Shadcn UI Components
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ashishnitp2k20/FinancialCalcis.git
cd FinancialCalcis
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Shadcn UI components
│   └── ...            # Calculator components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── styles/            # Global styles
```

## Features in Detail

### GST Calculator
- Calculate GST for both inclusive and exclusive amounts
- Support for multiple GST rates (5%, 12%, 18%, 28%)
- Real-time calculations
- Clear breakdown of base amount, GST amount, and total

### EMI Calculator
- Calculate monthly EMI payments
- Adjustable loan amount, interest rate, and tenure
- Detailed breakdown of principal and interest components
- Total interest and amount calculations

### Tax Estimator
- Calculate tax based on latest tax slabs
- Support for various deductions
- Effective tax rate calculation
- Detailed tax slab-wise breakdown

### PAN Validator
- Validate PAN card number format
- Real-time validation
- Clear error messages
- Format guidelines

### Loan Calculators
- Loan eligibility calculation based on income and existing EMIs
- Loan comparison with different parameters
- Detailed EMI breakdown
- Interest and principal component analysis

### Investment Calculators
- FD/RD maturity amount calculation
- PPF/EPF corpus growth projection
- Support for different compounding frequencies
- Detailed year-wise breakdown

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide Icons](https://lucide.dev/) for the icons
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
