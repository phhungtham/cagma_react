import { useMemo, useState } from 'react';

import { ShareLineIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Image from '@common/components/atoms/Image';
import Label from '@common/components/atoms/Label';
import BottomSheet from '@common/components/templates/BottomSheet';
import { AppCfg } from '@configs/appConfigs';
import { truncateText } from '@utilities/convert';
import { totalNumOfDaysBetweenDates } from '@utilities/dateTimeUtils';
import imgSrcDetected from '@utilities/imgSrcDetected';
import parserDataToHtml from '@utilities/parserHtml';

import './styles.scss';

const maxDateRemaining = 31;

const PromotionDetailBottom = ({ onClose, data = {}, currentLang, onClickTry }) => {
  const { banner_per_from_display: fromDate, banner_per_to_display: toDate } = data || {};
  const [eventDayRemain, setEventDayRemain] = useState(0);

  const isShowRemainingDateLabel = useMemo(() => {
    if (data?.banner_per_to) {
      const remainingDate = totalNumOfDaysBetweenDates(data.banner_per_to);
      // show event time remaining within the last 31 days..
      if (remainingDate >= 0 && remainingDate < maxDateRemaining) {
        setEventDayRemain(remainingDate);
        return true;
      }
    }
    return false;
  }, [data]);

  const handleShare = () => {
    //TODO: Call Plugin for share
  };

  return (
    <BottomSheet
      open
      onClose={onClose}
      closeIcon
      clazz="promotion-detail-bottom__wrapper"
      type="max-scroll"
    >
      <div className="promotion-detail-bottom__content">
        <div className="promotion__header">
          <div className="promotion__title__wrapper">
            <div className="promotion__title">
              {truncateText(parserDataToHtml(data[`banner_main_content_${currentLang}`]), 50)}
            </div>
            <div className="promotion__share">
              <span onClick={handleShare}>
                <ShareLineIcon />
              </span>
            </div>
          </div>
          <div className="promotion__period">
            {isShowRemainingDateLabel && (
              <Label
                type="outline"
                variant="blue"
                clazz="mr-2"
                label={`D-${eventDayRemain}`}
              />
            )}
            <span>{`${fromDate} ~ ${toDate}`}</span>
          </div>
        </div>
        <div className="promotion__main">
          <div className="main__img">
            <Image
              src={imgSrcDetected(AppCfg.BASE_URL_IMAGE, data[`banner_bottom_promotion_url_${currentLang}`])}
              alt="promotion banner"
            />
          </div>
          <div className="main__desc">{parserDataToHtml(data[`banner_sub_content_${currentLang}`])}</div>
        </div>
        <div className="btn__ctas">
          <Button
            label="Try it now!"
            className="w-full"
            variant="filled__primary"
            onClick={onClickTry}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default PromotionDetailBottom;
