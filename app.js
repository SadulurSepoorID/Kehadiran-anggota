// Fungsi untuk menampilkan form pencarian data
function showSearch() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h2>Cari Data</h2>
    <select id="searchType">
      <option value="nama">Cari Nama Anggota</option>
      <option value="kegiatan">Cari Lokasi/Kegiatan</option>
    </select>
    <input type="text" id="searchInput" placeholder="Masukkan kata kunci...">
    <button class="search-btn" onclick="searchData()">Cari</button>
    <div id="result"></div>
    <p id="keywordExample" class="keyword-example"></p> <!-- Tempat untuk menampilkan contoh kata kunci -->
  `;

  const searchType = document.getElementById('searchType');
  const searchInput = document.getElementById('searchInput');
  const keywordExample = document.getElementById('keywordExample'); // Menyimpan referensi contoh kata kunci

  // Event listener untuk mengubah placeholder dan contoh kata kunci sesuai pilihan
  searchType.addEventListener('change', () => {
    if (searchType.value === 'nama') {
      searchInput.placeholder = 'Masukkan nama lengkap...';
      keywordExample.textContent = 'Contoh: Fathir Ahmad Maulana, Moch Fikri';
    } else if (searchType.value === 'kegiatan') {
      searchInput.placeholder = 'Masukkan Lokasi/Kegiatan...';
      keywordExample.textContent = 'Contoh: "JPL 78 Bekasi" atau "Sosialisasi Disiplin Perlintasan"';
    }
  });

  // Set initial example text based on default selection
  if (searchType.value === 'nama') {
    keywordExample.textContent = 'Contoh: Fathir Ahmad Maulana, Moch Fikri';
  } else if (searchType.value === 'kegiatan') {
    keywordExample.textContent = 'Contoh: "JPL 78 Bekasi" atau "Sosialisasi Disiplin Perlintasan"';
  }
}

// Fungsi untuk mencari data berdasarkan nama atau kegiatan
function searchData() {
  const type = document.getElementById('searchType').value;
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultDiv = document.getElementById('result');
  const keywordExample = document.getElementById('keywordExample'); // Referensi contoh kata kunci

  // Sembunyikan contoh kata kunci setelah pencarian dilakukan
  keywordExample.style.display = 'none';

  if (type === "nama") {
    let hadir = 0, alpa = 0, izin = 0;
    let rekap = [];

    dataKegiatan.forEach(kegiatan => {
      kegiatan.absensi.forEach(absen => {
        if (absen.nama.toLowerCase() === keyword) {
          if (absen.status === "Hadir") hadir++;
          if (absen.status === "Alpa") alpa++;
          if (absen.status === "Izin") izin++;
          rekap.push({
            kegiatan: kegiatan.namaKegiatan,
            lokasi: kegiatan.lokasi,
            tanggal: kegiatan.tanggal,
            status: absen.status,
            alasan: absen.alasan || ""
          });
        }
      });
    });

    if (rekap.length === 0) {
      resultDiv.innerHTML = "<p>Data tidak ditemukan.</p>";
      return;
    }

    let html = `
      <h3>Nama: ${capitalizeWords(keyword)}</h3>
      <p>Hadir: ${hadir}x | Alpa: ${alpa}x | Izin: ${izin}x</p>
      <ul>
    `;
    rekap.forEach(r => {
      html += `<li><strong>${r.status}</strong> - ${r.kegiatan} di ${r.lokasi} (${r.tanggal}) ${r.alasan ? '- Alasan: ' + r.alasan : ''}</li>`;
    });
    html += "</ul>";
    resultDiv.innerHTML = html;

  } else if (type === "kegiatan") {
    const filtered = dataKegiatan.filter(k => 
      k.namaKegiatan.toLowerCase().includes(keyword) ||
      k.lokasi.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) {
      resultDiv.innerHTML = "<p>Data tidak ditemukan.</p>";
      return;
    }

    let html = "";
    filtered.forEach(k => {
      html += `
        <h3>Kegiatan: ${k.namaKegiatan}</h3>
        <p>Lokasi: ${k.lokasi}</p>
        <p>Tanggal: ${k.tanggal}</p>
        <p>Nama anggota yang hadir:</p>
        <ul>
      `;
      k.absensi.filter(a => a.status === "Hadir").forEach(a => {
        html += `<li>${a.nama}</li>`;
      });
      html += "</ul>";
    });

    resultDiv.innerHTML = html;
  }
}

// Fungsi untuk mengubah kapitalisasi setiap kata
function capitalizeWords(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

// Fungsi untuk menampilkan tabel nominasi 3 anggota terbaik
function showTop3() {
  const content = document.getElementById('content');

  let counter = {};

  // Daftar nama pengurus yang mau dikecualikan
  const pengurus = [
    "Hery Haryadi",
    "Arjuna Pamungkas",
    "Mohammad Walid Ridho",
    "Ridho Ariotama",
    "Rasyiqha Syafa Rabanny",
    "Muhammad Rizky Hidayat",
    "Salman Alparisi",
    "Fathir Ahmad Maulana",
    "Eki Apriandi",
    "Agil Pramono",
    "Moch Fikri",
    "Hasan Al Anwari",
    "Aldi Hadiansyah",
    "Muhammad Alfazely Wibisono"
  ];

  // Hitung kehadiran anggota
  dataKegiatan.forEach(kegiatan => {
    kegiatan.absensi.forEach(absen => {
      if (absen.status === "Hadir") {
        counter[absen.nama] = (counter[absen.nama] || 0) + 1;
      }
    });
  });

  // Buang nama-nama pengurus dari counter
  pengurus.forEach(nama => {
    delete counter[nama];
  });

  // Ambil 3 anggota terbaik berdasarkan jumlah kehadiran terbanyak
  const top3 = Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Tampilkan data dalam bentuk tabel
  let html = `
    <h2>Nominasi 3 Anggota Terbaik</h2>
    <table class="top3-table">
      <thead>
        <tr>
          <th>Ranking</th>
          <th>Nama</th>
          <th>Kehadiran</th>
        </tr>
      </thead>
      <tbody>
  `;

  top3.forEach(([nama, jumlah], index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${nama}</td>
        <td>${jumlah}x</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  content.innerHTML = html;
}