# Bookkeeper Frontend

This repository contains the frontend code for **Bookkeeper**, a personal finance management application built with modern React architecture and best practices.

## 🏛️ Architecture Overview

### Frontend Architecture
The application follows a modern React architecture with clear separation of concerns:

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.js    # Main navigation component
│   ├── DashboardCharts.js  # Chart visualization component
│   ├── InvestmentWidgets.js # Investment display widgets
│   ├── HouseholdManager.js  # Household management functionality
│   ├── Onboard.js       # User onboarding flow
│   └── BreakupWizard.js # Account separation wizard
├── hooks/               # Custom React hooks
│   └── useFetch.js      # Data fetching hook with API integration
├── pages/               # Route-based page components
│   ├── Dashboard.js     # Main dashboard view
│   ├── Accounts.js      # Account management
│   ├── Budgets.js       # Budget planning and tracking
│   ├── Transactions.js  # Transaction history and management
│   ├── Investments.js   # Investment portfolio
│   ├── Goals.js         # Financial goals tracking
│   ├── Settings.js      # User settings and preferences
│   ├── Login.js         # Authentication
│   └── Upgrade.js       # Subscription management
├── theme/               # Material UI theme configuration
│   └── theme.js         # Centralized theme settings
├── utils/               # Utility functions and configurations
│   └── api.js           # Centralized API configuration with interceptors
├── store.js             # Zustand state management
├── App.js               # Main application component with routing
├── index.js             # Application entry point with providers
├── index.css            # Global styles
└── setupTests.js        # Jest testing configuration
```

### Key Architectural Patterns

- **Component Architecture**: Follows React functional components with hooks pattern
- **State Management**: Uses Zustand for global state management with minimal boilerplate
- **API Layer**: Centralized API configuration with Axios interceptors for authentication and error handling
- **Theming**: Material UI theme system for consistent design language
- **Routing**: React Router for declarative routing
- **Testing**: Jest and React Testing Library setup for comprehensive testing
- **Code Quality**: ESLint and Prettier for consistent code formatting and quality

### Data Flow
1. **API Requests**: Centralized through `src/utils/api.js` with automatic token handling
2. **State Management**: Global state managed by Zustand store (`store.js`)
3. **Data Fetching**: Custom `useFetch` hook provides consistent data loading patterns
4. **UI Components**: Material UI components with custom theme integration

## 🚀 Tech Stack

- [React](https://react.dev/) - UI library
- [Material UI (MUI)](https://mui.com/) - Component library and design system
- [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- [Axios](https://axios-http.com/) - HTTP client with interceptors
- [React Router](https://reactrouter.com/) - Declarative routing
- [Recharts](https://recharts.org/) - Data visualization
- [Jest](https://jestjs.io/) & [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing framework
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) - Code quality and formatting

## 📦 Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/gitzhg2n/bookkeeper.git
   cd bookkeeper
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. **Run the development server:**
   ```sh
   npm start
   ```

5. **Build for production:**
   ```sh
   npm run build
   ```

## 🛠️ Development

### Code Quality
```sh
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Testing
```sh
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false
```

### Build
```sh
# Create production build
npm run build

# Serve production build locally
npx serve -s build
```

## ⚡ Features

- **Modern UI** with Material UI design system and custom theming
- **Responsive Design** that works on desktop and mobile devices
- **Global State Management** with Zustand for efficient state updates
- **Centralized API Configuration** with automatic authentication and error handling
- **Data Fetching Hooks** for consistent API communication patterns
- **Code Quality Tools** with ESLint and Prettier for maintainable code
- **Comprehensive Testing Setup** with Jest and Testing Library
- **Route-based Code Splitting** for optimal performance

### Application Features
- Dashboard with interactive charts and widgets
- Account management and tracking
- Budget planning and monitoring
- Transaction history and categorization
- Investment portfolio tracking
- Financial goals setting and progress tracking
- User settings and preferences
- Subscription and upgrade management
- Household financial management
- User onboarding and account setup

## 🌐 Backend Integration

The frontend integrates with a RESTful API backend. Key integration points:

- **Authentication**: JWT token-based authentication with automatic token refresh
- **Error Handling**: Centralized error handling with user-friendly messages
- **Request Interceptors**: Automatic authorization header injection
- **Response Interceptors**: Global error handling and redirect logic

Backend API endpoints are configured through the `REACT_APP_API_URL` environment variable.

## 📋 License

MIT
