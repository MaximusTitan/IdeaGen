"use client";

import React from 'react';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string; // Optional label for the checkbox
}

const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onChange, label }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
      />
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-400">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
