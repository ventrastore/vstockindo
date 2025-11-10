// JavaScript untuk Investview - Live Saham & Overview dengan harga stabil
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = this.querySelectorAll('span');
        if (mobileNav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on links
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            mobileMenuBtn.querySelectorAll('span').forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    // Harga dasar yang sudah ditentukan
    const basePrices = {
        'Ventra Stock': 11.928,
        'Prima Kelas D': 18.105,
        'Prima Kelas B': 22.450,
        'Ekonomika B2': 12.750,
        'Media Care': 15.320,
        'Ven Plus +': 9.880,
        'Batik BenangRatu': 7.650,
        'Prada Finance Indonesia': 14.220
    };

    // Simpan harga dasar untuk setiap saham
    const stockCards = document.querySelectorAll('.stock-card');
    stockCards.forEach(card => {
        const stockName = card.querySelector('h4').textContent;
        card.basePrice = basePrices[stockName];
    });

    // Update harga saham live dan overview setiap 3 detik
    setInterval(updateLiveData, 3000);
});

function updateLiveData() {
    updateLiveStocks();
    updateMarketOverview();
}

function updateLiveStocks() {
    const stockCards = document.querySelectorAll('.stock-card');
    
    stockCards.forEach(card => {
        const priceElement = card.querySelector('.price');
        const changeElement = card.querySelector('.change');
        const volumeElement = card.querySelector('.volume');
        const stockName = card.querySelector('h4').textContent;
        
        // Harga dasar yang sudah ditentukan
        const basePrice = card.basePrice;
        
        // Perubahan kecil saja (±0.5%)
        const changePercent = (Math.random() * 1 - 0.5) / 100; // -0.5% to +0.5%
        const newPrice = basePrice * (1 + changePercent);
        
        // Update volume secara acak dengan perubahan kecil
        const currentVolume = volumeElement.textContent.split(': ')[1];
        const volumeNumber = parseFloat(currentVolume.replace('M', ''));
        const newVolume = (volumeNumber * (1 + Math.random() * 0.1 - 0.05)).toFixed(1); // ±5%
        
        // Update tampilan
        priceElement.textContent = `${newPrice.toFixed(3)} Rp`;
        volumeElement.textContent = `user : ${newVolume}`;
        
        const isPositive = changePercent >= 0;
        const changeText = `${isPositive ? '+' : ''}${(changePercent * 100).toFixed(1)}%`;
        
        changeElement.textContent = changeText;
        changeElement.className = `change ${isPositive ? 'positive' : 'negative'}`;
        
        // Efek flash untuk perubahan harga
        priceElement.style.transition = 'color 0.3s';
        priceElement.style.color = isPositive ? '#00a86b' : '#ff4d4d';
        
        setTimeout(() => {
            priceElement.style.color = '#000';
        }, 1000);
    });
}

function updateMarketOverview() {
    const overviewCards = document.querySelectorAll('.overview-card');
    
    overviewCards.forEach(card => {
        const title = card.querySelector('.overview-title').textContent;
        const valueElement = card.querySelector('.overview-value');
        const changeElement = card.querySelector('.overview-change');
        
        if (title === 'Total Market Cap') {
            // Update total market cap dengan perubahan kecil
            const currentValue = parseFloat(valueElement.textContent.replace(/[^\d.]/g, ''));
            const changePercent = (Math.random() * 0.4 - 0.2) / 100; // ±0.2%
            const newValue = currentValue * (1 + changePercent);
            
            valueElement.textContent = `${newValue.toFixed(3)}T Rp`;
            updateChangeElement(changeElement, changePercent);
            
        } else if (title === 'Total Volume') {
            // Update total volume dengan perubahan kecil
            const currentValue = parseFloat(valueElement.textContent.replace('M', ''));
            const changePercent = (Math.random() * 0.6 - 0.3) / 100; // ±0.3%
            const newValue = currentValue * (1 + changePercent);
            
            valueElement.textContent = `${newValue.toFixed(1)}M`;
            updateChangeElement(changeElement, changePercent);
            
        } else if (title === 'Avg Price') {
            // Update average price dengan perubahan kecil
            const currentValue = parseFloat(valueElement.textContent.replace(/[^\d.]/g, ''));
            const changePercent = (Math.random() * 0.4 - 0.2) / 100; // ±0.2%
            const newValue = currentValue * (1 + changePercent);
            
            valueElement.textContent = `${newValue.toFixed(3)} Rp`;
            updateChangeElement(changeElement, changePercent);
        }
        // Total Saham tetap 8 (tidak berubah)
    });
}

function updateChangeElement(element, changePercent) {
    const isPositive = changePercent >= 0;
    const changeText = `${isPositive ? '+' : ''}${(changePercent * 100).toFixed(1)}%`;
    
    element.textContent = changeText;
    element.className = `overview-change ${isPositive ? 'positive' : 'negative'}`;
}

// Handle window resize
window.addEventListener('resize', function() {
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
        mobileNav.classList.remove('active');
        mobileMenuBtn.querySelectorAll('span').forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
});