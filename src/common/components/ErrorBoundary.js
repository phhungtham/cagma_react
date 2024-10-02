import React from 'react';

import reloadWebView from '@utilities/gmCommon/reloadWebView';
import { moveHome } from '@utilities/index';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import Alert from './molecules/Alert';

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
          subtitle="Sorry, An unexpected error occurred. If it occurs during a transaction, Please check the transaction history of your account."
          firstButton={{
            onClick: () => {
              moveHome();
              reloadWebView();
            },
            label: 'Confirm',
          }}
        />
      );
    }
    return this.props.children;
  }
}

export default withHTMLParseI18n(ErrorBoundary);
