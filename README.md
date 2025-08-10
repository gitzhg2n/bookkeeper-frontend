# Bookkeeper Frontend

This repository contains the frontend code for **Bookkeeper**, a privacy-first personal finance management application built with modern React architecture and best practices.

## 🏛️ Architecture Overview

### Frontend Architecture
The application follows a modern React architecture with clear separation of concerns:

```
src/
├── components/          # Reusable UI components
│   ├── AuthGate.js      # Authentication guard component
│   ├── ErrorBoundary.js # Error boundary for graceful error handling
│   └── Layout.js        # Main application layout with navigation
├── context/             # React context providers
│   ├── AuthContext.js   # Authentication state management
│   └── HouseholdContext.js # Household selection state
├── pages/               # Route-based page components
│   ├── Dashboard.js     # Main dashboard with budget summary
│   ├── Households.js    # Household management
│   ├── Accounts.js      # Account management
│   ├── Categories.js    # Category management
│   ├── Budgets.js       # Budget planning and tracking
│   ├── Transactions.js  # Transaction history and management
│   └── LoginPage.js     # Authentication
├── theme/               # Material UI theme configuration
│   ├── theme.js         # Centralized theme settings
│   └── ThemeProvider.js # Theme provider wrapper
├── api/                 # API client
│   └── client.js        # Centralized API client with authentication
├── App.js               # Main application component with routing
├── index.js             # Application entry point
├── index.css            # Global styles
└── setupTests.js        # Jest testing configuration
```

### Key Architectural Patterns

- **Component Architecture**: Follows React functional components with hooks pattern
- **State Management**: Uses React Context for authentication and household state
- **API Layer**: Centralized API client with automatic token handling and refresh
- **Theming**: Material UI theme system for consistent design language
- **Routing**: React Router for declarative routing
- **Testing**: Jest and React Testing Library setup for comprehensive testing
- **Code Quality**: ESLint and Prettier for consistent code formatting and quality

### Data Flow
1. **API Requests**: Centralized through `src/api/client.js` with automatic token handling
2. **State Management**: Authentication and household state managed by React Context
3. **UI Components**: Material UI components with custom theme integration

## 🚀 Tech Stack

- [React](https://react.dev/) - UI library
- [Material UI (MUI)](https://mui.com/) - Component library and design system
- [React Router](https://reactrouter.com/) - Declarative routing
- [Recharts](https://recharts.org/) - Data visualization (available for future use)
- [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management (available for future use)
- [Jest](https://jestjs.io/) & [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing framework
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) - Code quality and formatting

## 📦 Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/gitzhg2n/bookkeeper-frontend.git
   cd bookkeeper-frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Environment Configuration:**
   Copy the example environment file and configure your backend API:
   ```sh
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```env
   REACT_APP_API_BASE=http://localhost:3000
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

### Implemented Features
- **Modern UI** with clean, responsive design
- **Authentication** with JWT token-based login and registration
- **Household Management** with multi-household support and selection
- **Account Management** with multiple account types (checking, savings, credit, loan)
- **Category Management** for organizing transactions
- **Budget Planning** with monthly budgets and variance tracking
- **Transaction Management** with account-based transaction entry
- **Dashboard** with budget summary and variance calculations
- **Automatic Logout** with backend notification on logout

### Technical Features
- **Global State Management** with React Context for authentication and household state
- **Centralized API Client** with automatic authentication and token refresh
- **Route-based Navigation** with protected routes
- **Code Quality Tools** with ESLint and Prettier for maintainable code
- **Comprehensive Build Setup** with error handling and warnings as errors in CI

### Planned Features (Future Releases)
- Interactive charts and data visualization
- Investment portfolio tracking
- Financial goals setting and progress tracking
- Advanced reporting and analytics
- Mobile responsiveness improvements
- Enhanced error and loading states
- Data encryption indicators

## 🌐 Backend Integration

The frontend integrates with a RESTful API backend. Key integration points:

- **Authentication**: JWT token-based authentication with automatic token refresh
- **Error Handling**: Centralized error handling with user-friendly messages
- **Request Interceptors**: Automatic authorization header injection
- **Response Interceptors**: Global error handling and redirect logic

Backend API endpoints are configured through the `REACT_APP_API_BASE` environment variable.

### Required Backend Endpoints
- `POST /v1/auth/register` - User registration
- `POST /v1/auth/login` - User login
- `POST /v1/auth/logout` - User logout
- `POST /v1/auth/refresh` - Token refresh
- `GET /v1/users/me` - Get current user
- Household, Account, Category, Budget, and Transaction CRUD endpoints

## 📋 License

GPLv3
