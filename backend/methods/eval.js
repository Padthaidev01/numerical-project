// ประเมิน f(x) จากข้อความเช่น "x**3 - 7*x + 1"
// ใช้ with(Math) ให้พิมพ์ sin(x), log(x) ได้เลย
function makeFx(expr) {
  const body = `with (Math) { return (${expr}); }`;
  try {
    // NOTE: ในงานจริงควร sanitize เพิ่มเติม
    // ที่นี่เพื่อเรียน/แลบ เราใช้ new Function แบบควบคุมอินพุตเอง
    // หลีกเลี่ยงรับโค้ดที่ไม่ใช่สูตรคณิตศาสตร์
    return new Function('x', body);
  } catch (e) {
    throw new Error('รูปแบบสมการไม่ถูกต้อง');
  }
}

module.exports = { makeFx };
