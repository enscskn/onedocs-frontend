# OneDocs

OneDocs, modern ve şık bir arayüze sahip, Supabase tabanlı görev, belge ve e-posta yönetim uygulamasıdır. Takımlar ve bireyler için üretkenliği artırmayı hedefler. Tüm veriler Supabase üzerinde saklanır ve yönetilir.

## Özellikler

- Görev oluşturma, listeleme, filtreleme ve silme
- Belgeler için ekleme, arama, silme ve detay görüntüleme
- E-posta yönetimi (örnek veriyle otomatik doldurma dahil)
- Modern sekmeli (tab) arayüz
- Otomatik örnek veri oluşturma butonları
- Bildirim, istatistik ve ayarlar için şık modal ve toastlar
- Supabase ile tam entegre, gerçek zamanlı veri yönetimi

> ![OneDocs Logo](./public/onedocsturkiye_cover.jpg)

## Kurulum

1. **Depoyu klonlayın:**
   ```bash
   git clone <repo-url>
   cd onedocs-frontend
   ```
2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```
3. **Supabase ayarlarını yapın:**
   - `.env` dosyası oluşturun ve aşağıdaki değişkenleri girin:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
4. **Projeyi başlatın:**
   ```bash
   npm run dev
   ```
   Ardından tarayıcınızda `http://localhost:5173` adresini açın.

## Kullanılan Teknolojiler

- [React](https://react.dev/) (Vite ile)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)

## Klasör Yapısı

```
.
├── public/
│   └── onedocsturkiye_logo.jpg
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── App.tsx
│   └── ...
├── index.html
├── package.json
├── README.md
└── ...
```