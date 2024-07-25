import reloadWebView from '@utilities/gmCommon/reloadWebView';
import { moveHome } from '@utilities/index';
import React from 'react';
import Alert from './components/atomic/Alert/Alert';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {}

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          isCloseButton={false}
          isShowAlert={this.state.hasError}
          subtitle={this.props.translate('lbl_com_3235')} // get translate props from withHTMLParseI18n HOC, 2023/07/07  Yen, KHGMA-2035
          // subtitle = 'Error'
          alertType={'E'}
          firstButton={{
            onClick: () => {
              moveHome();
              reloadWebView();
            },
            // label: 'Reload'
            label: this.props.translate('lbl_cta_3006') // get translate props from withHTMLParseI18n HOC, 2023/07/07  Yen, KHGMA-2035
          }}
        />
      );
    }
    return this.props.children;
  }
}

export default withHTMLParseI18n(ErrorBoundary);