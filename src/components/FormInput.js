import React from 'react';

export default function FormInput({ label, name, value, onChange, type = 'text', placeholder = '', disabled = false, required = false, step }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required ? ' *' : ''}
      </label>
      <input
        aria-label={label}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        step={step}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        disabled={disabled}
      />
    </div>
  );
}
