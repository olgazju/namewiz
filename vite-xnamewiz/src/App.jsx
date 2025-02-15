import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
 
import { openShareLink } from "./utils/shareLink";
import { useTranslation } from "react-i18next";
import { useScrollToLastItem } from "./utils/useScrollToLastItem";
import CardCarousel from "./components/CardCarousel";
import SliderWithLabel from "./components/SliderWithLabel";
import Footer from "./components/Footer";
import { cardsData } from "./components/CardData";
import ModalPopup from "./components/popup/modalPopup"; // Import ModalPopup component
import Dropzone from "./components/Dropzone"; // Import Dropzone component
import ImagePreview from "./components/ImagePreview"; // Import ImagePreview component

import "./App.css";

import twitterLogo from "./assets/X.svg";
import linkedinLogo from "./assets/LinkedIn.svg";
import telegramLogo from "./assets/Telegram.svg";

import API_CONFIG from "./api/config";
import rateLimitInterceptor from "./api/interceptors/rateLimit";
import { fetchRateLimit, checkRateLimit, generateNames, processImage } from "./api";


const App = () => {
  const { t, i18n } = useTranslation();
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("General");
  const defaultLanguage = navigator.language.split("-")[0] || "en";
  const [lng, setLng] = useState(defaultLanguage);
  const [count, setCount] = useState(5);
  const [temperature, setTemperature] = useState(0.5);
  const [tone, setTone] = useState("Professional");
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rateLimit, setRateLimit] = useState({ requests: null, tokens: null });
  const [isAllowed, setIsAllowed] = useState(true);

  const [modelName, setModelName] = useState(cardsData[0].modelName); // Initialize with first model
  const [messageFormat, setMessageFormat] = useState(
    cardsData[0].messageFormat
  ); // Initialize with first model's message format

  const [requestStats, setRequestStats] = useState({
    modelName: null,
    clientResponseTime: null,
    serverResponseTime: null,
    lastRequestTime: null,
  });

  // Use  custom hook for scrolling
  const lastItemRef = useScrollToLastItem(names);

  const [temperatureDisabled, setTemperatureDisabled] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef(null);
  const [imageFile, setImageFile] = useState(null); // State to store the image file

  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [confirmCancel, setConfirmCancel] = useState(null); // State to store confirmation result

  const categoriesWithContexts = {
    General: "Versatile, creative, and adaptable.",
    "Tech Startup": "Futuristic, innovative, and sleek.",
    Fashion: "Trendy, elegant, and stylish.",
    Food: "Delicious, appetizing, and fun.",
    "Eco-Friendly": "Sustainable, green, and nature-inspired.",
    Finance: "Trustworthy, professional, and growth-focused.",
    Health: "Healthy, reliable, and caring.",
    Education: "Knowledgeable, inspiring, and engaging.",
    Travel: "Adventurous, exciting, and global.",
    Gaming: "Energetic, fun, and immersive.",
    Blog: "Creative, expressive, and memorable for your personal or professional blog.",
    "E-Commerce": "Catchy, appealing, and market-ready for online stores.",
    "Real Estate": "Professional, trustworthy, and location-focused.",
    "Art & Design": "Innovative, stylish, and visually inspiring.",
    "Social Media": "Trendy, relatable, and shareable.",
    "Sports & Fitness": "Energetic, motivational, and goal-oriented.",
    "Non-Profit": "Purposeful, inspiring, and community-focused.",
    Entertainment: "Fun, engaging, and memorable.",
    Photography: "Creative, timeless, and visually appealing.",
    "Technology Services": "Cutting-edge, reliable, and innovative.",
  };

  const responseLngContexts = {
    en: "US-English.",
    hi: "Hindi.",
    ru: "Russian.",
  };

  const { endpoint, authHeader } = API_CONFIG;

  console.log("[debug] endpoint:", endpoint);

  useEffect(() => {
    // Set up interceptor
    const interceptor = axios.interceptors.response.use(rateLimitInterceptor);

    fetchRateLimit(setRateLimit, setIsAllowed);

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    if (modelName) {
      fetchRateLimit(setRateLimit, setIsAllowed);
    }
  }, [modelName]);

  // Memoize the model change handler
  const handleModelChange = React.useCallback(
    (newModelName, newMessageFormat) => {
      setModelName(newModelName);
      // Only update messageFormat if it's different
      setMessageFormat((prevFormat) => {
        const newFormat = {
          ...newMessageFormat,
          optionalParameters: {
            ...newMessageFormat.optionalParameters,
            temperature, // Preserve current temperature
          },
        };

        // Check if actually different before updating
        if (JSON.stringify(prevFormat) === JSON.stringify(newFormat)) {
          return prevFormat;
        }
        return newFormat;
      });
    },
    [temperature]
  ); // Only depend on temperature

  const handleImageDropped = async (file) => {
    console.log("Image dropped:", file);
    setImageFile(file);

    const selectedModel = cardsData.find((model) => model.modelName === modelName);
    if (!selectedModel || !selectedModel.isMultimodal) {
      console.warn("Selected model does not support multimodal or vision capabilities.");
      // Display an appropriate message to the user
      alert("The selected model does not support image processing. Please select a different model.");
      return;
    }

    try {
      setLoading(true); // Start loading before processing the image
      const imageDescription = await processImage(file, endpoint, authHeader, modelName);
      if (imageDescription) {
        setKeywords(`${imageDescription} ${keywords}`); // Prepend the description to existing keywords
      }
    } catch (error) {
      console.error("Error processing image:", error);
      // Handle error (e.g., display an error message to the user)
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  const generateNamesHandler = async () => {
    console.log("[debug] generateNamesHandler invoked");

    if (isGenerating && abortControllerRef.current) {
      console.log("[debug] Request already in progress, asking for cancel");
      setShowModal(true); // Show modal instead of window.confirm
      return;
    }

    // Create new AbortController and store in ref
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsGenerating(true);

    const startTime = performance.now();

    const currentMessageFormat = {
      ...messageFormat,
      optionalParameters: {
        ...messageFormat.optionalParameters,
        temperature,
      },
    };

    console.log("Current messageFormat before Api call:", {
      modelName,
      messageFormat: currentMessageFormat,
      temperature,
    });

    try {
      const response = await generateNames(
        // Capture the response
        keywords,
        category,
        count,
        tone,
        lng,
        categoriesWithContexts,
        responseLngContexts,
        setNames,
        setLoading,
        setRateLimit,
        modelName,
        currentMessageFormat,
        controller, // pass the abortController
        t, // pass the translation function
      );

      const endTime = performance.now();

      setRequestStats({
        modelName,
        clientResponseTime: Math.round(endTime - startTime),
        serverResponseTime: response?.headers?.["x-response-time"]
          ? parseInt(response.headers["x-response-time"])
          : null,
        lastRequestTime: new Date().getTime(),
      });
    } catch (error) {
      console.error("Error in generateNamesHandler:", error);
      setRequestStats({
        modelName,
        clientResponseTime: null,
        serverResponseTime: null,
        lastRequestTime: new Date().getTime(),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Add effect to update disabled state when messageFormat changes
  // Memoize the temperature disabled calculation to prevent unnecessary updates
  const hasTemperature =
    messageFormat?.optionalParameters?.temperature !== undefined;
  useEffect(() => {
    if (temperatureDisabled !== !hasTemperature) {
      setTemperatureDisabled(!hasTemperature);
      console.log(
        "[debug] Temperature disabled:",
        !hasTemperature,
        messageFormat
      );
    }
  }, [hasTemperature, temperatureDisabled]); // Only depend on these values

  useEffect(() => {
    i18n.changeLanguage(lng);
    console.log("[debug] Language changed to:", lng);
  }, [lng]);

  // this useEffect hooks prevent displaying the modal when the names are generated and process of generation is finished
useEffect(() => {
  if (names.length > 0) {
    setShowModal(false);
  }
}, [names]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalConfirm = (state) => {
    setConfirmCancel(state);
    if (state && abortControllerRef.current) {
      console.log("[debug] Cancelling request via abort()");
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
    setShowModal(false);
  };

  return (
    <div className="main-container">
      <h1>🚀</h1>
      <h1>
        <span style={{ color: "#ff4b4b" }}>{t("NameWiz")}</span>
      </h1>
      <h3>
        {t("Generate creative names for your startup, business, or project!")}
      </h3>

      <CardCarousel cards={cardsData} onModelChange={handleModelChange} />
      <h4>
        {t("Rate limit remaining requests and tokens are:")}{" "}
        {rateLimit.requests === null
          ? t("not calculated yet")
          : rateLimit.requests === false
          ? t("Not Allowed")
          : `${rateLimit.requests} ${t("and")} ${rateLimit.tokens}`}
      </h4>
      <hr className="divider" />

      <input
        type="text"
        placeholder={t(
          '📝 Enter one or more keywords (e.g., "table fashion cats")'
        )}
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="form-control"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="️🏷️ Select a category" // emoji: 🏷️
        className="form-control"
      >
        {Object.keys(categoriesWithContexts).map((cat) => (
          <option key={cat} value={cat}>
            {t(cat)}
          </option>
        ))}
      </select>

      <select
        value={lng}
        onChange={(e) => setLng(e.target.value)}
        className="form-control"
      >
        <option value="en">{"English"}</option>
        <option value="ru">{"Russian"}</option>
        <option value="hi">{"Hindi"}</option>
        <option value="he">{"Hebrew"}</option>
      </select>

      <div className="sliders-wrapper">
        <div className="slider-group">
          <h4>{t("Number of names")}</h4>
          <SliderWithLabel
            min={1}
            max={10}
            initial={5}
            step={1}
            onChange={(value) => setCount(value)}
            id="names-slider"
          />
        </div>
        <div className="slider-group">
          <h4>{t("Temperature value")}</h4>
          <SliderWithLabel
            min={0.1}
            max={1}
            initial={0.5}
            step={0.1}
            onChange={(value) => {
              if (!temperatureDisabled) {
                setTemperature(value);

                console.log("Temperature slider changed:", value);
              }
            }}
            id="temperature-slider"
            disabled={temperatureDisabled}
          />
        </div>
      </div>

      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="form-control"
      >
        <option value="Professional">{t("Professional")}</option>
        <option value="Fun/Playful">{t("Fun/Playful")}</option>
        <option value="Modern/Minimalist">{t("Modern/Minimalist")}</option>
        <option value="Luxury/High-End">{t("Luxury/High-End")}</option>
      </select>

      <Dropzone onImageDropped={handleImageDropped} />

      {imageFile && <ImagePreview imageFile={imageFile} />} {/* Include ImagePreview component */}

      <button
        onClick={generateNamesHandler}
        className="form-control"
        // disabled={!isGenerating && loading}
        data-tip={rateLimit.requests}
      >
        {isGenerating ? t("Generating... press again to cancel") : loading ? t("Generating...") : t("Generate Names")}
      </button>
      

      {names.length > 0 && (
        <div>
          <h3>🎉 {t("Generated Names")}:</h3>
          <ul className="generated-names-list">
            {names.map((name, index) => (
              <li
                key={index}
                className="generated-names-item"
                ref={index === names.length - 1 ? lastItemRef : null}
              >
                {name}
                <div className="share-links">
                  <button
                    className="openShareLink"
                    onClick={() => openShareLink("twitter", name)}
                  >
                    <img src={twitterLogo} alt="X" />
                  </button>
                  <button
                    className="openShareLink"
                    onClick={() => openShareLink("linkedin", name)}
                  >
                    <img src={linkedinLogo} alt="LinkedIn" />
                  </button>
                  <button
                    className="openShareLink"
                    onClick={() => openShareLink("telegram", name)}
                  >
                    <img src={telegramLogo} alt="Telegram" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <Footer requestStats={requestStats} />
        </div>
      )}

      {showModal && (
        <ModalPopup
          message={t("Are you sure to cancel?")}
          buttonTrueLabel={t("Yes")}
          buttonFalseLabel={t("No")}
          setState={handleModalConfirm}
          onClose={handleModalClose}
          // pass i18n function to translate the message
          t={t}
        />
      )}
    </div>
  );
};

export default App;
