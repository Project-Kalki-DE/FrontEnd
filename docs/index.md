# Magical Frames - A Modern Angular Showcase

Welcome to the official documentation for the Magical Frames project. This is a modern, single-page application built with Angular, designed to showcase premium printing and professional photography services.

## ✨ Features

*   **Responsive Design**: A clean and modern UI that looks great on all devices.
*   **Dynamic Components**: Built with Angular's powerful component-based architecture.
*   **Containerized**: Fully containerized with Docker and Nginx for consistent and easy deployment.
*   **Automated E2E Testing**: End-to-end tests written with Playwright to ensure application reliability.

---

## 🛠️ Tech Stack

*   **Frontend**: [Angular](https://angular.dev/)
*   **Web Server**: [Nginx](https://www.nginx.com/)
*   **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
*   **E2E Testing**: [Playwright](https://playwright.dev/)
*   **Package Manager**: [npm](https://www.npmjs.com/)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [Angular CLI](https://angular.dev/tools/cli)
*   [Docker](https://www.docker.com/products/docker-desktop/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd FrontEnd
    ```

2.  **Install npm packages:**
    ```bash
    npm install
    ```

---

## 🏃 Running the Application

You can run the application in two ways: using the local Angular development server or using Docker.

### 1. Local Development Server (with Hot-Reload)

This is the recommended method for active development.

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### 2. Docker

This method builds and runs the application in a production-like containerized environment. It's great for testing the final build.

```bash
docker-compose up --build
```

Navigate to `http://localhost:8080/`.

---

## ✅ Running Tests

This project uses Playwright for end-to-end testing. The tests are configured to run against the Dockerized application to ensure they are testing a production-like environment.

1.  **Ensure no other instances are running** on port `8080`.

2.  **Run the E2E test command:**
    ```bash
    npm run e2e
    ```

This command will automatically:
*   Start the application using `docker-compose`.
*   Run all Playwright tests located in the `/e2e` directory.
*   Shut down the application server.

Test results and reports are generated in the `test-results/` and `playwright-report/` directories respectively.

---

## 🌐 Deployment

This application is configured for easy deployment. The multi-stage `Dockerfile` creates a lightweight, optimized Nginx server to serve the static Angular files.

For **GitHub Pages**, you would typically need to adjust the build process to output to a `/docs` folder or a specific branch (`gh-pages`) and ensure the base-href is set correctly in your Angular build command.
