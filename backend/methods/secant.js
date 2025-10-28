const RootFinder = require('./RootFinder');

class SecantMethod extends RootFinder {
  constructor(data) {
    super(data.equation);
    
    // แปลงค่า input และ validate
    this.x0 = parseFloat(data.x0); // xi-1 (จุดก่อนหน้า)
    this.x1 = parseFloat(data.x1); // xi (จุดปัจจุบัน)
    this.error = parseFloat(data.error);

    if (isNaN(this.x0) || isNaN(this.x1) || isNaN(this.error)) {
        throw new Error('Invalid input: x0, x1, and error must be numbers.');
    }
     if (this.error <= 0) {
        throw new Error('Error tolerance must be positive.');
     }
  }

  solve() {
    this.timerStart();
    this.iterations = [];
    
    let xi_minus_1 = this.x0; // x(i-1)
    let xi = this.x1;         // x(i)
    let iter = 0;
    const MAX_ITER = 100;
    let currentError = 100;
    let f_xi_minus_1, f_xi;

    do {
      iter++;

      // คำนวณ f(xi-1) และ f(xi)
      try {
        f_xi_minus_1 = this.f(xi_minus_1);
        f_xi = this.f(xi);
        if (!Number.isFinite(f_xi_minus_1) || !Number.isFinite(f_xi)) {
             throw new Error(`Function evaluation resulted in non-finite value at iteration ${iter}`);
        }
      } catch (e) {
          throw new Error(`Error during iteration ${iter} (f eval): ${e.message}`);
      }

      // ตรวจสอบ f(xi) - f(xi-1) ใกล้ 0 หรือไม่ (ป้องกันหารด้วย 0)
      const denominator = f_xi - f_xi_minus_1;
      if (Math.abs(denominator) < 1e-10) {
        throw new Error(`Secant method potentially fails: Denominator f(xi) - f(xi-1) is close to zero at iteration ${iter}. f(${xi.toFixed(6)}) = ${f_xi.toExponential()}, f(${xi_minus_1.toFixed(6)}) = ${f_xi_minus_1.toExponential()}`);
      }

      // คำนวณ xi_plus_1 (ค่า x ในรอบถัดไป) ด้วยสูตร Secant
      let xi_plus_1 = xi - (f_xi * (xi - xi_minus_1)) / denominator;

      // คำนวณ Error (หลังจาก iteration แรก และ xi_plus_1 ไม่ใช่ 0)
      if (iter > 1 && xi_plus_1 !== 0) {
        currentError = Math.abs((xi_plus_1 - xi) / xi_plus_1) * 100;
      } else if (iter > 1 && xi_plus_1 === 0 && xi !== 0) {
         currentError = 100;
      } else if (iter === 1) {
          currentError = 100; // รอบแรกไม่มี error
      }

      // บันทึกค่าลงตาราง
      this.iterations.push({
        iteration: iter,
        xi_minus_1: xi_minus_1, // x(i-1)
        xi: xi,                 // x(i)
        f_xi_minus_1: f_xi_minus_1,
        f_xi: f_xi,
        xi_plus_1: xi_plus_1,   // x(i+1) ที่คำนวณได้
        error: iter === 1 ? 'N/A' : currentError.toFixed(6)
      });

      // อัปเดตค่าสำหรับรอบถัดไป
      xi_minus_1 = xi;
      xi = xi_plus_1;

      // เช็คเงื่อนไขหยุด Loop
      if (currentError <= this.error) break;
       if (iter >= MAX_ITER) {
         console.warn(`Secant method reached MAX_ITER (${MAX_ITER}) without converging.`);
         break;
       }

    } while (true);

    const execTime = this.timerEnd();
    // หาช่วงสำหรับ plot กราฟ
    const plotRangeStart = Math.min(this.x0, this.x1, xi) - 1;
    const plotRangeEnd = Math.max(this.x0, this.x1, xi) + 1;
    const plotData = this.getPlotData(plotRangeStart, plotRangeEnd);
    
    return {
      root: xi.toFixed(6), // xi คือค่าล่าสุด = xi_plus_1 ของรอบก่อน
      iterations: this.iterations,
      plotData: plotData,
      executionTimeMs: execTime.toFixed(4)
    };
  }
}

module.exports = SecantMethod;