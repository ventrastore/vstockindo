// Data Saham untuk InvestView
const STOCKS = [
    // INI ADALAH SUMBER DATA ANDA. Ubah list ini untuk mengganti saham yang ditampilkan.
    { ticker: "SDKPM2", name: "SDK PUTRA MANDIRI", initialPrice: 2000, history: [], sparklineData: [], currentStatus: 'neutral' },
    { ticker: "SH2IS", name: "SINTA MURI ", initialPrice: 1000, history: [], sparklineData: [], currentStatus: 'neutral' },
    { ticker: "G2TS", name: "GRIA TABUNGAN SYARIAH", initialPrice: 8500, history: [], sparklineData: [], currentStatus: 'neutral' },
    { ticker: "VCPE2", name: "VENTRA COMMERCIAL PE", initialPrice: 1500, history: [], sparklineData: [], currentStatus: 'neutral' },
    { ticker: "GM11P", name: "GAJAH MADA PRIORITAS", initialPrice: 9150, history: [], sparklineData: [], currentStatus: 'neutral' }, 
    { ticker: "SKSD", name: "SK SINTA DEWI", initialPrice: 1000, history: [], sparklineData: [], currentStatus: 'neutral' },
];

const MAX_SPARKLINE_POINTS = 60; // Jumlah titik data yang ditampilkan pada grafik (riwayat 60 detik)
const UPDATE_INTERVAL_MS = 1000; // Interval pembaruan harga live (1000ms = 1 detik)

// --- Utility Functions ---
/**
 * Fungsi utilitas untuk memformat angka menjadi format Rupiah.
 */
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

/**
 * Fungsi untuk menghasilkan kode SVG yang menggambar grafik garis kecil (sparkline).
 */
function generateSparklineSVG(data, statusClass) {
    if (data.length < 2) return '';
    const width = 300; const height = 80; const padding = 5;
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    const points = data.map((price, index) => {
        const x = (index / (MAX_SPARKLINE_POINTS - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - ((price - minVal) / range) * (height - 2 * padding);
        return `${x},${y}`;
    }).join(' ');

    // Mengambil warna dari CSS
    let strokeColor = 'var(--color-text-light)';
    try {
        if (statusClass === 'positive') {
            strokeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-success').trim();
        } else if (statusClass === 'negative') {
            strokeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-danger').trim();
        }
    } catch (e) {
        // Fallback jika getComputedStyle gagal
    }
    
    return `<svg viewBox="0 0 ${width} ${height}" class="sparkline-svg" preserveAspectRatio="none">
                <polyline fill="none" stroke="${strokeColor}" stroke-width="2" points="${points}" />
            </svg>`;
}

/**
 * Fungsi Simulasi Harga Saham. Menggunakan rumus acak untuk meniru naik/turunnya harga.
 */
function simulatePriceChange(currentPrice, ticker) {
    let fluctuation;
    let noiseFactor = Math.random() - 0.5; // Angka acak antara -0.5 dan 0.5

    let percentage = 0.005 + Math.random() * 0.005; 
    fluctuation = noiseFactor * currentPrice * percentage;
    
    currentPrice += fluctuation;
    if (currentPrice < 50) currentPrice = 50; 
    return Math.round(currentPrice);
}

/**
 * Merender struktur kartu saham kosong ke dalam div 'stock-grid-live'.
 */
function renderInitialStockCards() {
    const stockGrid = document.getElementById('stock-grid-live');
    let htmlContent = '';
    STOCKS.forEach(stock => {
        htmlContent += `
            <div class="stock-card" id="live-card-${stock.ticker}">
                <div class="card-header">
                    <div class="stock-info">
                        <h3>${stock.ticker}</h3>
                        <p>${stock.name}</p>
                    </div>
                    <div class="stock-price">
                        <p class="current-price">Memuat...</p>
                        <span class="change-indicator neutral">Memuat...</span>
                    </div>
                </div>
                <div class="stock-chart-container">
                </div>
            </div>
        `;
    });
    stockGrid.innerHTML = htmlContent;
}

/**
 * Mengupdate DOM (HTML) dengan data harga terbaru.
 */
function updateStockCard(stock) {
    const cardElement = document.getElementById(`live-card-${stock.ticker}`);
    if (!cardElement) return;

    const currentPriceElement = cardElement.querySelector('.current-price');
    const changeIndicatorElement = cardElement.querySelector('.change-indicator');

    const latestPrice = stock.history[stock.history.length - 1];
    currentPriceElement.textContent = formatRupiah(latestPrice);
    
    const prevPrice = stock.history[0]; // Harga awal (titik pertama) dari riwayat 60 detik
    const absoluteChange = latestPrice - prevPrice;
    const percentChange = (absoluteChange / prevPrice) * 100;

    // Menentukan status (positive/negative/neutral) untuk pewarnaan
    let statusClass = 'neutral';
    let arrow = '—';
    if (percentChange > 0.01) { 
        statusClass = 'positive';
        arrow = '▲';
    } else if (percentChange < -0.01) {
        statusClass = 'negative';
        arrow = '▼';
    }
    stock.currentStatus = statusClass; 

    // Memperbarui tampilan harga dan indikator perubahan
    changeIndicatorElement.className = `change-indicator ${statusClass}`;
    changeIndicatorElement.textContent = `${arrow} ${absoluteChange.toFixed(0)} (${percentChange.toFixed(2)}%)`;

    // Memperbarui grafik sparkline
    const chartContainer = cardElement.querySelector('.stock-chart-container');
    chartContainer.innerHTML = generateSparklineSVG(stock.sparklineData, stock.currentStatus);
}

// --- Inisialisasi Aplikasi ---
function initializeInvestView() {
    renderInitialStockCards(); 

    // 1. Isi data awal (pre-populate 60 poin)
    STOCKS.forEach(stock => {
        let currentPrice = stock.initialPrice;
        for (let i = 0; i < MAX_SPARKLINE_POINTS; i++) {
            currentPrice = simulatePriceChange(currentPrice, stock.ticker);
            stock.history.push(currentPrice);
            stock.sparklineData.push(currentPrice);
        }
        updateStockCard(stock); 
    });

    // 2. Set interval untuk update live setiap detik
    setInterval(() => {
        STOCKS.forEach(stock => {
            const lastPrice = stock.history[stock.history.length - 1];
            const newPrice = simulatePriceChange(lastPrice, stock.ticker);
            
            // Mekanisme "Shift": Tambahkan harga baru di akhir, hapus harga tertua di awal
            stock.history.push(newPrice);
            stock.history.shift(); 
            stock.sparklineData.push(newPrice);
            stock.sparklineData.shift(); 
            
            updateStockCard(stock);
        });
    }, UPDATE_INTERVAL_MS);
}

// --- Navbar / Hamburger Menu Logic ---
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    // Menambahkan/menghapus kelas 'active' pada klik hamburger
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active'); 
        document.body.classList.toggle('no-scroll');
    });
    
    // Menutup menu saat salah satu link diklik (di mobile)
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// Jalankan fungsi inisialisasi setelah seluruh DOM dimuat
document.addEventListener('DOMContentLoaded', initializeInvestView);