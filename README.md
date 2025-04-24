# Task Manager Frontend

This project is a frontend application for a Task Manager, built using React, TypeScript, and Vite. It allows users to register, log in, manage their tasks, and view task statistics.

## Features

*   User authentication (Register/Login)
*   Create, Read, Update, Delete (CRUD) operations for tasks
*   View tasks in a list format
*   Visualize task status distribution with a chart
*   Protected routes for authenticated users

## Technologies Used

*   **Framework:** React
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Routing:** React Router DOM
*   **State Management:** Zustand
*   **API Client:** Axios
*   **Styling:** CSS (potentially with a UI library if added)
*   **Charting:** Recharts (based on `TaskChart.tsx`)

## Project Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/savg92/task-manager-frontend
    cd task-manager-frontend
    ```

2.  **Install dependencies:**
    Make sure you have Node.js and npm (or yarn/bun) installed.
    ```bash
    npm install
    # or
    yarn install
    # or
    bun install
    ```

## Running the Project

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

This will start the Vite development server, typically available at `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
# or
bun build
```
