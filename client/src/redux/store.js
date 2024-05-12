import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice'; // Correct import for a reducer from a slice
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Configuration for persistence
const persistConfig = {
  key: 'root', // Key for storage
  storage, // Storage engine
  version: 1,
};

// Apply persistence to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer, // Use persisted reducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Be cautious when disabling serializable checks
    }),
});

// Create persistor for the store
export const persistor = persistStore(store); // Persistor for rehydration
