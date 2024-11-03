export const buildRequestPayloadBaseMappingFields = (currentObject, mappingFields) => {
  const convertedObject = {};
  for (const [oldKey, newKey] of Object.entries(mappingFields)) {
    convertedObject[newKey] = currentObject[oldKey];
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

export const toJson = (str, defaultValue) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return defaultValue;
  }
};

export const truncateText = (text, limit) => {
  if (text?.length > limit) {
    return text.substring(0, limit) + '...';
  }
  return text;
};
