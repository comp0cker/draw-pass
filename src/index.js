import React from 'react';
import ReactDOM from 'react-dom';

import Amplify from 'aws-amplify';
import gql from 'graphql-tag';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import config from './aws-exports'
import App from './App';
import './index.css';

import { listDecks } from './graphql/queries';

Amplify.configure(config)

const client = new AWSAppSyncClient({
  url: config.aws_appsync_graphqlEndpoint,
  region: config.aws_appsync_region,
  auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: config.aws_appsync_apiKey,
  }
});

client.query({
  query: gql(listDecks)
}).then(({ data }) => {
  console.log(data);
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
