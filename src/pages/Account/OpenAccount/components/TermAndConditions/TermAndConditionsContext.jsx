import { createContext, useContext, useState } from 'react';

const TermAndConditionsContext = createContext();
export const TermAndConditionsProvider = ({ children }) => {
  const [viewTermBottom, setViewTermBottom] = useState({
    open: false,
    title: '',
    fileUrl: '',
    value: '',
  });
  const [checkedOptions, setCheckedOptions] = useState([]);

  return (
    <TermAndConditionsContext.Provider value={{ viewTermBottom, setViewTermBottom, checkedOptions, setCheckedOptions }}>
      {children}
    </TermAndConditionsContext.Provider>
  );
};

export const useTermAndConditions = () => useContext(TermAndConditionsContext);
