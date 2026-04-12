import React, { useState } from 'react';
import courseData from './courses.json';

export default function CourseManagerList() {
  const [courses] = useState(courseData);
  const [view, setView] = useState('guest');
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredData = courses.filter((item) => {
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterLevel === '' || item.level === filterLevel) &&
      (filterCategory === '' || item.category === filterCategory)
    );
  });

  // Level badge color mapping
  const levelColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-200 font-sans">
      {/* Decorative clouds */}
      <div className="fixed top-20 left-10 opacity-30 animate-pulse">
        <div className="text-7xl">☁️</div>
      </div>
      <div className="fixed top-40 right-20 opacity-30 animate-bounce">
        <div className="text-6xl">☁️</div>
      </div>
      <div className="fixed bottom-20 left-1/4 opacity-20 animate-pulse">
        <div className="text-8xl">☁️</div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header with Pororo Character */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-bounce">🐧</div>
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg">
                Pororo<span className="text-yellow-300">Edu</span>
              </h1>
              <p className="text-white/80 text-sm mt-1">Belajar sambil bermain bersama Pororo!</p>
            </div>
          </div>
          
          {/* Toggle Buttons */}
          <div className="flex bg-white/30 rounded-xl p-1 backdrop-blur-sm">
            <button 
              onClick={() => setView('guest')}
              className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
                view === 'guest' 
                  ? 'bg-yellow-400 text-blue-800 shadow-lg transform scale-105' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <span>👀</span> Guest
            </button>
            <button 
              onClick={() => setView('admin')}
              className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
                view === 'admin' 
                  ? 'bg-yellow-400 text-blue-800 shadow-lg transform scale-105' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <span>👑</span> Admin
            </button>
          </div>
        </header>

        {/* Search & Filter Bar with Pororo friends */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border-2 border-yellow-300">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔍</span>
            <span className="font-bold text-blue-700">Cari Kursus Favoritmu!</span>
            <span className="text-2xl ml-auto">🐧🦊🐻‍❄️</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari kursus..."
                className="w-full p-3 pl-10 border-2 border-blue-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 outline-none transition-all"
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-3 text-gray-400">🔎</span>
            </div>
            <select 
              className="p-3 border-2 border-blue-200 rounded-xl focus:border-yellow-400 outline-none bg-white cursor-pointer"
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="">📊 Semua Level</option>
              <option value="Beginner">🌱 Beginner - Pemula</option>
              <option value="Intermediate">⭐ Intermediate - Menengah</option>
              <option value="Advanced">🚀 Advanced - Mahir</option>
            </select>
            <select 
              className="p-3 border-2 border-blue-200 rounded-xl focus:border-yellow-400 outline-none bg-white cursor-pointer"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">📚 Semua Kategori</option>
              <option value="Web Development">💻 Web Development</option>
              <option value="Data Science">📊 Data Science</option>
              <option value="Mobile Development">📱 Mobile Development</option>
              <option value="UI/UX">🎨 UI/UX Design</option>
            </select>
          </div>
        </div>

        {/* Tampilan Konten */}
        {view === 'guest' ? (
          /* GUEST VIEW: GRID CARD ala Pororo */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((course, index) => (
              <div 
                key={course.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-yellow-200 relative"
              >
                {/* Pororo sticker */}
                <div className="absolute -top-2 -right-2 z-10 text-4xl rotate-12 group-hover:rotate-0 transition-transform">
                  {index % 4 === 0 ? '🐧' : index % 4 === 1 ? '🦊' : index % 4 === 2 ? '🐻‍❄️' : '🐧'}
                </div>
                
                {/* Image section with overlay */}
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className={`absolute bottom-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${levelColors[course.level]} shadow-md`}>
                    {course.level === 'Beginner' && '🌱 '}
                    {course.level === 'Intermediate' && '⭐ '}
                    {course.level === 'Advanced' && '🚀 '}
                    {course.level}
                  </span>
                </div>
                
                <div className="p-5">
                  <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-600 rounded-full inline-block">
                    {course.category === 'Web Development' && '💻 '}
                    {course.category === 'Data Science' && '📊 '}
                    {course.category === 'Mobile Development' && '📱 '}
                    {course.category === 'UI/UX' && '🎨 '}
                    {course.category}
                  </span>
                  <h3 className="font-bold text-lg mt-3 text-gray-800 line-clamp-2">{course.title}</h3>
                  
                  {/* Instructor with icon */}
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <span className="text-blue-400">👨‍🏫</span>
                    <span>{course.instructor.name}</span>
                    <span className="text-yellow-400 ml-auto">⭐ {course.instructor.rating}</span>
                  </div>
                  
                  {/* Stats mini */}
                  <div className="flex gap-3 mt-3 text-xs text-gray-400">
                    <span>📚 {course.stats.lessons} lessons</span>
                    <span>⏱️ {course.stats.duration}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t-2 border-blue-100">
                    <span className="font-bold text-xl text-blue-600">Rp {course.price.toLocaleString()}</span>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold px-4 py-2 rounded-full transition-all text-sm shadow-md hover:shadow-lg flex items-center gap-1">
                      Daftar <span>📝</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ADMIN VIEW: TABLE dengan tema Pororo */
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👑</span>
                <h2 className="text-white font-bold text-xl">Panel Admin Pororo</h2>
                <span className="text-white/80 text-sm ml-auto">🐧 Total {filteredData.length} kursus</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-4 text-blue-800">🐧 ID</th>
                    <th className="p-4 text-blue-800">📚 Nama Kursus</th>
                    <th className="p-4 text-blue-800">📂 Kategori</th>
                    <th className="p-4 text-blue-800">⭐ Level</th>
                    <th className="p-4 text-blue-800">👨‍🏫 Instruktur</th>
                    <th className="p-4 text-blue-800">🎓 Rating</th>
                    <th className="p-4 text-blue-800">👥 Siswa</th>
                    <th className="p-4 text-blue-800">💰 Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredData.map((course) => (
                    <tr key={course.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="p-4 text-gray-400 font-mono text-sm">#{course.id}</td>
                      <td className="p-4 font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xl group-hover:scale-125 transition-transform">📘</span>
                          {course.title}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                          {course.category === 'Web Development' && '💻 '}
                          {course.category === 'Data Science' && '📊 '}
                          {course.category === 'Mobile Development' && '📱 '}
                          {course.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${levelColors[course.level]}`}>
                          {course.level}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{course.instructor.name}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-yellow-500">
                          ⭐ {course.instructor.rating}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        <span className="flex items-center gap-1">
                          👥 {course.stats.students.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-blue-600">Rp {course.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <span className="text-6xl">🐧❓</span>
                <p className="text-gray-400 mt-4">Tidak ada kursus yang ditemukan...</p>
              </div>
            )}
          </div>
        )}

        {/* Footer dengan karakter Pororo */}
        <footer className="mt-12 text-center text-white/80 text-sm">
          <div className="flex justify-center gap-6 text-2xl mb-3">
            <span className="hover:scale-125 transition-transform cursor-pointer">🐧</span>
            <span className="hover:scale-125 transition-transform cursor-pointer">🦊</span>
            <span className="hover:scale-125 transition-transform cursor-pointer">🐻‍❄️</span>
            <span className="hover:scale-125 transition-transform cursor-pointer">🐥</span>
            <span className="hover:scale-125 transition-transform cursor-pointer">🐸</span>
          </div>
          <p>Belajar menyenangkan bersama Pororo & Friends! 🎓✨</p>
          <p className="text-xs mt-2">© 2024 PororoEdu - Belajar jadi lebih ceria</p>
        </footer>
      </div>
    </div>
  );
}