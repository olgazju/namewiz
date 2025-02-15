
import "./Card.css"; // Using regular CSS with Vite
import { useTranslation } from "react-i18next";
const Card = ({ title, descriptionKey, icon }) => {
    const { t, } = useTranslation();
   
  return (
    <div className="card-container">
      
      <div className="card-content">
        <div className="icon-wrapper">
          {icon && (
            <div className="icon">
              <img src={icon} alt={`${title} icon`} />
            </div>
          )}
        </div>
        <div className="text-content">
          <div className="title-wrapper">
          <span>{t("Choose AI model")}</span>
            <h3 className="title">{title}</h3>
          </div>
          <div className="description-wrapper" >
            <p className="description">{t(descriptionKey)}</p>
          </div>
        </div>
      </div>
       
    </div>
  );
};

export default Card;
