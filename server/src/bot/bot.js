const { Bot } = require("grammy");
const { handleLessons } = require("./handlers");
const { mainKeyboard } = require("./keyboards");

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Bot(BOT_TOKEN);

// Start komandası
bot.command("start", (ctx) =>
  ctx.reply(
    `Salam ${ctx.from.first_name}! AzTU Not Botuna xoş gəldin.\n\nİstifadə üçün /lessons komandasından istifadə et və ya düyməyə bas.`,
    { reply_markup: mainKeyboard }
  )
);

// Lessons komandası (Handler-ə yönləndiririk)
bot.command("lessons", handleLessons);

// Düyməyə basanda nə olacağını təyin edirik
bot.callbackQuery("btn_lessons", (ctx) => {
  ctx.reply("Dərsləri görmək üçün format: \n`/lessons M12345678 şifrə`", { parse_mode: "Markdown" });
});

module.exports = bot;