import { InfoIcon } from '@assets/icons';
import ToastIcon from '@assets/icons/ToastIcon';
import NoSearchData from '@assets/images/banks/no-search-data.png';
import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import Chips from '@common/ui/components/atomic/Chips';
import InputSearch from '@common/ui/components/atomic/Input/InputSearch';
import Spinner from '@common/ui/components/atomic/Spinner';
import Toast from '@common/ui/components/atomic/Toast';
import { debitCardsURLs } from '@components/VisaCard/redux/type';
import { apiCall } from '@shared/api';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useState } from 'react';

const SearchBankerBottomSheet = ({ open, onClose, onChooseBanker, translate }) => {
  const [bankerId, setBankerId] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isShowToast, setIsShowToast] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [currentTab, setCurrentTab] = useState('bnkr_nm');
  const [bankers, setBankers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const TAB_CODE = {
    bnkr_nm: '3',
    bnkerno: '9'
  };

  const renderSearchResult = item => {
    return (
      <div
        key={item?.bnkerno}
        className="search__item"
        onClick={() => {
          onChooseBanker(item);
          onClose();
        }}
      >
        <div className="agent__id">{item?.bnkerno}</div>
        <div className="name">{item?.bnkr_nm}</div>
      </div>
    );
  };
  const handleOnChangeInput = e => {
    let inputValue = e.target.value;
    setSearchValue(inputValue);
  };

  const handleOnSearchKeyUp = e => {
    if (e.key === 'Enter') {
      const searchInputBanker = document.querySelector('.input__search input');
      searchInputBanker && searchInputBanker.blur();
      handleSearchBanker();
    }
  };

  const handleSearchBanker = async () => {
    if ((currentTab === 'bnkr_nm' && searchValue.length < 3) || (currentTab === 'bnkerno' && searchValue.length < 8)) {
      setIsShowToast(true);
    } else {
      setIsLoading(true);
      let searchParam = {
        trx_func_d: TAB_CODE[currentTab],
        bnkerno: '',
        bnkr_nm: ''
      };
      searchParam[currentTab] = searchValue;
      const commonCodes = await apiCall(debitCardsURLs.INQUIRY_EMPLOYEE, 'POST', searchParam);
      setSearchString(searchValue);
      let searchResult = [];
      if (commonCodes.data?.elData?.list) {
        searchResult = commonCodes.data?.elData?.list;
      }
      setBankers(searchResult);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <BottomSheet title={translate('lbl_com_3169')} type="max" open={open} onClose={onClose}>
        <section className="search__banker">
          <Chips
            type="default"
            segments={[
              {
                label: translate('lbl_BHO2010000_0014'),
                value: 'bnkr_nm',
                handleClick: value => {
                  setSearchValue('');
                  setCurrentTab(value);
                }
              },
              {
                label: translate('lbl_com_3171'),
                value: 'bnkerno',
                handleClick: value => {
                  setSearchValue('');
                  setCurrentTab(value);
                  setIsShowToast(false);
                }
              }
            ]}
            defaultActive={currentTab}
          />
          {currentTab === 'bnkerno' ? (
            <InputSearch
              onClear={() => {}}
              onCancel={() => {
                setSearchValue('');
                setSearchString('');
                setBankers([]);
              }}
              onChange={handleOnChangeInput}
              onKeyUp={handleOnSearchKeyUp}
              value={searchValue}
              type="number"
              maxLength={8}
              placeHolder="8 digits"
            />
          ) : (
            <InputSearch
              onClear={() => {}}
              onCancel={() => {
                setSearchValue('');
                setSearchString('');
                setBankers([]);
              }}
              onChange={e => setSearchValue(e.target.value)}
              onKeyUp={handleOnSearchKeyUp}
              value={searchValue}
              placeHolder={translate('lbl_com_3170')}
            />
          )}
          <section className="banker_toast">
            <Toast
              isShowToast={isShowToast}
              iconStatus={<InfoIcon />}
              onClose={() => setIsShowToast(false)}
              message={translate('lbl_com_3206').replace('%1', currentTab === 'bnkr_nm' ? '3' : '8')}
            />
          </section>
          {searchString !== '' && bankers.length === 0 ? (
            <div className="search__result no__search">
              <img src={NoSearchData} />
              <p>{translate('lbl_com_3173')}</p>
            </div>
          ) : (
            <div className="search__result">{bankers.map((item, index) => renderSearchResult(item, index))}</div>
          )}
        </section>
      </BottomSheet>
    </>
  );
};

export default withHTMLParseI18n(SearchBankerBottomSheet);
