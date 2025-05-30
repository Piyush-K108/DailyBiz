import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Counter/counterReducer'; // Ensure this path is correct
import globalReducer from './index'; // Ensure this path is correct

// Create the store
const store = configureStore({
  reducer: {
    global: globalReducer, // Add the global reducer
    counter: counterReducer, // Add the counter reducer
  },
});

// Export the store
export default store;