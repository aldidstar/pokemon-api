import { BrowserRouter } from "react-router-dom";
import RouterPage from "./router";
import { ApolloClient } from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import "./App.css";

function App() {
  const httpLink = new createHttpLink({
    uri: "https://graphql-pokeapi.graphcdn.app/",
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <RouterPage />
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
