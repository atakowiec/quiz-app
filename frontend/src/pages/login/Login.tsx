import { useFormik } from "formik";
import Meta from "../../components/Meta.tsx";
import { Breadcrumb, Button } from "react-bootstrap";
import * as yup from "yup";
import styles from "./Login.module.scss";
import CustomInput from "../../components/CustomInput.tsx";
import { Link, useNavigate } from "react-router-dom";
import getApi from "../../api/axios.ts";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../store";
import { userActions, UserState } from "../../store/userSlice.ts";
import { useSocket } from "../../socket/useSocket.ts";
import MainContainer from "../../components/MainContainer.tsx";
import MainBox from "../../components/MainBox.tsx";
import MainTitle from "../../components/MainTitle.tsx";
import { UserPacket } from "@shared/user";
import { gameActions } from "../../store/gameSlice.ts";

const Login = () => {
  const [error, setError] = useState("");
  const user = useSelector<State, UserState>((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const loginSchema = yup.object({
    username: yup.string().required("Proszę wprowadzić login"),
    password: yup.string().required("Proszę wprowadzić hasło"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      getApi()
        .post("/auth/login", values)
        .then((response: AxiosResponse<UserPacket>) => {
          if (response.status !== 200) {
            return;
          }

          dispatch(userActions.setUser(response.data));
          dispatch(gameActions.setGame(null));
          socket.connect();
          navigate("/");
        })
        .catch((error: AxiosError) => {
          if (error.status == 401) {
            return setError("Niepoprawny login lub hasło");
          }

          if (error.status == 409) {
            return setError(
              "Użytkownik jest już połączony na innym urządzeniu"
            );
          }

          setError("Wystąpił błąd podczas logowania");
        });
    },
  });

  useEffect(() => {
    if (user.loggedIn) navigate("/");
  }, [user.loggedIn]);

  if (user.loggedIn) return null;

  return (
    <>
      <Meta title={"Logowanie"} />
      <Breadcrumb title="Logowanie" />
      <MainContainer>
        <MainBox>
          <MainTitle>Logowanie</MainTitle>
          <form onSubmit={formik.handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <CustomInput
                type="text"
                name="username"
                placeholder="Wprowadź login"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.username && formik.errors.username
                    ? `${styles.error} ${styles.errorMargin}`
                    : ""
                }
                autoComplete="off"
              />
              {formik.touched.username && formik.errors.username && (
                <div className={styles.error}>{formik.errors.username}</div>
              )}
            </div>
            <div className={styles.formGroup}>
              <CustomInput
                type="password"
                name="password"
                placeholder="Wprowadź hasło"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.password && formik.errors.password
                    ? `${styles.error} ${styles.errorMargin}`
                    : ""
                }
                autoComplete="off"
              />
              {formik.touched.password && formik.errors.password && (
                <div className={styles.error}>{formik.errors.password}</div>
              )}
            </div>
            {error && (
              <div className={`${styles.error} p-0 text-center`}>{error}</div>
            )}
            <button type="submit" className={styles.submitButton}>
              Zaloguj się
            </button>
          </form>
          <div className={styles.registerLink}>
            Nie masz jeszcze konta?{" "}
            <Link to="/register" className={styles.registerText}>
              Zarejestruj się
            </Link>
          </div>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default Login;
