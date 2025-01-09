import React from 'react';

import reloadWebView from '@utilities/gmCommon/reloadWebView';
import { moveHome } from '@utilities/index';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import Alert from './atoms/Alert';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('error boundary :>> ', error);
    console.log('errorInfo :>> ', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          isCloseButton={false}
          isShowAlert={this.state.hasError}
          textAlign="center"
          title="A temporary error has occurred." //TODO: Missing label lbl_com_4261
          subtitle="Please try again later." //lbl_com_4262
          firstButton={{
            onClick: () => {
              moveHome();
              reloadWebView();
            },
            label: 'Home', //lbl_com_4263
          }}
        />
      );
    }
    return this.props.children;
  }
}

export default withHTMLParseI18n(ErrorBoundary);
