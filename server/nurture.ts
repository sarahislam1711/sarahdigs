import cron from "node-cron";
import { storage } from "./storage";
import { SEQUENCE, sendSequenceEmail } from "./email";

/**
 * Nurture sequence runner.
 *
 * Step 1 (welcome) is sent on signup. This job handles steps 2..N: once a day
 * it finds subscribers who are due for their next email (at step-1, not
 * unsubscribed, last emailed >= daysAfterPrev ago), sends it, and advances them.
 *
 * Idempotent by design: a subscriber only matches ONE step at a time (their
 * current sequenceStep + 1), so re-running never double-sends.
 */
export async function runNurtureSequence(): Promise<{ sent: number; errors: number }> {
  let sent = 0;
  let errors = 0;

  // Process steps 2..N (skip step 1 = welcome, sent on signup).
  for (const entry of SEQUENCE) {
    if (entry.step < 2 || !("subject" in entry)) continue;

    let due;
    try {
      due = await storage.getSubscribersDueForStep(entry.step, entry.daysAfterPrev);
    } catch (err) {
      console.error(`[Nurture] failed to query step ${entry.step}:`, err);
      errors++;
      continue;
    }

    for (const sub of due) {
      try {
        const ok = await sendSequenceEmail({ email: sub.email }, entry.step);
        if (ok) {
          await storage.advanceSubscriberStep(sub.id, entry.step);
          sent++;
        }
        // if !ok (no sender configured), leave them for a later run.
      } catch (err) {
        console.error(`[Nurture] failed to send step ${entry.step} to ${sub.email}:`, err);
        errors++;
      }
    }
  }

  if (sent > 0 || errors > 0) {
    console.log(`[Nurture] run complete — sent ${sent}, errors ${errors}`);
  }
  return { sent, errors };
}

/**
 * Schedule the daily run. Called once at server startup.
 * Runs every day at 15:00 UTC (a reasonable daytime hour for most audiences).
 */
export function startNurtureScheduler(): void {
  // minute hour day month weekday — 15:00 UTC daily
  cron.schedule("0 15 * * *", () => {
    runNurtureSequence().catch((err) =>
      console.error("[Nurture] scheduled run threw:", err),
    );
  });
  console.log("[Nurture] scheduler started — daily at 15:00 UTC.");
}
