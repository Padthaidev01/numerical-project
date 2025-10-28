// src/components/FormRenderer.jsx
export default function FormRenderer({ fields, values, onChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 p-4 bg-gray-50 border rounded-md max-w-md"
    >
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="font-medium mb-1">{field.label}</label>
          <input
            type={field.type || "text"}
            step={field.step || "any"}
            value={values[field.name] ?? field.default ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        คำนวณ
      </button>
    </form>
  );
}
