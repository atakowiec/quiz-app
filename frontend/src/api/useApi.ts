import React, { useContext, useEffect, useRef, useState } from 'react';
import getApi from './axios.ts';
import { ReloadApiContext } from './ReloadApiContext.tsx';

export interface ApiData<T> {
    data: T | null | undefined
    loaded: boolean
    error: boolean | Error
    setData: React.Dispatch<any>
}

export default function useApi<DataType = any>(path: string, method: string, payload?: any): ApiData<DataType> {
    const [data, setData] = useState<DataType | null | undefined>(undefined);
    const [error, setError] = useState(false as boolean | Error);
    const reloadToken = useContext(ReloadApiContext)?.reloadToken

    const isLoaded = useRef(false);

    useEffect(() => {
        isLoaded.current = false;
        console.log({path, method});
        (getApi() as any)[method.toLowerCase()](path, payload)
            .then((res: any) => {
                setData(res.data);
                setError(false)
                isLoaded.current = true;
            })
            .catch((e: Error) => {
                console.log(e)
                setData(null)
                setError(e);
                isLoaded.current = true;
            })
    }, [path, method, payload, reloadToken]);

    return {loaded: isLoaded.current, data: isLoaded.current ? data : undefined, error, setData};
}