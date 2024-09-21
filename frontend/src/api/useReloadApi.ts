import { ReloadApiContext } from './ReloadApiContext.tsx';
import { useContext } from 'react';

export function useReloadApi() {
    const context = useContext(ReloadApiContext);

    return context!.reloadApi;
}