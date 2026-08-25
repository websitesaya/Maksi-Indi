/* =========================================================
   KONFIGURASI UNDANGAN
   ========================================================= */

// Tanggal & jam pemberkatan (dipakai untuk hitung mundur)
// Format: 'YYYY-MM-DDTHH:mm:ss+08:00'  (WITA = UTC+8)
const WEDDING_DATETIME = "2026-09-04T10:00:00+08:00";

// Link Google Maps (isi manual jika sudah ada)
const MAPS_AKAD = "https://maps.google.com/?q=Gereja+GMIT+Pniel+Hundihuk";
const MAPS_RESEPSI = "https://maps.google.com/?q=Desa+Hundihuk+Dusun+Hundihuk+Timur";

// Nomor rekening (untuk tombol salin) — tanpa spasi
const REKENING_NUMBER = "767701011122538";

/* =========================================================
   KONFIGURASI JSONBIN.IO (Buku Tamu / Ucapan)
   ---------------------------------------------------------
   1. Buat akun gratis di https://jsonbin.io
   2. Buat "Bin" baru dengan isi awal:  []
   3. Salin "Bin ID" ke JSONBIN_BIN_ID di bawah
   4. Buka menu API Keys, salin "X-Master-Key" ke JSONBIN_API_KEY
   5. Pastikan opsi bin "Private" DIMATIKAN agar bisa dibaca semua tamu,
      atau tetap pakai X-Master-Key seperti contoh ini (client-side).
   ========================================================= */
const JSONBIN_BIN_ID = "PASTE_BIN_ID_ANDA_DISINI";
const JSONBIN_API_KEY = "PASTE_X_MASTER_KEY_ANDA_DISINI";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

/* =========================================================
   GUEST NAME DARI URL (?to=Nama+Tamu)
   ========================================================= */
(function initGuestName(){
  const params = new URLSearchParams(window.location.search);
  const to = params.get("to");
  if(to){
    const decoded = decodeURIComponent(to.replace(/\+/g," "));
    document.getElementById("guestName").textContent = decoded;
    const namaInput = document.getElementById("namaInput");
    if(namaInput) namaInput.value = decoded;
  }
})();

/* =========================================================
   COUNTDOWN
   ========================================================= */
