import { IoIosArrowDown } from "react-icons/io";
import React, { ChangeEventHandler} from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  className?: string;
  defaultValue?: string;
  value: string;
  disabled?: boolean
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value = '',
  disabled = false
}) => {
  return (
    <div className="relative group">
    <button className={`absolute right-[12px] top-[15px] dark:text-white text-black duration-400 pointer-events-none group-focus-within:rotate-180`}><IoIosArrowDown /></button>
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        value && value !== ''
          ? "text-gray-800 dark:text-white/90"
          : "text-gray-400 dark:text-gray-400"
      } ${className} ${disabled ? 'cursor-not-allowed' : ''}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>
      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
    </div>
  );
};

export default Select;
