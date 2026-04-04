export default function FormPendaftaranKursus() {
	return (
		<div className="flex flex-col items-center justify-center m-5 p-5 bg-gray-100">
			<div className="bg-white p-6 rounded-lg shadow-lg w-96">
				<h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">Pendaftaran Kursus</h2>

				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-1">
						Nama
					</label>
					<input
						type="text"
						placeholder="Silahkan ketik Nama..."
						className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-1">
						Email
					</label>
					<input
						type="email"
						placeholder="Silahkan ketik Email..."
						className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-1">
						No Telepon
					</label>
					<input
						type="tel"
						placeholder="ex: 0812..."
						className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				

				<button className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white font-bold py-2 px-4 rounded mt-2">
          Simpan
        </button>
			</div>
		</div>
	);
}
