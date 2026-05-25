# 🏎️ Stuttgart-Apex — Premium Avtomobillar Virtual Markazi

**Stuttgart-Apex** — bu yuqori sinf va premium toifadagi avtomobillarni qidirish, taqqoslash, tahlil qilish hamda sun'iy intellekt (AI AI-Recommendation) yordamida eng mos modelni tanlash imkonini beruvchi ilg'or interaktiv platforma. 

Platforma professional muhandislik parametrlari, telemetriya ko'rsatkichlari, moliyaviy hisob-kitob kalkulyatorlari va premium avtomobillarni baholash tizimini yagona raqamli ekotizimga birlashtiradi.

---

## 🌟 Asosiy Xususiyatlar va Modullar

### 1. 🔍 Sun'iy Intellektual Qidiruv (AI Smart Search)
* **AI Maslahatchi**: Tabiiy tildagi so'rovlarni (masalan: *"Menga trek uchun mos bo'lgan ekstremal Porsche kerak, narxi $250k gacha bo'lsin"*) tushunib, real vaqt rejimida mos modellarni tavsiya qiluvchi aqlli qidiruv tizimi.
* **Gemini API Integratsiyasi**: Server-side formatda tuzilgan bo'lib, xavfsiz harakat qiladi va API kalitlarini brauzerdan yashiradi.

### 2. 📊 Muhandislik Filtrlari Paneli (Advanced Filters Panel)
* **Keng qamrovli qidiruv**: Ishlab chiqaruvchi brendlar, uzatmalar qutisi (Transmission) turi, ishlab chiqarilgan mamlakat (Origin Country) va kuch agregatlari (Propulsion Energy: Petrol, Electric, Hybrid) bo'yicha saralash.
* **Ochko burchagi va Odometer ko'rsatkichlari (Mileage)** hamda xaridor byudjetiga mos keluvchi dinamik narx chegaralari.

### 3. 🔬 Telemetriya va Showcase Studiyasi (Showcase Studio & Telemetry)
* **Muhandislik ko'rsatkichlari**: Avtomobilning 0-60 mph tezlashuv vaqti, umumiy og'irligi, quvvati, haydovchi o'qlari va boshqa parametrlari bilan to'liq tanishish.
* **Foydalanuvchilar sharhi (Verified Community Reviews)**: Jamiyat tomonidan tasdiqlangan sharhlarni yozish, rating berish va har bir modelning mexanik holatini real vaqtda baholash imkoniyati.

### 4. ⚖️ Metrik Lab / Taqqoslash Laboratoriyasi (Metric Labs Comparative Panel)
* **Side-by-side (Yonma-yon) taqqoslash**: Istalgan 2 yoki undan ortiq avtomobillarni tanlab, ularning narxi, quvvati, tezlanuvchanligi va vazn ko'rsatkichlarini professional grafik usulda vizual taqqoslash.

### 5. 💼 Boshqaruv Markazi (Command Center Dashboard)
* **Shaxsiy Garaj**: Sevimli avtomobillar ro'yxatini shakllantirish (Wishlist) va ularni saqlash (`localStorage` orqali brauzerda barqaror saqlanadi).
* **Moliyaviy va Kredit Kalkulyatori (Financing & Loan Calculator)**: Boshlang'ich to'lov, yillik foiz stavkasi va kredit muddati (24, 36, 48, 60 oy) bo'yicha oylik to'lovni aniq hisoblash.
* **Konsignatsiya Listingi (Consignment Upload)**: Avtomobilingizni savdoga chiqarish va uni Stuttgart muhandislari tomonidan verifikatsiyadan o'tkazish uchun ariza yuborish.

---

## 🛠️ Texnik Arxitektura va Texnologiyalar

Platforma eng zamonaviy va tezkor dasturlash vositalari asosida yaratilgan:

* **Frontend**: React 19, TypeScript, **Vite** (Module bundler).
* **Styling**: **Tailwind CSS v4** — yuqori kontrastli, ko'zni charchatmaydigan Kosmik To'q (Dark Cosmic Minimal) va Yengil Oq (Light Mode) dizayn.
* **Animatsiyalar**: `motion` (`motion/react`) orqali silliq va o'ta interaktiv animatsion o'tishlar.
* **Server-side (Backend Proxies)**: Express va Node.js, `esbuild` bilan optimallashgan holda ishga tushadi. API kalitlarining xavfsizligini ta'minlash uchun API so'rovlarni o'z ichiga oladi.
* **Ikonkalar**: `lucide-react` kutubxonasi yordamida yaratilgan chiroyli vektor belgilar.

---

## 🚀 Mahalliy Tizimda Ishga Tushirish (Development Guide)

Platformani o'z kompyuteringizda ishga tushirish uchun quyidagi buyruqlarni ketma-ket bajaring:

### 1. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 2. Dasturlash (Development) muhitida ishga tushirish
```bash
npm run dev
```
Ushbu buyruq mahalliy Express serverni `server.ts` orqali ishga tushiradi va Vite middleware orqali portalni taqdim etadi. Portalga brauzer orqali kirasiz: `http://localhost:3000`.

### 3. Tizim qoidalarini tekshirish (Lint)
```bash
npm run lint
```
TypeScript tiplari va sintaksisini tekshirish.

### 4. Production Build (Loyihani tayyorlash va optimallashtirish)
```bash
npm run build
```
Frontend fayllar `dist/` katalogiga jamlanadi, Express server esa yagona, ixcham `dist/server.cjs` fayli holatida esbuild orqali yig'iladi.

### 5. Production serverni ishga tushirish
```bash
npm run start
```

---

## 🎨 Dizayn Falsafasi (Design & UX Standards)

* **Swiss Tech Aesthetic**: Joylashtirilgan elementlarning aniq o'lchamlari, keng bo'shliqlar (generous negative space), aniq o'qiluvchan shriftlar va yuqori kontrastli interfeys.
* **Localization**: Tizim to'rtta tilda (Ingliz, Nemis, Italyan va Yapon tillarida) to'liq lokalizatsiya qilingan bo'lib, xorijiy xaridorlar va hamkorlar uchun ham ideal moslikni ta'minlaydi.
