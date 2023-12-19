import { legacy_createStore as createStore, combineReducers, applyMiddleware} from 'redux'
import { productsReducer } from './productsReducer';
import thunk from 'redux-thunk'
import { cartReducer } from './cartReducer';
import userReducer from "./userReducer";
import { wishReducer } from './wishlistReducer';
import { paymentReducer } from './paymentReducer'


const rootReducer = combineReducers({productsReducer, cartReducer, userReducer, wishReducer, paymentReducer})


const store = createStore(rootReducer, applyMiddleware(thunk));

export { store }