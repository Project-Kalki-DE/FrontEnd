# Magical Frames - A Modern Angular Showcase

Welcome to the official documentation for the Magical Frames project. This is a modern, single-page application built with Angular, designed to showcase premium printing and professional photography services.

## ✨ Features

*   **Responsive Design**: A clean and modern UI that looks great on all devices.
*   **Dynamic Components**: Built with Angular's powerful component-based architecture.
*   **Interactive UI**: Smooth-scrolling navigation and hover effects for an enhanced user experience.
*   **Containerized**: Fully containerized with Docker and Nginx for consistent and easy deployment.
*   **Automated E2E Testing**: End-to-end tests written with Playwright to ensure application reliability.
*   **Internationalization (i18n)**: Built-in support for multiple languages (DE, EN, TR) using Angular's localization framework.

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

This method builds and runs the application in a production-like containerized environment using Docker. It's the most reliable way to run the app and is great for testing the final build.

1.  **Ensure Docker is running**: Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and the Docker daemon is running on your local machine.

2.  **Build and run the container**:
    ```bash
    docker-compose up --build
    ```
    This command will build the Docker image for the first time and then start the container.

3.  **Access the application**:
    Navigate to `http://localhost:8080/`. The application will be served by the Nginx server inside the Docker container.

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

## 🌍 Internationalization (i18n)

The application is configured with full support for internationalization using Angular's built-in `@angular/localize` package.

### Supported Languages

*   **German (de)**: The default source language.
*   **English (en)**
*   **Turkish (tr)**

### How it Works

The application is built into language-specific versions. The Nginx server is configured to serve the correct version based on the URL prefix.

*   `http://localhost:8080/de/` serves the German version.
*   `http://localhost:8080/en/` serves the English version.
*   `http://localhost:8080/tr/` serves the Turkish version.

Visiting the root URL (`http://localhost:8080/`) will automatically redirect to the default language, which is currently set to German.

### Adding a New Language

To add a new language (e.g., French `fr`):

1.  **Update `angular.json`**: Add the new locale to the `i18n.locales` object and the `build.configurations.production.localize` array.
2.  **Create Translation File**: Copy `src/locale/messages.xlf` to `src/locale/messages.fr.xlf` and add the French translations in `<target>` tags.
3.  **Update Language Switcher**: Add the new language to the `languages` array in `src/app/home/home.component.ts`.
4.  **Update Nginx**: Add a new `location /fr/ { ... }` block to `nginx.conf`.

---

## 🌐 Deployment

This application is configured for easy deployment. The multi-stage `Dockerfile` creates a lightweight, optimized Nginx server to serve the static Angular files.

For **GitHub Pages**, you would typically need to adjust the build process to output to a `/docs` folder or a specific branch (`gh-pages`) and ensure the base-href is set correctly in your Angular build command.
