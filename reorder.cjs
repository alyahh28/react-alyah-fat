const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'LandingPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The markers in the file currently (to help with parsing)
const markers = [
  "{/* ===== HEADER ===== */}",
  "{/* ===== HERO ===== */}",
  "{/* ===== KATEGORI ===== */}",
  "{/* ===== PRODUK UNGGULAN ===== */}",
  "{/* ===== MEMBER & KODE PROMO ===== */}",
  "{/* ===== GALERI INSPIRASI ===== */}",
  "{/* ===== TESTIMONI ===== */}",
  "{/* ===== ABOUT ===== */}",
  "{/* ===== NEWSLETTER ===== */}",
  "{/* ===== FOOTER ===== */}",
  "{/* ===== FLOATING CHATBOT ===== */}",
  "{/* ===== FLOATING WHATSAPP ===== */}"
];

const getSection = (name) => {
  const startMarker = `{/* ===== ${name} ===== */}`;
  const start = content.indexOf(startMarker);
  if (start === -1) return "";
  
  let end = content.length;
  for (const marker of markers) {
    const markerIndex = content.indexOf(marker);
    if (markerIndex > start && markerIndex < end) {
      end = markerIndex;
    }
  }
  
  if (name === "FLOATING WHATSAPP") {
      end = content.lastIndexOf("    </div>\n  );\n}");
      if(end === -1) end = content.lastIndexOf("    </div>");
  }
  
  return content.slice(start, end);
};

const header = getSection("HEADER");
const hero = getSection("HERO");
const kategori = getSection("KATEGORI");
const produk = getSection("PRODUK UNGGULAN");
const promo = getSection("MEMBER & KODE PROMO");
const inspirasi = getSection("GALERI INSPIRASI");
const testimoni = getSection("TESTIMONI");
const tentang = getSection("ABOUT");
const kontak = getSection("NEWSLETTER");
const footer = getSection("FOOTER");
const chatbot = getSection("FLOATING CHATBOT");
const whatsapp = getSection("FLOATING WHATSAPP");

const beforeHeader = content.slice(0, content.indexOf("{/* ===== HEADER ===== */}"));

// WaEnd is right before the final closing div and return.
let waEnd = content.lastIndexOf("    </div>\n  );\n}");
if (waEnd === -1) waEnd = content.lastIndexOf("    </div>\r\n  );\r\n}");
const afterWa = content.slice(waEnd);

// NEW ORDER:
// HEADER -> HERO -> KATEGORI -> PRODUK -> INSPIRASI -> PROMO -> ABOUT -> NEWSLETTER -> TESTIMONI -> FOOTER
const newContent = beforeHeader +
  header +
  hero +
  kategori +
  produk +
  inspirasi +
  promo +
  tentang +
  kontak +
  testimoni +
  footer +
  chatbot +
  whatsapp +
  afterWa;

fs.writeFileSync(filePath, newContent);
console.log("Reordered sections successfully.");
