/* =========================================================
   santuary — interaksi frontend (tanpa backend)
   Data di bawah bersifat contoh untuk keperluan tampilan.

   Catatan: fungsi muatLayanan() berasal dari commit contributor
   "feat: integrasi awal frontend-backend lewat endpoint layanan".
   Fungsi ini sengaja tidak dijalankan otomatis agar halaman tetap
   bekerja saat backend belum tersedia. Tambahkan ?layanan pada URL
   untuk menjalankannya secara manual.
   ========================================================= */

async function muatLayanan() {
  try {
    var respons = await fetch('http://localhost:3000/api/layanan');
    var hasil = await respons.json();
    console.log('status:', hasil.status);
    console.log('data:', hasil.data);

    document.getElementById('hasil-api').textContent =
      JSON.stringify(hasil.data, null, 2);
  } catch (err) {
    console.info('Backend layanan belum tersedia; memakai data contoh frontend.');
  }
}

if (new URLSearchParams(window.location.search).has('layanan')) {
  muatLayanan();
}

(function () {
  'use strict';

  var KATEGORI = {
    verbal: 'Perundungan verbal',
    fisik: 'Perundungan fisik',
    siber: 'Perundungan siber',
    seksual: 'Pelecehan seksual',
    sosial: 'Pengucilan sosial'
  };

  var TINGKAT = {
    BERCERITA: 'Bercerita saja',
    DUKUNGAN: 'Minta dukungan',
    LAPORAN: 'Laporan formal'
  };

  var cerita = [
    {
      id: 1,
      judul: 'Komentar di grup kelas',
      isi: 'Aku mengirim jawaban yang salah dan beberapa orang menertawakannya di grup. Aku tahu itu kecil bagi mereka, tapi aku jadi takut membuka chat kelas lagi.',
      nama: 'Bunga',
      kategori: 'verbal',
      tingkat: 'BERCERITA',
      sensitif: false,
      dukungan: 12,
      waktu: '2 jam lalu'
    },
    {
      id: 2,
      judul: 'Foto yang tersebar',
      isi: 'Ada screenshot percakapan pribadi yang dibagikan ulang tanpa izinku. Aku tidak ingin menyebut siapa pun di sini. Aku hanya ingin tahu aku tidak sendirian.',
      nama: 'Anonim',
      kategori: 'siber',
      tingkat: 'DUKUNGAN',
      sensitif: true,
      dukungan: 34,
      waktu: '5 jam lalu'
    },
    {
      id: 3,
      judul: 'Aku tidak berani mengatakan apa pun',
      isi: 'Kejadian itu membuatku diam. Aku menyimpan sendiri sampai akhirnya menulis di sini. Pelan-pelan aku mulai percaya bahwa ceritaku boleh didengar.',
      nama: 'R.',
      kategori: 'seksual',
      tingkat: 'LAPORAN',
      sensitif: true,
      dukungan: 21,
      waktu: 'Kemarin'
    },
    {
      id: 4,
      judul: 'Duduk sendiri di kantin',
      isi: 'Setiap kali istirahat, aku mencari tempat yang kosong. Tidak ada yang mengganggu, tapi juga tidak ada yang menyapa. Aku lelah menjadi orang yang tak terlihat.',
      nama: 'Laut',
      kategori: 'sosial',
      tingkat: 'BERCERITA',
      sensitif: false,
      dukungan: 8,
      waktu: '2 hari lalu'
    },
    {
      id: 5,
      judul: 'Lengan yang memar',
      isi: 'Aku bilang saja terpeleset. Aku belum siap menjelaskan apa yang sebenarnya terjadi, tapi aku ingin seseorang tahu bahwa aku masih di sini.',
      nama: 'Awan',
      kategori: 'fisik',
      tingkat: 'DUKUNGAN',
      sensitif: false,
      dukungan: 5,
      waktu: '3 hari lalu'
    },
    {
      id: 6,
      judul: 'Suara yang memotong',
      isi: 'Di depan kelas, pertanyaanku dipotong dan dijawab orang lain. Aku tersenyum saat itu. Sekarang aku menulisnya supaya tidak perlu tersenyum lagi.',
      nama: 'Rumput',
      kategori: 'verbal',
      tingkat: 'BERCERITA',
      sensitif: false,
      dukungan: 17,
      waktu: '4 hari lalu'
    }
  ];

  var ALASAN = [
    'Menyalahkan atau merendahkan korban',
    'Mengandung data pribadi atau identitas',
    'Tidak sesuai kategori',
    'Konten berbahaya bagi komunitas'
  ];

  var revealed = {};
  var reported = {};
  var filterAktif = 'semua';
  var feed = document.getElementById('feed');
  var feedKosong = document.getElementById('feed-empty');

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function inisial(nama) {
    return escapeHtml(String(nama).trim().charAt(0).toUpperCase() || 'A');
  }

  function kartuCerita(item) {
    var terbuka = !item.sensitif || revealed[item.id];
    var isi = terbuka
      ? '<p class="feed-excerpt">' + escapeHtml(item.isi) + '</p>'
      : '<p class="feed-excerpt feed-excerpt-locked">Cerita ini ditandai sensitif. Buka jika kamu siap membacanya.</p>';

    var peringatan = '';
    if (item.sensitif && !terbuka) {
      peringatan =
        '<div class="sensitive-notice">' +
          '<strong>Peringatan konten sensitif</strong>' +
          '<p>Isi cerita disembunyikan sampai kamu memilih untuk membukanya.</p>' +
          '<button class="reveal-btn" type="button" data-action="reveal" data-id="' + item.id + '">Buka cerita</button>' +
        '</div>';
    } else if (item.sensitif && terbuka) {
      peringatan = '<p class="reveal-note">Dibuka. Bantuan selalu tersedia di pojok kanan bawah.</p>';
    }

    var tombolLapor = reported[item.id]
      ? '<button class="feed-action" type="button" disabled>Sudah dilaporkan</button>'
      : '<button class="feed-action" type="button" data-action="report" data-id="' + item.id + '">Laporkan</button>';

    var formLapor =
      '<form class="report-form" data-report-for="' + item.id + '" hidden>' +
        '<label for="alasan-' + item.id + '">Alasan laporan</label>' +
        '<select id="alasan-' + item.id + '" name="alasan">' +
          '<option value="">Pilih alasan</option>' +
          ALASAN.map(function (a) { return '<option value="' + escapeHtml(a) + '">' + escapeHtml(a) + '</option>'; }).join('') +
        '</select>' +
        '<button class="btn btn-sm btn-primary" type="submit">Kirim laporan</button>' +
        '<small class="error-text" data-error-for="alasan-' + item.id + '"></small>' +
        '<small class="report-success" hidden>Laporan terkirim. Moderator akan meninjaunya.</small>' +
      '</form>';

    return (
      '<article class="feed-card' + (item.sensitif ? ' is-sensitive' : '') + '" data-id="' + item.id + '">' +
        '<div class="feed-card-top">' +
          '<span class="chip">' + escapeHtml(KATEGORI[item.kategori]) + '</span>' +
          '<span class="chip chip-level">' + escapeHtml(TINGKAT[item.tingkat]) + '</span>' +
        '</div>' +
        '<h3>' + escapeHtml(item.judul) + '</h3>' +
        isi +
        peringatan +
        '<div class="feed-card-meta">' +
          '<span class="avatar" aria-hidden="true">' + inisial(item.nama) + '</span>' +
          '<span>' + escapeHtml(item.nama) + ' · ' + escapeHtml(item.waktu) + '</span>' +
        '</div>' +
        '<div class="feed-card-actions">' +
          '<button class="feed-action feed-support" type="button" data-action="support" data-id="' + item.id + '">♥ Dukung (' + item.dukungan + ')</button>' +
          tombolLapor +
        '</div>' +
        formLapor +
      '</article>'
    );
  }

  function renderFeed() {
    if (!feed) return;

    var daftar = cerita.filter(function (item) {
      return filterAktif === 'semua' || item.kategori === filterAktif;
    });

    feed.innerHTML = daftar.map(kartuCerita).join('');
    if (feedKosong) feedKosong.hidden = daftar.length !== 0;
  }

  if (feed) {
    var chips = document.querySelectorAll('.filter-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterAktif = chip.getAttribute('data-filter');
        chips.forEach(function (other) {
          var aktif = other === chip;
          other.classList.toggle('is-active', aktif);
          other.setAttribute('aria-pressed', String(aktif));
        });
        renderFeed();
      });
    });

    feed.addEventListener('click', function (event) {
      var tombol = event.target.closest('[data-action]');
      if (!tombol) return;

      var id = Number(tombol.getAttribute('data-id'));
      var aksi = tombol.getAttribute('data-action');
      var item = cerita.find(function (c) { return c.id === id; });
      if (!item) return;

      if (aksi === 'reveal') {
        revealed[id] = true;
        renderFeed();
        var kartu = feed.querySelector('[data-id="' + id + '"]');
        if (kartu) kartu.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }

      if (aksi === 'support') {
        item.dukungan += 1;
        tombol.textContent = '♥ Dukung (' + item.dukungan + ')';
        tombol.classList.add('is-supported');
      }

      if (aksi === 'report') {
        var formLapor = feed.querySelector('[data-report-for="' + id + '"]');
        if (formLapor) formLapor.hidden = !formLapor.hidden;
      }
    });

    feed.addEventListener('submit', function (event) {
      var formLapor = event.target.closest('.report-form');
      if (!formLapor) return;
      event.preventDefault();

      var id = Number(formLapor.getAttribute('data-report-for'));
      var alasan = formLapor.querySelector('select').value;
      var error = formLapor.querySelector('.error-text');
      var sukses = formLapor.querySelector('.report-success');

      if (!alasan) {
        error.textContent = 'Pilih alasan terlebih dahulu.';
        sukses.hidden = true;
        return;
      }

      error.textContent = '';
      sukses.hidden = false;
      reported[id] = true;
      formLapor.querySelector('button[type="submit"]').disabled = true;
      var tombolLapor = feed.querySelector('[data-action="report"][data-id="' + id + '"]');
      if (tombolLapor) {
        tombolLapor.textContent = 'Sudah dilaporkan';
        tombolLapor.disabled = true;
      }
    });

    renderFeed();
  }

  /* ---------- Formulir cerita ---------- */

  var form = document.getElementById('cerita-form');
  if (!form) return;

  var extra = document.getElementById('laporan-extra');
  var sukses = document.getElementById('form-success');
  var ref = document.getElementById('success-ref');

  function updateCounter(inputId, counterId) {
    var input = document.getElementById(inputId);
    var counter = document.getElementById(counterId);
    if (!input || !counter) return;
    counter.textContent = input.value.length + '/' + input.maxLength;
  }

  function setError(nama, pesan) {
    var target = form.querySelector('[data-error-for="' + nama + '"]');
    if (target) target.textContent = pesan || '';
  }

  function sinkronExtra() {
    var dipilih = form.querySelector('input[name="tingkat"]:checked');
    var mintaLaporan = dipilih && dipilih.value === 'LAPORAN';
    extra.hidden = !mintaLaporan;
    document.getElementById('lembaga').required = mintaLaporan;
    document.getElementById('persetujuan').required = mintaLaporan;
    if (!mintaLaporan) {
      setError('lembaga', '');
      setError('persetujuan', '');
    }
  }

  document.getElementById('judul').addEventListener('input', function () {
    updateCounter('judul', 'judul-counter');
    setError('judul', '');
  });

  document.getElementById('isi').addEventListener('input', function () {
    updateCounter('isi', 'isi-counter');
    setError('isi', '');
  });

  document.getElementById('kategori').addEventListener('change', function () { setError('kategori', ''); });
  form.querySelectorAll('input[name="tingkat"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      setError('tingkat', '');
      sinkronExtra();
    });
  });
  document.getElementById('lembaga').addEventListener('change', function () { setError('lembaga', ''); });
  document.getElementById('persetujuan').addEventListener('change', function () { setError('persetujuan', ''); });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var judul = document.getElementById('judul').value.trim();
    var isi = document.getElementById('isi').value.trim();
    var kategori = document.getElementById('kategori').value;
    var tingkat = form.querySelector('input[name="tingkat"]:checked');
    var lembaga = document.getElementById('lembaga');
    var persetujuan = document.getElementById('persetujuan');
    var valid = true;

    setError('judul', '');
    setError('isi', '');
    setError('kategori', '');
    setError('tingkat', '');

    if (judul.length < 5) { setError('judul', 'Judul minimal 5 karakter.'); valid = false; }
    if (isi.length < 20) { setError('isi', 'Ceritakan sedikit lebih lengkap, minimal 20 karakter.'); valid = false; }
    if (!kategori) { setError('kategori', 'Pilih kategori.'); valid = false; }
    if (!tingkat) { setError('tingkat', 'Pilih tingkat keterlibatan.'); valid = false; }

    if (tingkat && tingkat.value === 'LAPORAN') {
      if (!lembaga.value) { setError('lembaga', 'Pilih lembaga tujuan.'); valid = false; }
      if (!persetujuan.checked) { setError('persetujuan', 'Persetujuan tertulis diperlukan.'); valid = false; }
    }

    if (!valid) {
      var pertama = form.querySelector('.error-text:not(:empty)');
      if (pertama) {
        var field = pertama.closest('.form-field');
        if (field) field.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      return;
    }

    if (ref) {
      ref.textContent = 'SNT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    }
    form.hidden = true;
    sukses.hidden = false;
    sukses.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  document.getElementById('reset-form').addEventListener('click', function () {
    form.reset();
    form.hidden = false;
    sukses.hidden = true;
    updateCounter('judul', 'judul-counter');
    updateCounter('isi', 'isi-counter');
    sinkronExtra();
  });

  sinkronExtra();
})();

