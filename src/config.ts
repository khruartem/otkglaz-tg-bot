import dotenv from "dotenv";

// ВАЖНО: загрузите .env ДО использования переменных
dotenv.config();

export const config = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || "",
  adminChatId: process.env.ADMIN_CHAT_ID || "",
};

// Проверка на старте
if (!config.botToken) {
  console.error(
    "❌ ОШИБКА: TELEGRAM_BOT_TOKEN не найден в переменных окружения!",
  );
  console.error(
    "Убедитесь, что файл .env существует и содержит TELEGRAM_BOT_TOKEN",
  );
  process.exit(1);
}

if (!config.adminChatId) {
  console.error("⚠️ ПРЕДУПРЕЖДЕНИЕ: ADMIN_CHAT_ID не установлен");
}

console.log("✅ Конфиг загружен успешно");
console.log(`Bot Token: ${config.botToken.substring(0, 10)}...`); // Скрывает токен
