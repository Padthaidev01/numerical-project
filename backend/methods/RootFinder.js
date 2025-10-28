const math = require('mathjs');

class RootFinder {
  constructor(equation) {
    try {
      // ใช้ math.js compile สมการสตริงเป็นฟังก์ชัน
      this.func = (x) => math.evaluate(equation.replace(/\\^/g, '^'), { x: x }); // แทนที่ \\^ กลับเป็น ^ ก่อน evaluate
      this.equationString = equation; // เก็บสมการดั้งเดิมไว้ด้วยเผื่อใช้
    } catch (e) {
      console.error("Math.js compile error:", e);
      throw new Error(`Invalid equation input: "${equation}"`);
    }

    this.iterations = [];
    this.startTime = 0;
    this.endTime = 0;
  }

  f(x) {
    try {
      return this.func(x);
    } catch(e) {
        console.error(`Error evaluating f(${x}) for equation "${this.equationString}":`, e);
        // อาจจะ return NaN หรือ throw error ต่อไป ขึ้นกับการจัดการ error ที่ต้องการ
        throw new Error(`Error calculating f(${x}). Check the equation syntax.`);
    }
  }

  timerStart() {
    this.startTime = process.hrtime.bigint();
  }

  timerEnd() {
    this.endTime = process.hrtime.bigint();
    return Number(this.endTime - this.startTime) / 1_000_000; // ms
  }

  // Method ที่ Class ลูกต้อง implement
  solve() {
    throw new Error("Solve method must be implemented by subclass.");
  }

  // (ถ้าต้องการ) Method สำหรับสร้างข้อมูลให้ Plotly
  getPlotData(start, end, steps = 100) {
    const xValues = [];
    const yValues = [];
    const stepSize = (end - start) / steps;
    for (let i = 0; i <= steps; i++) {
      const x = start + i * stepSize;
      try {
        const y = this.f(x);
        // ตรวจสอบว่าผลลัพธ์เป็นตัวเลขที่ถูกต้อง
        if (Number.isFinite(y)) {
            xValues.push(x);
            yValues.push(y);
        } else {
             // จัดการกับค่าที่ไม่ใช่ตัวเลข (เช่น Infinity, NaN) อาจจะไม่ใส่จุดนั้นลงกราฟ
             // หรืออาจจะใส่ null เพื่อให้ Plotly สร้าง gap ในกราฟ
             // xValues.push(x);
             // yValues.push(null);
             console.warn(`Skipping plot point at x=${x} due to non-finite result: ${y}`);
        }
      } catch (e) {
          // จัดการ Error ที่เกิดจากการคำนวณ f(x) สำหรับจุดนี้
          console.warn(`Skipping plot point at x=${x} due to calculation error: ${e.message}`);
          // xValues.push(x);
          // yValues.push(null);
      }
    }
    return { x: xValues, y: yValues };
  }
}

module.exports = RootFinder;