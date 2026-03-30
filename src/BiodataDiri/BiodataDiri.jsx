import "./custom.css";


export default function BiodataDiri() {
  return (
    <div className="card-container pororo-theme">

      

      <div className="snow-overlay"></div>

      <h1 className="title-pororo">Biodata Diri</h1>
      <div className="divider-snow">❄️❄️❄️</div>

      <div className="content-scroll">
        <DataPribadi />
        <Pendidikan />
        <Skill />
        <Hobi />
        <MediaSosial />
        <Kontak />
      </div>
    </div>
  );
}

function DataPribadi() {
  return (
    <div className="info-section ice-card">
      <h3>🐧 Profil </h3>
      <p><strong>Nama:</strong> Alyah Najwa Restu Islami</p>
      <p><strong>Jurusan:</strong> Sistem Informasi</p>
    </div>
  );
}

function Pendidikan() {
  return (
    <div className="info-section ice-card">
      <h3>🎒 Pendidikan</h3>
      <ul>
        <li>SD - IT Bunayya</li>
        <li>SMP - IT Bunayya</li>
        <li>SMA - MAN 1 Pekanbaru</li>
        <li>Politeknik caltex riau - Sistem Informasi</li>
      </ul>
    </div>
  );
}

function Skill() {
  return (
    <div className="info-section ice-card">
      <h3>✨ Keajaiban (Skill)</h3>
      <div className="badge-group">
        <span className="badge-ice">ReactJS</span>
        <span className="badge-ice">JavaScript</span>
      </div>
    </div>
  );
}

function Hobi() {
  return (
    <div className="info-section ice-card">
      <h3>⛷️ Hobi </h3>
      <p>ngoding tipis, nonton drakor, game dan Musik</p>
    </div>
  );
}

function MediaSosial() {
  return (
    <div className="info-section ice-card">
      <h3>📱Sosmed</h3>
      <p>Instagram: @najwa.alyahh </p>
    </div>
  );
}

function Kontak() {
  return (
    <div className="footer-section">
      <small>"Halo teman-teman! Semuanya hebat!" ✨ </small>
    </div>
  );
}