import React from 'react'
import Router from './router'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'//供应商
import { PersistGate } from 'redux-persist/integration/react'//可持久化
import { store, persistor } from './redux/store'
import './App.css'
export default function App() {


  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}
