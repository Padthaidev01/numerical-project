import React from 'react';
import { methodRegistry } from '../methods/registry'; // Import registry

const IterationsTable = ({ iterations, method }) => { // รับ method มาด้วย
  // ดึง Headers จาก registry ตาม method ที่เลือก
  const headers = methodRegistry[method]?.resultHeaders;

  // ถ้าไม่มี iterations หรือไม่มี header สำหรับ method นี้ ไม่ต้องแสดงตาราง
  if (!iterations || iterations.length === 0 || !headers) {
    if (method !== 'graphical') {
      return <div style={{ marginTop: '1rem', textAlign: 'center', color: '#6c757d' }}>No iteration data available for this method.</div>;
    }
    return null;
  }

  // ดึง keys จาก iteration แรก เพื่อใช้ในการแสดงข้อมูลแต่ละแถว
  // (ควรจะตรงกับ headers แต่ใช้ keys จาก data จริงจะปลอดภัยกว่า)
  const dataKeys = Object.keys(iterations[0]);

  // สร้าง Header Row
  const headerRow = headers.map((header) => (
    <th key={header}>
      {header}
    </th>
  ));

  // สร้าง Data Rows
  const dataRows = iterations.map((item, index) => {
     const cells = headers.map(header => {
        // ... (Logic การหา keyToUse เหมือนเดิม) ...
        let keyToUse = '';
        if (header.toLowerCase().includes('iteration')) keyToUse = dataKeys.find(k => k.toLowerCase().includes('iter'));
        else if (header.toLowerCase().includes('error')) keyToUse = dataKeys.find(k => k.toLowerCase().includes('error'));
        else if (header.toLowerCase().includes('xl')) keyToUse = dataKeys.find(k => k.toLowerCase() === 'xl');
        else if (header.toLowerCase().includes('xr')) keyToUse = dataKeys.find(k => k.toLowerCase() === 'xr');
        else if (header.toLowerCase().includes('xm')) keyToUse = dataKeys.find(k => k.toLowerCase() === 'xm');
        else if (header.toLowerCase().includes('f(xm)')) keyToUse = dataKeys.find(k => k.toLowerCase() === 'fxm');
        else if (header.toLowerCase().includes('x1') && !header.toLowerCase().includes('+1') && !header.toLowerCase().includes('-1') && !header.toLowerCase().includes('(i)')) keyToUse = dataKeys.find(k => k.toLowerCase() === 'x1'); // False Position x1
        else if (header.toLowerCase().includes('f(x1)')) keyToUse = dataKeys.find(k => k.toLowerCase() === 'fx1');
        else if (header.toLowerCase().includes('xi') && !header.toLowerCase().includes('+1') && !header.toLowerCase().includes('-1')) keyToUse = dataKeys.find(k => k.toLowerCase() === 'xi'); // Newton/OnePoint xi
        else if (header.toLowerCase().includes('f(xi)')) keyToUse = dataKeys.find(k => k.toLowerCase() === 'fxi');
        else if (header.toLowerCase().includes("f'(xi)")) keyToUse = dataKeys.find(k => k.toLowerCase() === 'fprimexi');
        else if (header.toLowerCase().includes('xi+1')) keyToUse = dataKeys.find(k => k.toLowerCase().includes('plus_1') || k.toLowerCase().includes('_new')); // OnePoint/Newton/Secant xi+1
        else if (header.toLowerCase().includes('x(i-1)')) keyToUse = dataKeys.find(k => k.toLowerCase() === 'xi_minus_1');
        else if (header.toLowerCase().includes('x(i)') && method === 'secant') keyToUse = dataKeys.find(k => k.toLowerCase() === 'xi'); // Secant x(i)
        else if (header.toLowerCase().includes('f(x(i-1))')) keyToUse = dataKeys.find(k => k.toLowerCase() === 'f_xi_minus_1');
        else if (header.toLowerCase().includes('f(x(i))') && method === 'secant') keyToUse = dataKeys.find(k => k.toLowerCase() === 'f_xi'); // Secant f(x(i))

        let value = (keyToUse && item[keyToUse] !== null && item[keyToUse] !== undefined) ? item[keyToUse] : '-';

        if (typeof value === 'number' && !header.toLowerCase().includes('iteration')) {
          value = value.toFixed(6);
        }

        return (
          <td key={`${header}-${index}`}>
            {value}
          </td>
        );
     });

    return <tr key={index}>{cells}</tr>;
  });


  return (
    // ใช้ class 'table-container'
    <div className="table-container">
      <h2>
        Iterations Table
      </h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>{headerRow}</tr>
          </thead>
          <tbody>
            {dataRows}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IterationsTable;