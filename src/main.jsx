import 'bootstrap/dist/css/bootstrap.min.css';
// import './custom-bootstrap.scss';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/src/sweetalert2.scss';
import App from './App.jsx';
import './index.css';
import './i18n';
import { store } from './store/store';

// const preferredLanguage = localStorage.getItem('preferredLanguage');

// if (!preferredLanguage) {
//   localStorage.setItem('preferredLanguage', 'bn');
// }


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
