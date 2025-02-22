export const postalCodeAllowRegex = /^[0-9a-zA-Z-]{1,10}$/;
export const postalCodeNotAllowRegex = /[^0-9a-zA-Z-]/g;
export const notAllowNumberRegex = /[^0-9]/g;
export const notAllowNumberAlphabetRegex = /[^0-9a-zA-Z]/g;
export const notAllowSpaceRegex = /\s+/g;
export const invalidNameRegex = /[^0-9a-zA-Z.,‘’'-\s]/g;
export const invalidCityRegex = /[^0-9a-zA-Z.‘’'-\s]/g;

export const notAllowAlphabetSpaceRegex = /[^a-zA-Z\s]/g;
export const notAllowAlphabetRegex = /[^a-zA-Z]/g;
export const invalidAccident = /[^0-9a-zA-Z.‘’'-\s]/g;

export const emailFormatRegex = /^[\._a-zA-Z0-9\-]+@[\._a-zA-Z0-9\-]+\.[a-zA-Z]{2,}$/;
