import React, { useState, useId } from "react";
import "./FloatingInput.css";
import type { InputHTMLAttributes } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({ label, id, ...props }) => {
    const [value, setValue] = useState("");
    const autoId = useId();

    const inputId = id ?? autoId;

    return (
        <div className="floating-input">
            <input
                id={inputId}
                autoComplete="off"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    props.onChange?.(e);
                }}
                placeholder=" "
                {...props}
            />
            <label htmlFor={inputId}>{label}</label>
        </div>
    );
};

export default FloatingInput;
