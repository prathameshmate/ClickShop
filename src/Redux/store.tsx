import { configureStore  } from "@reduxjs/toolkit"
import rootReducer from "./combineReducer"
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";



const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
})

export default store;