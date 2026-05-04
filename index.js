require("dotenv").config();
const http = require("http");
const bot = require("./src/bot/bot.js");

const PORT = process.env.PORT || 8080;

const bootstrap = async () => {
  try {
    bot.start({
      onStart: (botInfo) => {
        console.log(`🤖 Bot @${botInfo.username} is up and running.`);
      },
    });

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

    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
    });

    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
      process.exit(1);
    });

  } catch (error) {
    console.error("💥 Critical error during bootstrap:", error);
    process.exit(1);
  }
};

bootstrap();