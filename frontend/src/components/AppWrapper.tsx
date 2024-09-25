import { ReactNode, useEffect, useState } from "react";
import useApi from "../api/useApi.ts";
import { globalDataActions } from "../store/globalDataSlice.ts";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userSlice.ts";
import { useSocket } from "../socket/useSocket.ts";
import getApi from "../api/axios.ts";
import { AxiosError, AxiosResponse } from "axios";
import { UserPacket } from "@shared/user";
import { useReloadApi } from "../api/useReloadApi.ts";
import LoadingScreen from "./loading-screen/LoadingScreen.tsx";
import { toast } from "react-toastify";

export default function AppWrapper({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const socket = useSocket();
  const reloadApi = useReloadApi();
  const categoriesData = useApi("/questions/categories", "get");
  const [refreshToken, setRefreshToken] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  // on start of the application check whether the user has some valid token
  useEffect(() => {
    getApi()
      .post("/auth/verify")
      .then((response: AxiosResponse<UserPacket>) => {
        dispatch(userActions.setUser(response.data));

        if (response.data.id) {
          socket.connect();
        }

        setError(null);
        setLoaded(true);

        if (refreshToken > 5) {
          toast.info("Udało się połączyć z serwerem!")
        }
      })
      .catch((error: AxiosError) => {
        dispatch(userActions.setUser(null));
        setError(error)
        setLoaded(true);

        // if there was an error, try again in 3 seconds
        setTimeout(() => {
          setRefreshToken(prevState => prevState + 1);
          reloadApi();
        }, 3000)
      });
  }, [refreshToken]);

  // on the start of the application fetch the categories and store them in the global state
  useEffect(() => {
    if (!categoriesData.loaded) return;

    dispatch(globalDataActions.setData({ categories: categoriesData.data }));
  }, [categoriesData]);

  if (!loaded) {
    return <LoadingScreen empty={true} attempt={0}/>
  }

  // check if there was an error and if it's a network error - server errors have a number code
  if (error && isNaN(parseInt(error.code ?? ""))) {
    return <LoadingScreen empty={false} attempt={refreshToken}/>
  }

  if (!categoriesData.loaded)
    return null;

  return children;
}