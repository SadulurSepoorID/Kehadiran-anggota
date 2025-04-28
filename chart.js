function showChart() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h2>Statistik Kehadiran 2025</h2>
    <canvas id="myChart" width="400" height="200"></canvas>
  `;

  let bulan = Array(12).fill(0);

  dataKegiatan.forEach(kegiatan => {
    const month = new Date(kegiatan.tanggal).getMonth(); // 0 - Jan, 11 - Dec
    bulan[month] += kegiatan.absensi.filter(a => a.status === "Hadir").length;
  });

  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
      datasets: [{
        label: 'Jumlah Kehadiran',
        data: bulan,
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision:0
          }
        }
      }
    }
  });
}