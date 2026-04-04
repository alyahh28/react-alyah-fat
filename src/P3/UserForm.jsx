import InputField from "./components/InputField";

export default function UserForm() {
  return (
    <div className="flex flex-col items-center justify-center m-5 p-5 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Tambah User</h2>
        <InputField
          label="Nama"
          type="text"
          placeholder="Silahkan ketik Nama..."
        />

        <InputField
          label="Email"
          type="email"
          placeholder="Silahkan ketik EMail..."
        />

        <InputField 
        label="No Telepon" 
        type="tel" 
        placeholder="ex: 0812..."
        />

        <SelectField label="Pilih Kursus" options={["React JS", "Node JS", "Python Data Science"]} 
          value={formData.kursus} onChange={(e) => { setFormData({...formData, kursus: e.target.value}); validate("kursus", e.target.value) }} 
          error={errors.kursus} />

        <SelectField label="Level" options={["Pemula", "Menengah", "Mahir"]} 
          value={formData.level} onChange={(e) => { setFormData({...formData, level: e.target.value}); validate("level", e.target.value) }} 
          error={errors.level} />

        <button className="w-full bg-green-500 text-white p-2 rounded">
          Simpan
        </button>
      </div>
    </div>
  );
}
