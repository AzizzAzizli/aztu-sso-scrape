const { scrapeAZTU } = require("../scraper/engine");
const { mainKeyboard } = require("./keyboards");
const { formatDuration } = require("./time-formater-util");

const handleLessons = async (ctx) => {
  const args = ctx.match ? ctx.match.split(" ") : [];

  if (args.length !== 2) {
    return ctx.reply(
      "❌ **Səhv format!** \n\nZəhmət olmasa belə yazın: \n`/lessons M12345678 şifrə123`",
      { parse_mode: "Markdown" },
    );
  }

  const [username, password] = args;
  await ctx.reply("⏳ AzTU sisteminə bağlanılır, xahiş edirəm gözləyin...");

  try {
    const result = await scrapeAZTU(username, password);

    if (!result.success) {
      return ctx.reply(`❌ Xəta: ${result.error}`);
    }

    let mesaj = "📊 **Sizin Məlumatlarınız:**\n\n";
    mesaj += `⌛**${formatDuration(result.time)}**\n\n\n`;

    result.data.forEach((s) => {
      mesaj += `📖 **Dərs:** ${s.subjectName}\n`;
      mesaj += `🚶 **Davamiyyət:** ${s.attendance}\n`;
      mesaj += `📝 **Ballar:**\n`;
      mesaj += s.scores
        .map((sc) => `  ▫️ _${sc.label}:_ **${sc.value}**`)
        .join("\n");
      mesaj += "\n" + "─".repeat(20) + "\n"; // Ayırıcı xətt
    });

    await ctx.reply(mesaj, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Handler Error:", error);
    await ctx.reply("💥 Məlumat çəkilərkən texniki xəta baş verdi.");
  }
};

const start = (ctx) => {
  const message = `
<b>Salam, ${ctx.from.first_name}!</b> 👋

AzTU SSO Botuna xoş gəldin. Bu bot vasitəsilə portal məlumatlarını sürətli şəkildə əldə edə bilərsən.

🚀 <b>İstifadə qaydası:</b>
<code>/lessons M12345678 şifrə123</code>

⚠️ <i>Məlumatlarınızın təhlükəsizliyi üçün şifrənizi kimsə ilə paylaşmayın.</i>
⚠️ Məlumatlarınız serverdə saxlanılmır.

────────────────
👨‍💻 <b>Created by Aziz</b>
  `.trim();
  ctx.reply(message, {
    parse_mode: "HTML",
    reply_markup: mainKeyboard,
  });
};
module.exports = { handleLessons, start };
