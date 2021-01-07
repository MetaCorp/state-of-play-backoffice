import * as React from 'react';
import { Component } from 'react';
import buildGraphQLProvider from 'ra-data-graphql';
import { Admin, Resource, Delete } from 'react-admin';

import buildQuery from './buildQuery'; // see Specify your queries and mutations section below
import { UserCreate, UserEdit, UserList } from './components/admin/users';
// import { createNetworkInterface } from 'react-apollo';
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from "@apollo/client/link/error";

import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
} from 'ra-core';

import pluralize from 'pluralize';


const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([link, new HttpLink({
    // uri: 'https://housely-server.ew.r.appspot.com/graphql'
    uri: 'http://localhost:4000/graphql'
  })])
});

const firstLowerCase = str => str.charAt(0).toLowerCase() + str.slice(1);

class App extends Component {
    constructor() {
        super();
        this.state = { dataProvider: null };
    }
    componentDidMount() {
      buildGraphQLProvider({
        client: client,
        buildQuery,
        introspection: {
          operationNames: {
              [GET_LIST]: resource => `${firstLowerCase(pluralize(resource.name))}`,
              [GET_ONE]: resource => `${firstLowerCase(resource.name)}`,
              [GET_MANY]: resource => `${firstLowerCase(pluralize(resource.name))}`,
              [GET_MANY_REFERENCE]: resource => `${firstLowerCase(pluralize(resource.name))}`,
              [CREATE]: resource => `create${resource.name}`,
              [UPDATE]: resource => `update${resource.name}Admin`,
              [DELETE]: resource => `delete${resource.name}`,
          },
          exclude: undefined,
          include: undefined,
      },
      }).then(dataProvider => this.setState({ dataProvider }));
    }

    render() {
      const { dataProvider } = this.state;

      if (!dataProvider) {
        return <div>Loading</div>;
      }

      return (
        <Admin dataProvider={dataProvider}>
          <Resource name="User" list={UserList} edit={UserEdit} create={UserCreate} />
        </Admin>
      );
    }
}

export default App;