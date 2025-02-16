import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";

const Footer = ({ requestStats }) => {
  const { t } = useTranslation();
  const { modelName, clientResponseTime, serverResponseTime, lastRequestTime } =
    requestStats;

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">{t("Model")}:</span>
            <span className="stat-value">{modelName || "N/A"}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t("Client Response")}:</span>
            <span className="stat-value">
              {clientResponseTime ? `${clientResponseTime}ms` : "N/A"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t("Server Response")}:</span>
            <span className="stat-value">
              {serverResponseTime ? `${serverResponseTime}ms` : "N/A"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t("Last Request")}:</span>
            <span className="stat-value">
              {lastRequestTime
                ? new Date(lastRequestTime).toLocaleTimeString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
