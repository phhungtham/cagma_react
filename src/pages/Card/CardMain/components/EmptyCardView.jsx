import { useState } from 'react';

import { ArrowRight, PlusIcon } from '@assets/icons';
import cardEmptyImg from '@assets/images/card-empty.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import { MENU_CODE } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { cardLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';

const EmptyCardView = ({ translate: t, setAlert }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [requestedNewCardResponse, setRequestedNewCardResponse] = useState();
  const { requestApi } = useApi();

  const checkNavigateAddCard = isAddCardInProgress => {
    if (isAddCardInProgress) {
      setAlert({
        isShow: true,
        title: t(cardLabels.pleaseCheck),
        content: t(cardLabels.youCannotApplyBecause),
      });
    } else {
      moveNext(MENU_CODE.ADD_NEW_CARD, {}, routePaths.addNewCard);
    }
  };

  const handleNavigateAddNewCard = async () => {
    if (requestedNewCardResponse) {
      const { cnt } = requestedNewCardResponse;
      const isAddCardInProgress = Number(cnt) > 0;
      return checkNavigateAddCard(isAddCardInProgress);
    }
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.checkCardIssuanceProgress);
    setShowLoading(false);
    if (isSuccess) {
      const { cnt } = data || {};
      const isAddCardInProgress = Number(cnt) > 0;
      setRequestedNewCardResponse(data);
      return checkNavigateAddCard(isAddCardInProgress);
    } else {
      setAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
  };

  const checkNavigateActiveCard = isAddCardInProgress => {
    if (!isAddCardInProgress) {
      setAlert({
        isShow: true,
        title: t(cardLabels.pleaseCheck2),
        content: t(cardLabels.noCardToActivate),
      });
    } else {
      moveNext(MENU_CODE.ACTIVE_CARD, {}, routePaths.activeCard);
    }
  };

  const handleNavigateActiveCard = async () => {
    if (requestedNewCardResponse) {
      const { cnt } = requestedNewCardResponse;
      const isAddCardInProgress = Number(cnt) > 0;
      return checkNavigateActiveCard(isAddCardInProgress);
    }
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.checkCardIssuanceProgress);
    setShowLoading(false);
    if (isSuccess) {
      const { cnt } = data || {};
      const isAddCardInProgress = Number(cnt) > 0;
      setRequestedNewCardResponse(data);
      return checkNavigateActiveCard(isAddCardInProgress);
    } else {
      setAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
  };

  return (
    <>
      {showLoading && <Spinner />}
      <div className="empty-card-view__wrapper page__container">
        <div className="empty-card__content">
          <div className="empty-card__img">
            <img
              src={cardEmptyImg}
              alt="card empty"
            />
          </div>
          <div className="empty-card__title">{t(cardLabels.accessCardService)}</div>
          <div className="empty-card__desc">
            <p>{t(cardLabels.emptyCardGuide)}</p>
          </div>
          <div className="empty-card__btn">
            <Button
              label={t(cardLabels.getNewAccessCard)}
              variant="filled__secondary-blue"
              size="lg"
              startIcon={<PlusIcon />}
              onClick={handleNavigateAddNewCard}
            />
          </div>
          <div className="empty-card__note">
            <span>{t(cardLabels.alreadyGotCard)}</span>
            <Button
              label={t(cardLabels.activate)}
              variant="text__primary"
              size="sm"
              endIcon={<ArrowRight />}
              onClick={handleNavigateActiveCard}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EmptyCardView;
