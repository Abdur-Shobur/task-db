import {
	Action,
	combineReducers,
	configureStore,
	ThunkAction,
} from '@reduxjs/toolkit';

import { apiSlice } from './features/api/apiSlice';
import counterReducer from './features/counter/counterSlice';

// import webReducer from './web'

// ...

const rootReducer = combineReducers({
	counter: counterReducer,
	[apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
	return configureStore({
		reducer: rootReducer,
		devTools: process.env.NODE_ENV !== 'production',

		middleware: (getDefaultMiddleware) => {
			return getDefaultMiddleware().concat(apiSlice.middleware);
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
	ThunkReturnType,
	RootState,
	unknown,
	Action
>;
