import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import CheckBox from '@common/ui/components/atomic/Checkbox';
import InfoBox from '@common/ui/components/atomic/InfoBox';
import InputSelect from '@common/ui/components/atomic/Input/InputSelect';
import Tabs from '@common/ui/components/atomic/Tabs';
import { debitCardsURLs } from '@components/VisaCard/redux/type';
import { apiCall } from '@shared/api';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useRef, useState } from 'react';

const WayToReceiveBottomSheet = ({
  open,
  onClose,
  onChooseAddress,
  deliverAddress,
  deliverBranch,
  translate,
  setLoadingStatus
}) => {
  const TABS = {
    DELIVER_TO_ME: `${translate('lbl_BCD8000000_0068')}`,
    AT_BRANCH: `${translate('lbl_BCD8000000_0069')}`
  };

  const [currentTab, setCurrentTab] = useState(TABS.DELIVER_TO_ME);
  const [destination, setDestination] = useState();
  const [isSelected, setIsSelected] = useState(true);
  const [isCorfirm, setIsCorfirm] = useState(false);
  const [address, setAddress] = useState('');
  const [directAddress, setDirectAddress] = useState([]);
  const [addressPicked, setAddressPicked] = useState(null);
  const checkBoxRef = useRef(null);
  const cityAddress = useRef(null);
  const directCityAddress = useRef(null);
  const branchAddress = useRef(null);

  const handleTabChange = tabName => {
    setCurrentTab(tabName);
  };

  const handleToggleSelectMode = status => {
    setIsSelected(status);
  };

  const renderRowContent = (index, title, subtitle, phone, handleClick) => {
    const titlePrefix =
      !isSelected && currentTab === TABS.DELIVER_TO_ME ? `${ordinal_suffix_of(index + 1)} ${title}` : title;
    return (
      <section
        key={index}
        className="row__info"
        onClick={() => {
          handleClick(title);
          setAddressPicked(title);
        }}
      >
        <div className={`title ${title === addressPicked && 'picked'}`}>{titlePrefix}</div>
        {subtitle && <div className="subtitle">{subtitle}</div>}
        {phone && <div className="subtitle">{phone}</div>}
      </section>
    );
  };

  const handleChooseAddress = (address, addressObj) => {
    directCityAddress.current = { ...addressObj };
    branchAddress.current = null;
    setAddress(address);
    if (!isCorfirm) {
      checkBoxRef.current.scrollIntoView();
    }
  };

  const handleChooseBranch = branch => {
    setAddress(branch?.CODE_NAME);
    branchAddress.current = { ...branch };
    directCityAddress.current = null;
    onClose();
  };

  const ordinal_suffix_of = i => {
    let j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + 'st';
    }
    if (j === 2 && k !== 12) {
      return i + 'nd';
    }
    if (j === 3 && k !== 13) {
      return i + 'rd';
    }
    return i + 'th';
  };

  const handleRequestInquiryAddress = async (zipCode = null) => {
    if (isCorfirm) {
      setIsCorfirm(false);
    }
    setLoadingStatus(true);
    const changePassRes = await apiCall(debitCardsURLs.INQUIRY_ADDRESS, 'POST', { zipc: zipCode });
    let addressResult;
    if (!changePassRes?.data?.elData) addressResult = [];
    addressResult = changePassRes?.data?.elData?.list || [];
    setDirectAddress(addressResult);
    handleToggleSelectMode(!isSelected);
    setLoadingStatus(false);
  };

  useEffect(() => {
    if ((isCorfirm && address) || currentTab === TABS.AT_BRANCH) {
      onChooseAddress(address, currentTab, cityAddress.current, branchAddress.current, directCityAddress.current);
      const timeOut = setTimeout(() => {
        onClose();
      }, 200);
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [isCorfirm, address]);

  return (
    <section className="way__to__receive__bottomsheet">
      <BottomSheet type="fit-content" title={translate('lbl_BCD8000000_0067')} open={open} onClose={onClose}>
        <Tabs
          onTabChange={handleTabChange}
          tabList={[{ title: `${translate('lbl_BCD8000000_0068')}` }, { title: `${translate('lbl_BCD8000000_0069')}` }]}
        >
          {currentTab === TABS.DELIVER_TO_ME &&
            (isSelected ? (
              <>
                {deliverAddress.map((addr, index) =>
                  renderRowContent(index, addr?.zipc_class_adr1, null, null, () => {
                    setDestination(addr);
                    cityAddress.current = addr;
                    handleRequestInquiryAddress(addr?.zipc);
                  })
                )}
                <section className="deliver__info__box">
                  <InfoBox variant="informative" label={translate('lbl_BCD8000000_0099')} />
                </section>
              </>
            ) : (
              <div className="way__to__receive__content">
                <InputSelect
                  beExpand={false}
                  value={destination?.zipc_class_adr1}
                  onClick={() => handleToggleSelectMode(!isSelected)}
                />
                <section className="info__box__receive">
                  <InfoBox variant="informative" label={translate('lbl_BCD8000000_0070')} />
                </section>
                {directAddress.map((address, index) =>
                  renderRowContent(index, address?.zipc_class_adr2, null, null, () =>
                    handleChooseAddress(`${address?.zipc_class_adr1}, ${address?.zipc_class_adr2}`, address)
                  )
                )}
                <section className="check__box__wrapper" ref={checkBoxRef}>
                  <CheckBox
                    size="large"
                    label={translate('lbl_BCD8000000_0072')}
                    onChange={val => setIsCorfirm(val)}
                    defaultChecked={isCorfirm}
                  />
                </section>
              </div>
            ))}
          {currentTab === TABS.AT_BRANCH && (
            <section className="at__branch">
              {deliverBranch.map((branch, index) =>
                renderRowContent(index, branch?.CODE_NAME, branch?.BR_ADR, branch?.BR_TELNO, () =>
                  handleChooseBranch(branch)
                )
              )}
            </section>
          )}
        </Tabs>
      </BottomSheet>
    </section>
  );
};

export default withHTMLParseI18n(WayToReceiveBottomSheet);
