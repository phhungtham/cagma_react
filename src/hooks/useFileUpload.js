/* eslint-disable indent */
import { useCallback, useState } from 'react';

const useFileUpload = (fileSize, allowedFileTypes) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState({});

  const handleUploadFile = useCallback(uploadedFile => {
    setError({ isError: false, mess: '' });
    if (uploadedFile.size > fileSize) {
      setError({ isError: true, mess: 'The maximum file attachment size is 5MB. Please check the file size' });
      return;
    }
    const typeFile = uploadedFile?.type;
    if (allowedFileTypes.includes(typeFile)) {
      setFile(URL.createObjectURL(uploadedFile));
    } else {
      setError({
        isError: true,
        mess: 'Please check the photo format again',
      });
    }
  }, []);
  return { file, setFile, error, handleUploadFile };
};

export default useFileUpload;
