import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux'
import { store } from './store/store'
import '@/assets/css/fontawesome/all.min.css';
import '@/assets/css/fontawesome/fontawesome.min.css';
import '@/assets/css/fontawesome/regular.min.css';
import '@/assets/css/fontawesome/solid.min.css';
import '@/assets/css/fontawesome/brands.min.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

// import Toast from 'vue-toastification'
// import the CSS or use your own!
// import 'vue-toastification/dist/index.css'

library.add(fas)
// library.add(fas, far, fab)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
    <Provider store={store}>
    <App />
  </Provider>,
)
