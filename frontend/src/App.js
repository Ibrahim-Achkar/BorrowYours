//package imports
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

//app imports
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ItemListScreen from './screens/ItemListScreen';
import UsersScreen from './screens/UsersScreen';
import ItemScreen from './screens/ItemScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/items/:id' component={ItemScreen} exact />
          <Route path='/items' component={ItemListScreen} exact />
          <Route
            path='/items/page/:pageNumber'
            component={ItemListScreen}
            exact
          />
          <Route path='/users' component={UsersScreen} />
          <Route path='/' component={HomeScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
