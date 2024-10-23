import { ProductCode } from '@common/constants/product';

const useOpenAccount = ({ product }) => {
  const getFilteredBasedProductCode = accounts => {
    //TODO: Check other product
    if (product.prdt_c !== ProductCode.E_POWER_TERM_DEPOSIT) {
    } else {
      return (accounts || []).filter(account => account.prdt_c === ProductCode.E_SAVING);
    }
  };

  return { getFilteredBasedProductCode };
};

export default useOpenAccount;
