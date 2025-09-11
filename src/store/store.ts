// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { usersApi } from './api/usersApi';
import { categoriesApi } from './api/categoriesApi';
import { postsApi } from './api/postsApi';
import { welcomeBannerApi } from './api/welcomeBannerApi';
import { audioApi } from './api/audioApi';
import { notificationsApi } from './api/notificationsApi';
import { termsApi } from './api/termsApi';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [welcomeBannerApi.reducerPath]: welcomeBannerApi.reducer,
    [audioApi.reducerPath]: audioApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [termsApi.reducerPath]: termsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }).concat(
      authApi.middleware,
      usersApi.middleware,
      categoriesApi.middleware,
      postsApi.middleware,
      welcomeBannerApi.middleware,
      audioApi.middleware,
      notificationsApi.middleware,
      termsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;