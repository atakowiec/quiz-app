import React from 'react';

interface CustomInputProps {
  type: string;
  name: string;
  placeholder?: string; 
  className?: string;   
  value?: string;        
  onChange?: React.ChangeEventHandler<HTMLInputElement>; 
  onBlur?: React.FocusEventHandler<HTMLInputElement>;  
  autoComplete?: string; 
}

const CustomInput: React.FC<CustomInputProps> = (props) => {
  const { type, name, placeholder, className, value, onChange, onBlur, autoComplete } = props;
  
  return (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`form-control ${className || ''}`} 
        value={value || ''} 
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
      />
    </div>
  );
}

export default CustomInput;
