import { forwardRef } from 'react';

import Image from '@common/components/atoms/Image';
import { AppCfg } from '@configs/appConfigs';
import imgSrcDetected from '@utilities/imgSrcDetected';
import parserDataToHtml from '@utilities/parserHtml';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import EmptyNotification from './EmptyNotification';

const PromotionsTab = forwardRef((props, ref) => {
  const { promotionList, translate, onClick, currentLang, showLoading, fullContent = false } = props;
  promotionList?.sort((pre, nex) => (pre.banner_seq > nex.banner_seq ? 1 : -1));
  return (
    <div
      ref={ref}
      className={`${fullContent ? 'notification__list__fullContent' : 'notification__list'}`}
    >
      {!showLoading && (
        <>
          {promotionList?.length > 0 ? (
            promotionList.map(item => (
              <div
                className="promotion__item__wrapper"
                key={item?.banner_seq}
                onClick={() => onClick(item)}
              >
                <div className="promotion__item">
                  <div className="promotion__img">
                    {item.banner_image_url && (
                      <Image
                        src={imgSrcDetected(AppCfg.BASE_URL_IMAGE, item.banner_image_url)}
                        alt="promotion logo"
                      />
                    )}
                  </div>
                  <div className="promotion__item__main">
                    <div className="promotion__title">
                      {parserDataToHtml(item[`banner_main_content_${currentLang}`])}
                    </div>
                    <div className="promotion__content">
                      {parserDataToHtml(item[`banner_sub_content_${currentLang}`])}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyNotification translate={translate} />
          )}
        </>
      )}
    </div>
  );
});

export default withHTMLParseI18n(PromotionsTab);
