# Sign Language Translation Application

## Overview

This project is a web-based Sign Language Translation application designed to facilitate communication and learning. It leverages modern web technologies to provide features such as real-time sign language input, translation result display, learning modules, and performance tracking.

## Features

- **Intuitive User Interface:** Built with Shadcn UI components for a modern and responsive design.
- **Real-time Camera Input:** `CameraInputArea.tsx` likely handles camera feeds for sign language recognition.
- **Translation Results:** `ResultsPanel.tsx` displays the interpreted sign language.
- **Language Selection:** `LanguageSelectionPanel.tsx` allows users to choose different sign languages.
- **Learning Modules:** The `Learn` page and components like `LearningProgressPanel.tsx` suggest features for learning sign language.
- **Performance Tracking:** `ModelPerformancePanel.tsx` and `SessionProgressPanel.tsx` help monitor translation accuracy and user progress.
- **Navigation:** Seamless navigation between Home, Learn, Settings, and About pages using `react-router-dom`.
- **Global State Management:** Efficient state handling with `zustand`.
- **Data Fetching:** Robust data management using `@tanstack/react-query`.
- **Theming:** Supports dark and light modes for personalized user experience.

## Technologies Used

- **Frontend Framework:** React.js
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Library:** Shadcn UI
- **Styling:** Tailwind CSS, PostCSS
- **State Management:** Zustand
- **Routing:** React Router DOM
- **Data Fetching/Caching:** React Query
- **Icons:** Lucide React
- **Form Handling:** React Hook Form
- **Schema Validation:** Zod
- **Date Utilities:** Date-fns
- **Theming:** next-themes

## Installation

To set up the project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/Sign-Language-Translation.git
    cd Sign-Language-Translation
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using bun:
    ```bash
    bun install
    ```

## Usage

1.  **Run the development server:**
    Using npm:

    ```bash
    npm run dev
    ```

    Or using bun:

    ```bash
    bun run dev
    ```

    The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

2.  **Build for production:**
    Using npm:
    ```bash
    npm run build
    ```
    Or using bun:
    ```bash
    bun run build
    ```
    This will create a `dist` folder with the production-ready build.

## Project Structure

```
.
├── public/                     # Static assets (favicon, robots.txt, etc.)
├── src/                        # Main application source code
│   ├── components/             # Reusable UI components
│   │   ├── camera/             # Components for camera input
│   │   │   └── CameraInputArea.tsx
│   │   ├── demo/               # Demo-related components
│   │   │   └── SeedDataInitializer.tsx
│   │   ├── language/           # Components for language selection
│   │   │   └── LanguageSelectionPanel.tsx
│   │   ├── layout/             # Layout components (Header, Footer, Layout)
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── results/            # Components to display translation results
│   │   │   └── ResultsPanel.tsx
│   │   ├── stats/              # Components for tracking learning & model performance
│   │   │   ├── LearningProgressPanel.tsx
│   │   │   ├── ModelPerformancePanel.tsx
│   │   │   └── SessionProgressPanel.tsx
│   │   └── ui/                 # Shadcn UI components
│   │       └── ... (various UI components like button, card, dialog, etc.)
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useTheme.ts
│   ├── lib/                    # Utility functions
│   │   └── utils.ts
│   ├── pages/                  # Top-level page components
│   │   ├── About.tsx
│   │   ├── Home.tsx
│   │   ├── Learn.tsx
│   │   ├── NotFound.tsx
│   │   └── Settings.tsx
│   ├── services/               # API interaction and data fetching logic
│   │   └── mockServices.ts
│   ├── store/                  # Zustand store for global state management
│   │   └── useAppStore.ts
│   ├── App.css                 # Global CSS for the application
│   ├── App.tsx                 # Main application component, handles routing
│   ├── index.css               # Base CSS
│   └── main.tsx                # Entry point for the React application
├── .eslintrc.js                # ESLint configuration
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
└── package.json                # Project dependencies and scripts
```
