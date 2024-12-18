import { ReactNode, useEffect, useState } from "react";
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
  const [refreshToken, setRefreshToken] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const everythingLoaded = categoriesLoaded && loaded && (!error || !isNaN(parseInt(error.code ?? "")));

  // on start of the application check whether the user has some valid token
  useEffect(() => {
    getApi()
      .post("/auth/verify")
      .then((response: AxiosResponse<UserPacket>) => {
        dispatch(userActions.setUser(response.data));

        if (response.data.username) {
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
    getApi().get("/questions/categories")
      .then((response: AxiosResponse) => {
        dispatch(globalDataActions.setData({ categories: response.data }));
        setCategoriesLoaded(true);
      })
      .catch(() => {
        if (!error)
          setRefreshToken(prevState => prevState + 1);
      })
  }, [refreshToken]);

  if (!everythingLoaded && refreshToken == 1) {
    return null;
  }

  return (
    <>
      {everythingLoaded && children}
      <LoadingScreen visible={!everythingLoaded} attempt={refreshToken}/>
    </>
  );
}