/**
 * ClearFrame — единый конфиг сайта.
 * Меняйте значения здесь — они автоматически подставятся на всех страницах
 * (элементы с data-cfg="ключ" в HTML).
 */
window.SITE_CONFIG = {
  BRAND_NAME: "ClearFrame Property Records",
  BRAND_SHORT: "ClearFrame",

  PHONE_DISPLAY: "(858) 241-7543",
  PHONE_TEL: "+18582417543",          // формат для href="tel:"
  EMAIL: "clearframeproperty@gmail.com",

  SERVICE_AREA_SHORT: "Carlsbad & North County San Diego",
  BUSINESS_HOURS: "10am–9pm",

  BOOKING_LINK: "[BOOKING_LINK]",      // ссылка на Calendly/Cal.com — вставить позже
  PRICE_STARTING: "$150",              // самая низкая цена — для общих формулировок "starting at"
  PRICE_MOVEIN: "$200",                // Move-In Baseline
  PRICE_MOVEOUT: "$200",               // Move-Out Pre-Work Record
  PRICE_POSTWORK: "$150",              // Post-Cleaning / Post-Repair Record
  PRICE_COMPLETE: "$250",              // Complete Rental Record
  REPORT_DELIVERY_TIME: "3 business days",
  FILE_RETENTION_PERIOD: "60 days",

  INSTAGRAM_URL: "",                    // добавить, когда профиль будет создан
  GBP_URL: "",                          // Google Business Profile

  // Форма заявок — см. README.md для настройки
  FORMSPREE_ENDPOINT: "https://formspree.io/f/mkjnwbpa",
  // Telegram-токен НЕ хранится здесь — см. cloudflare-worker.js и README.md.
  // Вставьте сюда адрес задеплоенного Worker'а (https://ИМЯ.ВАШ_АККАУНТ.workers.dev):
  TELEGRAM_PROXY_URL: "YOUR_WORKER_URL"
};
