# GourmetOS - Luxury Restaurant Management Terminal

GourmetOS is a sophisticated, full-stack restaurant management system designed for high-end culinary establishments. It features a dark, luxurious aesthetic with specialized terminals for Admins, Managers, Chefs, and Cashiers.

## Features

- **Executive Dashboard**: Real-time sales intelligence and operational overview.
- **Neural Insights**: AI-powered sales analysis and recommendations using Google Gemini.
- **Culinary Inventory**: Detailed menu management with category-specific views.
- **Live Operations**: Real-time order tracking and status management.
- **Guest Ledger**: Comprehensive table reservation system with guest details.
- **Stock Cellar**: Inventory management with low-stock alerts.

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Motion (formerly Framer Motion).
- **Backend**: Express.js (Node.js).
- **Icons**: Lucide React.
- **Charts**: Recharts.
- **AI**: Google Gemini API.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Gemini API Key.

### Development

Start the development server:
```bash
npm run dev
```

### Production Build

Build the application for production:
```bash
npm run build
```
Start the production server:
```bash
npm start
```

## Deployment to AWS Amplify

This project is optimized for deployment on **AWS Amplify Hosting**.

### Steps to Publish:

1.  **Connect to GitHub**: Link your repository to AWS Amplify in the [AWS Console](https://console.aws.amazon.com/amplify).
2.  **Zero Configuration**: The application is designed to be "plug-and-play". It automatically detects if a server or API keys are missing and falls back to a high-fidelity local simulation mode.
3.  **Optional AI Acceleration**:
    -   To enable live AI insights, add `GEMINI_API_KEY` to your environment variables in the Amplify console.
    -   If omitted, the app will use sophisticated pre-cached insights to maintain the "luxury terminal" experience.
4.  **Redirects (SPA Support)**:
    -   In the Amplify console, go to **App Settings > Rewrites and redirects**.
    -   Add a rule to redirect all routes to `index.html` for true Single Page Application (SPA) support.

### Full-Stack Intelligence:
The app uses a hybrid `DataService` that seamlessly transitions between real backend responses and consistent browser-local state, ensuring your data persists even without a database.
