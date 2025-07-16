import cron from "node-cron";
import prisma from "./prisma.js";

export function recruitmentCron() {
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      const deleted = await prisma.recruitment.deleteMany({
        where: { deadline: { lte: now } },
      });
      console.log(`[${new Date().toISOString()}] Deleted ${deleted.count} expired recruitment posts.`);
    } catch (err) {
      console.error("Failed to delete expired recruitments:", err);
    }
  });
}
