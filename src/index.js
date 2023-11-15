import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./utils/history";
import { getConfig } from "./config";
import { ChakraProvider } from '@chakra-ui/react'
// import dotenv from 'dotenv';
// dotenv.config();
const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

const config = getConfig();

const providerConfig = {
  domain:`dev-st4zy53myhpbn3os.us.auth0.com`,
  clientId: `2x5gOPz000GzXalQK1XWjaLQo1nYZZPB`,
  onRedirectCallback,
  authorizationParams: {
    redirect_uri: "https://book-app-frontend-prod-2.vercel.app/",
    ...(`https://book-api-auth0-e4ad716ccb6a.herokuapp.com`? { audience: `https://book-api-auth0-e4ad716ccb6a.herokuapp.com` } : null),
  },
};

const root = createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    {...providerConfig}
  >

    <ChakraProvider>
      <App />
    </ChakraProvider>


    
  </Auth0Provider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
