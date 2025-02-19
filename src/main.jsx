// import './custom-bootstrap.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import "flatpickr/dist/themes/material_green.css";
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/src/sweetalert2.scss';
import App from './App.jsx';
import './i18n';
import './index.css';
import { store } from './store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

window.pagination = {
  page: 1,
  size: 4,
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

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
)
