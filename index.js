require("dotenv").config();
const http = require("http");
const bot = require("./src/bot/bot.js");

const PORT = process.env.PORT || 8080;
let server; // Sunucu referansını dışarıda tutuyoruz

const bootstrap = async () => {
  try {
    // 1. Önceki bir sunucu varsa kapat (EADDRINUSE önleyici)
    if (server && server.listening) {
      server.close();
    }

    bot.catch((err) => {
      const ctx = err.ctx;
      console.error(`❌ Error while handling update ${ctx.update.update_id}:`);
      console.error(err.error);
    });

    bot.start({
      onStart: (botInfo) => {
        console.log(`🤖 Bot @${botInfo.username} is up and running.`);
      },
    }).catch((err) => {
      if (err.description && err.description.includes("Conflict")) {
        console.warn("⚠️ Conflict detected: Retrying in 10 seconds...");
        // Sadece botu tekrar başlat, tüm bootstrap'i değil (veya sunucuyu kontrol et)
        setTimeout(() => bot.bootstrap(), 10000);
      } else {
        console.error("💥 Failed to start the bot:", err);
      }
    });

    // Sunucuyu değişkene ata
    server = http.createServer((req, res) => {
      if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
      } else {
        res.writeHead(200);
        res.end("Bot is active!");
      }
    });

    server.listen(PORT, () => {
      console.log(`🌐 Health check server listening on port ${PORT}`);
    });

    // Hata yönetimi
    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.log('⚠️ Port in use, retrying...');
      }
    });

  } catch (error) {
    console.error("💥 Critical error during bootstrap:", error);
    process.exit(1);
  }
};

// Graceful Shutdown
const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  if (server) server.close();
  await bot.stop();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

bootstrap();