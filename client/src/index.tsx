import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo-hooks';
import { createOfflineClient } from './client'
import { OffixProvider } from './lib/offix-react-hooks/OffixProvider'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


const theme = createMuiTheme({
  palette: {
    primary: { main: '#2c6157' },
    secondary: { main: '#6fd056' },
  },
});

const client = createOfflineClient()

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <OffixProvider client={client}>
      <App />
    </OffixProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
