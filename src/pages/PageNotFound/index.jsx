import errorImg from '@assets/images/failure.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import reloadWebView from '@utilities/gmCommon/reloadWebView';
import { moveHome } from '@utilities/index';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

//TODO: Missing labels
const PageNotFound = ({ translate: t }) => {
  const handleMoveHome = () => {
    moveHome();
    reloadWebView();
  };

  return (
    <div className="page-success page-gradient">
      <div className="success__header">
        <div className="success__img">
          <img
            src={errorImg}
            alt="Complete"
          />
        </div>
        <div className="success__title">
          <span>Page Not Found</span>
        </div>
        <div className="note">
          The page you are looking for has been either changed or deleted, making it unavailable for use
        </div>
      </div>
      <div className="footer__fixed flex-gap-x-8">
        <Button
          variant="filled__primary"
          label="Home"
          className="btn__cta"
          onClick={handleMoveHome}
        />
      </div>
    </div>
  );
};

export default withHTMLParseI18n(PageNotFound);
