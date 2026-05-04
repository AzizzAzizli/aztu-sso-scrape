const { InlineKeyboard } = require("grammy");

const mainKeyboard = new InlineKeyboard()
  .text("📖 Məlumatları Gətir", "btn_lessons")
  .row()
  .url("🌐 AzTU SSO", "https://sso.aztu.edu.az/")
  .row()
  .url("🐙 GitHub", "https://github.com/AzizzAzizli")
  .url("💼 LinkedIn", "https://www.linkedin.com/in/aziz-azizli-3ba24a28a/");

module.exports = { mainKeyboard };
