import React, { useState } from 'react';
import axios from 'axios';
import FormRenderer from './components/FormRenderer';
import IterationsTable from './components/IterationsTable';
import PlotlyChart from './components/PlotlyChart';
import { methodRegistry } from './methods/registry';

// ตั้งค่า URL ของ Backend API (ดึงจาก Environment Variable ถ้ามี, หรือใช้ค่า Default)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function App() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
    setResults(null); // ล้างผลลัพธ์เก่าเมื่อเปลี่ยนวิธี
    setError('');     // ล้าง Error เก่า
  };

  const handleCalculate = async (formData) => {
    if (!selectedMethod) {
      setError('Please select a calculation method.');
      return;
    }

    const methodConfig = methodRegistry[selectedMethod];
    if (!methodConfig) {
      setError('Invalid method selected.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    // สร้าง Payload และ Endpoint URL
    let payload = { ...formData };
    let endpoint = `${API_URL}/${methodConfig.endpoint}`;

    // *** จัดการกรณีพิเศษสำหรับ One-Point ***
    if (selectedMethod === 'onePoint') {
        payload = {
            gEquation: formData.equation, // ส่ง equation ไปเป็น gEquation
            x0: formData.x0,
            error: formData.error,
        };
        // endpoint ไม่ต้องเปลี่ยน เพราะเราตั้งไว้ใน registry แล้ว
    } else if (selectedMethod === 'graphical') {
         payload = {
            equation: formData.equation,
            start: formData.xl,
            end: formData.xr,
            steps: 100, // จำนวน Step หยาบ (อาจจะเพิ่ม field ให้ user กรอกก็ได้)
            fineStep: formData.fineStep // ส่งค่า fineStep ไปด้วย
         }
    }

    try {
      console.log("Sending request to:", endpoint);
      console.log("Payload:", payload);

      const response = await axios.post(endpoint, payload);

      console.log("API Response:", response.data);
      setResults(response.data);

    } catch (err) {
      console.error("API Error:", err);
      // แสดง Error จาก Backend ถ้ามี, หรือแสดงข้อความทั่วไป
      setError(err.response?.data?.error || err.message || 'An error occurred during calculation.');
      setResults(null); // เคลียร์ผลลัพธ์ถ้าเกิด Error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container"> {/* ใช้ class 'container' */}
      <h1 className="title"> {/* ใช้ class 'title' */}
        Numerical Methods Calculator
      </h1>

      <div className="card"> {/* ใช้ class 'card' */}
        <label htmlFor="method-select"> {/* ไม่มี class แล้ว */}
          Select Method:
        </label>
        <select
          id="method-select"
          value={selectedMethod}
          onChange={handleMethodChange}
          // ไม่มี className แล้ว (style มาจาก tag selector ใน css)
        >
          <option value="">-- Select a Method --</option>
          {Object.entries(methodRegistry).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>

      {selectedMethod && (
        <FormRenderer
          method={selectedMethod}
          onSubmit={handleCalculate}
          isLoading={loading}
          // FormRenderer ต้องแก้ข้างในให้ใช้ CSS ธรรมดา
        />
      )}

      {loading && (
        <div className="loading-indicator"> {/* ใช้ class 'loading-indicator' */}
          <p>Calculating...</p>
        </div>
      )}

      {error && (
        <div className="error-box" role="alert"> {/* ใช้ class 'error-box' */}
          <p className="error-title">Error:</p> {/* ใช้ class 'error-title' */}
          <p>{error}</p>
        </div>
      )}

      {results && !loading && (
         // อาจจะไม่ต้องมี div ครอบ หรือใช้ div ธรรมดา
         <div>
           {/* --- แสดงผลลัพธ์ --- */}
           {(results.root !== undefined || results.refinedRoot !== undefined) && (
             <div className="result-box"> {/* ใช้ class 'result-box' */}
                <h2>Result</h2> {/* ไม่มี class แล้ว */}
                {results.root !== undefined && (
                    <p>
                      Calculated Root: <strong>{results.root}</strong>
                    </p>
                )}
                 {results.refinedRoot !== undefined && (
                    <p>
                      Approximate Root (Refined): <strong>{results.refinedRoot}</strong>
                      {results.yAtRefinedRoot !== undefined && ` (f(x) ≈ ${results.yAtRefinedRoot})`}
                    </p>
                )}
                {results.executionTimeMs && (
                    <p className="execution-time"> {/* ใช้ class 'execution-time' */}
                      Execution Time: {results.executionTimeMs} ms
                    </p>
                )}
                 {results.message && (
                    <p className="result-message">{results.message} {/* ใช้ class 'result-message' */}
                    
                    </p> 
                )}
             </div>
            )}

          {/* --- แสดงตาราง Iterations --- */}
          {results.iterations && results.iterations.length > 0 && (
            <IterationsTable
               iterations={results.iterations}
               method={selectedMethod}
               // IterationsTable ต้องแก้ข้างใน
             />
          )}

          {/* --- แสดงกราฟ Plotly --- */}
          {results.plotData && (
             <PlotlyChart
                plotData={results.plotData}
                root={results.root !== undefined ? results.root : results.refinedRoot}
                methodName={methodRegistry[selectedMethod]?.label || selectedMethod}
                 
             />
          )}
        </div>
      )}
    </div>
  );
}

export default App;