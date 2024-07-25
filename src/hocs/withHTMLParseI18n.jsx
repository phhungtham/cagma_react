import parserDataToHtml from '@utilities/parserHtml';
import { useTranslation } from 'react-i18next';

export default function withHTMLParseI18n(WrappedComponent) {
  const Component = props => {
    const { t: translateI18n } = useTranslation();

    const translate = label => {
      return parserDataToHtml(translateI18n(label));
    };
    return <WrappedComponent {...props} translate={translate}/>;
  };
  return Component;
}
