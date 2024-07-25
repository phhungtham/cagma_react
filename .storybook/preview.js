import '../src/styles/index.scss';
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'shinhan',
        value: '#3270ea'
      },
      {
        name: 'light',
        value: '#fff'
      },
      {
        name: 'dark',
        value: '#000'
      }
    ]
  }
};
