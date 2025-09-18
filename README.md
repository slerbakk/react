# React Shop - E-commerce Store

A fully functional e-commerce application built with React, TypeScript, and Tailwind CSS. This project demonstrates modern web development practices including API integration, state management, responsive design, and comprehensive testing.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.2.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-green)
![Testing Library](https://img.shields.io/badge/Testing%20Library-14.0.0-red)

## 🚀 Features

### Core Functionality

- **Product Catalog**: Browse products with images, prices, ratings, and discount badges
- **Product Details**: Detailed product pages with descriptions, reviews, and tags
- **Shopping Cart**: Add/remove items, adjust quantities, view totals
- **Search & Filter**: Real-time search with keyboard navigation and sorting options
- **Checkout Flow**: Complete checkout process with order confirmation
- **Contact Form**: Validated contact form with character counting

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first design that works on all devices
- **Toast Notifications**: User feedback for all interactions
- **API Integration**: Real-time data from Noroff API
- **State Management**: React Context API for global state
- **Comprehensive Testing**: 31 tests with 100% pass rate
- **Modern UI**: Clean, professional design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 5.2.0
- **Styling**: Tailwind CSS 3.4.1
- **Routing**: React Router DOM 6.22.3
- **Testing**: Vitest + React Testing Library + JSDOM
- **API**: Noroff Online Shop API
- **Development**: ESLint for code quality

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing

This project includes comprehensive testing with 31 tests covering all major components and functionality.

### Run Tests

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui
```

### Test Coverage

- **ProductCard Component**: Rendering, interactions, discount badges
- **SearchBar Component**: Search functionality, keyboard navigation
- **HomePage Component**: API integration, loading states, error handling
- **CartContext**: State management, cart operations
- **ContactPage**: Form validation, character counting

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── __tests__/       # Component tests
│   ├── Header.tsx       # Navigation header
│   ├── ProductCard.tsx  # Product display card
│   ├── SearchBar.tsx    # Search functionality
│   ├── SortFilter.tsx   # Product sorting
│   ├── Toast.tsx        # Toast notification
│   └── ToastContainer.tsx
├── context/             # React Context providers
│   ├── __tests__/       # Context tests
│   ├── CartContext.tsx  # Shopping cart state
│   └── ToastContext.tsx # Toast notifications
├── pages/               # Page components
│   ├── __tests__/       # Page tests
│   ├── HomePage.tsx     # Product listing
│   ├── ProductDetail.tsx # Product details
│   ├── CartPage.tsx     # Shopping cart
│   ├── CheckoutSuccess.tsx # Order confirmation
│   └── ContactPage.tsx  # Contact form
├── types/               # TypeScript type definitions
│   └── index.ts
├── test/                # Test configuration
│   └── setup.ts
└── App.tsx              # Main application component
```

## 🔗 API Integration

The application integrates with the Noroff Online Shop API:

- **Base URL**: `https://v2.api.noroff.dev/online-shop`
- **Endpoints**:
  - `GET /online-shop` - Fetch all products
  - `GET /online-shop/<id>` - Fetch single product

### API Response Types

```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  image: string | { url: string; alt: string };
  rating: number;
  tags: string[];
  reviews: Review[];
}
```

## 🎨 Key Components

### Shopping Cart System

- Global state management with React Context
- Persistent cart state during session
- Real-time total calculations
- Quantity adjustments and item removal

### Search & Filter

- Live search with debouncing
- Keyboard navigation (arrow keys, enter, escape)
- Multiple sorting options (price, name, rating)
- Real-time results filtering

### Toast Notifications

- Success, error, info, and warning types
- Auto-dismiss functionality
- Slide animations
- Global notification system

### Form Validation

- Client-side validation rules
- Real-time error feedback
- Character counting
- Email format validation

## 🚀 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured experience with hover effects
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with mobile navigation

## 🔄 State Management

### Cart Context

```typescript
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

### Toast Context

```typescript
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}
```

## 🎯 Learning Outcomes Achieved

This project demonstrates proficiency in:

- **React Fundamentals**: Components, hooks, context, routing
- **TypeScript**: Type safety, interfaces, generic types
- **API Integration**: Async operations, error handling, loading states
- **State Management**: Context API, reducers, global state
- **Testing**: Unit tests, integration tests, mocking
- **Modern CSS**: Tailwind utility classes, responsive design
- **User Experience**: Accessible forms, feedback, navigation

## 🔧 Development Decisions

### Why These Technologies?

- **React**: Component-based architecture for maintainable code
- **TypeScript**: Type safety reduces bugs and improves developer experience
- **Tailwind CSS**: Utility-first CSS for rapid development
- **Vite**: Fast build tool with excellent developer experience
- **React Testing Library**: Testing focused on user behavior
- **Context API**: Built-in state management for this scale of application

### Architecture Patterns

- **Component Composition**: Small, focused components for reusability
- **Custom Hooks**: Abstracted logic for cart and toast management
- **Error Boundaries**: Graceful error handling throughout the app
- **Loading States**: Better user experience during API calls

## 🚀 Future Enhancements

Potential improvements for production deployment:

- User authentication and accounts
- Product reviews and ratings system
- Wishlist functionality
- Advanced filtering (categories, price range)
- Payment integration
- Order history
- Admin dashboard
- Performance optimization with React.memo
- Internationalization (i18n)
- PWA capabilities

## 📄 License

This project is created for educational purposes as part of a JavaScript Frameworks course assignment.

## 🤝 Contributing

This is an educational project, but suggestions and feedback are welcome!

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
