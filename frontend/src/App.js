import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { myStore } from './store/configureStore';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

const store = myStore();

const App = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
