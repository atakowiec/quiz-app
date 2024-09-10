import { useFormik } from "formik";
import Meta from "../components/Meta";
import { Breadcrumb, Container, Button } from "react-bootstrap";
import * as yup from "yup";
import "../styles/Login.scss";
import CustomInput from "../components/CustomInput";

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
    <div>
      <Meta title={"Login"} />
      <Breadcrumb title="login" />
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className="login-box">
              <div className="login-text">
                Logowanie
              </div>
              <form onSubmit={formik.handleSubmit} className="login-form">
                <div className="form-group"> 
                  <CustomInput 
                    type="text" 
                    name="login" 
                    placeholder="Wprowadź login" 
                    value={formik.values.login} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} 
                    className={formik.touched.login && formik.errors.login ? "error" : ""} 
                    autoComplete="off"
                  />
                  {formik.touched.login && formik.errors.login && (
                    <div className="error">{formik.errors.login}</div>
                  )}
                </div>
                <div className="form-group"> 
                  <CustomInput 
                    type="password" 
                    name="password" 
                    placeholder="Wprowadź hasło" 
                    value={formik.values.password} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} 
                    className={formik.touched.password && formik.errors.password ? "error" : ""} 
                    autoComplete="off"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="error">{formik.errors.password}</div>
                  )}
                </div>
                <Button type="submit" className="submit-button">
                  Zaloguj
                </Button>
              </form>
              <div className="register-link">
                  Nie masz jeszcze konta? <a href="/register" className="register-text">Zarejestruj się</a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
