/**
 * HTML Sunum Sistemi - Engine
 * JSON parser ve HTML generator fonksiyonları
 */

class PresentationEngine {
    constructor() {
        this.slides = [];
        this.currentSlideIndex = 0;
        this.totalSlides = 0;
    }

    /**
     * JSON verilerini parse eder ve slide objelerine dönüştürür
     * @param {Object} jsonData - Sunum verisi
     * @returns {Array} Parse edilmiş slide dizisi
     */
    parseSlides(jsonData) {
        try {
            if (!jsonData || !jsonData.slides) {
                throw new Error('Geçersiz JSON verisi: slides dizisi bulunamadı');
            }

            this.slides = jsonData.slides.map((slide, index) => {
                return {
                    id: slide.id || `slide-${index}`,
                    title: slide.title || 'Başlıksız Slide',
                    subtitle: slide.subtitle || '',
                    content: slide.content || '',
                    type: slide.type || 'default',
                    layout: slide.layout || 'center',
                    background: slide.background || '',
                    animation: slide.animation || {},
                    position: slide.position || this.calculatePosition(index),
                    rotation: slide.rotation || 0,
                    scale: slide.scale || 1,
                    duration: slide.duration || 1000,
                    items: slide.items || [],
                    image: slide.image || '',
                    chart: slide.chart || null,
                    style: slide.style || {}
                };
            });

            this.totalSlides = this.slides.length;
            console.log(`${this.totalSlides} slide başarıyla parse edildi`);
            return this.slides;

        } catch (error) {
            console.error('Slide parse hatası:', error);
            throw error;
        }
    }

