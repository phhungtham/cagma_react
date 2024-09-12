export const convertObjectBaseMappingFields = (currentObject, mappingFields, ignoreRemainingFields = false) => {
  const convertedObject = ignoreRemainingFields ? {} : { ...currentObject };
  for (const [oldKey, newKey] of Object.entries(mappingFields)) {
    convertedObject[newKey] = currentObject[oldKey];
    delete convertedObject[oldKey];
  }
  return convertedObject;
};

export const buildObjectMapFromResponse = (response, mappingFields) => {
  const newObject = {};
  for (const [localKey, remoteKey] of Object.entries(mappingFields)) {
    if (response.hasOwnProperty(remoteKey)) {
      newObject[localKey] = response[remoteKey] || null;
    }
  }
  return newObject;
};

export const commonCodeDataToOptions = (commonCodeData = []) => {
  if (!commonCodeData) {
    return [];
  }

  return commonCodeData.map(item => {
    return {
      label: item.value,
      value: item.key,
    };
  });
};
