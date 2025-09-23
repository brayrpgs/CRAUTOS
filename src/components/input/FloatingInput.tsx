import React, { useState } from "react";
import './FloatingInput.css'
import type { InputHTMLAttributes } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({ label, ...props }) => {
    const [value, setValue] = useState("");

    return (
        <div style={{ background: "#0b1633", borderRadius: "8px", width: "200px" }}>   
            <div className="floating-input">
                <input
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        props.onChange?.(e);
                    }}

                    placeholder=" "
                />

                <label>{label}</label>
            </div>
        </div>
    );
};

export default FloatingInput;