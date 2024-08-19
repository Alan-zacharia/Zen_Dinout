import cron from "node-cron";
import UserModel from "../../database/model.ts/userModel";
import { getFormattedDate } from "../../utils/dateUtils";
import EmailService from "../../lib/EmailService";

cron.schedule("0 0 * * *", async () => {
  console.log("Running CRON job to check for expiring memberships.");
  try {
    const today = new Date();
    const reminderDate = new Date(today);
    reminderDate.setDate(today.getDate() + 7);
    const usersToRemind = await UserModel.find({
      "primeSubscription.endDate": {
        $gte: today,
        $lte: reminderDate,
      },
      "primeSubscription.status": "active",
    });

    const usersToDeactivate = await UserModel.find({
      "primeSubscription.endDate": { $lt: today },
      "primeSubscription.status": "active",
    });

    usersToDeactivate.forEach(async (user) => {
      if (user.primeSubscription) {
        await UserModel.findByIdAndUpdate(user._id, {
          $set: {
            "primeSubscription.status": "inactive",
            "primeSubscription.endDate": user.primeSubscription.endDate,
          },
        });
        console.log(
          `Membership for user ${user.username} has been deactivated.`
        );
      }
    });

    usersToRemind.forEach((user) => {
      if (user.primeSubscription) {
        const { username, email, primeSubscription } = user;
        const emailContent = `Hello ${username},\n\nYour membership is expiring in 7 days on ${getFormattedDate(
          primeSubscription.endDate
        )}. Please renew it to continue enjoying our services.\n\nBest regards,\nZen Dinout`;

        EmailService.sendReminderEmail(
          email,
          "Membership Expiration Reminder",
          emailContent
        ).catch((error) => {
          console.error(`Error sending email to ${email}:`, error);
        });
      }
    });
  } catch (error) {
    console.error("Error in CRON job:", error);
  }
});
