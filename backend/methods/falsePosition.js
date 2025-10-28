const RootFinder = require('./RootFinder');

class FalsePositionMethod extends RootFinder {
  constructor(data) { 
    super(data.equation); 
    this.xl = parseFloat(data.xl); 
    this.xr = parseFloat(data.xr); 
    this.error = parseFloat(data.error); 

     // ตรวจสอบค่า Input เบื้องต้น (เหมือน Bisection)
     if (isNaN(this.xl) || isNaN(this.xr) || isNaN(this.error)) {
        throw new Error('Invalid input: xl, xr, and error must be numbers.');
     }
     if (this.error <= 0) {
        throw new Error('Error tolerance must be positive.');
     }
      if (this.xl >= this.xr) {
        throw new Error('Invalid interval: xl must be less than xr.');
     }
  }

  solve() {
    this.timerStart();
    this.iterations = [];

    let currentXl = this.xl;
    let currentXr = this.xr;
    let x1 = NaN, fx1, fxl, fxr;
    let iter = 0;
    const MAX_ITER = 100;
    let currentError = 100;

    // ประเมินค่าฟังก์ชันที่ขอบ และเช็คเงื่อนไข (เหมือน Bisection)
     try {
        fxl = this.f(currentXl);
        fxr = this.f(currentXr);
        if (!Number.isFinite(fxl) || !Number.isFinite(fxr)) {
            throw new Error('Function evaluation at interval endpoints did not return finite numbers.');
        }
        if (fxl * fxr >= 0) {
            throw new Error("False Position method fails: f(xl) and f(xr) must have opposite signs.");
        }
    } catch(e) {
        throw new Error(`Failed initial function evaluation: ${e.message}`);
    }

    do {
      iter++;
      const prevX1 = x1; // เก็บ x1 เก่า

      // คำนวณ fxl, fxr ใหม่ทุกรอบ เพราะค่า xl, xr อาจเปลี่ยน
      try {
         fxl = this.f(currentXl);
         fxr = this.f(currentXr);
         if (!Number.isFinite(fxl) || !Number.isFinite(fxr)) {
             throw new Error(`Function evaluation failed at iteration ${iter}`);
         }
      } catch (e) {
          throw new Error(`Error during iteration ${iter} (f eval): ${e.message}`);
      }

      // คำนวณ x1 ด้วยสูตร False Position
      // ป้องกันการหารด้วย 0 ถ้า fxl == fxr (ไม่ควรเกิดถ้าเช็คเงื่อนไขตอนแรกแล้ว)
      if (Math.abs(fxr - fxl) < 1e-10) { // ใช้ค่าเล็กน้อยเพื่อเปรียบเทียบ float
          throw new Error(`Potential division by zero at iteration ${iter}: fxr and fxl are too close.`);
      }
      x1 = (currentXl * fxr - currentXr * fxl) / (fxr - fxl);


      try {
        fx1 = this.f(x1);
        if (!Number.isFinite(fx1)) {
            throw new Error(`f(x1) calculation resulted in non-finite value at x1=${x1}`);
        }
      } catch (e) {
          throw new Error(`Error during iteration ${iter} (fx1 eval): ${e.message}`);
      }


      // คำนวณ Error (เหมือน Bisection)
      if (iter > 1 && x1 !== 0) {
        currentError = Math.abs((x1 - prevX1) / x1) * 100;
      } else if (iter > 1 && x1 === 0 && prevX1 !== 0){
        currentError = 100;
      } else if (iter === 1) {
        currentError = 100;
      }

      // บันทึกค่าลงตาราง
      this.iterations.push({
        iteration: iter,
        xl: currentXl,
        xr: currentXr,
        x1: x1, // key เป็น x1
        fx1: fx1, // key เป็น fx1
        error: iter === 1 ? 'N/A' : currentError.toFixed(6)
      });

      // Update ช่วง [xl, xr] (ใช้ fxl ที่คำนวณไว้ตอนต้น loop)
      if (fx1 * fxl < 0) {
        currentXr = x1;
      } else if (fx1 * fxl > 0) {
        currentXl = x1;
      } else {
        // ถ้า fx1 หรือ fxl เป็น 0, x1 คือคำตอบพอดี
        currentError = 0;
      }

       // เช็คเงื่อนไขหยุด Loop
       if (currentError <= this.error) break;
       if (iter >= MAX_ITER) {
         console.warn(`False Position reached MAX_ITER (${MAX_ITER}) without converging.`);
         break;
       }


    } while (true);

    const execTime = this.timerEnd();
    const plotData = this.getPlotData(this.xl -1, this.xr + 1);

    return {
      root: x1.toFixed(6),
      iterations: this.iterations,
      plotData: plotData,
      executionTimeMs: execTime.toFixed(4)
    };
  }
}

module.exports = FalsePositionMethod;