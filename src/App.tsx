import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Error from './pages/Error';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import create from './redux/create';

const store = create();

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={Error}>
        <BrowserRouter>
          <Switch>
            <Route path="/results" component={Home} />
            <Route exact path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
