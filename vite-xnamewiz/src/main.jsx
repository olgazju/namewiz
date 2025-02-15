import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import initI18n from "./i18n";

async function startApp() {
  try {
    await initI18n();
    console.log("i18n initialized successfully.");

    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error("Failed to initialize i18n:", error);
  }
}


async function enableMocking() {
  console.log("enableMocking: Starting.");
  if (import.meta.env.MODE === "development") {
    try {
      const { worker } = await import("./mocks/browser");
      console.log("enableMocking: mockServiceWorker.js loaded.");
      try {
        await worker.start({
          serviceWorker: {
            url: '/xnamewiz/mockServiceWorker.js' // real path of service worker related to vite base
          }
        });
        console.log("enableMocking: Worker started successfully.");
      } catch (error) {
        console.error("enableMocking: Error starting worker:", error);
      }
    } catch (error) {
      console.error("enableMocking: Error loading mockServiceWorker.js:", error);
    }
  } else {
    console.log("enableMocking: Not in development mode. Mocking disabled.");
  }
}
enableMocking().then(() => {
  startApp();
  });
