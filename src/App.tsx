import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apollo-client';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AppNavigator />
    </ApolloProvider>
  );
};

export default App;
