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
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://standom-api', // Auth0 API (audience) ID used to issue an access token for calls to the backend.
        //scope: "read:current_user update:current_user_metadata"
      }}>
        <SquidContextProvider
          options={{
            appId: process.env.REACT_APP_SQUID_APP_ID,
            region: process.env.REACT_APP_SQUID_REGION, // example: 'us-east-1.aws'
            environmentId: process.env.REACT_APP_SQUID_ENVIRONMENT_ID, // choose one of 'dev' or 'prod'
            squidDeveloperId: process.env.REACT_APP_SQUID_DEVELOPER_ID,
          }}>
            <Provider store={store}>
                <App />
            </Provider>
        </SquidContextProvider>
    </Auth0Provider>
  </React.StrictMode>
);


