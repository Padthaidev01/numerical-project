import { useState } from "react";
import { METHOD_REGISTRY } from "./methods/registry";
import FormRenderer from "./components/FormRenderer";
import IterationsTable from "./components/IterationsTable";

export default function App() {
  const [methodKey, setMethodKey] = useState(METHOD_REGISTRY.methods[0].key);
  const [formValues, setFormValues] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedMethod = METHOD_REGISTRY.methods.find(
    (m) => m.key === methodKey
  );

  const handleMethodChange = (e) => {
    const newMethodKey = e.target.value;
    setMethodKey(newMethodKey);
    setFormValues({});
    setResult(null);
  };

  const handleFormChange = (name, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    try {
      const inputs = {};
      for (const field of selectedMethod.fields) {
        const value = formValues[field.name] ?? field.default ?? '';
        if (field.type === "number" && value !== '') {
          inputs[field.name] = parseFloat(value);
        } else {
          inputs[field.name] = value;
        }
      }
      
      const out = await selectedMethod.solve(inputs);
      setResult(out);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      alert("Error: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (isLoading) return <p className="mt-6">Calculating...</p>;
    if (!result) return null;

    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Result:</h2>
        <p className="mb-2 text-lg">
          The calculated root is approximately:
          <span className="font-mono bg-gray-200 px-2 py-1 rounded ml-2">
            {result.root?.toFixed(6) ?? "N/A"}
          </span>
        </p>
        <IterationsTable data={result.iterations} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Numerical Methods Calculator</h1>
        <div className="mb-6">
          <label className="font-bold mr-2 text-lg">Select Method:</label>
          <select value={methodKey} onChange={handleMethodChange} className="border rounded px-3 py-2 text-lg">
            {METHOD_REGISTRY.methods.map((method) => (
              <option key={method.key} value={method.key}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
        <FormRenderer
          fields={selectedMethod.fields}
          values={formValues}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />
        {renderResult()}
      </div>
    </div>
  );
}