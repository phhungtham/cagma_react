import { useState } from 'react';

import { FillPhoneIcon } from '@assets/icons';
import BannerImg from '@assets/images/add-new-card-banner.png';
import SearchBranchIcon from '@assets/images/icon-fill-atm-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import TermConditionChecklist from '@common/components/organisms/TermConditionChecklist';
import { externalUrls } from '@common/constants/url';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { moveBack } from '@utilities/index';

import { termConditionConfig } from '../../constants';
import './styles.scss';

const TermsAndConditions = ({ onSubmit }) => {
  const [viewTermBottom, setViewTermBottom] = useState({
    open: false,
    title: '',
    fileUrl: '',
    value: '',
  });
  const [checkedOptions, setCheckedOptions] = useState([]);

  const isValidForm = checkedOptions?.length === termConditionConfig.options.length;

  const onClickSubmit = () => {
    onSubmit();
  };

  const handleCheckOption = (value, checked) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
  };

  const onClickViewTermDetail = value => {
    const termItem = termConditionConfig.options.find(item => item.value === value);
    const { fileUrl, title } = termItem;
    setViewTermBottom({
      open: true,
      fileUrl,
      title,
      value,
    });
  };

  const handleCheckAll = checked => {
    if (checked) {
      setCheckedOptions(termConditionConfig.options.map(option => option.value));
    } else {
      setCheckedOptions([]);
    }
  };

  const handleConfirmTerm = () => {
    const checkedValue = viewTermBottom.value;
    if (!checkedOptions.includes(checkedValue)) {
      setCheckedOptions([...checkedOptions, checkedValue]);
    }
    onCloseViewTermBottom();
  };

  const onCloseViewTermBottom = () => {
    setViewTermBottom({ ...viewTermBottom, open: false });
  };

  const handleNavigateBranchInfo = () => {
    openURLInBrowser(externalUrls.branchInfo);
  };

  const handleNavigateContactUs = () => {
    openURLInBrowser(externalUrls.contactUs);
  };

  return (
    <div className="add-new-card term-conditions__wrapper">
      <Header
        title="Add New Card"
        onClick={moveBack}
      />
      <div className="add-new-card term-conditions__content">
        <div className="page__container">
          <h1 className="page__title">Terms&Conditions</h1>
          <div className="term-condition__banner">
            <div className="banner__desc">
              <div className="page__title">Consumer Classic Access Card</div>
              <div className="card__desc">
                <span>Enhance your life style with Shinhan Debit Card! Available for POS/ATM transactions</span>
              </div>
            </div>
            <div className="banner__spec" />
            <div className="banner__image">
              <img src={BannerImg} />
            </div>
          </div>
          <div className="term-condition__more-info">
            <div className="more-info__desc">More information, check the link below</div>
            <div className="more-info__links">
              <IconButton
                size="lg"
                type="circle"
                label="Search Branch"
                icon={<img src={SearchBranchIcon} />}
                onClick={handleNavigateBranchInfo}
              />
              <IconButton
                size="lg"
                type="circle"
                label="Contact Us"
                className="contact-us__icon"
                icon={<FillPhoneIcon />}
                onClick={handleNavigateContactUs}
              />
            </div>
          </div>
        </div>

        <div className="divider__group" />
        <div className="term-condition__checklist page__container">
          <TermConditionChecklist
            config={termConditionConfig}
            onClickViewTerm={onClickViewTermDetail}
            onCheckOption={handleCheckOption}
            onCheckAll={handleCheckAll}
            checkedOptions={checkedOptions}
          />
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label="Next"
          variant="filled__primary"
          className="btn__cta"
          onClick={onClickSubmit}
          disable={!isValidForm}
        />
      </div>
      <ViewTermBottom
        open={viewTermBottom.open}
        onClose={onCloseViewTermBottom}
        title={viewTermBottom.title}
        pdfFile={viewTermBottom.fileUrl}
        onConfirm={handleConfirmTerm}
      />
    </div>
  );
};

export default TermsAndConditions;
