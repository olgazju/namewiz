import { useState, useEffect, memo } from "react";
import Card from "./Card";
import "./CardCarousel.css";

const CardCarousel = memo(({ cards, onModelChange }) => {
  // Remove temperature prop
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use useEffect with a check to prevent unnecessary updates
  useEffect(() => {
    // Only update if we have valid data
    if (onModelChange && cards[currentIndex]) {
      const currentCard = cards[currentIndex];
      const currentModelName = currentCard.modelName;
      const currentMessageFormat = currentCard.messageFormat;

      // Only call onModelChange if we have different data
      onModelChange(currentModelName, currentMessageFormat);
    }
  }, [currentIndex]); // Only depend on currentIndex

  const nextCard = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousCard = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel-container">
      <button
        className="nav-button prev-button"
        onClick={previousCard}
        aria-label="Previous card"
      >
        ←
      </button>

      <div className="card-wrapper">
        <Card {...cards[currentIndex]} />
      </div>

      <button
        className="nav-button next-button"
        onClick={nextCard}
        aria-label="Next card"
      >
        →
      </button>

      <div className="indicators">
        {cards.map((_, index) => (
          <button
            key={index}
            className={`indicator ${
              index === currentIndex ? "active-indicator" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

CardCarousel.displayName = "CardCarousel";
export default CardCarousel;
