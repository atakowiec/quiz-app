import { useFormik } from "formik";
import Meta from "../components/Meta";
import { Breadcrumb, Container, Button } from "react-bootstrap";
import * as yup from "yup";
import styles from "../styles/Login.module.scss";
import CustomInput from "../components/CustomInput";
import {Link} from "react-router-dom";

const Login = () => {
  const loginSchema = yup.object({
    login: yup.string().required("Proszę wprowadzić login"),
    password: yup.string().required("Proszę wprowadzić hasło"),
  });

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {},
  });

  return (
    <>
      <Meta title={"Logowanie"} />
      <Breadcrumb title="Logowanie" />
      <Container className={styles.loginContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.loginBox}>
              <div className={styles.loginText}>
                Logowanie
              </div>
              <form onSubmit={formik.handleSubmit} className={styles.loginForm}>
                <div className={styles.formGroup}> 
                  <CustomInput 
                    type="text" 
                    name="login" 
                    placeholder="Wprowadź login" 
                    value={formik.values.login} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} 
                    className={formik.touched.login && formik.errors.login ? styles.error : ""} 
                    autoComplete="off"
                  />
                  {formik.touched.login && formik.errors.login && (
                    <div className={styles.error}>{formik.errors.login}</div>
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
                <Button type="submit" className={styles.submitButton}>
                  Zaloguj
                </Button>
              </form>
              <div className={styles.registerLink}>
                  Nie masz jeszcze konta? <Link to="/register" className={styles.registerText}>Zarejestruj się</Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;
