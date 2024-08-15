import Header from '@common/ui/components/Header';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { moveBack } from '@utilities/index';
import TermAndConditions from './components/TermAndConditions';

const OpenAccount = ({translation}) => {
  return (
    <div className="open-account__wrapper">
      <TermAndConditions />
    </div>
  );
};

export default withHTMLParseI18n(OpenAccount);