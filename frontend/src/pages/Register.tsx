import {useFormik} from "formik";
import Meta from "../components/Meta";
import {Breadcrumb, Container, Button} from "react-bootstrap";
import * as yup from "yup";
import styles from "../styles/Login.module.scss";
import CustomInput from "../components/CustomInput";
import {useEffect, useState} from "react";
import getApi from "../api/axios.ts";
import {AxiosError, AxiosResponse} from "axios";
import {Link, useNavigate} from "react-router-dom";
import {UserPacket} from "@shared/user";
import {useDispatch, useSelector} from "react-redux";
import {userActions, UserState} from "../store/userSlice.ts";
import {State} from "../store";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector<State, UserState>(state => state.user)
  const [error, setError] = useState<string>("");

  const registerSchema = yup.object({
    email: yup.string().email("Proszę wprowadzić poprawny email").required("Proszę wprowadzić email"),
    username: yup.string().required("Proszę wprowadzić login"),
    password: yup.string().min(6, "Hasło musi mieć co najmniej 6 znaków").required("Proszę wprowadzić hasło"),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], "Hasła muszą się zgadzać")
      .required("Proszę potwierdzić hasło")
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      formik.setErrors({})

      getApi().post("/auth/register", {
        email: values.email,
        username: values.username,
        password: values.password
      }).then((res: AxiosResponse<UserPacket>) => {
        if (res.status !== 201)
          return; // should never happen

        dispatch(userActions.setUser(res.data));
        navigate("/");
      }).catch((err: AxiosError<any>) => {
        if (err.status === 409) {
          err.response?.data.message.forEach((error: any) => formik.setFieldError(error.field, error.error));
          return;
        }

        setError("Wystąpił błąd podczas rejestracji");
      })
    },
  });

  // prevent logged-in users from accessing this page - in the future maybe we will make some kind of protected route
  useEffect(() => {
    if (user.loggedIn)
      navigate("/");
  }, [user.loggedIn]);

  if (user.loggedIn)
    return null;

  return (
    <>
      <Meta title={"Rejestracja"}/>
      <Breadcrumb title="Rejestracja"/>
      <Container className={styles.loginContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.loginBox}>
              <div className={styles.loginText}>
                Rejestracja
              </div>
              <form onSubmit={formik.handleSubmit} className={styles.loginForm}>
                <div className={styles.formGroup}>
                  <CustomInput
                    type="email"
                    name="email"
                    placeholder="Wprowadź email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.email && formik.errors.email ? styles.error : ""}
                    autoComplete="off"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className={styles.error}>{formik.errors.email}</div>
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
                    className={formik.touched.username && formik.errors.username ? styles.error : ""}
                    autoComplete="off"
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="error">{formik.errors.username}</div>
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
                    className={formik.touched.password && formik.errors.password ? styles.error : ""}
                    autoComplete="off"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className={styles.error}>{formik.errors.password}</div>
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
                    className={formik.touched.confirmPassword && formik.errors.confirmPassword ? styles.error : ""}
                    autoComplete="off"
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="error">{formik.errors.confirmPassword}</div>
                  )}
                </div>
                {error && <div className="error p-0 text-center">{error}</div>}
                <Button type="submit" className={styles.submitButton}>
                  Zarejestruj się
                </Button>
              </form>
              <div className={styles.registerLink}>
                Masz już konto? <Link to="/login" className={styles.registerText}>Zaloguj się</Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Register;
