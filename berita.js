// Data Saham (diambil dari InvestView, digunakan untuk simulasi prediksi harga)
const STOCKS = [
    { ticker: "SDKPM2", name: "SDK PUTRA MANDIRI", initialPrice: 2000 },
    { ticker: "SH2IS", name: "SINTA MURI", initialPrice: 1000 },
    { ticker: "G2TS", name: "GRIA TABUNGAN SYARIAH", initialPrice: 8500 },
    { ticker: "VCPE2", name: "VENTRA COMMERCIAL PE", initialPrice: 1500 },
    { ticker: "GM11P", name: "GAJAH MADA PRIORITAS", initialPrice: 9150 },
    { ticker: "SKSD", name: "SK SINTA DEWI", initialPrice: 1000 },
];

// Format Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

/**
 * Membuat data simulasi prediksi harga dan merender ke sidebar.
 */
function generatePricePredictions() {
    const predictionStocksList = document.getElementById('prediction-stocks-list');
    if (!predictionStocksList) return; // Penting: Pastikan elemen ada
    
    let htmlContent = '';
    
    STOCKS.forEach(stock => {
        // Simulasi harga saat ini (berfluktuasi sedikit dari harga awal)
        const currentPrice = stock.initialPrice * (0.95 + Math.random() * 0.1); 
        // Simulasi prediksi perubahan (bisa positif atau negatif)
        const predictionChange = (Math.random() - 0.3) * 15; // Range: sekitar -4.5% sampai +10.5%
        const predictedPrice = currentPrice * (1 + predictionChange / 100);
        
        const changeClass = predictionChange >= 0 ? 'positive' : 'negative';
        const changeSymbol = predictionChange >= 0 ? '+' : '';
        
        htmlContent += `
            <div class="stock-item">
                <div class="stock-info-sidebar">
                    <h4>${stock.ticker}</h4>
                    <p>${stock.name}</p>
                </div>
                <div class="stock-price-sidebar">
                    <div class="current-price-sidebar">${formatRupiah(currentPrice)}</div>
                    <div class="prediction-price">Prediksi: ${formatRupiah(predictedPrice)}</div>
                    <div class="prediction-change ${changeClass}">
                        ${changeSymbol}${predictionChange.toFixed(1)}%
                    </div>
                </div>
            </div>
        `;
    });
    
    predictionStocksList.innerHTML = htmlContent;
}

// --- Fungsionalitas Navbar (Hamburger Menu) ---
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active'); 
        document.body.classList.toggle('no-scroll');
    });
    
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    generatePricePredictions();
    
    // Update prediksi setiap 1 menit (simulasi update)
    setInterval(() => {
        generatePricePredictions();
    }, 60000); // 60000 ms = 1 menit
});