    /**
     * Slide pozisyonunu otomatik hesaplar
     * @param {number} index - Slide indeksi
     * @returns {Object} x, y, z koordinatları
     */
    calculatePosition(index) {
        const radius = 1500;
        const angle = (index * 360 / this.totalSlides) * Math.PI / 180;
        
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: index * 100
        };
    }

    /**
     * Slide için HTML içeriği oluşturur
     * @param {Object} slide - Slide objesi
     * @param {number} index - Slide indeksi
     * @returns {string} HTML string
     */
    generateHTML(slide, index) {
        const position = slide.position;
        const dataAttributes = [
            `data-x="${position.x}"`,
            `data-y="${position.y}"`,
            `data-z="${position.z}"`,
            `data-rotate="${slide.rotation}"`,
            `data-scale="${slide.scale}"`,
            `data-transition-duration="${slide.duration}"`
        ].join(' ');

        let contentHTML = '';

        // Slide tipine göre içerik oluştur
        switch (slide.type) {
            case 'title':
                contentHTML = this.generateTitleSlide(slide);
                break;
            case 'content':
                contentHTML = this.generateContentSlide(slide);
                break;
            case 'list':
                contentHTML = this.generateListSlide(slide);
                break;
            case 'image':
                contentHTML = this.generateImageSlide(slide);
                break;
            case 'chart':
                contentHTML = this.generateChartSlide(slide);
                break;
            case 'quote':
                contentHTML = this.generateQuoteSlide(slide);
                break;
            case 'comparison':
                contentHTML = this.generateComparisonSlide(slide);
                break;
            default:
                contentHTML = this.generateDefaultSlide(slide);
        }

        return `
            <div id="${slide.id}" class="step" ${dataAttributes}>
                <div class="slide-content ${slide.layout}">
                    ${contentHTML}
                </div>
            </div>
        `;
    }

    /**
     * Başlık slide'ı oluşturur
     */
    generateTitleSlide(slide) {
        return `
            <div class="text-center">
                <h1 class="slide-title text-6xl font-bold mb-6 text-blue-900">${slide.title}</h1>
                ${slide.subtitle ? `<h2 class="slide-subtitle text-3xl text-gray-600 mb-8">${slide.subtitle}</h2>` : ''}
                ${slide.content ? `<p class="slide-text text-xl text-gray-700">${slide.content}</p>` : ''}
            </div>
        `;
    }

    /**
     * İçerik slide'ı oluşturur
     */
    generateContentSlide(slide) {
        return `
            <div>
                <h2 class="slide-title text-4xl font-bold mb-6 text-blue-900">${slide.title}</h2>
                ${slide.subtitle ? `<h3 class="slide-subtitle text-2xl text-gray-600 mb-4">${slide.subtitle}</h3>` : ''}
                <div class="slide-text text-lg leading-relaxed text-gray-700">
                    ${this.formatContent(slide.content)}
                </div>
            </div>
        `;
    }

    /**
     * Liste slide'ı oluşturur
     */
    generateListSlide(slide) {
        const listItems = slide.items.map(item => 
            `<li class="flex items-start mb-4">
                <span class="inline-block w-3 h-3 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                <span class="text-lg text-gray-700">${item}</span>
            </li>`
        ).join('');

        return `
            <div>
                <h2 class="slide-title text-4xl font-bold mb-6 text-blue-900">${slide.title}</h2>
                ${slide.subtitle ? `<h3 class="slide-subtitle text-2xl text-gray-600 mb-6">${slide.subtitle}</h3>` : ''}
                <ul class="slide-list space-y-2">
                    ${listItems}
                </ul>
            </div>
        `;
    }

    /**
     * Resim slide'ı oluşturur
     */
    generateImageSlide(slide) {
        return `
            <div class="text-center">
                <h2 class="slide-title text-4xl font-bold mb-6 text-blue-900">${slide.title}</h2>
                ${slide.image ? `
                    <div class="mb-6">
                        <img src="${slide.image}" alt="${slide.title}" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" style="max-height: 400px;">
                    </div>
                ` : ''}
                ${slide.content ? `<p class="slide-text text-lg text-gray-700">${slide.content}</p>` : ''}
            </div>
        `;
    }

    /**
     * Grafik slide'ı oluşturur
     */
    generateChartSlide(slide) {
        return `
            <div>
                <h2 class="slide-title text-4xl font-bold mb-6 text-blue-900">${slide.title}</h2>
                ${slide.subtitle ? `<h3 class="slide-subtitle text-2xl text-gray-600 mb-4">${slide.subtitle}</h3>` : ''}
                <div id="chart-${slide.id}" class="chart-container mb-4" style="height: 400px;">
                    <!-- Grafik buraya yüklenecek -->
                </div>
                ${slide.content ? `<p class="slide-text text-lg text-gray-700">${slide.content}</p>` : ''}
            </div>
        `;
    }

    /**
     * Alıntı slide'ı oluşturur
     */
    generateQuoteSlide(slide) {
        return `
            <div class="text-center">
                <blockquote class="text-3xl font-light italic text-gray-800 mb-8 leading-relaxed">
                    "${slide.content}"
                </blockquote>
                <cite class="text-xl text-gray-600 font-semibold">— ${slide.title}</cite>
                ${slide.subtitle ? `<p class="text-lg text-gray-500 mt-2">${slide.subtitle}</p>` : ''}
            </div>
        `;
    }

    /**
     * Karşılaştırma slide'ı oluşturur
     */
    generateComparisonSlide(slide) {
        const leftItems = slide.items.filter((_, index) => index % 2 === 0);
        const rightItems = slide.items.filter((_, index) => index % 2 === 1);

        return `
            <div>
                <h2 class="slide-title text-4xl font-bold mb-6 text-blue-900 text-center">${slide.title}</h2>
                <div class="grid grid-cols-2 gap-8">
                    <div class="bg-green-50 p-6 rounded-lg">
                        <h3 class="text-2xl font-semibold text-green-800 mb-4">Avantajlar</h3>
                        <ul class="space-y-3">
                            ${leftItems.map(item => `<li class="flex items-start"><span class="text-green-500 mr-2">✓</span><span class="text-gray-700">${item}</span></li>`).join('')}
                        </ul>
                    </div>
                    <div class="bg-red-50 p-6 rounded-lg">
                        <h3 class="text-2xl font-semibold text-red-800 mb-4">Dezavantajlar</h3>
                        <ul class="space-y-3">
                            ${rightItems.map(item => `<li class="flex items-start"><span class="text-red-500 mr-2">✗</span><span class="text-gray-700">${item}</span></li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Varsayılan slide oluşturur
     */
    generateDefaultSlide(slide) {
        return `
            <div>
                <h2 class="slide-title text-4xl font-bold mb-6 text-blue-900">${slide.title}</h2>
                ${slide.subtitle ? `<h3 class="slide-subtitle text-2xl text-gray-600 mb-4">${slide.subtitle}</h3>` : ''}
                ${slide.content ? `<div class="slide-text text-lg text-gray-700">${this.formatContent(slide.content)}</div>` : ''}
            </div>
        `;
    }

    /**
     * İçeriği formatlar (markdown benzeri)
     */
    formatContent(content) {
        if (!content) return '';
        
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p class="slide-text text-lg leading-relaxed text-gray-700 mb-4">')
            .replace(/\n/g, '<br>');
    }

    /**
     * Flowbite bileşenlerini uygular
     */
    applyFlowbite() {
        try {
            // Flowbite bileşenlerini başlat
            if (typeof window.Flowbite !== 'undefined') {
                window.Flowbite.init();
            }

            // Tooltip'leri etkinleştir
            const tooltips = document.querySelectorAll('[data-tooltip-target]');
            tooltips.forEach(tooltip => {
                if (typeof window.Tooltip !== 'undefined') {
                    new window.Tooltip(tooltip);
                }
            });

            // Modal'ları etkinleştir
            const modals = document.querySelectorAll('[data-modal-target]');
            modals.forEach(modal => {
                if (typeof window.Modal !== 'undefined') {
                    new window.Modal(modal);
                }
            });

            // Dropdown'ları etkinleştir
            const dropdowns = document.querySelectorAll('[data-dropdown-toggle]');
            dropdowns.forEach(dropdown => {
                if (typeof window.Dropdown !== 'undefined') {
                    new window.Dropdown(dropdown);
                }
            });

            console.log('Flowbite bileşenleri başarıyla uygulandı');
        } catch (error) {
            console.warn('Flowbite uygulama hatası:', error);
        }
    }

    /**
     * Tüm slide'ları HTML olarak oluşturur
     */
    generateAllSlides() {
        return this.slides.map((slide, index) => this.generateHTML(slide, index)).join('');
    }

    /**
     * Slide sayısını döndürür
     */
    getTotalSlides() {
        return this.totalSlides;
    }

    /**
     * Belirli bir slide'ı döndürür
     */
    getSlide(index) {
        return this.slides[index] || null;
    }

    /**
     * Mevcut slide indeksini döndürür
     */
    getCurrentSlideIndex() {
        return this.currentSlideIndex;
    }

    /**
     * Mevcut slide indeksini ayarlar
     */
    setCurrentSlideIndex(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlideIndex = index;
        }
    }
}

// Global engine instance
window.presentationEngine = new PresentationEngine();

