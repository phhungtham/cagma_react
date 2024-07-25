import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import { React, useEffect, useState, useRef, memo } from 'react';
import QRCode from 'qrcode.react';
import USD_Symbol from '@assets/images/usdsymbol.png';
import KHR_Symbol from '@assets/images/khrsymbol.png';
import { convertCurrency } from '@common/utils/formater';
import Timer from '../ui/components/atomic/Timer/Timer';
import { emv } from 'bakong-khqr/src/constant/index';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

const { BakongKHQR, khqrData, MerchantInfo } = require('bakong-khqr');

const MerchantQRBottomSheet = props => {
  // const handleCloseBottomSheet = () => {
  //   onClose();
  // };
  const { open = false, onClose, currentMerchant, inputValue, translate } = props;
  const inputValueFormatted = inputValue.replace(/,/g, '');
  const [refresh, setRefresh] = useState(true);

  emv.DEFAULT_MERCHANT_CATEGORY_CODE = currentMerchant.mcht_category_c; //add category code
  const optionalData = {
    accountInformation: currentMerchant.mcht_acno,
    currency: currentMerchant.mcht_ac_ccy_c === 'USD' ? khqrData.currency.usd : khqrData.currency.khr,
    amount: parseFloat(parseFloat(inputValueFormatted).toFixed(2)),
    mobileNumber: currentMerchant.ctadr_no //add contact number
  };

  const citySubstring = currentMerchant.city_eng_nm.substring(0, 15);
  const merchantInfo = new MerchantInfo(
    currentMerchant.bakong_act_id,
    currentMerchant.mcht_eng_nm,
    citySubstring,
    currentMerchant.mcht_id,
    currentMerchant.bakong_rcvbnk_nm,
    optionalData
  );
  const KHQR = new BakongKHQR();
  currentMerchant.qrString = KHQR.generateMerchant(merchantInfo).data.qr;
  function formatNumber(inputString) {
    if (inputString.indexOf('.') !== -1) {
      const splitStr = inputString.split('.');
      if (splitStr[1].length === 1) {
        return inputString + '0';
      } else if (splitStr[1].length === 0) {
        return inputString + '00';
      } else {
        return inputString;
      }
    } else {
      return inputString + '.00';
    }
  }
  return (
    <>
      <BottomSheet open={open} onClose={onClose} type="fit-content" clazz="bottomsheet__qr__card">
        <div className="qr__card">
          <div className="qr-container" style={{ aspectRatio: 20 / 29, borderRadius: '16px' }}>
            <div style={{ height: '18%' }}>
              <svg
                width="221"
                height="57"
                viewBox="0 0 221 57"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  height: 'auto',
                  width: '100%',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px'
                }}
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0 0H222V57L202.405 38.2742H0V0Z"
                  fill="#E21A1A"
                />
                <path
                  d="M117.628 17.2673V20.9339H114.023C113.663 20.9339 113.393 20.6589 113.393 20.2923V17.2673C113.393 16.9006 113.663 16.6256 114.023 16.6256H116.907C117.358 16.5339 117.628 16.9006 117.628 17.2673Z"
                  fill="white"
                />
                <path
                  d="M134.387 18.734H132.585C132.585 16.534 130.873 14.7923 128.71 14.7923C126.998 14.7923 125.557 15.8923 125.015 17.5423C124.926 17.909 124.836 18.3673 124.836 18.734V24.509H124.745C123.754 24.509 123.033 23.684 123.033 22.7673V18.734C123.033 17.1757 123.664 15.6173 124.836 14.5173C125.917 13.509 127.269 12.959 128.71 12.959C131.864 12.959 134.387 15.5257 134.387 18.734Z"
                  fill="white"
                />
                <path
                  d="M134.386 24.508H131.863L131.232 23.8664L129.881 22.4914L127.988 20.5664H130.512L134.386 24.508Z"
                  fill="white"
                />
                <path
                  d="M118.259 22.6757H112.852C112.222 22.6757 111.681 22.1257 111.681 21.484V15.984C111.681 15.3423 112.222 14.7923 112.852 14.7923H118.259C118.89 14.7923 119.43 15.3423 119.43 15.984V21.484L121.233 23.3173V14.7007C121.233 13.6923 120.422 12.959 119.521 12.959H111.681C110.689 12.959 109.969 13.784 109.969 14.7007V22.6757C109.969 23.684 110.779 24.4173 111.681 24.4173H120.061L118.259 22.6757Z"
                  fill="white"
                />
                <path
                  d="M96.3596 24.509H93.8362L88.6095 19.1007V24.509H86.5371V12.959H88.6095V18.0923L93.6563 12.959H96.089L90.6825 18.459L96.3596 24.509Z"
                  fill="white"
                />
                <path
                  d="M105.822 12.959H107.805V24.509H105.822V19.4673H100.055V24.509H97.9824V12.959H100.055V17.8173H105.822V12.959Z"
                  fill="white"
                />
              </svg>
            </div>
            <div style={{ height: '16%' }}>
              <div style={{ marginLeft: '14.5%' }}>
                <div
                  style={{
                    fontSize: '1.5vh',
                    fontWeight: ' 400',
                    textAlign: 'left',
                    letterSpacing: '0.01px'
                  }}
                >
                  {currentMerchant.mcht_eng_nm} ({currentMerchant.mcht_acno?.slice(-4)})
                </div>
                <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '3.25vh',
                      fontWeight: '700',
                      lineHeight: '5vh',
                      letterSpacing: '0em',
                      textAlign: 'left',
                      height: 'auto'
                    }}
                  >
                    {currentMerchant.mcht_ac_ccy_c === 'USD' ? formatNumber(inputValue) : inputValue}
                  </span>
                  <span
                    style={{
                      fontSize: '1.5vh',
                      fontWeight: '400',
                      lineHeight: '2vh',
                      letterSpacing: '0em',
                      textAlign: 'center',
                      marginLeft: '4px',
                      height: '100%'
                    }}
                  >
                    {currentMerchant.mcht_ac_ccy_c === 'USD' ? translate('lbl_com_3005') : translate('lbl_com_3076')}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ height: '8%' }}>
              <svg
                width="221"
                height="2"
                viewBox="0 0 221 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', verticalAlign: 'top' }}
              >
                <path
                  d="M0.498047 0.669922H220.498"
                  stroke="black"
                  stroke-opacity="0.5"
                  stroke-width="0.569667"
                  stroke-dasharray="4.56 4.56"
                />
              </svg>
            </div>
            <div style={{ height: '50%', flexDirection: 'row', textAlign: 'center' }}>
              <QRCode
                imageSettings={{
                  src: currentMerchant.mcht_ac_ccy_c === 'USD' ? USD_Symbol : KHR_Symbol,
                  height: 24,
                  width: 24
                }}
                value={currentMerchant.qrString}
                renderAs={'canvas'}
                style={{ width: 'auto', height: '100%', aspectRatio: 1 }}
              />
            </div>
            <div style={{ height: '8%' }} />
          </div>
        </div>
        <div className="qr__content__container" style={{ textAlign: 'center' }}>
          <div className="qr__content">QR will expire soon.</div>
          <div className="qr__content">To stay on, please refresh</div>
          <Timer onClose={onClose} refresh={refresh} setRefresh={setRefresh} />
        </div>
      </BottomSheet>
    </>
  );
};

export default withHTMLParseI18n(memo(MerchantQRBottomSheet));
