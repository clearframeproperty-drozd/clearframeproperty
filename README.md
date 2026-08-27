# ClearFrame Property Records — многостраничный сайт

12 HTML-страниц + общий `styles.css`, `config.js` и `common.js`. Чистый HTML/CSS/JS, без сборки — готов для GitHub Pages.

**Дизайн:** «Modern Proptech» — тёмно-индиговый hero с мягким градиентным свечением, акценты — электрик-бирюза и янтарь, на светлых секциях. Шрифты: **Space Grotesk** (заголовки) + **Inter** (текст) + **IBM Plex Mono** (данные/подписи). Добавлено больше движения: карточки и кнопки приподнимаются при наведении, фото в hero сменяют друг друга по кругу, счётчики на главной "взводятся" при прокрутке, интерактивный слайдер сравнения Move-In/Move-Out (тяните мышкой), бегущая строка городов обслуживания. Все фотографии — помещения и фасады без людей в кадре (соответствует сути сервиса: фиксация состояния объекта).

## Структура файлов

```
index.html            — Home
services.html          — Services
sample-report.html     — Sample Report (интерактивный слайдер)
for-landlords.html     — For Landlords
for-renters.html       — For Renters
how-it-works.html      — How It Works
book.html               — Book a Documentation Visit (форма)
thank-you.html          — страница подтверждения после отправки формы
about.html               — About
faq.html                 — FAQ (аккордеон)
contact.html              — Contact (форма)
privacy.html               — Privacy Policy
terms.html                  — Terms & Service Disclaimer
styles.css                   — вся дизайн-система (общая для всех страниц)
config.js                     — ЕДИНЫЙ конфиг: телефон, email, цены, ссылки
common.js                     — общая логика: меню, форма, FAQ, слайдер, анимации, счётчики
favicon.svg
```

## 1. Залить на GitHub

```bash
git init
git add .
git commit -m "ClearFrame — многостраничный сайт"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git
git push -u origin main
```

Затем: **Settings → Pages → Source → Deploy from a branch → main / (root)**.

## 2. Подключить свой домен

1. Создайте в корне репозитория файл `CNAME` с вашим доменом (одна строка, без `http://`):
   ```
   clearframerecords.com
   ```
2. У регистратора домена:
   - A-записи для корневого домена на IP GitHub Pages:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - CNAME-запись для `www` → `ВАШ_ЛОГИН.github.io`
3. В Settings → Pages впишите домен, дождитесь "DNS check successful", включите "Enforce HTTPS".

## 3. Заполнить config.js — САМЫЙ ВАЖНЫЙ ШАГ

Все редактируемые данные сайта собраны в одном месте — `config.js`. Откройте его и замените:

```js
window.SITE_CONFIG = {
  BRAND_NAME: "ClearFrame Property Records",
  PHONE_DISPLAY: "[PHONE]",        // → "(760) 123-4567"
  PHONE_TEL: "+10000000000",        // → "+17601234567" (для клика "позвонить")
  EMAIL: "[EMAIL]",                  // → "hello@clearframerecords.com"
  BUSINESS_HOURS: "[HOURS]",          // → "Mon–Sat, 8am–6pm"
  BOOKING_LINK: "[BOOKING_LINK]",      // → ссылка на Calendly/Cal.com
  PRICE_STARTING: "[PRICE]",            // → "$249"
  REPORT_DELIVERY_TIME: "[REPORT DELIVERY TIME]",  // → "48 hours"
  FILE_RETENTION_PERIOD: "[FILE RETENTION PERIOD]", // → "12 months"
  ...
};
```

Эти значения автоматически подставляются на всех 12 страницах — их не нужно менять в каждом файле отдельно.

**Важно:** пока `PRICE_STARTING`, `REPORT_DELIVERY_TIME` и `FILE_RETENTION_PERIOD` не заполнены реальными значениями, на сайте будут видны плейсхолдеры вида `[PRICE]`. Это сделано намеренно — сайт не должен показывать выдуманные цифры.

## 4. Подключить календарь бронирования (Calendly / Cal.com)

Сейчас на странице `book.html` вверху формы — ссылка-заглушка "Open our booking calendar", которая подставляется из `BOOKING_LINK` в `config.js`. Когда заведёте Calendly или Cal.com:

1. Скопируйте ссылку на свою страницу бронирования.
2. Вставьте её в `BOOKING_LINK` в `config.js`.

Если позже захотите встроенный виджет календаря прямо на странице (а не просто ссылку) — могу добавить embed-код Calendly отдельным блоком.

## 5. Подключить формы (Book a Visit + Contact)

Обе формы (`book.html` и `contact.html`) используют одну и ту же логику из `common.js` и отправляют заявку одновременно на email и в Telegram.

### Email (Formspree, бесплатно)

1. Зарегистрируйтесь на https://formspree.io, создайте форму, скопируйте ID.
2. В `config.js`:
   ```js
   FORMSPREE_ENDPOINT: "https://formspree.io/f/ВАШ_ID",
   ```

### Telegram

1. В Telegram: **@BotFather** → `/newbot` → получите токен.
2. Напишите боту любое сообщение, чтобы он вас "увидел".
3. Узнайте chat_id через `https://api.telegram.org/bot<ТОКЕН>/getUpdates`.
4. В `config.js`:
   ```js
   TELEGRAM_BOT_TOKEN: "ВАШ_ТОКЕН",
   TELEGRAM_CHAT_ID: "ВАШ_CHAT_ID",
   ```

### ⚠️ Нюанс безопасности

Токен Telegram и Formspree ID видны в исходном коде страницы, так как сайт статический. Практический риск невелик (посторонний сможет максимум флудить в бот-чат, не более). Подробности — см. README из первой версии сайта, либо спросите — помогу вынести отправку в бесплатный Cloudflare Worker, если хотите убрать этот риск полностью.

## 6. Что ещё стоит сделать перед публикацией

- Все фото сейчас — подобранные вручную фото Unsplash (помещения/фасады, без людей в кадре). Замените на свои реальные фото объектов, когда они появятся — это всегда усиливает доверие сильнее любых стоковых изображений.
- Создать `og-image.jpg` (1200×630) для превью в соцсетях и положить рядом с `index.html`, либо убрать эту строку из `<meta property="og:image">`.
- Заполнить `INSTAGRAM_URL` и `GBP_URL` в `config.js`, когда профили будут созданы, и добавить ссылки в футер (сейчас не выведены на страницы — могу добавить одной правкой).
- Проверить формулировки цен/сроков — сайт специально не придумывает эти цифры, они остаются плейсхолдерами, пока вы их не укажете.

## 7. Локальная проверка

Просто откройте `index.html` в браузере — сайт работает без сервера. Переходы между страницами, FAQ-аккордеон, слайдер sample-report, слайдер сравнения Move-In/Move-Out на главной и анимации работают сразу; для проверки самой отправки формы нужны настроенные Formspree/Telegram (шаг 5).
