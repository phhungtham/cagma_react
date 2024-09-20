/* eslint-disable prettier/prettier */
/* eslint-disable indent */
export const isEqual = (object1, object2, fieldsCompare) => {
    for (const key of fieldsCompare) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }
    return true;
};
