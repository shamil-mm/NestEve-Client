// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {store} from "./store/index.ts"
import App from './App.tsx'
import { Provider } from 'react-redux'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  // </StrictMode>,
)
