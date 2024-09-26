/* eslint-disable indent */
import { endpoints } from '@common/constants/endpoint';
import { FileErrorType } from '@common/constants/error';
import { apiCall } from '@shared/api';

const useFile = () => {
  const handleUploadFile = async (file, options = {}, cb) => {
    const { maxFileSizeInByte, allowedFileTypes, userId } = options;
    let result = { success: true, errorType: '' };

    if (allowedFileTypes) {
      const typeFile = file?.type;
      if (!allowedFileTypes.includes(typeFile)) {
        result = {
          success: false,
          error: FileErrorType.FORMAT,
        };
        return cb(result);
      }
    }

    if (maxFileSizeInByte) {
      if (file.size > maxFileSizeInByte) {
        result = {
          success: false,
          error: FileErrorType.SIZE,
        };
        return cb(result);
      }
    }

    if (userId) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', userId);
      const response = await apiCall(endpoints.uploadFile, 'POST', formData, { isUploadFile: true });
      const data = response?.data;
      if (data.result === 'success') {
        const { file_location: fileLocation, file_name: fileName } = data;
        result = {
          success: true,
          file: file,
          fileLocation,
          fileName,
        };
        return cb(result);
      } else {
        result = {
          success: false,
          error: data?.msg || 'Unexpected error',
        };
        return cb(result);
      }
    }
  };

  return { handleUploadFile };
};

export default useFile;
