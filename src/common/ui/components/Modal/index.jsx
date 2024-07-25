import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
function Modal(props) {
  const { open, title, width, height = '300px', onCancel } = props;
  return (
    <>
      {open && (
        <>
          <div className="component-modal background" onClick={onCancel}></div>
          <div className="component-modal main">
            <div className="component-modal-container" style={{ width, height }}>
              <div className="component-modal-header">
                <span className="component-modal-header-title">{title}</span>
                <button className="component-modal-header-btnClose" onClick={onCancel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 50 80"
                    xmlSpace="preserve"
                  >
                    <polyline
                      fill="none"
                      stroke="black"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,50 25,75 50,50 "
                    />
                  </svg>
                </button>
              </div>
              <div className="component-modal-content">{props.children}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
Modal.propTypes = {
  title: PropTypes.string,
  onOK: PropTypes.func,
  onCancel: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.element,
  open: PropTypes.bool
};
export default Modal;
