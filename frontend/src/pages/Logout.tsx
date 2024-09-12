import {useNavigate} from "react-router-dom";
import getApi from "../api/axios.ts";
import {useEffect} from "react";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    getApi().post("/auth/logout").then(() => {
      navigate("/");
    });
  }, []);

  return null;
}