const { Bot } = require("grammy");
const { handleLessons, start } = require("./handlers");

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Bot(BOT_TOKEN);


bot.command("start", start);

bot.command("lessons", handleLessons);

bot.callbackQuery("btn_lessons", (ctx) => {
  ctx.reply("Dərsləri görmək üçün format: \n`/lessons M12345678 şifrə`", {
    parse_mode: "Markdown",
  });
});

module.exports = bot;
