const { makeFx } = require('./eval.js');

function falsePosition({ expr, xl, xr, maxIter = 50, tol = 1e-6 }) {
  const f = makeFx(expr);
  let fl = f(xl), fr = f(xr);
  if (fl * fr > 0) throw new Error('f(XL) และ f(XR) ต้องมีเครื่องหมายต่างกัน');

  let x1 = xr - (fr * (xl - xr)) / (fl - fr);
  let prev = x1;
  const logs = [];

  for (let i = 1; i <= maxIter; i++) {
    const fx1 = f(x1);
    const err = i === 1 ? null : Math.abs((x1 - prev) / x1) * 100;

    logs.push({
      iter: i,
      xl, xr, x1,
      fxl: fl, fxr: fr, fx1,
      errPct: err === null ? null : +err.toFixed(6),
    });

    if (Math.abs(fx1) < tol || (i > 1 && Math.abs(x1 - prev) < tol)) break;

    if (fl * fx1 < 0) {
      xr = x1; fr = fx1;
    } else {
      xl = x1; fl = fx1;
    }
    prev = x1;
    x1 = xr - (fr * (xl - xr)) / (fl - fr);
  }
  return { root: prev, iterations: logs };
}

module.exports = { falsePosition };