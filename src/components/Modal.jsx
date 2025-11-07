import React from "react";

const Modal = ({
  clickedImg,
  clickedTitle,
  clickedUrl,
  setClickedImg,
  handleRotationRight,
  handleRotationLeft,
}) => {
  const handleClose = () => {
    setClickedImg(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          ×
        </button>

        <button className="modal-nav modal-prev" onClick={handleRotationLeft}>
          ‹
        </button>

        <div className="modal-image-container">
          <img src={clickedImg} alt={clickedTitle} className="modal-image" />
          {clickedTitle && <h3 className="modal-title">{clickedTitle}</h3>}
          {clickedUrl && (
            <a
              href={clickedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link"
            >
              View Project
            </a>
          )}
        </div>

        <button className="modal-nav modal-next" onClick={handleRotationRight}>
          ›
        </button>
      </div>
    </div>
  );
};

export default Modal;
