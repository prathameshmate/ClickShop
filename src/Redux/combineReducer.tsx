import {combineReducers} from 'redux';
import cartReducer from './cartReducer';
import wishlistReducer from './wishlistReducer';
import addressReducer from './addressReducer';
import productsReducer from './productsReducer';

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  address: addressReducer,
  products: productsReducer,
});

export default rootReducer;
