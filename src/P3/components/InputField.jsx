export default function InputField({ label, type, placeholder, value, onChange, error }) {
  return (
    <div className="mb-3">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {/* Menampilkan alert error di bawah inputan sesuai modul */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}