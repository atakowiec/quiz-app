import { useFormik } from "formik";
import Meta from "../components/Meta";
import { Breadcrumb, Container, Button } from "react-bootstrap";
import * as yup from "yup";
import styles from "../styles/Login.module.scss";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import getApi from "../api/axios.ts";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../store";
import { userActions, UserState } from "../store/userSlice.ts";
import { useSocket } from "../socket/useSocket.ts";

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
        .then((response) => {
          if (response.status !== 200) {
            return;
          }

          dispatch(userActions.setUser(response.data));
          socket.connect();
          navigate("/");
        })
        .catch((error: AxiosError) => {
          if (error.status == 401) {
            return setError("Niepoprawny login lub hasło");
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
      <Container className={styles.mainContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.mainBox}>
              <div className={styles.mainText}>Logowanie</div>
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
                {error && <div className="error p-0 text-center">{error}</div>}
                <Button type="submit" className={styles.submitButton}>
                  Zaloguj się
                </Button>
              </form>
              <div className={styles.registerLink}>
                Nie masz jeszcze konta?{" "}
                <Link to="/register" className={styles.registerText}>
                  Zarejestruj się
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;
