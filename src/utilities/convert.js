export const convertObjectBaseMappingFields = (currentObject, mappingFields) => {
  const convertedObject = { ...currentObject };
  for (const [oldKey, newKey] of Object.entries(mappingFields)) {
    convertedObject[newKey] = convertedObject[oldKey];
    delete convertedObject[oldKey];
  }
  return convertedObject;
};
