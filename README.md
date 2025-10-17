# React Movie App

A responsive movie listing application built with React, TypeScript and Vite.

## Features

- Responsive grid layout with multiple breakpoints
- Movie filtering and sorting
- Dark theme design

## Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
pnpm install
```

## Running the App

Start the development server:

```bash
npm run start
# or
pnpm start
```


## Testing

Run unit tests:

```bash
npm run test
# or
pnpm test
```

Run tests in watch mode:

```bash
npm run test:watch
# or
pnpm test:watch
```

## Building for Production

```bash
npm run build
# or
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── api/             # API and mock data
├── pages/           # Page components
├── store/           # State management
├── types/           # Type definitions
├── App.tsx          # Main App component
└── main.tsx         # Entry point
```

## Responsive Breakpoints

- 1200px: 3 columns
- 768px: 2 columns
- 480px: 1 column
