import { Telegraf } from "telegraf";
import { config } from "./config";

// Инициализация бота
const bot = new Telegraf(config.botToken);

// Обработка команды /start
bot.start((ctx) => {
  const welcomeMessage = `
👋 Добро пожаловать в наш бот!

Я могу помочь вам отправить сообщение администратору.

📝 Просто напишите любое сообщение, и я передам его на указанный аккаунт.

Доступные команды:
/start - показать это сообщение
/help - справка
  `;
  ctx.reply(welcomeMessage);
});

// Обработка команды /help
bot.command("help", (ctx) => {
  ctx.reply(
    `ℹ️ Справка:\n\n` +
      `1. Напишите любое сообщение\n` +
      `2. Бот автоматически передаст его администратору\n` +
      `3. Вы получите уведомление о результате`,
  );
});

// Обработка обычных текстовых сообщений
bot.on("text", async (ctx) => {
  const userMessage = ctx.message.text;
  const userId = ctx.from?.id;
  const userName = ctx.from?.username || ctx.from?.first_name || "Unknown";

  try {
    // Формируем сообщение для отправки администратору
    const messageToAdmin = `
📨 Новое сообщение от пользователя:

👤 Имя: ${userName}
🆔 ID: ${userId}
📅 Время: ${new Date().toLocaleString("ru-RU")}

💬 Сообщение:
${userMessage}
    `;

    // Отправляем сообщение администратору
    await bot.telegram.sendMessage(config.adminChatId, messageToAdmin, {
      parse_mode: "HTML",
    });

    // Отправляем сообщение об успехе пользователю
    ctx.reply(
      `✅ Спасибо! Ваше сообщение успешно отправлено администратору.\n\n` +
        `Мы свяжемся с вами в ближайшее время.`,
    );

    console.log(
      `✅ Сообщение от ${userName} (ID: ${userId}) успешно отправлено`,
    );
  } catch (error) {
    // Обработка ошибок
    console.error("❌ Ошибка при отправке сообщения:", error);

    ctx.reply(
      `❌ К сожалению, произошла ошибка при отправке сообщения.\n\n` +
        `Пожалуйста, попробуйте позже или свяжитесь с администратором.`,
    );
  }
});

// Обработка других типов сообщений (фото, видео и т.д.)
bot.on("photo", async (ctx) => {
  try {
    const fileId = ctx.message.photo[ctx.message.photo.length - 1]?.file_id;
    const caption = ctx.message.caption || "Фото без описания";
    const userId = ctx.from?.id;
    const userName = ctx.from?.username || ctx.from?.first_name || "Unknown";

    const messageToAdmin = `
📨 Новое сообщение от пользователя (с фото):

👤 Имя: ${userName}
🆔 ID: ${userId}
📅 Время: ${new Date().toLocaleString("ru-RU")}

💬 Описание:
${caption}
    `;

    await bot.telegram.sendPhoto(config.adminChatId, fileId!, {
      caption: messageToAdmin,
      parse_mode: "HTML",
    });

    ctx.reply(`✅ Фото успешно отправлено администратору!`);

    console.log(
      `✅ Сообщение с фото от ${userName} (ID: ${userId}) успешно отправлено`,
    );

  } catch (error) {
    console.error("❌ Ошибка при отправке фото:", error);
    ctx.reply(`❌ Ошибка при отправке фото. Пожалуйста, попробуйте позже.`);
  }
});

// Обработка команды /cancel
// bot.command("cancel", (ctx) => {
//   ctx.reply(`❌ Операция отменена.`);
// });

// Обработка ошибок
bot.catch((err: any) => {
  console.error("Непредвиденная ошибка:", err);
});

// Запуск бота
bot.launch();

console.log("🤖 Бот запущен и готов к работе!");

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
