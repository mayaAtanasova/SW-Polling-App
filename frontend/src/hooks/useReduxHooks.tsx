import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';

export const useMyDispatch = () => useDispatch<AppDispatch>();
export const useMySelector: TypedUseSelectorHook<RootState> = useSelector;