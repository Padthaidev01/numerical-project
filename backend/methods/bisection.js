const { makeFx } = require('./eval.js');

function bisection({ expr, xl, xr, maxIter = 50, tol = 1e-6 }) {
  const f = makeFx(expr);
  let fl = f(xl), fr = f(xr);
  if (isNaN(fl) || isNaN(fr)) throw new Error('คำนวณ f(x) ไม่ได้');
  if (fl * fr > 0) throw new Error('f(XL) และ f(XR) ต้องมีเครื่องหมายต่างกัน');

  let xm = (xl + xr) / 2, fxm = f(xm);
  let prev = xm;
  const logs = [];
  for (let i = 1; i <= maxIter; i++) {
    xm = (xl + xr) / 2;
    fxm = f(xm);
    const err = i === 1 ? null : Math.abs((xm - prev) / xm) * 100;

    logs.push({
      iter: i,
      xl, xr, xm,
      fxl: fl, fxr: fr, fxm,
      errPct: err === null ? null : +err.toFixed(6),
    });

    if (Math.abs(fxm) < tol || (i > 1 && Math.abs(xm - prev) < tol)) break;

    if (fl * fxm < 0) {
      xr = xm; fr = fxm;
    } else {
      xl = xm; fl = fxm;
    }
    prev = xm;
  }
  return { root: xm, iterations: logs };
}

module.exports = { bisection };