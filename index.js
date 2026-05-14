require("dotenv").config();
const http = require("http");
const bot = require("./src/bot/bot.js");

const PORT = process.env.PORT || 8080;

const bootstrap = async () => {
  try {
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
        console.warn("⚠️ Conflict detected: Another bot instance is likely running. Retrying in 10 seconds...");
        setTimeout(() => bootstrap(), 10000); 
      } else {
        console.error("💥 Failed to start the bot:", err);
      }
    });

    const server = http.createServer((req, res) => {
      if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ 
          status: "ok", 
          uptime: process.uptime(),
          timestamp: new Date().toISOString() 
        }));
      } else {
        res.writeHead(200);
        res.write("Bot is active and healthy!");
        res.end();
      }
    });

    server.listen(PORT, () => {
      console.log(`🌐 Health check server listening on port ${PORT}`);
    });

    const stopBot = async () => {
      console.log("Shutting down gracefully...");
      await bot.stop();
      process.exit(0);
    };

    process.on("SIGINT", stopBot);
    process.on("SIGTERM", stopBot);

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