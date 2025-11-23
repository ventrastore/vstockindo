const triggerHeading = document.getElementById('trigger-heading');
const featuresGrid = document.getElementById('features-grid');
const newsGrid = document.getElementById('news-grid');
const actionHint = document.getElementById('action-hint');
const featuresTitle = document.querySelector('.features-title'); 

const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

// Data saham untuk update real-time
const STOCKS = [
    { ticker: "SDKPM2", name: "SDK PUTRA MANDIRI", initialPrice: 2000 },
    { ticker: "SH2IS", name: "SINTA MURI", initialPrice: 5000 },
    { ticker: "G2TS", name: "GRIA TABUNGAN SYARIAH", initialPrice: 4500 },
    { ticker: "VCPE2", name: "VENTRA COMMERCIAL PE", initialPrice: 1000 },
    { ticker: "GM11P", name: "GAJAH MADA PRIORITAS", initialPrice: 9150 },
    { ticker: "SKSD", name: "SK SINTA DEWI", initialPrice: 1600 },
];

// Format Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

// Update harga saham di berita
function updateStockPrices() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        const ticker = card.querySelector('.stock-tag').textContent;
        const stock = STOCKS.find(s => s.ticker === ticker);
        
        if (stock) {
            // Simulasi harga baru: +/- 5% dari harga awal
            const currentPrice = stock.initialPrice * (0.95 + Math.random() * 0.1); 
            // Simulasi perubahan persentase: antara -5.0% hingga +5.0%
            const changePercent = (Math.random() - 0.5) * 10;
            const changeClass = changePercent >= 0 ? 'positive' : 'negative';
            const changeSymbol = changePercent >= 0 ? '+' : '';
            
            const priceElement = card.querySelector('.current-price');
            const changeElement = card.querySelector('.price-change');
            
            priceElement.textContent = formatRupiah(currentPrice);
            changeElement.textContent = `${changeSymbol}${changePercent.toFixed(1)}%`;
            changeElement.className = `price-change ${changeClass}`; // Pastikan kelas diupdate
        }
    });
}

// Logika 1: Hamburger Menu Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active'); 
    document.body.classList.toggle('no-scroll');
});

// Logika 2: Tutup menu saat link diklik (di mobile)
document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Logika 3: Toggle Fitur/Berita
triggerHeading.addEventListener('click', () => {
    const isFeaturesHidden = featuresGrid.classList.toggle('hide-grid');
    newsGrid.classList.toggle('hide-grid');
    
    triggerHeading.classList.toggle('open'); 

    if (isFeaturesHidden) {
        // Tampilkan Berita
        featuresTitle.textContent = 'Berita Terbaru & Update Live'; 
        actionHint.textContent = 'Klik untuk Tampilkan Keunggulan VStock'; 
        actionHint.style.color = 'var(--color-text-light)';
        
        // Update harga saat beralih ke berita
        updateStockPrices();
    } else {
        // Tampilkan Fitur
        featuresTitle.textContent = 'Mengapa Memilih VStock?'; 
        actionHint.textContent = 'Klik untuk Lihat Berita & Update Live'; 
        actionHint.style.color = 'var(--color-primary-dark)';
    }
});

// Update harga setiap 10 detik saat di halaman berita
setInterval(() => {
    // Periksa apakah news-grid sedang ditampilkan (tidak memiliki kelas 'hide-grid')
    if (!newsGrid.classList.contains('hide-grid')) {
        updateStockPrices();
    }
}, 10000);