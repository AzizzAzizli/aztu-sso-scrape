const { InlineKeyboard } = require("grammy");

const mainKeyboard = new InlineKeyboard()
  .text("📖 Məlumatları Gətir", "btn_lessons")
  .row()
  .url("🌐 AzTU SSO", "https://sso.aztu.edu.az/");

module.exports = { mainKeyboard };
