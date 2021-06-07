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
import CreateItemScreen from './screens/CreateItemScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/profile' render={ProfileScreen} exact />
          <Route
            path='/profile/page/:pageNumber'
            render={ProfileScreen}
            exact
          />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' render={RegisterScreen} />
          <Route path='/items/:id' component={ItemScreen} exact />
          <Route path='/items' component={ItemListScreen} exact />
          <Route path='/items/page/:pageNumber' render={ItemListScreen} exact />
          <Route path='/create_item' component={CreateItemScreen} />
          <Route path='/users' render={UsersScreen} />
          <Route path='/' render={HomeScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
