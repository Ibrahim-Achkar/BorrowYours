import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import configureStore from './store/configureStore';
import HomeScreen from './screens/HomeScreen';

const store = configureStore();

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <main className='py-3'>
          <Container>
            <Route path='/' component={HomeScreen} exact />
          </Container>
        </main>
        <Footer />
      </Router>
    </Provider>
  );
};

export default App;
