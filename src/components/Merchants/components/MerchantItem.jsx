import noMerChantContent from '@assets/images/no-merchant-content.png';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { merchantSelectedSelector } from '../redux/selector';
import QRCode from 'qrcode.react';
import saveQR from '@utilities/gmCommon/saveQR';
import shareQR from '@utilities/gmCommon/shareQR';
import USD_Symbol from '@assets/images/usdsymbol.png';
import KHR_Symbol from '@assets/images/khrsymbol.png';
import html2canvas from 'html2canvas';
import screenShotQR from '@utilities/gmCommon/screenShotQR';
import inProcessMerchant from '@assets/images/image_in_process_merchant.png';

const MerchantItem = props => {
  const {
    card,
    noCard = false,
    translate,
    errMsg,
    setErrMsg,
    handleShowEnterAmount,
    handleShowCreateMerchant,
    handleShowToast,
    handleShowToastFail,
    handleScreenshotFail,
    isCallingPlugin,
    setIsCallingPlugin
  } = props;
  const cardSelected = useSelector(merchantSelectedSelector) || {};

  const backgroundStyle = {
    height: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -1
  };

  const onClickDownload = () => {
    setIsCallingPlugin(true);
    const divToCapture = document.getElementById(card.mcht_id);

    html2canvas(divToCapture)
      .then(function (canvas) {
        const base64Image = canvas.toDataURL('image/png');
        saveQR(
          () => {
            setTimeout(() => {
              setIsCallingPlugin(false);
              handleShowToast();
            }, 400);
          },
          base64Image
        );
      })
      .catch(function (error) {
        setIsCallingPlugin(false);
        handleShowToastFail();
        console.error('Error:', error);
      });
  };
  const onClickScreenShot = () => {
    setIsCallingPlugin(true);
    const divToCapture = document.getElementById(card.mcht_id);

    html2canvas(divToCapture)
      .then(function (canvas) {
        const base64Image = canvas.toDataURL('image/png');
        screenShotQR(
          () => {
            setTimeout(() => {
              setIsCallingPlugin(false);
            }, 400);
          },
          base64Image
        );
      })
      .catch(function (error) {
        setIsCallingPlugin(false);
        handleScreenshotFail();
        console.error('Error:', error);
      });
  };

  const onClickSend = () => {
    setIsCallingPlugin(true);
    const HOST_URL = `https://gmkhdev.shinhanglobal.com/link.jsp?ac=${card.mcht_acno}&screenid=KHTR202005&cd=${
      card.mcht_ac_ccy_c === 'USD' ? 'US' : 'KH'
    }`;
    shareQR(
      () => {
        setTimeout(() => {
          setIsCallingPlugin(false);
        }, 400);
      },
      `Welcome to Shinhan Merchant QR Code! Click the link below to transfer: ${HOST_URL}`
    );
  };

  return (
    <div className={`card-item ${noCard && 'no_merchant'}`}>
      {noCard ? (
        <div className="flip-card-front" style={backgroundStyle}>
          <div className="no-card-content-top">{translate('lbl_KHMM1140000_0001')}</div>
          <img alt="noCardContent" className="no-card-image" src={noMerChantContent}></img>
          <Button
            className={'add-new-card'}
            label={translate('lbl_KHMM1140000_0002')}
            onClick={handleShowCreateMerchant}
          />
        </div>
      ) : (
        <>
          <div className="flip-card-front" style={backgroundStyle}>
            <div className="opacityBackground-merchant"></div>
            <div className="qr-container" id={card.mcht_id} style={{ borderRadius: '16px', height: '50vh' }}>
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
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H222V57L202.405 38.2742H0V0Z" fill="#E21A1A" />
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
                    {card.mcht_eng_nm} ({card.mcht_acno?.slice(-4)})
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
                    onClick={handleShowEnterAmount}
                  >
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
                      {card.mcht_ac_ccy_c === 'USD' ? '0.00' : '0'}
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
                      {card.mcht_ac_ccy_c === 'USD' ? translate('lbl_com_3005') : translate('lbl_com_3076')}
                    </span>
                    <svg
                      width="12.57"
                      height="12.57"
                      viewBox="0 0 12.57 12.57"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        lineHeight: '2vh',
                        marginLeft: '4px',
                        marginRight: '4px',
                        height: '100%'
                      }}
                      data-html2canvas-ignore="true"
                    >
                      <path
                        d="M2.39233 3.95539L7.10662 8.66968L11.8209 3.95539"
                        stroke="#A0A2A7"
                        stroke-width="0.982144"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
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
                    src: card.mcht_ac_ccy_c === 'USD' ? USD_Symbol : KHR_Symbol,
                    height: 24,
                    width: 24
                  }}
                  value={card.qrString}
                  renderAs={'canvas'}
                  style={{ width: 'auto', height: '100%', aspectRatio: 1 }}
                />
              </div>
              <div style={{ height: '8%' }} />
            </div>
            <div
              className="button-container"
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                textAlign: 'center',
                backgroundColor: '#F8F8FA',
                boxSizing: 'border-box',
                borderBottomRightRadius: '16px',
                borderBottomLeftRadius: '16px',
                width: '100%',
                height: '10vh'
              }}
            >
              <div className="button-wrapper" onClick={onClickDownload}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: '85%' }}
                >
                  <path
                    d="M2.63837 9.33867C2.63837 10.1402 2.63837 10.5409 2.83072 10.8288C2.91399 10.9534 3.021 11.0604 3.14562 11.1437C3.4335 11.336 3.83425 11.336 4.63575 11.336H9.08543C9.88693 11.336 10.2877 11.336 10.5756 11.1437C10.7002 11.0604 10.8072 10.9534 10.8905 10.8288C11.0828 10.5409 11.0828 10.1402 11.0828 9.33867V4.88898C11.0828 4.08748 11.0828 3.68673 10.8905 3.39886C10.8072 3.27423 10.7002 3.16723 10.5756 3.08396C10.2877 2.8916 9.88693 2.8916 9.08543 2.8916H4.63575C3.83425 2.8916 3.4335 2.8916 3.14562 3.08396C3.021 3.16723 2.91399 3.27423 2.83072 3.39886C2.63837 3.68673 2.63837 4.08748 2.63837 4.88898V9.33867ZM4.74948 5.00271H8.9717V9.22493H4.74948V5.00271Z"
                    fill="#FF6A63"
                  />
                  <path
                    d="M2.63837 19.8942C2.63837 20.6957 2.63837 21.0965 2.83072 21.3843C2.91399 21.509 3.021 21.616 3.14562 21.6992C3.4335 21.8916 3.83425 21.8916 4.63575 21.8916H9.08543C9.88693 21.8916 10.2877 21.8916 10.5756 21.6992C10.7002 21.616 10.8072 21.509 10.8905 21.3843C11.0828 21.0965 11.0828 20.6957 11.0828 19.8942V15.4445C11.0828 14.643 11.0828 14.2423 10.8905 13.9544C10.8072 13.8298 10.7002 13.7228 10.5756 13.6395C10.2877 13.4472 9.88693 13.4472 9.08543 13.4472H4.63575C3.83425 13.4472 3.4335 13.4472 3.14562 13.6395C3.021 13.7228 2.91399 13.8298 2.83072 13.9544C2.63837 14.2423 2.63837 14.643 2.63837 15.4445V19.8942Z"
                    fill="#FF6A63"
                  />
                  <path
                    d="M15.1913 2.8916C14.3898 2.8916 13.9891 2.8916 13.7012 3.08396C13.5766 3.16723 13.4695 3.27423 13.3863 3.39886C13.1939 3.68673 13.1939 4.08748 13.1939 4.88898V9.33867C13.1939 10.1402 13.1939 10.5409 13.3863 10.8288C13.4695 10.9534 13.5766 11.0604 13.7012 11.1437C13.9891 11.336 14.3898 11.336 15.1913 11.336H19.641C20.4425 11.336 20.8432 11.336 21.1311 11.1437C21.2557 11.0604 21.3627 10.9534 21.446 10.8288C21.6384 10.5409 21.6384 10.1402 21.6384 9.33867V4.88898C21.6384 4.08748 21.6384 3.68673 21.446 3.39886C21.3627 3.27423 21.2557 3.16723 21.1311 3.08396C20.8432 2.8916 20.4425 2.8916 19.641 2.8916H15.1913Z"
                    fill="#FF6A63"
                  />
                  <path
                    d="M21.6384 19.7805H19.5273V21.8916H20.4732C20.9408 21.8916 21.1745 21.8916 21.3425 21.7794C21.4152 21.7308 21.4776 21.6684 21.5262 21.5957C21.6384 21.4278 21.6384 21.194 21.6384 20.7265V19.7805Z"
                    fill="#FF6A63"
                  />
                  <path
                    d="M15.305 13.4472H14.3591C13.8915 13.4472 13.6578 13.4472 13.4898 13.5594C13.4171 13.6079 13.3547 13.6704 13.3061 13.7431C13.1939 13.911 13.1939 14.1448 13.1939 14.6123V15.5583H15.305V13.4472Z"
                    fill="#FF6A63"
                  />
                  <path d="M17.4161 15.5583H15.305V17.6694H17.4161V15.5583Z" fill="#FF6A63" />
                  <path d="M15.305 17.6694H13.1939V19.7805H15.305V17.6694Z" fill="#FF6A63" />
                  <path d="M17.4161 19.7805H15.305V21.8916H17.4161V19.7805Z" fill="#FF6A63" />
                  <path d="M19.5273 17.6694H17.4161V19.7805H19.5273V17.6694Z" fill="#FF6A63" />
                  <path d="M19.5273 13.4472H17.4161V15.5583H19.5273V13.4472Z" fill="#FF6A63" />
                  <path d="M21.6384 15.5583H19.5273V17.6694H21.6384V15.5583Z" fill="#FF6A63" />
                  <path
                    d="M22.3125 29.9414C20.1908 29.9414 18.1559 29.0986 16.6556 27.5983C15.1553 26.098 14.3125 24.0631 14.3125 21.9414C14.3125 19.8197 15.1553 17.7848 16.6556 16.2845C18.1559 14.7843 20.1908 13.9414 22.3125 13.9414C24.4342 13.9414 26.4691 14.7843 27.9694 16.2845C29.4697 17.7848 30.3125 19.8197 30.3125 21.9414C30.3125 24.0631 29.4697 26.098 27.9694 27.5983C26.4691 29.0986 24.4342 29.9414 22.3125 29.9414Z"
                    fill="#4F8BF4"
                  />
                  <path d="M25.1424 22.9414L22.3124 25.7714L19.4824 22.9414" fill="#4F8BF4" />
                  <path
                    d="M25.1424 22.9414L22.3124 25.7714L19.4824 22.9414"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22.3125 18.1113V25.7713"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div className="button__text">{translate('lbl_com_3021')}</div>
              </div>
              <div className="button-wrapper" onClick={onClickScreenShot}>
                <svg
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: '85%' }}
                >
                  <path
                    d="M25.1131 12.3059C25.103 11.5486 24.9612 10.7987 24.6941 10.0899C24.4624 9.49209 24.1086 8.94913 23.6553 8.49576C23.2019 8.0424 22.6589 7.68858 22.0611 7.45693C21.3614 7.19429 20.6223 7.05227 19.8751 7.03693C18.9131 6.99393 18.6081 6.98193 16.1661 6.98193C13.7241 6.98193 13.4111 6.98193 12.4561 7.03693C11.7092 7.05239 10.9704 7.1944 10.2711 7.45693C9.67314 7.68842 9.13011 8.04218 8.67672 8.49557C8.22333 8.94895 7.86958 9.49199 7.63809 10.0899C7.37492 10.7891 7.23321 11.528 7.21909 12.2749C7.17609 13.2379 7.16309 13.5429 7.16309 15.9849C7.16309 18.4269 7.16309 18.7389 7.21909 19.6949C7.23409 20.4429 7.37509 21.1809 7.63809 21.8819C7.86996 22.4797 8.22398 23.0225 8.67752 23.4757C9.13106 23.9289 9.67415 24.2825 10.2721 24.5139C10.9695 24.7871 11.7085 24.9393 12.4571 24.9639C13.4201 25.0069 13.7251 25.0199 16.1671 25.0199C18.6091 25.0199 18.9221 25.0199 19.8771 24.9639C20.6242 24.9492 21.3634 24.8075 22.0631 24.5449C22.6608 24.313 23.2036 23.9591 23.6569 23.5058C24.1103 23.0524 24.4642 22.5096 24.6961 21.9119C24.9591 21.2119 25.1001 20.4739 25.1151 19.7249C25.1581 18.7629 25.1711 18.4579 25.1711 16.0149C25.1691 13.5729 25.1691 13.2629 25.1131 12.3059ZM16.1601 20.6029C13.6061 20.6029 11.5371 18.5339 11.5371 15.9799C11.5371 13.4259 13.6061 11.3569 16.1601 11.3569C17.3862 11.3569 18.5621 11.844 19.429 12.711C20.296 13.578 20.7831 14.7538 20.7831 15.9799C20.7831 17.206 20.296 18.3819 19.429 19.2489C18.5621 20.1159 17.3862 20.6029 16.1601 20.6029ZM20.9671 12.2639C20.8255 12.2641 20.6852 12.2363 20.5544 12.1821C20.4235 12.128 20.3047 12.0486 20.2045 11.9485C20.1044 11.8484 20.025 11.7295 19.9709 11.5986C19.9167 11.4678 19.889 11.3275 19.8891 11.1859C19.8891 11.0444 19.917 10.9043 19.9711 10.7736C20.0253 10.6429 20.1046 10.5241 20.2047 10.424C20.3047 10.324 20.4235 10.2446 20.5542 10.1905C20.685 10.1363 20.8251 10.1084 20.9666 10.1084C21.1081 10.1084 21.2482 10.1363 21.3789 10.1905C21.5097 10.2446 21.6284 10.324 21.7285 10.424C21.8285 10.5241 21.9079 10.6429 21.9621 10.7736C22.0162 10.9043 22.0441 11.0444 22.0441 11.1859C22.0441 11.7819 21.5621 12.2639 20.9671 12.2639Z"
                    fill="#4F8BF4"
                  />
                  <path
                    d="M22.4785 11.063C22.4785 11.7879 21.8909 12.3755 21.166 12.3755C20.4411 12.3755 19.8535 11.7879 19.8535 11.063C19.8535 10.3381 20.4411 9.75049 21.166 9.75049C21.8909 9.75049 22.4785 10.3381 22.4785 11.063Z"
                    fill="#4F8BF4"
                  />
                  <path
                    d="M16.16 18.9821C17.8185 18.9821 19.163 17.6376 19.163 15.9791C19.163 14.3206 17.8185 12.9761 16.16 12.9761C14.5015 12.9761 13.157 14.3206 13.157 15.9791C13.157 17.6376 14.5015 18.9821 16.16 18.9821Z"
                    fill="#1E59CF"
                  />
                  <path
                    d="M8.16602 3.50049H5.66602C4.56145 3.50049 3.66602 4.39592 3.66602 5.50049V8.00049"
                    stroke="#4F8BF4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M24.166 28.5005L26.666 28.5005C27.7706 28.5005 28.666 27.6051 28.666 26.5005L28.666 24.0005"
                    stroke="#4F8BF4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M28.666 8.00049L28.666 5.50049C28.666 4.39592 27.7706 3.50049 26.666 3.50049L24.166 3.50049"
                    stroke="#4F8BF4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.66602 24.0005L3.66602 26.5005C3.66602 27.6051 4.56145 28.5005 5.66602 28.5005L8.16602 28.5005"
                    stroke="#4F8BF4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div className="button__text">{translate('lbl_com_3020')}</div>
              </div>
              <div className="button-wrapper" onClick={onClickSend}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: '85%' }}
                >
                  <path
                    d="M15.0883 30.5886C23.1451 30.5886 29.6765 24.0572 29.6765 16.0004C29.6765 7.94349 23.1451 1.41211 15.0883 1.41211C7.03138 1.41211 0.5 7.94349 0.5 16.0004C0.5 24.0572 7.03138 30.5886 15.0883 30.5886Z"
                    fill="#C8E3FF"
                  />
                  <path
                    d="M24.2059 30.5887C28.2343 30.5887 31.5 27.3231 31.5 23.2946C31.5 19.2662 28.2343 16.0005 24.2059 16.0005C20.1774 16.0005 16.9117 19.2662 16.9117 23.2946C16.9117 27.3231 20.1774 30.5887 24.2059 30.5887Z"
                    fill="#FFC947"
                  />
                  <path
                    d="M24.2059 18.2588V19.8324"
                    stroke="white"
                    stroke-width="1.37335"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                  <path
                    d="M24.2059 26.7563V28.33"
                    stroke="white"
                    stroke-width="1.37335"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                  <path
                    d="M26.409 21.5635C26.409 20.6067 25.4207 19.8325 24.2059 19.8325C22.991 19.8325 22.0028 20.6067 22.0028 21.5635C22.0028 23.433 26.409 23.156 26.409 25.0255C26.409 25.9823 25.4207 26.7565 24.2059 26.7565C22.991 26.7565 22.0028 25.9823 22.0028 25.0255"
                    fill="#FEC42D"
                  />
                  <path
                    d="M26.409 21.5635C26.409 20.6067 25.4207 19.8325 24.2059 19.8325C22.991 19.8325 22.0028 20.6067 22.0028 21.5635C22.0028 23.433 26.409 23.156 26.409 25.0255C26.409 25.9823 25.4207 26.7565 24.2059 26.7565C22.991 26.7565 22.0028 25.9823 22.0028 25.0255"
                    stroke="white"
                    stroke-width="1.37335"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                  <path
                    d="M15.8631 11.9339L16.6655 11.1316C17.4679 10.3292 18.7626 10.3292 19.5649 11.1316C20.3673 11.9339 20.3673 13.2286 19.5649 14.031L16.9846 16.6113C16.1823 17.4136 14.8876 17.4136 14.0852 16.6113"
                    stroke="#1E59CF"
                    stroke-width="1.36765"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                  <path
                    d="M13.9212 19.6746L13.1189 20.477C12.3165 21.2793 11.0218 21.2793 10.2194 20.477C9.41709 19.6746 9.41709 18.3799 10.2194 17.5776L12.7997 14.9973C13.6021 14.1949 14.8968 14.1949 15.6992 14.9973"
                    stroke="#1E59CF"
                    stroke-width="1.36765"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                </svg>
                <div className="button__text">{translate('lbl_com_3077')}</div>
              </div>
            </div>
          </div>
          {card.mcht_ledg_s === 1 ? (
            <div className="in-process-merchant">
              <div style={{ maxWidth: '80%', marginLeft: 'auto', marginRight: 'auto', marginTop: '15vh' }}>
                <img
                  className="in-process-img"
                  src={inProcessMerchant}
                  alt=""
                  style={{
                    height: '18vh',
                    alignItems: 'center',
                    marginBottom: '3vh',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                />
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    lineHeight: '23px',
                    letterSpacing: '0px',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    width: '100%'
                  }}
                >
                  Merchant
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    lineHeight: '23px',
                    letterSpacing: '0px',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    wordWrap: 'break-word'
                  }}
                >
                  "{card.mcht_eng_nm}"
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '400',
                    lineHeight: '23px',
                    letterSpacing: '0px',
                    textAlign: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  is in review for approval.{' '}
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </>
      )}
    </div>
  );
};

export default withHTMLParseI18n(memo(MerchantItem));
