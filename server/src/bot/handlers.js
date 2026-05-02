const { scrapeAZTU } = require("../scraper/engine");
const { mainKeyboard } = require("./keyboards");

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

    // Mesajı hazırlayaq
    let mesaj = "📊 **Sizin Qiymətləriniz:**\n\n";

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

module.exports = { handleLessons };
