import React, { useState, useEffect } from 'react';
import { methodRegistry } from '../methods/registry';

const FormRenderer = ({ method, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({});
  const methodConfig = methodRegistry[method];

  // Reset form data when the method changes
  useEffect(() => {
    // กำหนดค่า default ถ้ามี
    const initialData = {};
    methodConfig?.fields.forEach(field => {
        initialData[field.name] = field.defaultValue || '';
    });
    setFormData(initialData);
  }, [method, methodConfig]); // ใส่ methodConfig ใน dependency array ด้วย

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  if (!methodConfig) {
    return <div className="text-center text-red-500">Form configuration not found for this method.</div>;
  }

  return (
    // ใช้ class 'card'
    <form onSubmit={handleSubmit} className="card">
      {/* ใช้ inline style หรือสร้าง class ใหม่ใน styles.css */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#343a40' }}>
        Input for {methodConfig.label}
      </h2>
      {/* ใช้ CSS จัดการ spacing หรือเพิ่ม div ครอบ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {methodConfig.fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name}> {/* ไม่มี class แล้ว */}
                {method === 'onePoint' && field.name === 'equation'
                  ? 'g(x) Equation (e.g., (x+1)/2)'
                  : method === 'graphical' && field.name === 'xl'
                  ? 'Start Point (x Start)'
                  : method === 'graphical' && field.name === 'xr'
                  ? 'End Point (x End)'
                  : field.label}
                 {field.required && <span className="required">*</span>} {/* ใช้ class 'required' */}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                step={field.type === 'number' ? 'any' : undefined}
                // ไม่มี className แล้ว (style มาจาก tag selector)
                disabled={isLoading}
              />
              {field.description && (
                <p className="field-description">{field.description} {/* ใช้ class 'field-description' */}
                </p> 
              )}
                   
            </div>
          ))}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        // ไม่มี className แล้ว (style มาจาก tag selector)
      >
        {isLoading ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  );
};

export default FormRenderer;