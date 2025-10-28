const RootFinder = require('./RootFinder'); // Import Class แม่

class BisectionMethod extends RootFinder { // สืบทอดจาก RootFinder
  constructor(data) {
    super(data.equation); // ส่ง data.equation ให้ Class แม่
    this.xl = parseFloat(data.xl); // <--- ใช้ data.xl
    this.xr = parseFloat(data.xr); // <--- ใช้ data.xr
    this.error = parseFloat(data.error); // <--- ใช้ data.error

    // ตรวจสอบค่า Input เบื้องต้น
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
    this.iterations = []; // เคลียร์ iterations เก่า

    let currentXl = this.xl;
    let currentXr = this.xr;
    let xm = NaN, fxm, fxl; // ใช้ NaN เพื่อเช็คค่าเริ่มต้น
    let iter = 0;
    const MAX_ITER = 100; // ป้องกัน Loop ค้างไม่จบ
    let currentError = 100;

    // ประเมินค่าฟังก์ชันที่ขอบ และเช็คเงื่อนไข Bisection
    try {
        fxl = this.f(currentXl);
        const fxr = this.f(currentXr);
        if (!Number.isFinite(fxl) || !Number.isFinite(fxr)) {
            throw new Error('Function evaluation at interval endpoints did not return finite numbers.');
        }
        if (fxl * fxr >= 0) {
            throw new Error("Bisection method fails: f(xl) and f(xr) must have opposite signs.");
        }
    } catch(e) {
        // ส่งต่อ error
        throw new Error(`Failed initial function evaluation: ${e.message}`);
    }


    do {
      iter++;
      const prevXm = xm; // เก็บ xm เก่าไว้คำนวณ error
      xm = (currentXl + currentXr) / 2;

      try {
        fxm = this.f(xm);
         if (!Number.isFinite(fxm)) {
            throw new Error(`f(xm) calculation resulted in non-finite value at xm=${xm}`);
         }
      } catch (e) {
         throw new Error(`Error during iteration ${iter}: ${e.message}`);
      }

      // คำนวณ Error (หลังจาก iteration แรก และ xm ไม่ใช่ 0)
      if (iter > 1 && xm !== 0) {
        currentError = Math.abs((xm - prevXm) / xm) * 100;
      } else if (iter > 1 && xm === 0 && prevXm !== 0){
        // กรณีพิเศษที่ xm เป็น 0 แต่ prevXm ไม่ใช่
        currentError = 100; // หรือถือว่า error ยังสูง
      } else if (iter === 1) {
          currentError = 100; // ยังไม่มี error ในรอบแรก
      }
      // ถ้า xm และ prevXm เป็น 0 ทั้งคู่ error จะเป็น 0

      // บันทึกค่าลงตาราง iterations
      this.iterations.push({
        iteration: iter, // เปลี่ยน key เป็น iteration
        xl: currentXl,
        xr: currentXr,
        xm: xm,
        fxm: fxm,
        error: iter === 1 ? 'N/A' : currentError.toFixed(6) // แสดง 'N/A' ในรอบแรก
      });

      // Update ช่วง [xl, xr]
      // ต้องเช็ค fxl ใหม่ทุกรอบ เผื่อกรณี xl ถูกอัปเดต
       try {
            fxl = this.f(currentXl); // คำนวณ fxl ใหม่
            if (!Number.isFinite(fxl)) {
               throw new Error(`f(xl) calculation resulted in non-finite value at xl=${currentXl}`);
            }
       } catch (e) {
            throw new Error(`Error updating interval at iteration ${iter}: ${e.message}`);
       }

      if (fxm * fxl < 0) {
        currentXr = xm;
      } else if (fxm * fxl > 0) {
        currentXl = xm;
      } else {
        // ถ้า fxm หรือ fxl เป็น 0, xm คือคำตอบพอดี
        currentError = 0;
      }

      // เช็คเงื่อนไขหยุด Loop
      if (currentError <= this.error) break;
      if (iter >= MAX_ITER) {
        console.warn(`Bisection reached MAX_ITER (${MAX_ITER}) without converging to the desired error.`);
        break; // หยุดถ้าทำซ้ำมากไป
      }


    } while (true); // ใช้ break ออกจาก Loop แทนเงื่อนไขใน while

    const execTime = this.timerEnd();

    // สร้างข้อมูลสำหรับ Plotly (ตัวอย่าง: พล็อตในช่วง [xl, xr] เริ่มต้น)
    // คุณอาจจะต้องปรับช่วง start, end ให้เหมาะสม
    const plotData = this.getPlotData(this.xl -1, this.xr + 1); // ขยายช่วงเล็กน้อย

    return {
      root: xm.toFixed(6), // หรือ xm เฉยๆ ถ้าต้องการเป็น number
      iterations: this.iterations,
      plotData: plotData,
      executionTimeMs: execTime.toFixed(4)
    };
  }
}

module.exports = BisectionMethod;