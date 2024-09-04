export const FeatureName = 'cardCount';
export const ActionType = {
  GET_CARD_COUNT_REQUEST_SUCCESS: `${FeatureName}/GET_CARD_COUNT_REQUEST_SUCCESS`,
  GET_CARD_COUNT_REQUEST_FAILED: `${FeatureName}/GET_CARD_COUNT_REQUEST_FAILED`,
  GET_CARD_COUNT_REQUEST: `${FeatureName}/GET_CARD_COUNT_REQUEST`,
  CLEAN_UP: `${FeatureName}/CLEAN_UP`,
};

export const CardCountURLs = {
  GET_CARD_COUNT: '/ca/pr/CAPR006.pwkjson',
};
