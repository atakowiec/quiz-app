import { ChangeEventHandler, FC, FocusEventHandler } from "react";
import styles from "../../pages/login/Login.module.scss";

interface CustomInputProps {
  type: string;
  name: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  autoComplete?: string;
}

const CustomInput: FC<CustomInputProps> = (props) => {
  const {
    type,
    name,
    placeholder,
    className,
    value,
    onChange,
    onBlur,
    autoComplete,
  } = props;

  return (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`${styles.formControl} ${styles.inputBox} ${className || ""}`}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default CustomInput;
