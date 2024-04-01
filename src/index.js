import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { SquidContextProvider } from '@squidcloud/react';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './Utilities/Redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
        crossOrigin="anonymous"
    />
    <Auth0Provider
      domain="dev-v7r2nkibjlmlj717.us.auth0.com"
      clientId="4Scu56U3UQaERmPWdAxqY42er4vuhdmF"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://standom-api', // Auth0 API (audience) ID used to issue an access token for calls to the backend.
        //scope: "read:current_user update:current_user_metadata"
      }}>
        <SquidContextProvider
          options={{
            appId: '4e3yja9i5vo8i2t4ch',
            region: 'us-east-1.aws', // example: 'us-east-1.aws'
            environmentId: 'dev', // choose one of 'dev' or 'prod'
            squidDeveloperId: 'u9c239qpm51zgzhxit',
          }}>
            <Provider store={store}>
              <App />
            </Provider>
        </SquidContextProvider>
    </Auth0Provider>
  </React.StrictMode>
);


