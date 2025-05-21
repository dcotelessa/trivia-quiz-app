import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Fix for import.meta.env
const httpLink = createHttpLink({
  uri: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GRAPHQL_URL) || 'http://localhost:3001/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
