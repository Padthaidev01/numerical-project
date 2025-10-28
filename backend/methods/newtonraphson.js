const RootFinder = require('./RootFinder');
const math = require('mathjs');

class NewtonRaphson extends RootFinder {
  constructor(data) {
    // ส่ง data.equation ให้ Class แม่ (RootFinder)
    super(data.equation); 
    
    // แปลงค่า input เป็น number และ validate
    this.x0 = parseFloat(data.x0);
    this.error = parseFloat(data.error);

    if (isNaN(this.x0) || isNaN(this.error)) {
        throw new Error('Invalid input: x0 and error must be numbers.');
    }
    if (this.error <= 0) {
        throw new Error('Error tolerance must be positive.');
    }

    // ใช้ math.js หาอนุพันธ์ f'(x)
    try {
      // ตรวจสอบว่ามีสมการก่อนหาอนุพันธ์
      if (!data.equation || typeof data.equation !== 'string') {
          throw new Error("Equation string is missing or invalid.");
      }
      const equationCleaned = data.equation.replace(/\\^/g, '^'); // Ensure correct power syntax
      const derivativeNode = math.derivative(equationCleaned, 'x');
      const derivativeString = derivativeNode.toString();
      
      // Compile อนุพันธ์เป็น function ที่คำนวณได้
      this.fPrime = (x) => math.evaluate(derivativeString, { x: x });
    } catch (e) {
      console.error("Error calculating derivative:", e);
      throw new Error(`Could not compute derivative for Newton-Raphson. Check equation syntax. Error: ${e.message}`);
    }
  }

  solve() {
    this.timerStart();
    this.iterations = [];
    
    let xi = this.x0;
    let iter = 0;
    const MAX_ITER = 100;
    let currentError = 100;

    do {
      iter++;
      let fxi, fPrimeXi;

      // คำนวณ f(xi) และ f'(xi)
      try {
        fxi = this.f(xi);
        fPrimeXi = this.fPrime(xi);

        if (!Number.isFinite(fxi)) {
            throw new Error(`f(xi) calculation resulted in non-finite value at xi=${xi}`);
        }
         if (!Number.isFinite(fPrimeXi)) {
            throw new Error(`f'(xi) calculation resulted in non-finite value at xi=${xi}`);
         }
      } catch (e) {
          throw new Error(`Error during iteration ${iter}: ${e.message}`);
      }
      
      // ตรวจสอบ f'(xi) ใกล้ 0 หรือไม่ (ป้องกันหารด้วย 0)
      if (Math.abs(fPrimeXi) < 1e-10) { // 1e-10 คือค่าเล็กมากๆ
        throw new Error(`Newton-Raphson potentially fails: Derivative f'(${xi.toFixed(6)}) is close to zero (${fPrimeXi.toExponential()}).`);
      }

      // คำนวณ xi_new (ค่า x ในรอบถัดไป)
      let xi_new = xi - (fxi / fPrimeXi);
      
      // คำนวณ Error (หลังจาก iteration แรก และ xi_new ไม่ใช่ 0)
      if (iter > 1 && xi_new !== 0) {
        currentError = Math.abs((xi_new - xi) / xi_new) * 100;
      } else if (iter > 1 && xi_new === 0 && xi !== 0) {
        currentError = 100; 
      } else if (iter === 1) {
          currentError = 100; // รอบแรกยังไม่มี error
      }
      // ถ้า xi_new และ xi เป็น 0 ทั้งคู่ error จะเป็น 0

      // บันทึกค่าลงตาราง iterations
      this.iterations.push({
        iteration: iter,
        xi: xi, // xi ของรอบ ปัจจุบัน
        fxi: fxi,
        fPrimeXi: fPrimeXi,
        xi_new: xi_new, // ค่า x ที่คำนวณได้สำหรับรอบ ถัดไป
        error: iter === 1 ? 'N/A' : currentError.toFixed(6)
      });
      
      // อัปเดตค่า xi สำหรับรอบถัดไป
      xi = xi_new;

      // เช็คเงื่อนไขหยุด Loop
      if (currentError <= this.error) break;
      if (iter >= MAX_ITER) {
         console.warn(`Newton-Raphson reached MAX_ITER (${MAX_ITER}) without converging.`);
         break;
      }

    } while (true);

    const execTime = this.timerEnd();
    // สร้าง plot data ในช่วงที่เหมาะสม (อาจจะต้องปรับค่า +/- )
    const plotRangeStart = Math.min(this.x0, xi) - 1;
    const plotRangeEnd = Math.max(this.x0, xi) + 1;
    const plotData = this.getPlotData(plotRangeStart, plotRangeEnd); 
    
    return {
      root: xi.toFixed(6),
      iterations: this.iterations,
      plotData: plotData, // ส่งข้อมูลกราฟไปด้วย
      executionTimeMs: execTime.toFixed(4)
    };
  }
}

module.exports = NewtonRaphson;