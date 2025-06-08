import { useSelector } from "react-redux";
import moment from "moment"
import momentTZ from "moment-timezone";
/**
 * Check user is loggedIn
 */
export function getLocalStorageData(key) {
    //const token = window.localStorage.getItem("token");
    const loggedUserData = window.localStorage.getItem(key);
    return JSON.parse(loggedUserData);
}
/**
 * Check user is loggedIn
 */
export function isUserLoggedIn() {
    //const token = window.localStorage.getItem("token");
    const loggedUserData = getLocalStorageData("loggedUser");
    return loggedUserData && Object.keys(loggedUserData).length > 0 
    // return !!(loggedUserData && loggedUserData.token);
}

/**
 * States of the slice
 * @readonly
 * @enum {string}
 */
export const Status = {
    /** The initial state */
    IDLE: "idle",
    /** The loading state */
    LOADING: "loading",
    /** The success state */
    SUCCESS: "success",
    /** The error state */
    FAILURE: "failure",
};

/**
 * Check if error is an ApiError
 *
 * @param {object} error
 * @returns {boolean} error is ApiError
 */
export function isApiError(error) {
    switch (error.name) {
        case "AxiosError":
            return typeof error === "object" && error !== null;
        case "errors":
            return (
                typeof error === "object" && error !== null && "errors" in error
            );
        default:
            break;
    }
}


/**
 * find File By Type
 */

export const findFileByType = (data,type) => {
    let a = data.filter((item)=>item.filetype.split("/")[0] === type)
    return a;
}
  


/**
 * Error code & Error Message
 */
export const getErrorDetails = (error) => {
    let statusCode = "";
    let msg = "";
    statusCode = error.response.status ? error.response.status : error.code;
    msg = error.response.data ? error.response.data.message : error.message;
    return { statusCode, msg };
};

/**
 * @param {import('@reduxjs/toolkit').Draft} state
 * @param {import('@reduxjs/toolkit').PayloadAction} action
 */
export function successReducer(state, _action) {
    state.status = Status.SUCCESS;
    //state.errors = action.payload.error;
}
export function failureReducer(state, _action) {
    state.status = Status.FAILURE;
    //state.errors = action.payload.error;
}

/**
 * clean object
 */
export const objDeepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
/**
 * First letter capital
 */
export const firstLetterCapitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const isAdminUser = (role) => {
    return role === "ADMIN" ? true : false;
};

/**
 * Today Data time
 */
//   export const getTodayDateTime = () => {
//     //2021-07-17T14:13
//     return moment().format("YYYY-MM-DDTHH:mm");
//   };

/**
 * date custome format
 */

export const dateCustomFormat = (date, format, isCon = false) => {
    if (isCon === true) {
      return moment(date).utc().format(format); //convert with utc
    } else {
      return moment(date).format(format);
    }
};

export const dateUTCTOIST = (date, format) => {
    const kolkataTime = momentTZ(date).tz('Asia/Kolkata');
    let istTime = kolkataTime.format(format);
    return istTime;
};

export const utcToIST_ddmmyyyy = (utcDateString) => {

    const date = new Date(utcDateString);
    // Convert to IST (UTC+5:30)
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime());

    const day = String(istDate.getDate()).padStart(2, '0');
    const month = String(istDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = istDate.getFullYear();

    return `${day}-${month}-${year}`;
};


export const addDayInDate = (date, days) => {
    let day = ((60 * 60 * 24 * 1000)*days);
    let newDate = new Date(date.getTime() + day);
    return newDate;
};

export const substractDayInDate = (date, days) => {
    let day = ((60 * 60 * 24 * 1000)*(days-1));
    let newDate = new Date(date.getTime() - day)
    return newDate;
};

export const checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) {
        return true;
    }

    if (rules.required) {
        isValid = value !== "" && isValid;
        // isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isAlphabetsNumeric) {
        const pattern = /^[A-Za-z0-9\s_-]+$/;
        isValid = pattern.test(value) && isValid;
    }

    if (rules.isAlphabets) {
        const pattern = /^[a-zA-Z ]*$/;
        isValid = pattern.test(value) && isValid;
    }

    if (rules.isEmail) {
        const pattern =
            /[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/;
        isValid = pattern.test(value) && isValid;
    }

    return isValid;
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};

export const updateFormData = (obj) => {
    const { formobj, value, field } = obj;
    const updatedFormElement = updateObject(formobj[field], {
        value: value,
        valid: checkValidity(value, formobj[field].validation),
        touched: true,
    });
    return updateObject(formobj, {
        [field]: updatedFormElement,
    });
};

export const rowMaterialUserFriendly = (key) =>{

    switch (key) {
        case "resin":
            return 'Resin'
        case "fiber":
            return 'Fiber'
        case "getcoat":
            return 'Get Coat'
        case "sandingDisc":
            return 'Sanding Disc'
        case "primerGrey":
            return 'Primer Grey'
        case "primerGreen":
            return 'Primer Green'
        case "puBlackPaint":
            return 'Pu Black Paint'
        case "thinner":
            return 'Thinner'
        case "putti":
            return 'Putti'
        default:
            break;
    }
};

/**
 * Format string by replacing underscores with spaces and capitalizing words
 * @param {string} str - The string to format
 * @returns {string} Formatted string
 */
export const formatString = (str) => {
    if (!str) return '';
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};