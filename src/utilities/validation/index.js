import * as yup from 'yup';

export const requireStringField = message => yup.string().required(message);
export const notNegativeInterger = message => yup.number().positive().integer().required(message);

export default yup;