/* =========================================================
   Mode terang/gelap
   Pilihan disimpan di localStorage dan dipakai di semua halaman.
   ========================================================= */

(function () {
  'use strict';

  var root = document.documentElement;
  var tombol = document.querySelectorAll('[data-theme-toggle]');
  var label = document.querySelectorAll('[data-theme-label]');
  var meta = document.querySelector('meta[name="theme-color"]');
  var WARNA = { light: '#F5F2EA', dark: '#171F1A' };

  function terapkan(tema, simpan) {
    root.setAttribute('data-theme', tema);

    if (meta) {
      meta.setAttribute('content', WARNA[tema]);
    }

    var gelap = tema === 'dark';
    tombol.forEach(function (button) {
      button.setAttribute('aria-pressed', String(gelap));
      button.setAttribute('aria-label', gelap ? 'Ganti mode terang' : 'Ganti mode gelap');
    });
    label.forEach(function (span) {
      span.textContent = gelap ? 'Mode terang' : 'Mode gelap';
    });

    if (simpan) {
      try {
        localStorage.setItem('santuary-theme', tema);
      } catch (e) {
        // localStorage tidak tersedia: tema tetap berlaku untuk sesi ini.
      }
    }
  }

  terapkan(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

  tombol.forEach(function (button) {
    button.addEventListener('click', function () {
      terapkan(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  });

  window.addEventListener('storage', function (event) {
    if (event.key === 'santuary-theme' &&
        (event.newValue === 'light' || event.newValue === 'dark')) {
      terapkan(event.newValue, false);
    }
  });
})();
