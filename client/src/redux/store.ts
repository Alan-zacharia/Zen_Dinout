import { combineReducers, configureStore } from "@reduxjs/toolkit";
import restaurantsReducer from "./restaurant/restaurantSearchSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice";
import tableBookingReducer from "./user/tableBookingSlice";
import currentChatReducer from "./chat/currentChatSLice";
import { useDispatch } from "react-redux";

const rootReducer = combineReducers({
  user: userReducer,
  restaurant: restaurantsReducer,
  booking: tableBookingReducer,
  currentChat : currentChatReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
