import { useFormik } from "formik";
import Meta from "../components/Meta";
import { Breadcrumb, Container, Button } from "react-bootstrap";
import * as yup from "yup";
import "../styles/Login.scss";
import CustomInput from "../components/CustomInput";

const Register = () => {
  const registerSchema = yup.object({
    email: yup.string().email("Proszę wprowadzić poprawny email").required("Proszę wprowadzić email"),
    login: yup.string().required("Proszę wprowadzić login"),
    password: yup.string().min(6, "Hasło musi mieć co najmniej 6 znaków").required("Proszę wprowadzić hasło"),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], "Hasła muszą się zgadzać")
      .required("Proszę potwierdzić hasło")
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      login: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {

    },
  });

  return (
    <div>
      <Meta title={"Rejestracja"} />
      <Breadcrumb title="Rejestracja" />
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className="login-box">
              <div className="login-text">
                Rejestracja
              </div>
              <form onSubmit={formik.handleSubmit} className="login-form">
                <div className="form-group"> 
                  <CustomInput 
                    type="email" 
                    name="email" 
                    placeholder="Wprowadź email" 
                    value={formik.values.email} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} 
                    className={formik.touched.email && formik.errors.email ? "error" : ""} 
                    autoComplete="off"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="error">{formik.errors.email}</div>
                  )}
                </div>
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
                <div className="form-group"> 
                  <CustomInput 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="Potwierdź hasło" 
                    value={formik.values.confirmPassword} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} 
                    className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "error" : ""} 
                    autoComplete="off"
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="error">{formik.errors.confirmPassword}</div>
                  )}
                </div>
                <Button type="submit" className="submit-button">
                  Zarejestruj się
                </Button>
              </form>
              <div className="register-link">
                Masz już konto? <a href="/login" className="register-text">Zaloguj się</a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Register;
