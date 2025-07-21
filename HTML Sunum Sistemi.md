# HTML Sunum Sistemi

İmpress.js, Tailwind CSS ve Flowbite kullanarak geliştirilmiş JSON tabanlı HTML sunum sistemi.

## Özellikler

- **JSON Tabanlı İçerik**: Sunum içeriği JSON formatında kolayca düzenlenebilir
- **Modern Teknolojiler**: İmpress.js, Tailwind CSS, Flowbite
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Çoklu Sunum Desteği**: 4 farklı işletme stratejisi sunumu
- **GitHub Pages Uyumlu**: Statik hosting için optimize edilmiş

## Dosya Yapısı

```
html-presentation-system/
├── index.html              # Ana HTML dosyası
├── engine.js               # JSON parser ve HTML generator
├── renderer.js             # DOM manipülasyonu ve impress.js entegrasyonu
├── content/                # JSON ve JS sunum dosyaları
│   ├── demo.json          # Demo - İşletme Stratejisi Temelleri
│   ├── rekabet-analizi.json # Rekabet Analizi ve Pazar Dinamikleri
│   ├── dijital-donusum.json # Dijital Dönüşüm Stratejileri
│   ├── surdurulebilir-buyume.json # Sürdürülebilir Büyüme Stratejileri
│   ├── data.js            # İşletme Stratejisi Temelleri (JS)
│   ├── data2.js           # Rekabet Analizi (JS)
│   ├── data3.js           # Dijital Dönüşüm Stratejileri (JS)
│   └── data4.js           # Sürdürülebilir Büyüme (JS)
└── README.md              # Bu dosya
```

## Kullanım

### Yerel Geliştirme

1. Dosyaları bir web sunucusu ile çalıştırın:
```bash
python3 -m http.server 8000
```

2. Tarayıcıda `http://localhost:8000` adresini açın

### GitHub Pages

1. Dosyaları GitHub repository'sine yükleyin
2. Repository ayarlarından GitHub Pages'i etkinleştirin
3. `main` branch'i seçin
4. Siteniz `https://username.github.io/repository-name` adresinde yayınlanacak

## Sunum Kontrolü

### Klavye Kısayolları
- **→ / ↓ / Space**: Sonraki slide
- **← / ↑**: Önceki slide
- **Home**: İlk slide
- **End**: Son slide
- **Esc**: Genel bakış modu
- **F / F11**: Tam ekran

### Mouse/Touch
- **Mouse Wheel**: Slide değiştirme
- **Swipe**: Mobil cihazlarda slide değiştirme

### Navigasyon Butonları
- **Önceki/Sonraki**: Slide navigasyonu
- **Genel Bakış**: Tüm slide'ları görüntüleme

## JSON Şema

```javascript
{
  "title": "Sunum Başlığı",
  "subtitle": "Alt Başlık",
  "author": "Yazar",
  "date": "2025",
  "slides": [
    {
      "id": "slide-0",
      "type": "title|content|list|image|chart|quote|comparison",
      "title": "Slide Başlığı",
      "subtitle": "Alt Başlık",
      "content": "İçerik metni",
      "items": ["Liste öğesi 1", "Liste öğesi 2"],
      "position": { "x": 0, "y": 0, "z": 0 },
      "rotation": 0,
      "scale": 1
    }
  ]
}
```

## Slide Tipleri

- **title**: Başlık slide'ı
- **content**: İçerik slide'ı
- **list**: Liste slide'ı
- **image**: Resim slide'ı
- **chart**: Grafik slide'ı
- **quote**: Alıntı slide'ı
- **comparison**: Karşılaştırma slide'ı

## Teknoloji Stack

- **İmpress.js**: 3D sunum framework'ü
- **Tailwind CSS**: Utility-first CSS framework
- **Flowbite**: Tailwind CSS bileşenleri
- **Vanilla JavaScript**: Framework'süz JavaScript

## Özelleştirme

### Yeni Sunum Ekleme

1. Yeni bir `dataX.js` dosyası oluşturun
2. JSON şemasına uygun içerik ekleyin
3. `index.html` dosyasındaki data controls bölümüne yeni buton ekleyin

### Stil Değişiklikleri

CSS stilleri `index.html` dosyasının `<style>` bölümünde bulunur. Tailwind CSS sınıfları kullanılarak özelleştirilebilir.

### Yeni Slide Tipleri

`engine.js` dosyasında yeni `generate*Slide()` fonksiyonları ekleyerek yeni slide tipleri oluşturabilirsiniz.

## Tarayıcı Desteği

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Sorun Giderme

### Sunum Yüklenmiyor
- Tarayıcı konsolunu kontrol edin
- JavaScript hatalarını giderin
- Dosya yollarını kontrol edin

### Slide'lar Görünmüyor
- JSON syntax'ını kontrol edin
- Slide ID'lerinin benzersiz olduğundan emin olun
- Position değerlerini kontrol edin

### Performans Sorunları
- Slide sayısını azaltın
- Büyük resimleri optimize edin
- Animasyon süresini artırın

## İletişim

Sorularınız için GitHub Issues kullanın.

