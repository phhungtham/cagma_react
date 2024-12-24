import { useState } from 'react';

import { FillChatIcon } from '@assets/icons';
import BannerImg from '@assets/images/add-new-card-banner.png';
import SearchBranchIcon from '@assets/images/icon-fill-atm-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import TermConditionChecklist from '@common/components/organisms/TermConditionChecklist';
import { cardLabels, ctaLabels, menuLabels } from '@common/constants/labels';
import { externalUrls } from '@common/constants/url';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { moveBack } from '@utilities/index';

import { termConditionConfig } from '../../constants';
import './styles.scss';

const TermsAndConditions = ({ onSubmit, translate: t }) => {
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
      title: t(title),
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
    openInternalWebview({
      url: externalUrls.branchInfo,
      title: 'Search Branch',
    });
  };

  const handleNavigateContactUs = () => {
    openInternalWebview({
      url: externalUrls.contactUs,
      title: 'Contact Us',
    });
  };

  return (
    <div className="add-new-card term-conditions__wrapper">
      <Header
        title={t(menuLabels.accessCardService)}
        onClick={moveBack}
      />
      <div className="add-new-card term-conditions__content">
        <div className="page__container">
          <h1 className="page__title">{t(cardLabels.termCondition)}</h1>
          <div className="term-condition__banner">
            <div className="banner__desc">
              <div className="page__title">{t(cardLabels.consumerClassicCard)}</div>
              <div className="card__desc">
                <p>{t(cardLabels.enhanceYourLife)}</p>
              </div>
            </div>
            <div className="banner__spec" />
            <div className="banner__image">
              <img src={BannerImg} />
            </div>
          </div>
          <div className="term-condition__more-info flex-gap-y-12">
            <div className="more-info__desc">{t(cardLabels.moreInformation)}</div>
            <div className="more-info__links">
              <IconButton
                size="lg"
                type="circle"
                label={t(cardLabels.searchBranch)}
                icon={<img src={SearchBranchIcon} />}
                onClick={handleNavigateBranchInfo}
              />
              <IconButton
                size="lg"
                type="circle"
                label={t(cardLabels.contactUs)}
                className="contact-us__icon"
                icon={<FillChatIcon />}
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
          label={t(ctaLabels.next)}
          variant="filled__primary"
          className="btn__cta"
          onClick={onClickSubmit}
          disable={!isValidForm}
        />
      </div>
      {viewTermBottom.open && (
        <ViewTermBottom
          open={viewTermBottom.open}
          onClose={onCloseViewTermBottom}
          title={viewTermBottom.title}
          pdfFile={viewTermBottom.fileUrl}
          onConfirm={handleConfirmTerm}
        />
      )}
    </div>
  );
};

export default TermsAndConditions;
