const RootFinder = require('./RootFinder');

class OnePointIteration extends RootFinder {
  constructor(data) {
    // **สำคัญ:** Class แม่จะ compile `data.gEquation` ให้เป็น this.func ซึ่งก็คือ g(x)
    super(data.gEquation); 
    
    // แปลงค่า input และ validate
    this.x0 = parseFloat(data.x0);
    this.error = parseFloat(data.error);

     if (isNaN(this.x0) || isNaN(this.error)) {
        throw new Error('Invalid input: x0 and error must be numbers.');
     }
      if (this.error <= 0) {
        throw new Error('Error tolerance must be positive.');
     }
  }

  // Override f(x) ให้เป็น g(x) เพื่อความชัดเจน (จริงๆ ใช้ super.f(x) ก็ได้)
  g(x) {
    // this.func ถูกสร้างจาก gEquation ใน constructor ของ RootFinder
    try {
        return this.func(x);
    } catch(e) {
        console.error(`Error evaluating g(${x}) for equation "${this.equationString}":`, e);
        throw new Error(`Error calculating g(${x}). Check the equation syntax.`);
    }
  }

  solve() {
    this.timerStart();
    this.iterations = [];
    
    let xi = this.x0;
    let iter = 0;
    const MAX_ITER = 100; // ป้องกัน Loop ไม่รู้จบ
    let currentError = 100;

    do {
      iter++;
      let xi_plus_1;

      // คำนวณ xi+1 = g(xi)
       try {
            xi_plus_1 = this.g(xi);
            if (!Number.isFinite(xi_plus_1)) {
                 throw new Error(`g(xi) calculation resulted in non-finite value at xi=${xi}`);
            }
       } catch (e) {
           throw new Error(`Error during iteration ${iter}: ${e.message}`);
       }


      // คำนวณ Error (หลังจาก iteration แรก และ xi_plus_1 ไม่ใช่ 0)
      if (iter > 1 && xi_plus_1 !== 0) {
        currentError = Math.abs((xi_plus_1 - xi) / xi_plus_1) * 100;
      } else if (iter > 1 && xi_plus_1 === 0 && xi !== 0) {
        currentError = 100;
      } else if (iter === 1) {
          currentError = 100; // รอบแรกไม่มี error
      }

      // บันทึกค่าลงตาราง iterations
      this.iterations.push({
        iteration: iter,
        xi: xi,           // ค่า x ที่ใช้ในรอบนี้
        xi_plus_1: xi_plus_1, // ค่า x ที่คำนวณได้ (จะเป็น xi ของรอบหน้า)
        error: iter === 1 ? 'N/A' : currentError.toFixed(6)
      });
      
      // อัปเดตค่า xi สำหรับรอบถัดไป
      xi = xi_plus_1;

      // เช็คเงื่อนไขหยุด Loop
      if (currentError <= this.error) break;
       if (iter >= MAX_ITER) {
         console.warn(`One-Point Iteration reached MAX_ITER (${MAX_ITER}) without converging.`);
         // อาจจะ throw error แทนถ้าต้องการให้ล้มเหลวชัดเจน
         // throw new Error(`One-Point Iteration did not converge within ${MAX_ITER} iterations.`);
         break;
       }

    } while (true);

    const execTime = this.timerEnd();

    // **ข้อควรระวัง:** plotData นี้จะเป็นของ g(x), ไม่ใช่ f(x) เดิม
    // หาช่วงคร่าวๆ สำหรับ plot g(x)
    const plotRangeStart = Math.min(this.x0, xi) - 1;
    const plotRangeEnd = Math.max(this.x0, xi) + 1;
    const plotData = this.getPlotData(plotRangeStart, plotRangeEnd); // ใช้ getPlotData ของ g(x)
    
    return {
      root: xi.toFixed(6),
      iterations: this.iterations,
      plotData: plotData, // กราฟของ g(x)
      executionTimeMs: execTime.toFixed(4)
    };
  }
}

module.exports = OnePointIteration;