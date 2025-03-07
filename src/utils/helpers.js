import { toast } from 'react-toastify';
// import { toBengaliNumber, toBengaliWord } from 'bengali-number'

// const { permissions } = useSelector((state) => state.auth) || [];

export const toaster = (msg, type = 'success') => {

  if (type == 'success') {
    toast.success(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } else if (type == 'error') {
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } else {
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  // toast.success('🦄 Wow so easy!', {
  //     position: "top-right",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "colored",
  // });
}

// import { Notyf } from 'notyf'
import Hashids from 'hashids';
import moment from 'moment';


export const pagination = {
  currentPage: 0,
  perPage: 10,
  totalRows: 0,
  totalPages: 0,
  slOffset: 1,
}

export function cn(obj, input, if_false = '') {
  const elements = input.split('.')

  for (let i = 0; i < elements.length; i++) {
    if (!obj || !obj[elements[i]]) {
      return if_false
    }

    obj = obj[elements[i]]
  }

  if (obj) return obj
  return if_false
}

export default {
  loading: false,
  cn: function (obj, input, if_false = '') {
    const elements = input.split('.')

    for (let i = 0; i < elements.length; i++) {
      if (!obj || !obj[elements[i]]) {
        return if_false
      }

      obj = obj[elements[i]]
    }

    if (obj) return obj
    return if_false
  },
  authUser: function () {
    return JSON.parse(localStorage.getItem('authUser'))
  },
  auth_id: function () {
    this.cn(this.authUser, 'id')
  },
  auth_name: function () {
    this.cn(this.authUser, 'user_name')
  },
  //   noty: function (msg, type ='success', args = null, callback = null) {
  //     let options = {
  //       position: {
  //         x: 'right',
  //         y: 'top',
  //       }
  //     }

  //     if (args) {
  //       options = Object.assign(options, args)
  //     }

  //     const notyfInstance = new Notyf(options)

  //     if (type == 'success') {
  //       notyfInstance.success(msg)
  //     }

  //     if (type == 'error') {
  //       notyfInstance.error(msg)
  //     }

  //     return new Notyf(options)
  //   },
  err_msg: function (err) {
    if (err && err.data && err.data.msg) return err.data.msg
    else return 'Falied to process this request please try again later'
  },
  rand: function (min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  hashids: function (value, encode = true) {
    const hashids = new Hashids('to-pass-url-argument', 32)
    if (encode) return hashids.encode(value)
    else return hashids.decode(value)
  },
  paginationData(data) {
    pagination.currentPage = data.page;
    pagination.totalRows = data.totalElements;
    pagination.perPage = data.size;
    console.log('pagination.perPage', pagination.perPage)
    console.log('pagination.currentPage', pagination.perPage)
    pagination.slOffset = pagination.perPage * (pagination.currentPage + 1) - pagination.perPage + 1;
  },
  checkCurrentDateLessThenDate: function (dateValue) {
    const currentDate = this.dDate(new Date(), "YYYY-MM-DD");
    const anotherDate = this.dDate(dateValue, "YYYY-MM-DD");
    if (anotherDate >= currentDate) {
      return true;
    } else {
      return false;
    }
  },
  dDate: function (value, format = "DD-MM-YYYY") {
    // return moment(value).local().format(format);
    if (value) {``
      return moment(value).format(format);
    }
    return ''
  },
  dDateUtc: function (value, format = "D MMM YYYY") {
    return moment.utc(value).local().format(format);
  },
  dDateTime: function (value, format = "D MMM YYYY LT") {
    return moment.utc(value).local().format(format);
  },
  dTime: function (value, format = "LT") {
    if (value) {
      return moment(value, "HH:mm:ss").format(format);
    }
    return ''
  },
  dRealTime: function (value, format = "LT") {
    return moment(value).local().format(format);
  },
  rTime: function (value) {
    const today = new Date();
    const year = today.getFullYear();
    const mes = today.getMonth() + 1;
    const dia = today.getDate();
    const fecha = year + "-" + mes + "-" + dia;
    return moment(fecha + ' ' + value).format('LT');
  },
  getBetweenHour: function (startTime, endTime) {
    const myEndTime = endTime ? new Date(endTime) : new Date();
    const myStartTime = new Date(startTime);
    const diffMs = myEndTime - myStartTime;
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(
      ((diffMs % 86400000) % 3600000) / 60000
    );
    if (diffHrs > 1) {
      return `${diffHrs} Hours ${diffMins} min`;
    } else {
      return `${diffHrs} Hour ${diffMins} min`;
    }
  },
  dMonth: function (value, format = "MMM YYYY") {
    return moment(value).format(format);
  },
  dYear: function (value, format = "YYYY") {
    return moment(value).format(format);
  },
  dNow: function (value) {
    // return moment(value).fromNow()
    return moment.utc(value).local().fromNow();
  },
  calculateRemainingLife: function (economicLife, manufacturingYear) {
    if (!economicLife) {
      return 0;
    }
    const currentYear = new Date().getFullYear();
    const remainingLife = economicLife - (currentYear - manufacturingYear);
    return remainingLife;
  },
  integer: function (value = 0) {
    const integerValue = value | 0;
    return Number(integerValue).toLocaleString();
  },
  float: function (value = 0.0) {
    const integerValue = parseFloat(value);
    return Number(integerValue).toLocaleString();
  },
  float2: function (value = 0.0) {
    const double = parseFloat(value).toFixed(2);
    return Number(double).toLocaleString();
  },
  limit_str: function (str, limit = 20, alt_str = "...") {
    return str.length > limit
      ? str.substring(0, limit - 3) + alt_str
      : str;
  },
  avatarText: function (value) {
    const matches = value.match(/\b(\w)/g)

    if (matches.length == 1) {
      return value.substring(0, 2).toLocaleUpperCase();
    } else {
      const data = matches.filter((item, index) => {
        if (index < 2) {
          return Object.assign({}, item);
        }
      });
      return data.join("");
    }
  },
  has_permission: function (permit_code) {

    console.log('permit_code', permit_code)

    // let permission_disable=this.$store.state.site.permission_disable;
    let permission_disable = false

    if (permission_disable) {
      return true;
    } else if (permit_code) {

      if (permit_code == "permitted") {
        return true;
      } else {

        // const authStore = useAuthStore();

        // const store = pinia.store;
        // const authStore = useAuthStore(store);
        // const permissions = authStore.permissions;
        // const permissions = []
        // console.log('permissions', authStore)
        const permissions = []

        if (permissions && permissions.length) {

          const userPermission = permissions.find(
            (permission) => permission == permit_code
          );

          return userPermission == undefined ? false : true;

        } else {
          return false;
        }
      }

    } else return false;
  },
  errorHandler: function (error) {
    if (error.response.status === 401) {
      localStorage.clear();
      toaster('Unauthorized access', 'error')
      // window.location.href = '/logout'
    } else if (error.response.status === 403) {
      toaster('Forbidden, The client does not have access rights to the content', 'error')
    } else if (error.response.status === 404) {
      toaster('Source Not Found', 'error')
    } else if (error.response.status === 500) {
      toaster('Internal Server Error', 'error')
    } else if (error.response.status === 503) {
      toaster('Service Unavailable', 'error')
    }
    return error
  },
  generateUniqueId: function (type = 'normal') {
    if (type === 'short') return Date.now().toString(36);
    if (type === 'normal') return Date.now().toString(36) + Math.random().toString(36).substring(2);
    if (type === 'long') return crypto.randomUUID();
  },
  getErrorMessage: function (error) {
    console.log('error checking message', error);
    if (error.response && error.response.data) {
      // Map API errors to Formik fields
      const apiErrors = error.response.data; // Assuming API returns a field-wise error object
      if (apiErrors) {
        return apiErrors; // Map errors to form fields
      } else if (error.response.data.message) {
        return { form: error.response.data.message }; // Global form error
      }
    } else {
      // Set a global form error if no field-specific errors exist
      return { form: 'An unexpected error occurred. Please try again.' };
    }
  },
  masked: function (input) {
    const str = input.toString();
    if (str.length <= 4) {
      return str;
    }

    const firstTwo = str.slice(0, 2); // First 2 characters
    const lastTwo = str.slice(-2); // Last 2 characters
    const maskedPart = '*'.repeat(str.length - 4); // Middle part replaced with *
    console.log('maskedPart', maskedPart)

    return firstTwo + maskedPart + lastTwo;
  },
  replaceRegularExpression: function (input) {
    /* 
        Explanation:
        [-\/\\,\s\[\]\(\)]:
        
        -: Matches hyphen/dash.
        \/: Matches forward slash.
        \\: Matches backslash (requires escaping with \\ because \ is a special character in regex).
        ,: Matches comma.
        \s: Matches any whitespace character (spaces, tabs, newlines).
        \[\]: Matches square brackets [ and ] (requires escaping with \).
        \(\): Matches parentheses ( and ) (requires escaping with \).
        g (global flag):
        
        Ensures that all occurrences in the string are replaced, not just the first.
    */
    const sanitizedValue = input.replace(/[-\/\\,\s\[\]\(\)]/g, "_");

    return sanitizedValue
  },
  compareValuesAreSame: function (obj1, obj2) {
    return Object.keys(obj1).every(key => obj1[key] === obj2[key]);
  },
  sumArray: function (arr = []) {
    return arr.reduce((sum, value) => sum + value, 0);
  },
  capitalizeFirstLetter: function (string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  isEmptyObject: function (obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  },
}

// Function to calculate the sum of an array of numbers
export const sumArray = (arr = []) => {
  return arr.reduce((sum, value) => sum + value, 0);
};

// Function to capitalize the first letter of a string
export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to check if an object is empty
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

