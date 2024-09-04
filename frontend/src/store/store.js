// store.js
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "../reducer/rootReducer.js";
import {configureStore} from "@reduxjs/toolkit";

const persistConfig = {
    key: "root",
    storage, // Use localStorage
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer
const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

const persistor = persistStore(store);

export {store, persistor};
