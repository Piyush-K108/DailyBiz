import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Counter/counterReducer'; 
import globalReducer from './index'; 
import commonReducer from './Counter/commonSlice';
// Create the store
const store = configureStore({
  reducer: {
    global: globalReducer, 
    commonSilce: commonReducer,
    counter: counterReducer, 
  },
});

// Export the store
export default store;