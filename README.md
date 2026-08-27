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
og-image.jpg                  — превью для соцсетей (1200×630), уже сгенерировано
cloudflare-worker.js          — прокси для Telegram-уведомлений (см. раздел 5)
```

## 1. Залить на GitHub

Репозиторий уже инициализирован локально, файлы закоммичены, и remote `origin` указывает на:

```
https://github.com/clearframeproperty-drozd/clearframeproperty.git
```

Осталось только авторизоваться и отправить коммит — на машине, где это делалось, не было сохранённых GitHub-учётных данных, так что этот последний шаг нужно выполнить из вашего терминала:

```bash
cd "clearframe Project"
git push -u origin main
```

Если репозиторий на GitHub ещё не создан — создайте пустой репозиторий `clearframeproperty` под аккаунтом `clearframeproperty-drozd` на github.com (без README/лицензии, чтобы не было конфликта), и только потом выполните `git push` выше.

Git спросит логин/пароль — GitHub больше не принимает обычный пароль аккаунта для `git push` по HTTPS, нужен **Personal Access Token** (Settings → Developer settings → Personal access tokens → Generate new token, права `repo`), который вводится вместо пароля. Проще всего один раз сохранить его в Keychain:

```bash
git config --global credential.helper osxkeychain
```

— после первого успешного пуша с токеном macOS больше не будет спрашивать заново.

Затем на GitHub: **Settings → Pages → Source → Deploy from a branch → main / (root)**. Сайт появится по адресу `https://clearframeproperty-drozd.github.io/clearframeproperty/` в течение пары минут.

## 2. Подключить свой домен (опционально, можно позже)

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

### Telegram (через Cloudflare Worker — токен не светится в коде)

Сайт статический, без бэкенда, поэтому токен бота нельзя просто положить в `config.js` — он был бы виден в исходном коде любому. Вместо этого браузер стучится на бесплатный Cloudflare Worker (`cloudflare-worker.js` в корне репозитория), а сам Worker уже дергает Telegram API с токеном, который хранится не в git, а в секретах Cloudflare.

1. В Telegram: **@BotFather** → `/newbot` → получите токен вида `123456:ABC-DEF...`.
2. Напишите своему новому боту любое сообщение — иначе Telegram не создаст chat_id.
3. Узнайте chat_id: откройте `https://api.telegram.org/bot<ТОКЕН>/getUpdates` в браузере, найдите `"chat":{"id": ЧИСЛО, ...}`.
4. Зарегистрируйтесь на https://dash.cloudflare.com/sign-up (бесплатно).
5. **Workers & Pages → Create → Create Worker** → дайте имя (например `clearframe-notify`) → **Deploy** (заготовку) → **Edit code** → вставьте содержимое `cloudflare-worker.js` из этого репозитория → **Deploy**.
6. В настройках Worker'а: **Settings → Variables and Secrets → Add** → добавьте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` как **Secret** (не Plaintext) → Save and deploy.
7. Скопируйте адрес Worker'а (вида `https://clearframe-notify.ВАШ_АККАУНТ.workers.dev`) и вставьте в `config.js`:
   ```js
   TELEGRAM_PROXY_URL: "https://clearframe-notify.ВАШ_АККАУНТ.workers.dev",
   ```
8. В самом `cloudflare-worker.js` проверьте список `ALLOWED_ORIGINS` в начале файла — там должен быть адрес вашего сайта (GitHub Pages или домен), иначе Worker будет отклонять запросы с других источников.

### ⚠️ Про Formspree ID

`FORMSPREE_ENDPOINT` в коде виден всем — это нормально: Formspree сам ограничивает частоту отправок и фильтрует спам, ничего секретного в этом ID нет.

## 6. Что ещё стоит сделать перед публикацией

- Все фото сейчас — подобранные вручную фото Unsplash (помещения/фасады, без людей в кадре). Замените на свои реальные фото объектов, когда они появятся — это всегда усиливает доверие сильнее любых стоковых изображений.
- Создать `og-image.jpg` (1200×630) для превью в соцсетях и положить рядом с `index.html`, либо убрать эту строку из `<meta property="og:image">`.
- Заполнить `INSTAGRAM_URL` и `GBP_URL` в `config.js`, когда профили будут созданы, и добавить ссылки в футер (сейчас не выведены на страницы — могу добавить одной правкой).
- Проверить формулировки цен/сроков — сайт специально не придумывает эти цифры, они остаются плейсхолдерами, пока вы их не укажете.

## 7. Локальная проверка

Просто откройте `index.html` в браузере — сайт работает без сервера. Переходы между страницами, FAQ-аккордеон, слайдер sample-report, слайдер сравнения Move-In/Move-Out на главной и анимации работают сразу; для проверки самой отправки формы нужны настроенные Formspree/Telegram (шаг 5).
