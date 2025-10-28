import React from 'react';
import Plot from 'react-plotly.js';

const PlotlyChart = ({ plotData, root, methodName }) => {
  if (!plotData || !plotData.x || !plotData.y || plotData.x.length === 0) {
     
    return <div style={{ marginTop: '1rem', textAlign: 'center', color: '#6c757d' }}>Graph data is not available.</div>;
  }

  const trace1 = {
    x: plotData.x,
    y: plotData.y,
    mode: 'lines',
    name: 'f(x)' // หรือ g(x)
  };

  const traceRoot = root !== null && root !== undefined ? {
    x: [parseFloat(root)],
    y: [0],
    mode: 'markers',
    marker: {
      color: '#dc3545', // สีแดง
      size: 10,
      symbol: 'x'
    },
    name: methodName.toLowerCase().includes('graphical') ? `Approx. Root ≈ ${root}` : `Root ≈ ${root}`
  } : null;

  const data = [trace1, traceRoot].filter(trace => trace !== null);

  const layout = {
    title: `Graph for ${methodName}`,
    xaxis: {
      title: 'x',
      gridcolor: '#e9ecef', // สี grid อ่อนลง
    },
    yaxis: {
      title: 'f(x)',
      zeroline: true,
      zerolinecolor: '#adb5bd', // สีเส้นศูนย์เข้มขึ้นเล็กน้อย
      gridcolor: '#e9ecef',
    },
    hovermode: 'closest',
    showlegend: true,
    plot_bgcolor: '#ffffff', // พื้นหลังกราฟ
    paper_bgcolor: '#ffffff', // พื้นหลังรอบๆ กราฟ
    font: {
      family: 'inherit', // ใช้ font จาก body
      color: '#495057' // สีตัวหนังสือแกน/title
    },
    margin: { l: 50, r: 30, t: 50, b: 40 } // ปรับ margin
  };

  return (
    // ใช้ class 'chart-container'
    <div className="chart-container">
      <Plot
        data={data}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '400px' }}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default PlotlyChart;