import React, { createContext, useState } from 'react';

export const TooltipContext = createContext();

export const TooltipProvider = ({ children }) => {
  const [currentId, setCurrentIdId] = useState(null);

  const onChangeDisplayTooltipId = (id) => {
    setCurrentIdId(id);
  };

  return (
    <TooltipContext.Provider value={{ currentId, onChangeDisplayTooltipId }}>
      {children}
    </TooltipContext.Provider>
  );
};
