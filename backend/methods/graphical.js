const { makeFx } = require('./eval.js');

function graphical({ expr, xl, xr, step = 0.00001 }) {
  const f = makeFx(expr);

  let prevX = null;
  let prevFx = null;
  const iterations = [];

  // เราจะวนลูปในช่วงที่กำหนด ด้วย step ที่ละเอียด
  for (let x = xl; x <= xr; x = x + step) {
    // ป้องกันปัญหาเรื่อง floating point precision
    const currentX = Number(x.toPrecision(15));
    const currentFx = f(currentX);

    iterations.push({
      x: currentX,
      fx: currentFx,
    });

    // ตรวจสอบว่า f(x) ข้ามแกน 0 หรือไม่
    // (เกิดขึ้นเมื่อเครื่องหมายของ f(x) เปลี่ยนจากลบเป็นบวก หรือบวกเป็นลบ)
    if (prevFx !== null && prevFx * currentFx <= 0) {
      // เมื่อเจอจุดที่ข้ามแกน เราจะเลือกว่าจุดก่อนหน้า หรือจุดปัจจุบัน ใกล้ 0 มากกว่ากัน
      const root = Math.abs(prevFx) < Math.abs(currentFx) ? prevX : currentX;
      
      // ส่งค่า root ที่หาได้ และข้อมูลการวนลูปบางส่วนกลับไป
      return { 
        root: root, 
        iterations: iterations.slice(-10) // ส่งแค่ 10 รอบล่าสุดเพื่อไม่ให้ข้อมูลเยอะไป
      };
    }

    prevX = currentX;
    prevFx = currentFx;
  }

  // ถ้าวนจนจบแล้วยังไม่เจอจุดที่ข้ามแกนเลย
  throw new Error('ไม่พบรากในช่วงที่กำหนดด้วย step นี้ ลองขยายช่วง [XL, XR] หรือปรับค่า step');
}

module.exports = { graphical };