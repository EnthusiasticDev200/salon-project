import React from "react";
const Input = ({
  type = "text",
  element = "input",
  options = [],
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
}) => {
  const isDateOrTime = type === "date" || type === "time";
  const isDate = type === "date"

  const getIcon = () => {
    if (type === "date") return <i className="ri-calendar-line w-5 h-5"></i>;
    if (type === "time") return <i className="ri-time-line w-5 h-5"></i>;
    return null;
  };

  const triggerPicker = () => {
    const el = document.getElementById(id);
    if (el?.showPicker) el.showPicker();
  };

  const style = `w-full no-native-icon border ${ error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500" } rounded-lg px-4 py-2 ${ isDateOrTime ? "pr-12" : "" } text-gray-700 focus:outline-none focus:ring-2`

  return (
    <div className="w-full my-4">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 font-medium"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {
          element == 'input' ?
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={style}
          /> :
          element == 'select' ? 
          <select 
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={style}
          >
            <option value={''} disabled>Select {placeholder}</option>
            {
              options.map((option, index) => <option key={index} value={option}>{option}</option>)
            }
          </select> : 
          element == 'textarea' ? 
          <textarea 
            name={name} 
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className={style}
            rows={8}
          >
            { value }
          </textarea> : null
        }
        {isDateOrTime && (
          <div
            className="absolute bottom-[0.85rem] right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
            onClick={triggerPicker}
          >
            {getIcon()}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
