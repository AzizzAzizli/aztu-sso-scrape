require("dotenv").config();
const http = require("http");
const bot = require("./src/bot/bot.js");
// const connectDB = require("./src/database/connect.js");

const PORT = process.env.PORT || 8080;

/**
 * Proyekti başladan ana funksiya
 */
const bootstrap = async () => {
  try {
    // 1. Verilənlər bazası bağlantısı (ehtiyac olduqda aktivləşdir)
    // await connectDB();
    // console.log("📦 Database connected successfully.");

    // 2. Telegram Botunu başlat
    // catch xətaları botun çökməsinin qarşısını alır
    bot.start({
      onStart: (botInfo) => {
        console.log(`🤖 Bot @${botInfo.username} is up and running.`);
      },
    });

    // 3. HTTP Server yarat (Sağlamlıq yoxlaması - Health Check üçün)
    const server = http.createServer((req, res) => {
      if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
      } else {
        res.writeHead(200);
        res.write("Bot is active!");
        res.end();
      }
    });

    server.listen(PORT, () => {
      console.log(`🌐 Health check server listening on port ${PORT}`);
    });

    // 4. Gözlənilməz xətaları tutmaq üçün (Process listeners)
    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
    });

    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
      // Kritik xətada botu təhlükəsiz şəkildə dayandır və yenidən başlat
      process.exit(1);
    });

  } catch (error) {
    console.error("💥 Critical error during bootstrap:", error);
    process.exit(1);
  }
};

bootstrap();