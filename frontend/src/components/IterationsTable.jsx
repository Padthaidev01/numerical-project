export default function IterationsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="mt-4 text-gray-600">
        No iteration data available for this method.
      </p>
    );
  }

  // สร้าง Label ที่เป็นมิตรกับผู้ใช้
  const labels = {
    iter: "Iter",
    xl: "XL",
    xr: "XR",
    xm: "XM (Bisection)",
    x1: "X1 (False Position)",
    fxl: "f(XL)",
    fxr: "f(XR)",
    fxm: "f(XM)",
    fx1: "f(X1)",
    errPct: "Error (%)",
  };

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto mt-4">
      <h3 className="text-lg font-semibold mb-2">Iterations</h3>
      <table className="table-auto w-full border-collapse border border-gray-400 text-sm text-center">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col) => (
              <th key={col} className="border border-gray-400 px-4 py-2">
                {labels[col] || col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              {columns.map((col) => (
                <td
                  key={col}
                  className="border border-gray-300 px-4 py-2 text-right font-mono"
                >
                  {row[col] === null
                    ? "-"
                    : typeof row[col] === "number"
                    ? row[col].toFixed(6)
                    : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
