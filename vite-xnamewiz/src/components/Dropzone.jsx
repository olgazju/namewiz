import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import './Dropzone.css'; // Import the CSS file

const Dropzone = ({ onImageDropped }) => {
  const { t } = useTranslation();
  const onDrop = useCallback(acceptedFiles => {
    // This function will be called when files are dropped
    if (acceptedFiles.length > 0) {
      onImageDropped(acceptedFiles[0]); // Pass the first image to the parent component
    }
  }, [onImageDropped]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*', // Only accept image files
    multiple: false, // Only allow single file upload
  });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>{t("Drop the image here ...")}</p> :
          <p>{t("Drag &apos;n&apos; drop an image here, or click to select image")}</p>
      }
    </div>
  );
};

export default Dropzone;