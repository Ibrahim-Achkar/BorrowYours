//package imports
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
//app imports
import { myStore } from './store/configureStore';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

const store = myStore();
const persistor = persistStore(store);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Header />
          <main className='py-3'>
            <Container>
              <Route path='/login' component={LoginScreen} />
              <Route path='/' component={HomeScreen} exact />
            </Container>
          </main>
          <Footer />
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
