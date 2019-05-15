import thunk from 'redux-thunk'
import {compose, createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import logger from 'redux-logger'
import {IS_PROD} from "../conf";
import {
	getReduxStore,
	syncStoreDataToWebStorage
} from '../lib/plugins/redux-plugins'
import rootReducer from './reducer'

let plugins = IS_PROD ? compose(applyMiddleware(thunk)) : compose(composeWithDevTools(applyMiddleware(thunk, logger)));

const store = (initialState = getReduxStore()) => {
	const store = createStore(rootReducer, initialState, plugins);
	if (module.hot && !IS_PROD) {
		console.log('replacing reducer...');
		const nextRootReducer = require('./reducer').default;
		store.replaceReducer(nextRootReducer);
	}
	//全局监听redux变量更新
	syncStoreDataToWebStorage(store);
	return store
};

export default store()
