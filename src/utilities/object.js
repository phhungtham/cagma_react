export const isEqual = (object1, object2, fieldsCompare) => {
  for (const key of fieldsCompare) {
    const object1Value = object1?.[key] || '';
    const object2Value = object2?.[key] || '';
    if (object1Value !== object2Value) {
      return false;
    }
  }
  return true;
};
