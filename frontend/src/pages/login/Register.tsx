import { useFormik } from "formik";
import Meta from "../../components/Meta.tsx";
import { Breadcrumb } from "react-bootstrap";
import * as yup from "yup";
import styles from "./Login.module.scss";
import CustomInput from "../../components/CustomInput.tsx";
import { useEffect, useState } from "react";
import getApi from "../../api/axios.ts";
import { AxiosError, AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserPacket } from "@shared/user";
import { useDispatch, useSelector } from "react-redux";
import { userActions, UserState } from "../../store/userSlice.ts";
import { State } from "../../store";
import { useSocket } from "../../socket/useSocket.ts";
import MainContainer from "../../components/MainContainer.tsx";
import MainBox from "../../components/MainBox.tsx";
import MainTitle from "../../components/MainTitle.tsx";

const Register = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector<State, UserState>((state) => state.user);
  const [error, setError] = useState<string>("");

  const registerSchema = yup.object({
    email: yup
      .string()
      .email("Proszę wprowadzić poprawny email")
      .required("Proszę wprowadzić email"),
    username: yup.string().required("Proszę wprowadzić login"),
    password: yup
      .string()
      .min(6, "Hasło musi mieć co najmniej 6 znaków")
      .required("Proszę wprowadzić hasło"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Hasła muszą się zgadzać")
      .required("Proszę potwierdzić hasło"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      formik.setErrors({});

      getApi()
        .post("/auth/register", {
          email: values.email,
          username: values.username,
          password: values.password,
        })
        .then((res: AxiosResponse<UserPacket>) => {
          if (res.status !== 201) return; // should never happen

          dispatch(userActions.setUser(res.data));
          socket.connect();
          navigate("/");
        })
        .catch((err: AxiosError<any>) => {
          if (err.status === 409) {
            err.response?.data.message.forEach((error: any) =>
              formik.setFieldError(error.field, error.error)
            );
            return;
          }

          setError("Wystąpił błąd podczas rejestracji");
        });
    },
  });

  // prevent logged-in users from accessing this page - in the future maybe we will make some kind of protected route
  useEffect(() => {
    if (user.loggedIn) navigate("/");
  }, [user.loggedIn]);

  if (user.loggedIn) return null;

  return (
    <>
      <Meta title={"Rejestracja"} />
      <Breadcrumb title="Rejestracja" />
      <MainContainer>
        <MainBox>
          <MainTitle>Rejestracja</MainTitle>
          <form onSubmit={formik.handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <CustomInput
                type="email"
                name="email"
                placeholder="Wprowadź email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.email && formik.errors.email
                    ? `${styles.error} ${styles.errorMargin}`
                    : ""
                }
                autoComplete="off"
              />
              {formik.touched.email && formik.errors.email && (
                <div className={`${styles.error} ${styles.errorMargin}`}>
                  {formik.errors.email}
                </div>
              )}
            </div>
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
                <div className={`${styles.error} ${styles.errorMargin}`}>
                  {formik.errors.username}
                </div>
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
                <div className={`${styles.error} ${styles.errorMargin}`}>
                  {formik.errors.password}
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <CustomInput
                type="password"
                name="confirmPassword"
                placeholder="Potwierdź hasło"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? `${styles.error} ${styles.errorMargin}`
                    : ""
                }
                autoComplete="off"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className={`${styles.error} ${styles.errorMargin}`}>
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
            {error && <div className="error p-0 text-center">{error}</div>}
            <button type="submit" className={styles.submitButton}>
              Zarejestruj się
            </button>
          </form>
          <div className={styles.registerLink}>
            Masz już konto?{" "}
            <Link to="/login" className={styles.registerText}>
              Zaloguj się
            </Link>
          </div>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default Register;
