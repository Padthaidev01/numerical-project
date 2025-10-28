import axios from 'axios';

// สร้างฟังก์ชันสำหรับเรียก API แบบไดนามิก
const apiSolver = (methodKey) => async (inputs) => {
  try {
    const response = await axios.post(
      `http://localhost:4000/api/calculate/${methodKey}`,
      inputs
    );
    return response.data;
  } catch (error) {
    // ส่งต่อ Error ที่ได้รับจาก Backend
    throw new Error(error.response?.data?.message || 'An API error occurred');
  }
};

// คลังเมธอด + ฟอร์มของแต่ละเมธอด
// frontend/src/methods/registry.js

export const methodRegistry = {
  graphical: {
    label: 'Graphical Method',
    endpoint: 'graphical',
    fields: [
      { name: 'equation', label: 'Equation f(x)', type: 'text', required: true, placeholder: 'e.g., x^3 - x - 2 or x**3 - x - 2' },
      { name: 'xl', label: 'Start Point (x Start)', type: 'number', required: true, placeholder: 'e.g., 0' },
      { name: 'xr', label: 'End Point (x End)', type: 'number', required: true, placeholder: 'e.g., 10' },
      // เพิ่ม Field นี้
      { name: 'fineStep', label: 'Fine Step Size', type: 'number', required: false, placeholder: 'e.g., 0.000001', defaultValue: '0.000001', description: 'Step size for refined search near the approximate root.' },
    ],
    resultHeaders: null
  },
  bisection: {
    label: 'Bisection Method',
    endpoint: 'bisection',
    fields: [
      { name: 'equation', label: 'Equation f(x)', type: 'text', required: true, placeholder: 'e.g., x^3 - x - 2' },
      { name: 'xl', label: 'Lower Bound (xl)', type: 'number', required: true, placeholder: 'e.g., 1' },
      { name: 'xr', label: 'Upper Bound (xr)', type: 'number', required: true, placeholder: 'e.g., 2' },
      { name: 'error', label: 'Error Tolerance (%)', type: 'number', required: true, placeholder: 'e.g., 0.001', defaultValue: '0.000001' },
    ],
    resultHeaders: ['Iteration', 'xl', 'xr', 'xm', 'f(xm)', 'Error (%)'] // ใช้ key จาก API response
  },
  falsePosition: {
    label: 'False Position Method',
    endpoint: 'false-position',
    fields: [
      { name: 'equation', label: 'Equation f(x)', type: 'text', required: true, placeholder: 'e.g., x^3 - x - 2' },
      { name: 'xl', label: 'Lower Bound (xl)', type: 'number', required: true, placeholder: 'e.g., 1' },
      { name: 'xr', label: 'Upper Bound (xr)', type: 'number', required: true, placeholder: 'e.g., 2' },
      { name: 'error', label: 'Error Tolerance (%)', type: 'number', required: true, placeholder: 'e.g., 0.001', defaultValue: '0.000001' },
    ],
     // key ต้องตรงกับ response จาก backend (x1, fx1)
    resultHeaders: ['Iteration', 'xl', 'xr', 'x1', 'f(x1)', 'Error (%)']
  },
  onePoint: {
    label: 'One-Point Iteration Method',
    endpoint: 'one-point', // Endpoint ที่เราสร้างใน server.js
    fields: [
      // Label จะถูกแก้ใน FormRenderer
      { name: 'equation', label: 'Equation g(x)', type: 'text', required: true, placeholder: 'e.g., (x+2)^(1/3)', description: 'Must be in the form x = g(x)' },
      { name: 'x0', label: 'Initial Guess (x0)', type: 'number', required: true, placeholder: 'e.g., 1.5' },
      { name: 'error', label: 'Error Tolerance (%)', type: 'number', required: true, placeholder: 'e.g., 0.001', defaultValue: '0.000001' },
    ],
     // key ต้องตรงกับ response จาก backend (xi, xi_plus_1)
    resultHeaders: ['Iteration', 'xi', 'xi+1', 'Error (%)']
  },
  newtonRaphson: {
    label: 'Newton-Raphson Method',
    endpoint: 'newton-raphson', // Endpoint ที่เราสร้าง
    fields: [
      { name: 'equation', label: 'Equation f(x)', type: 'text', required: true, placeholder: 'e.g., x^3 - x - 2' },
      { name: 'x0', label: 'Initial Guess (x0)', type: 'number', required: true, placeholder: 'e.g., 1.5' },
      { name: 'error', label: 'Error Tolerance (%)', type: 'number', required: true, placeholder: 'e.g., 0.001', defaultValue: '0.000001' },
    ],
    // key ต้องตรงกับ response จาก backend (xi, fxi, fPrimeXi, xi_new)
    resultHeaders: ['Iteration', 'xi', 'f(xi)', "f'(xi)", 'xi+1', 'Error (%)']
  },
  secant: {
    label: 'Secant Method',
    endpoint: 'secant', // Endpoint ที่เราสร้าง
    fields: [
      { name: 'equation', label: 'Equation f(x)', type: 'text', required: true, placeholder: 'e.g., x^3 - x - 2' },
      { name: 'x0', label: 'Initial Guess 1 (x0)', type: 'number', required: true, placeholder: 'e.g., 1' },
      { name: 'x1', label: 'Initial Guess 2 (x1)', type: 'number', required: true, placeholder: 'e.g., 2' },
      { name: 'error', label: 'Error Tolerance (%)', type: 'number', required: true, placeholder: 'e.g., 0.001', defaultValue: '0.000001' },
    ],
     // key ต้องตรงกับ response จาก backend (xi_minus_1, xi, f_xi_minus_1, f_xi, xi_plus_1)
    resultHeaders: ['Iteration', 'x(i-1)', 'x(i)', 'f(x(i-1))', 'f(x(i))', 'x(i+1)', 'Error (%)']
  },
  // --- เพิ่ม Method อื่นๆ ตรงนี้ ---
};
