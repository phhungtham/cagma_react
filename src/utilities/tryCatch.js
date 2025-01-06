export const tryCatch = (f, defaultValue, ...args) => {
  let result;
  try {
    result = f(...args);
  } catch {
    result = defaultValue;
  }
  return result;
};
