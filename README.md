# EasySearch Monolith

<p align="center">
  A comprehensive service-based platform for house rentals, hostel rentals, marketplace, and other service-related solutions.
</p>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 📋 Description

**EasySearch** is a modern, scalable service-based platform built with NestJS that provides a unified solution for multiple service domains:

- 🏠 **House Rental Services** - Find and list residential properties
- 🏨 **Hostel Rental Services** - Manage and discover hostel accommodations
- 🛒 **Marketplace** - Buy and sell products and services
- 🔧 **Other Services** - Extensible platform for additional service categories

This monolithic application is designed with a modular architecture, making it easy to scale and maintain while providing a robust foundation for service-oriented features.

## 🚀 Features

- **Modular Architecture** - Clean separation of concerns with NestJS modules
- **TypeScript** - Type-safe development experience
- **RESTful API** - Well-structured API endpoints
- **Dependency Injection** - Built-in DI container for better code organization
- **Testing Support** - Comprehensive unit and e2e testing setup
- **Hot Reload** - Fast development with watch mode
- **Code Quality** - ESLint and Prettier configured for consistent code style

## 🛠️ Technology Stack

- **Framework:** NestJS 11.x
- **Runtime:** Node.js
- **Language:** TypeScript 5.x
- **Package Manager:** pnpm
- **Testing:** Jest
- **Code Quality:** ESLint, Prettier

## 💻 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **pnpm** (v8 or higher)

Install pnpm globally if you haven't:
```bash
npm install -g pnpm
```

## 🚀 Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
# Install dependencies
pnpm install
```

### 2. Running the Application

```bash
# Development mode
pnpm run start

# Watch mode (recommended for development)
pnpm run start:dev

# Debug mode
pnpm run start:debug

# Production mode
pnpm run start:prod
```

The application will start on `http://localhost:3000` by default.

### 3. Building the Project

```bash
# Build for production
pnpm run build
```

## 🧪 Testing

```bash
# Run unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run e2e tests
pnpm run test:e2e

# Generate test coverage report
pnpm run test:cov

# Debug tests
pnpm run test:debug
```

## 📝 Code Quality

```bash
# Format code with Prettier
pnpm run format

# Lint and fix code
pnpm run lint
```

## 📁 Project Structure

```
easysearch-monolith/
├── src/
│   ├── apps/              # Domain modules
│   │   ├── domain.module.ts
│   │   └── index.ts
│   ├── app.controller.ts  # Main application controller
│   ├── app.service.ts     # Main application service
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── test/               # E2E tests
├── .prettierrc         # Prettier configuration
├── eslint.config.mjs   # ESLint configuration
├── nest-cli.json       # Nest CLI configuration
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## 🚀 API Endpoints

The platform provides RESTful API endpoints for various services:

### Base URL
```
http://localhost:3000
```

### Health Check
- `GET /` - Returns "Hello World!" to verify the application is running

*More endpoints will be available as service modules are developed.*

## 🏛️ Architecture

EasySearch follows a modular monolithic architecture:

- **AppModule**: Root module that orchestrates the entire application
- **DomainModule**: Contains domain-specific business logic and services
- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic and data operations
- **Dependency Injection**: Promotes loose coupling and testability

## 🛡️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
# Add other environment variables as needed
```

## 📚 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add unit tests for new features

### Module Creation
```bash
# Generate a new module
nest g module <module-name>

# Generate a new controller
nest g controller <controller-name>

# Generate a new service
nest g service <service-name>
```

## 🔐 Security

- Input validation for all API endpoints
- Environment-based configuration
- Security headers implementation (to be added)
- Rate limiting (to be added)

## 🛣️ Roadmap

- [ ] House Rental Module
  - [ ] Property listing CRUD operations
  - [ ] Search and filter functionality
  - [ ] Image upload support
- [ ] Hostel Rental Module
  - [ ] Hostel management
  - [ ] Booking system
  - [ ] Availability calendar
- [ ] Marketplace Module
  - [ ] Product listings
  - [ ] Category management
  - [ ] Search functionality
- [ ] User Management
  - [ ] Authentication & Authorization
  - [ ] User profiles
  - [ ] Role-based access control
- [ ] Payment Integration
- [ ] Notification System
- [ ] Admin Dashboard

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is [UNLICENSED](LICENSE).

## 📞 Support & Contact

For support or questions, please:
- Open an issue in the repository
- Contact the development team

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/) - A progressive Node.js framework
- Powered by [TypeScript](https://www.typescriptlang.org/)

---

<p align="center">Made with ❤️ for the EasySearch Platform</p>
