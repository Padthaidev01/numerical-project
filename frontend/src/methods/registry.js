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
export const METHOD_REGISTRY = {
  category: 'Root of Equation',
  methods: [
    {
      key: 'bisection',
      name: 'Bisection',
      fields: [
        { name: 'expr', label: 'f(x)', type: 'text', placeholder: 'x**3 - x - 2', required: true },
        { name: 'xl', label: 'XL', type: 'number', step: 'any', required: true },
        { name: 'xr', label: 'XR', type: 'number', step: 'any', required: true },
        { name: 'maxIter', label: 'Max Iter', type: 'number', default: 50 },
        { name: 'tol', label: 'Tolerance', type: 'number', step: 'any', default: 1e-6 },
      ],
      solve: apiSolver('bisection'),
    },
    {
      key: 'falsePosition',
      name: 'False Position',
      fields: [
        { name: 'expr', label: 'f(x)', type: 'text', placeholder: 'x**3 - x - 2', required: true },
        { name: 'xl', label: 'XL', type: 'number', step: 'any', required: true },
        { name: 'xr', label: 'XR', type: 'number', step: 'any', required: true },
        { name: 'maxIter', label: 'Max Iter', type: 'number', default: 50 },
        { name: 'tol', label: 'Tolerance', type: 'number', step: 'any', default: 1e-6 },
      ],
      solve: apiSolver('falsePosition'),
    },
    {
      key: 'graphical',
      name: 'Graphical (scan)',
      fields: [
        { name: 'expr', label: 'f(x)', type: 'text', placeholder: 'x**3 - x - 2', required: true },
        { name: 'xl', label: 'X min', type: 'number', step: 'any', default: -5 },
        { name: 'xr', label: 'X max', type: 'number', step: 'any', default: 5 },
        { name: 'step', label: 'Step', type: 'number', step: 'any', default: 0.5 },
      ],
      solve: apiSolver('graphical'),
    },
  ],
};
