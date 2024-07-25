import { useCallback } from 'react';

const useHandler = (handler, ref, removePassword) =>
  useCallback(() => {
    handler?.(ref.current?.value);
    removePassword();
  }, [handler, ref, removePassword]);

export default useHandler;
