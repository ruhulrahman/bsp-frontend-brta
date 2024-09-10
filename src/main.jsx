// import './custom-bootstrap.scss';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/src/sweetalert2.scss';
import App from './App.jsx';
import './i18n';
import { store } from './store/store';
import './index.css';
import "flatpickr/dist/themes/material_green.css";

window.pagination = {
  page: 1,
  size: 10,
  // currentPage: 1,
  // totalRows: 0,
  // perPage: 10,
  // slOffset: 1
};

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
