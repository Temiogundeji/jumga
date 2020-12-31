import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { fetchProducts } from './features/products/productsSlice'


// Pages
import Homepage from './pages/Homepage/Homepage'
import ProductPage from './pages/ProductPage/ProductPage';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import CartPage from './pages/CartPage/CartPage';

// Components
import ScrollToTop from './ScrollToTop';

import './App.css';


const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  // eslint-disable-next-line
  }, []);


  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/:category/:id" component={ProductPage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/cart" component={CartPage} />
      </Switch>
    </Router>
  );
}

export default App;
