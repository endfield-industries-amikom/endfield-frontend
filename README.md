# Endfield Industries Frontend

A React + TypeScript frontend built on React Router, with MUI components and Tailwind utilities for UI styling. It includes SSR output via the React Router build pipeline.

# Getting Started

## Build (npm)

```bash
npm install
npm run build
```

## Build (Docker)

```bash
docker build -t endfield-frontend .
docker run -p 3000:3000 endfield-frontend
```

# Development

All application code is located in the `app` directory. Run `npm run dev` to start the development server with HMR.

The application utilized material design from @mui which implements Material Design components for React and provides a consistent look and feel across the application.

All components are located in the `app/components` directory.

Static data is located in the `app/data` directory.

Routes are defined in the `app/routes.ts` file. While each route is defined as a React component inside the `app/routes` directory, the routing logic is handled by React Router.
