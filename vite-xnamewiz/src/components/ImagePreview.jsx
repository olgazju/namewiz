import React, { useState } from 'react';
import ModalPopup from './popup/modalPopup';

const ImagePreview = ({ imageFile }) => {
  const imageUrl = URL.createObjectURL(imageFile);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="image-preview-container">
      <img
        src={imageUrl}
        alt="Preview"
        className="image-preview"
        onClick={() => setShowModal(true)}
        style={{ cursor: 'pointer' }}
      />
      {showModal && (
        <ModalPopup
          message={<img src={imageUrl} alt="Full Preview" style={{ width: '100%' }} />}
          setState={() => {}}
          onClose={() => setShowModal(false)}
          hideButtons={true}
          size="md"
        />
      )}
    </div>
  );
};

export default ImagePreview;