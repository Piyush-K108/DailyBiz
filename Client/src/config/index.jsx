export const API_URL = import.meta.env.VITE_DOMAIN

export const KEY = import.meta.env.VITE_KEY
export const MKEY = import.meta.env.VITE_MKEY

export const DKEY= import.meta.env.VITE_APP_AUTH_DOMAIN
export const PKEY= import.meta.env.VITE_APP_PROJECT_ID
export const SKEY= import.meta.env.VITE_APP_STORAGE_BUCKET
export const MSKEY= import.meta.env.VITE_APP_MESSAGING_SENDER_ID
export const AKEY= import.meta.env.VITE_APP_APP_ID
export const MEKEY= import.meta.env.VITE_APP_MEASUREMENT_ID


export const drawerWidth = 260;

export const twitterColor = "#1DA1F2";
export const facebookColor = "#3b5998";
export const linkedInColor = "#0e76a8";

export const snackbarSetting = {
    vertical: "top", 
    horizontal: "right", 
    autoHideDuration: 6000,
};

// ==============================|| THEME CONFIG  ||============================== //

const config = {
    defaultPath: "/dashboard",
    fontFamily: `'Public Sans', sans-serif`,
    i18n: "en",
    miniDrawer: false,
    container: true,
    mode: "light",
    presetColor: "default",
    themeDirection: "ltr",
    alertVariant: "filled", 
    alertDisplayType: "Snackbar", 
};

export default config;