(function initCountdown(){
  const target = new Date(WEDDING_DATETIME).getTime();
  const els = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs"),
  };
  function tick(){
    const now = Date.now();
    let diff = target - now;
    if(diff < 0) diff = 0;
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins = Math.floor((diff / (1000*60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    els.d.textContent = String(days).padStart(2,"0");
    els.h.textContent = String(hours).padStart(2,"0");
    els.m.textContent = String(mins).padStart(2,"0");
    els.s.textContent = String(secs).padStart(2,"0");
  }
  tick();
  setInterval(tick, 1000);
})();

/* =========================================================
   MUSIK LATAR
   ========================================================= */
const musicCtl = (function initMusic(){
  const btn = document.getElementById("musicToggle");
  const audio = document.getElementById("bgMusic");
  let playing = false;

  function play(){
    audio.play().then(()=>{
      playing = true;
      btn.classList.add("playing");
    }).catch(()=>{ /* butuh interaksi user */ });
  }
  function pause(){
    audio.pause();
    playing = false;
    btn.classList.remove("playing");
  }
  btn.addEventListener("click", ()=>{
    playing ? pause() : play();
  });
  return { play, pause };
})();

/* =========================================================
   TIRAI PEMBUKA (CURTAIN INTRO)
   Klik "BUKA UNDANGAN" -> tirai menutup layar -> halaman
   berpindah ke bagian Mempelai -> tirai terbuka.
   ========================================================= */
(function initCurtain(){
  const curtain = document.getElementById("curtain");
  const openBtn = document.getElementById("openInvite");
  const targetSection = document.getElementById("s-mempelai");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  openBtn.addEventListener("click", ()=>{
    musicCtl.play();
    openBtn.disabled = true;

    if(reduceMotion){
      document.body.classList.remove("locked");
      targetSection.scrollIntoView({behavior:"auto"});
      curtain.classList.add("is-hidden");
      document.body.classList.add("opened");
      return;
    }

    curtain.classList.add("is-active");

    // 1) Tirai menutup (panel bergerak dari tepi layar ke tengah, menutupi layar)
    requestAnimationFrame(()=>{
      curtain.classList.add("is-closing");
    });

    setTimeout(()=>{
      // 2) Saat layar tertutup penuh, pindah ke section mempelai secara instan
      document.body.classList.remove("locked");
      targetSection.scrollIntoView({behavior:"auto"});
      // Halaman opening tidak lagi bisa dicapai dengan scroll ke atas
      document.body.classList.add("opened");

      // 3) Tirai terbuka, mengungkap halaman undangan di baliknya
      curtain.classList.remove("is-closing");
      curtain.classList.add("is-open");

      setTimeout(()=>{
        curtain.classList.add("is-hidden");
      }, 1150);
    }, 560);
  });
})();

/* =========================================================
   DAUN-DAUN BERJATUHAN (ambience)
   ========================================================= */
(function initLeaves(){
  const layer = document.getElementById("leavesLayer");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!layer || reduceMotion) return;

  const LEAF_PATH = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C8 6 4 14 8 22c2 4 6 7 8 8 2-1 6-4 8-8 4-8 0-16-8-20z" fill="currentColor"/>
      <path d="M16 5v22" stroke="rgba(0,0,0,0.22)" stroke-width="1" fill="none"/>
    </svg>`;

  const colors = ["#B08A55","#D9BD8C","#8A6A3E","#3E7C74","#F0E3C9"];
  const total = 14;

  for(let i=0;i<total;i++){
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.setProperty("--lx", `${Math.random()*100}%`);
    leaf.style.setProperty("--ls", `${12 + Math.random()*14}px`);
    leaf.style.setProperty("--ld", `${11 + Math.random()*10}s`);
    leaf.style.setProperty("--lde", `${(Math.random()*-20).toFixed(2)}s`);
    leaf.style.setProperty("--sway1", `${18 + Math.random()*26}px`);
    leaf.style.setProperty("--sway2", `${-(18 + Math.random()*26)}px`);
    leaf.style.color = colors[i % colors.length];
    leaf.innerHTML = LEAF_PATH;
    layer.appendChild(leaf);
  }
})();

/* =========================================================
   TOMBOL NEXT / PREV ANTAR HALAMAN
   ========================================================= */
const allScreens = Array.from(document.querySelectorAll(".screen:not(.cover)"));

document.querySelectorAll(".nav-next").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const target = document.getElementById(btn.dataset.target);
    if(target) target.scrollIntoView({behavior:"smooth"});
  });
});

document.querySelectorAll(".nav-arrow").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const currentScreen = btn.closest(".screen");
    const idx = allScreens.indexOf(currentScreen);
    const dir = parseInt(btn.dataset.dir,10);
    const nextIdx = idx + dir;
    if(nextIdx >= 0 && nextIdx < allScreens.length){
      allScreens[nextIdx].scrollIntoView({behavior:"smooth"});
    }
  });
});

/* =========================================================
   LINK GOOGLE MAPS
   ========================================================= */
document.getElementById("mapAkad").href = MAPS_AKAD;
document.getElementById("mapResepsi").href = MAPS_RESEPSI;

/* =========================================================
   GALERI FOTO (Foto1.jpg ... Foto10.jpg) + LIGHTBOX
   Ditampilkan berpasangan, 2 foto berdampingan per baris.
   ========================================================= */
(function initGallery(){
  const grid = document.getElementById("galleryGrid");
  const total = 10;
  for(let i=1;i<=total;i++){
    const wrap = document.createElement("div");
    wrap.className = "gph reveal" + (i % 2 === 0 ? " reveal-delay-1" : "");
    const img = document.createElement("img");
    img.src = `assets/Foto${i}.jpg`;
    img.alt = `Foto ${i}`;
    img.loading = "lazy";
    wrap.appendChild(img);
    wrap.addEventListener("click", ()=> openLightbox(img.src));
    grid.appendChild(wrap);
  }

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  function openLightbox(src){
    lbImg.src = src;
    lightbox.classList.add("open");
  }
  document.getElementById("lbClose").addEventListener("click", ()=>{
    lightbox.classList.remove("open");
  });
  lightbox.addEventListener("click",(e)=>{
    if(e.target === lightbox) lightbox.classList.remove("open");
  });

  // Daftarkan elemen galeri yang baru dibuat ke reveal observer
  if(window.__registerReveal) window.__registerReveal();
})();

/* =========================================================
   SALIN NOMOR REKENING
   ========================================================= */
document.getElementById("copyRek").addEventListener("click", function(){
  navigator.clipboard.writeText(REKENING_NUMBER).then(()=>{
    this.textContent = "Tersalin ✓";
    this.classList.add("copied");
    setTimeout(()=>{
      this.textContent = "Salin No. Rekening";
      this.classList.remove("copied");
    },2000);
  });
});

/* =========================================================
   RSVP: PILIHAN STATUS KEHADIRAN
   ========================================================= */
let selectedStatus = "Hadir";
document.querySelectorAll(".rsvp-choice").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".rsvp-choice").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    selectedStatus = btn.dataset.status;
  });
});
// default pilih "Hadir"
document.querySelector('.rsvp-choice[data-status="Hadir"]').classList.add("active");

/* =========================================================
   BUKU TAMU (JSONBIN.IO)
   ========================================================= */
async function fetchGuestbook(){
  const listEl = document.getElementById("guestbookList");
  if(JSONBIN_BIN_ID.startsWith("PASTE_")){
    listEl.innerHTML = `<p class="gb-empty">Buku tamu belum aktif. Silakan atur JSONBIN_BIN_ID &amp; JSONBIN_API_KEY di script.js.</p>`;
    return;
  }
  try{
    const res = await fetch(JSONBIN_URL + "/latest", {
      headers: { "X-Master-Key": JSONBIN_API_KEY }
    });
    const data = await res.json();
    const entries = (data.record && Array.isArray(data.record)) ? data.record : [];
    renderGuestbook(entries);
  }catch(err){
    listEl.innerHTML = `<p class="gb-empty">Gagal memuat ucapan. Periksa koneksi Anda.</p>`;
  }
}

function renderGuestbook(entries){
  const listEl = document.getElementById("guestbookList");
  if(!entries.length){
    listEl.innerHTML = `<p class="gb-empty">Jadilah yang pertama memberikan ucapan &amp; doa 💌</p>`;
    return;
  }
  const sorted = [...entries].reverse();
  listEl.innerHTML = sorted.map(item=>`
    <div class="gb-item">
      <div class="gb-head">
        <span class="gb-name">${escapeHtml(item.nama || "Tamu")}</span>
        <span class="gb-status">${escapeHtml(item.status || "Hadir")}</span>
      </div>
      <p class="gb-msg">${escapeHtml(item.ucapan || "")}</p>
      <p class="gb-time">${item.waktu ? new Date(item.waktu).toLocaleString("id-ID") : ""}</p>
    </div>
  `).join("");
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById("rsvpForm").addEventListener("submit", async function(e){
  e.preventDefault();
  const statusMsg = document.getElementById("rsvpStatusMsg");
  const nama = document.getElementById("namaInput").value.trim();
  const ucapan = document.getElementById("ucapanInput").value.trim();

  if(!nama || !ucapan){
    statusMsg.textContent = "Mohon isi nama dan ucapan terlebih dahulu.";
    return;
  }

  if(JSONBIN_BIN_ID.startsWith("PASTE_")){
    statusMsg.textContent = "Buku tamu belum diaktifkan oleh mempelai (JSONBIN belum diatur).";
    return;
  }

  statusMsg.textContent = "Mengirim ucapan...";

  try{
    // Ambil data terbaru
    const getRes = await fetch(JSONBIN_URL + "/latest", {
      headers: { "X-Master-Key": JSONBIN_API_KEY }
    });
    const getData = await getRes.json();
    const entries = (getData.record && Array.isArray(getData.record)) ? getData.record : [];

    entries.push({
      nama,
      status: selectedStatus,
      ucapan,
      waktu: new Date().toISOString()
    });

    const putRes = await fetch(JSONBIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY
      },
      body: JSON.stringify(entries)
    });

    if(!putRes.ok) throw new Error("Gagal menyimpan");

    statusMsg.textContent = "Terima kasih! Ucapan Anda telah terkirim. 🙏";
    document.getElementById("ucapanInput").value = "";
    renderGuestbook(entries);
  }catch(err){
    statusMsg.textContent = "Terjadi kesalahan saat mengirim. Silakan coba lagi.";
  }
});

fetchGuestbook();

/* =========================================================
   ANIMASI SAAT SCROLL (reveal on scroll)
   ========================================================= */
(function initReveal(){
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = new WeakSet();

  if(reduceMotion){
    document.querySelectorAll(".reveal").forEach(el=> el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
        seen.add(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  function register(){
    document.querySelectorAll(".reveal").forEach(el=>{
      if(!seen.has(el) && !el.classList.contains("in-view")){
        observer.observe(el);
      }
    });
  }
  window.__registerReveal = register;
  register();

  // Elemen di dalam layar pertama yang sudah terlihat sebelum interaksi
  // (mis. saat curtain terbuka) langsung ditandai in-view agar tidak "meloncat".
  const mempelai = document.getElementById("s-mempelai");
  if(mempelai){
    mempelai.querySelectorAll(".reveal").forEach(el=>{
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight){
        el.classList.add("in-view");
        seen.add(el);
      }
    });
  }
})();
