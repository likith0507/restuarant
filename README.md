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
2.  **Build Settings**: Amplify will automatically detect the `amplify.yml` file. Ensure the "Build Image" supports Node.js 18 or higher.
3.  **Environment Variables**: 
    -   In the Amplify console, go to **App Settings > Environment Variables**.
    -   Add `GEMINI_API_KEY` with your Google Gemini API key.
4.  **Redirects (SPA Support)**:
    -   Go to **App Settings > Rewrites and redirects**.
    -   Add a rule: `Source address: </^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)(.*)/>`, `Target address: /index.html`, `Type: 200 (Rewrite)`. This ensures refreshes on sub-routes don't return 404.

### Note on Full-Stack Logic:
In a static hosting environment like Amplify Hosting, the custom Express server (`server.ts`) does not run. The application uses a built-in `DataService` that:
1.  Attempts to call the local API.
2.  Falls back to `localStorage` and mock data if the API is unreachable, ensuring a fully functional demo experience.
