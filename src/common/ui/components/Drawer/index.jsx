import React from 'react';
import './styles.scss';
const Drawer = ({ cancelButton = false, onClose, children }) => {
  return (
    <section className="drawer-wrapper">
      <div className="drawer-container">{children}</div>
      {cancelButton && (
        <div className="drawer-close" onClick={onClose}>
          Cancel
        </div>
      )}
    </section>
  );
};

export default Drawer;
