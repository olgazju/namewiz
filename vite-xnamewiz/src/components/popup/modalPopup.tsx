import React, { useEffect } from 'react';
import './modalPopup.css';

interface ModalPopupProps {
  message: React.ReactNode;
  buttonTrueLabel?: string;
  buttonFalseLabel?: string;
  setState: (state: boolean) => void;
  onClose: () => void;
  hideButtons?: boolean;
  t?: (key: string) => string;
  size?: 'sm' | 'md' | 'xl'; // optional size prop
}

const ModalPopup: React.FC<ModalPopupProps> = ({
  message,
  buttonTrueLabel = 'Yes',
  buttonFalseLabel = 'No',
  setState,
  onClose,
  hideButtons = false,
  size = 'sm', // default size is small
}) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleButtonClick = (state: boolean) => {
    setState(state);
    console.log(state);
    onClose();
  };

  const sizeClass = size === 'md' ? 'modal-content-md' : size === 'xl' ? 'modal-content-xl' : 'modal-content-sm';

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${sizeClass}`}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-message">{message}</div>
        {!hideButtons && (
          <div className="button-group">
            <button onClick={() => handleButtonClick(true)}>{buttonTrueLabel}</button>
            <button onClick={() => handleButtonClick(false)}>{buttonFalseLabel}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalPopup;