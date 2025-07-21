/**
 * HTML Sunum Sistemi - Renderer
 * DOM manipülasyonu ve impress.js entegrasyonu
 */

class PresentationRenderer {
    constructor() {
        this.impressInstance = null;
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.isInitialized = false;
        this.progressBar = null;
        this.slideCounter = null;
        this.navigation = null;
    }

    /**
     * Sunumu DOM'a render eder
     * @param {Array} slides - Slide dizisi
     */
    renderToDOM(slides) {
        try {
            const impressContainer = document.getElementById('impress');
            if (!impressContainer) {
                throw new Error('Impress container bulunamadı');
            }

            // Mevcut içeriği temizle
            impressContainer.innerHTML = '';

            // Slide'ları HTML olarak oluştur ve DOM'a ekle
            const slidesHTML = window.presentationEngine.generateAllSlides();
            impressContainer.innerHTML = slidesHTML;

            this.totalSlides = slides.length;
            this.updateSlideCounter();

            console.log(`${this.totalSlides} slide DOM'a render edildi`);
            return true;

        } catch (error) {
            console.error('DOM render hatası:', error);
            throw error;
        }
    }

    /**
     * Impress.js'i başlatır
     */
    initImpress() {
        try {
            // Önceki instance'ı temizle
            if (this.impressInstance) {
                this.impressInstance.teardown();
            }

            // Yeni instance oluştur
            this.impressInstance = impress();
            
            if (!this.impressInstance) {
                throw new Error('Impress.js başlatılamadı');
            }

            // Impress.js'i başlat
            this.impressInstance.init();
            this.isInitialized = true;

            // Event listener'ları ekle
            this.bindImpressEvents();

            console.log('Impress.js başarıyla başlatıldı');
            return true;

        } catch (error) {
            console.error('Impress.js başlatma hatası:', error);
            throw error;
        }
    }

    /**
     * Event listener'ları bağlar
     */
    bindEvents() {
        try {
            // Navigation butonları
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const overviewBtn = document.getElementById('overview-btn');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.previousSlide());
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextSlide());
            }

            if (overviewBtn) {
                overviewBtn.addEventListener('click', () => this.toggleOverview());
            }

            // Klavye kısayolları
            document.addEventListener('keydown', (event) => {
                this.handleKeyPress(event);
            });

            // Mouse wheel desteği
            document.addEventListener('wheel', (event) => {
                this.handleMouseWheel(event);
            });

            // Touch desteği (mobil)
            this.bindTouchEvents();

            // Resize event
            window.addEventListener('resize', () => {
                this.handleResize();
            });

            console.log('Event listenerlar başarıyla bağlandı');

        } catch (error) {
            console.error('Event binding hatası:', error);
        }
    }

    /**
     * Impress.js event'lerini bağlar
     */
    bindImpressEvents() {
        if (!this.impressInstance) return;

        // Slide değişim event'i
        document.addEventListener('impress:stepenter', (event) => {
            this.onSlideChange(event);
        });

        // Sunum başlama event'i
        document.addEventListener('impress:init', () => {
            this.onPresentationInit();
        });

        // Overview modu event'leri
        document.addEventListener('impress:overview:show', () => {
            this.onOverviewShow();
        });

        document.addEventListener('impress:overview:hide', () => {
            this.onOverviewHide();
        });
    }

    /**
     * Touch event'lerini bağlar (mobil destek)
     */
    bindTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        });

        document.addEventListener('touchend', (event) => {
            endX = event.changedTouches[0].clientX;
            endY = event.changedTouches[0].clientY;

            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;

            // Yatay swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }

    /**
     * Klavye tuşlarını işler
     */
    handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                event.preventDefault();
                this.previousSlide();
                break;

            case 'ArrowRight':
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                event.preventDefault();
                this.nextSlide();
                break;

            case 'Home':
                event.preventDefault();
                this.goToSlide(0);
                break;

            case 'End':
                event.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;

            case 'Escape':
                event.preventDefault();
                this.toggleOverview();
                break;

            case 'f':
            case 'F11':
                event.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }

    /**
     * Mouse wheel'i işler
     */
    handleMouseWheel(event) {
        if (Math.abs(event.deltaY) > 50) {
            event.preventDefault();
            if (event.deltaY > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    /**
     * Pencere yeniden boyutlandırma
     */
    handleResize() {
        if (this.impressInstance) {
            // Impress.js'i yeniden boyutlandır
            setTimeout(() => {
                if (this.impressInstance.goto) {
                    this.impressInstance.goto(this.currentSlide);
                }
            }, 100);
        }
    }

    /**
     * Önceki slide'a geç
     */
    previousSlide() {
        if (this.impressInstance && this.impressInstance.prev) {
            this.impressInstance.prev();
        }
    }

    /**
     * Sonraki slide'a geç
     */
    nextSlide() {
        if (this.impressInstance && this.impressInstance.next) {
            this.impressInstance.next();
        }
    }

    /**
     * Belirli bir slide'a git
     */
    goToSlide(index) {
        if (this.impressInstance && this.impressInstance.goto) {
            const slideElement = document.querySelector(`#slide-${index}`);
            if (slideElement) {
                this.impressInstance.goto(slideElement);
            }
        }
    }

    /**
     * Overview modunu aç/kapat
     */
    toggleOverview() {
        if (this.impressInstance) {
            const api = this.impressInstance;
            if (api.overview) {
                api.overview();
            }
        }
    }

    /**
     * Tam ekran modunu aç/kapat
     */
    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }

    /**
     * Slide değişim event'ini işler
     */
    onSlideChange(event) {
        const step = event.target;
        const stepId = step.id;
        
        // Slide indeksini güncelle
        const slideIndex = Array.from(step.parentNode.children).indexOf(step);
        this.currentSlide = slideIndex;
        
        // UI'ı güncelle
        this.updateProgressBar();
        this.updateSlideCounter();
        
        // Slide-specific işlemler
        this.handleSlideSpecificActions(step);
        
        console.log(`Slide değişti: ${stepId} (${slideIndex + 1}/${this.totalSlides})`);
    }

    /**
     * Sunum başlatma event'ini işler
     */
    onPresentationInit() {
        // Loading ekranını gizle
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }

        // Navigation'ı göster
        const navigation = document.getElementById('navigation');
        if (navigation) {
            navigation.classList.remove('hidden');
        }

        // Slide counter'ı göster
        const slideCounter = document.getElementById('slide-counter');
        if (slideCounter) {
            slideCounter.classList.remove('hidden');
        }

        // Flowbite'ı uygula
        window.presentationEngine.applyFlowbite();

        console.log('Sunum başarıyla başlatıldı');
    }

    /**
     * Overview gösterim event'ini işler
     */
    onOverviewShow() {
        const navigation = document.getElementById('navigation');
        if (navigation) {
            navigation.style.opacity = '0.5';
        }
    }

    /**
     * Overview gizleme event'ini işler
     */
    onOverviewHide() {
        const navigation = document.getElementById('navigation');
        if (navigation) {
            navigation.style.opacity = '1';
        }
    }

    /**
     * Slide-specific aksiyonları işler
     */
    handleSlideSpecificActions(step) {
        // Animasyonları tetikle
        this.triggerSlideAnimations(step);
        
        // Grafikleri yükle
        this.loadSlideCharts(step);
        
        // Lazy loading için resimleri yükle
        this.loadSlideImages(step);
    }

    /**
     * Slide animasyonlarını tetikler
     */
    triggerSlideAnimations(step) {
        const animatedElements = step.querySelectorAll('[data-animate]');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-fade-in');
            }, index * 200);
        });
    }

    /**
     * Slide grafiklerini yükler
     */
    loadSlideCharts(step) {
        const chartContainers = step.querySelectorAll('[id^="chart-"]');
        chartContainers.forEach(container => {
            // Grafik yükleme mantığı buraya eklenebilir
            console.log('Grafik yükleniyor:', container.id);
        });
    }

    /**
     * Slide resimlerini yükler (lazy loading)
     */
    loadSlideImages(step) {
        const images = step.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    /**
     * Progress bar'ı günceller
     */
    updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar && this.totalSlides > 0) {
            const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    /**
     * Slide counter'ı günceller
     */
    updateSlideCounter() {
        const currentSlideElement = document.getElementById('current-slide');
        const totalSlidesElement = document.getElementById('total-slides');
        
        if (currentSlideElement) {
            currentSlideElement.textContent = this.currentSlide + 1;
        }
        
        if (totalSlidesElement) {
            totalSlidesElement.textContent = this.totalSlides;
        }
    }

    /**
     * Renderer'ın başlatılıp başlatılmadığını kontrol eder
     */
    isReady() {
        return this.isInitialized && this.impressInstance !== null;
    }

    /**
     * Renderer'ı temizler
     */
    cleanup() {
        if (this.impressInstance) {
            this.impressInstance.teardown();
            this.impressInstance = null;
        }
        this.isInitialized = false;
        this.currentSlide = 0;
        this.totalSlides = 0;
    }
}

// Global renderer instance
window.presentationRenderer = new PresentationRenderer();

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    // Sunum verisi varsa başlat
    if (window.presentationData) {
        initializePresentation();
    }
});

/**
 * Sunumu başlatır
 */
function initializePresentation() {
    try {
        // Engine ile slide'ları parse et
        const slides = window.presentationEngine.parseSlides(window.presentationData);
        
        // Renderer ile DOM'a render et
        window.presentationRenderer.renderToDOM(slides);
        
        // Impress.js'i başlat
        window.presentationRenderer.initImpress();
        
        // Event'leri bağla
        window.presentationRenderer.bindEvents();
        
        console.log('Sunum başarıyla başlatıldı');
        
    } catch (error) {
        console.error('Sunum başlatma hatası:', error);
        
        // Hata mesajı göster
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div class="text-center">
                    <div class="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 class="text-xl font-semibold text-red-600 mb-2">Sunum Yüklenemedi</h2>
                    <p class="text-gray-600">${error.message}</p>
                    <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Yeniden Dene
                    </button>
                </div>
            `;
        }
    }
}


// Global renderer instance
window.presentationRenderer = new PresentationRenderer();

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    // Sunum verisi varsa başlat
    if (window.presentationData) {
        initializePresentation();
    }
});

/**
 * Sunumu başlatır
 */
function initializePresentation() {
    try {
        // Engine ile slide'ları parse et
        const slides = window.presentationEngine.parseSlides(window.presentationData);
        
        // Renderer ile DOM'a render et
        window.presentationRenderer.renderToDOM(slides);
        
        // Impress.js'i başlat
        window.presentationRenderer.initImpress();
        
        // Event'leri bağla
        window.presentationRenderer.bindEvents();
        
        console.log('Sunum başarıyla başlatıldı');
        
    } catch (error) {
        console.error('Sunum başlatma hatası:', error);
        
        // Hata mesajı göster
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div class="text-center">
                    <div class="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 class="text-xl font-semibold text-red-600 mb-2">Sunum Yüklenemedi</h2>
                    <p class="text-gray-600">${error.message}</p>
                    <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Yeniden Dene
                    </button>
                </div>
            `;
        }
    }
}

