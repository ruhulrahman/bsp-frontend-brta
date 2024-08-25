import '@/assets/css/fontawesome/all.min.css';
import '@/assets/css/fontawesome/brands.min.css';
import '@/assets/css/fontawesome/fontawesome.min.css';
import '@/assets/css/fontawesome/regular.min.css';
import '@/assets/css/fontawesome/solid.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/src/sweetalert2.scss';
import App from './App.jsx';
import './index.css';
import { store } from './store/store';

// import Toast from 'vue-toastification'
// import the CSS or use your own!
// import 'vue-toastification/dist/index.css'

// library.add(fas, far, fab)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
    <Provider store={store}>
    <App />
  </Provider>,
)
