import { useState } from "react";
import InputField from "./components/InputField";

export default function FormPendaftaranKursus() {
  // State untuk menyimpan inputan
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [kursus, setKursus] = useState("");
  const [level, setLevel] = useState("");

  // State untuk menyimpan pesan error (Validasi)
  const [errorNama, setErrorNama] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorTelepon, setErrorTelepon] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fungsi Validasi (Terapkan setidaknya 3 validasi di setiap inputan)
  const validateNama = (val) => {
    setNama(val);
    if (val.trim() === "") {
      setErrorNama("Nama wajib diisi");
    } else if (val.length < 3) {
      setErrorNama("Nama minimal 3 karakter");
    } else if (/\d/.test(val)) {
      setErrorNama("Nama tidak boleh mengandung angka");
    } else {
      setErrorNama("");
    }
  };

  const validateEmail = (val) => {
    setEmail(val);
    if (!val) {
      setErrorEmail("Email wajib diisi");
    } else if (!val.includes("@")) {
      setErrorEmail("Email harus mengandung karakter @");
    } else if (val.length < 5) {
      setErrorEmail("Email terlalu pendek");
    } else {
      setErrorEmail("");
    }
  };

  const validateTelepon = (val) => {
    setTelepon(val);
    if (!val) {
      setErrorTelepon("No Telepon wajib diisi");
    } else if (isNaN(val)) {
      setErrorTelepon("Harus berupa angka");
    } else if (val.length < 10) {
      setErrorTelepon("Minimal 10 digit");
    } else {
      setErrorTelepon("");
    }
  };

  // Cek apakah semua validasi berhasil dan inputan terisi
  const isValid = 
    nama && email && telepon && kursus && level && 
    !errorNama && !errorEmail && !errorTelepon;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">Pendaftaran Kursus</h2>

        {/* 3 Inputan menggunakan Reusable Component */}
        <InputField 
          label="Nama" type="text" placeholder="Masukkan Nama..." 
          value={nama} onChange={(e) => validateNama(e.target.value)} error={errorNama} 
        />
        <InputField 
          label="Email" type="email" placeholder="Masukkan Email..." 
          value={email} onChange={(e) => validateEmail(e.target.value)} error={errorEmail} 
        />
        <InputField 
          label="No Telepon" type="text" placeholder="0812..." 
          value={telepon} onChange={(e) => validateTelepon(e.target.value)} error={errorTelepon} 
        />

        {/* 2 Select Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Pilih Kursus</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            value={kursus} onChange={(e) => setKursus(e.target.value)}
          >
            <option value="">-- Pilih Kursus --</option>
            <option value="React JS">React JS</option>
            <option value="Tailwind CSS">Tailwind CSS</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Level</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            value={level} onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">-- Pilih Level --</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
          </select>
        </div>

        {/* Conditional Rendering Tombol Submit: Tampil jika semua sesuai */}
        {isValid && (
          <button 
            onClick={() => setIsSubmitted(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded mt-2 transition-all"
          >
            Submit Pendaftaran
          </button>
        )}

        {/* Conditional Rendering Respon Inputan (Muncul di bawah form setelah submit) */}
        {isSubmitted && (
          <div className="mt-4 p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded">
            <p className="font-bold">Konfirmasi Data:</p>
            <ul className="text-sm">
              <li>Nama: {nama}</li>
              <li>Kursus: {kursus}</li>
              <li>Level: {level}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}