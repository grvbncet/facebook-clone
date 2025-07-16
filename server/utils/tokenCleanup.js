// utils/tokenCleanup.js
import cron from "node-cron";
import RefreshToken from "../models/RefreshToken.model.js";

// Runs every hour (you can adjust the schedule)
const cleanupExpiredTokens = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();
      const deleted = await RefreshToken.destroy({
        where: {
          expiryDate: { lt: now },
        },
      });
      console.log(`[Cleanup] Deleted ${deleted} expired refresh tokens.`);
    } catch (error) {
      console.error("Error cleaning expired refresh tokens:", error);
    }
  });
};

export default cleanupExpiredTokens;
