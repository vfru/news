import { legacy_createStore as createStore, combineReducers } from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const persistConfig = {
    key: 'root',
    storage,
    //blacklist:
    //whitelist:
    blacklist:['LoadingReducer']
}
//合并所有的reducer
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})
//reducer的持久化
const persistedReducer = persistReducer(persistConfig, reducer)


const store = createStore(persistedReducer)
const persistor  = persistStore(store)

export { store, persistor  }



/*
原始的方法
store.dispatch()
store.subsribe()
*/ 