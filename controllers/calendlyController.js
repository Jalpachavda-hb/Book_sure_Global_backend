// import axios from "axios";
// import db from "../config/db.js";
// import cron from "node-cron";

// const CALENDLY_TOKEN = process.env.CALENDLY_PAT;

// /* ================================
//    🔹 INTERNAL SYNC FUNCTION
// ================================ */

// // const syncCalendlyEventsInternal = async () => {
// //   try {
// //     const userRes = await axios.get("https://api.calendly.com/users/me", {
// //       headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
// //     });

// //     const userUri = userRes.data.resource.uri;

// //     let nextPage = `https://api.calendly.com/scheduled_events?user=${userUri}&status=active`;

// //     while (nextPage) {
// //       const eventsRes = await axios.get(nextPage, {
// //         headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
// //       });

// //       const events = eventsRes.data.collection;

// //       for (let event of events) {
// //         const eventId = event.uri.split("/").pop();
// //         console.log("EVENT START FROM CALENDLY:", event.start_time);
// //         const inviteeRes = await axios.get(
// //           `https://api.calendly.com/scheduled_events/${eventId}/invitees`,
// //           {
// //             headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
// //           },
// //         );

// //         const invitees = inviteeRes.data.collection;

// //         if (!invitees || invitees.length === 0) continue;

// //         const invitee = invitees[0];

// //       await db.promise().query(
// //   `INSERT INTO calendly_events
// //    (calendly_event_id, invitee_name, invitee_email, event_start, event_end, timezone, status)
// //    VALUES (?, ?, ?, ?, ?, ?, ?)
// //    ON DUPLICATE KEY UPDATE
// //    invitee_name = VALUES(invitee_name),
// //    invitee_email = VALUES(invitee_email),
// //    event_start = VALUES(event_start),
// //    event_end = VALUES(event_end),
// //    timezone = VALUES(timezone),
// //    status = VALUES(status)`,
// //   [
// //     eventId,
// //     invitee.name,
// //     invitee.email,
// //     event.start_time,   // ✅ store raw UTC
// //     event.end_time,     // ✅ store raw UTC
// //     invitee.timezone || "UTC",
// //     event.status,
// //   ]
// // );
// //       }

// //       nextPage = eventsRes.data.pagination.next_page;
// //     }

// //     console.log("Calendly auto sync completed");
// //   } catch (error) {
// //     console.error("Cron Sync Error:", error.message);
// //   }
// // };

// const syncCalendlyEventsInternal = async () => {
//   try {
//     const userRes = await axios.get("https://api.calendly.com/users/me", {
//       headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
//     });

//     const userUri = userRes.data.resource.uri;

//     let nextPage = `https://api.calendly.com/scheduled_events?user=${userUri}&status=active`;

//     while (nextPage) {
//       const eventsRes = await axios.get(nextPage, {
//         headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
//       });

//       const events = eventsRes.data.collection;

//       for (let event of events) {
//         const eventId = event.uri.split("/").pop();

//         // Log raw Calendly data
//         console.log("📥 RAW FROM CALENDLY:", {
//           eventId,
//           start_time: event.start_time,
//           end_time: event.end_time,
//         });

//         const inviteeRes = await axios.get(
//           `https://api.calendly.com/scheduled_events/${eventId}/invitees`,
//           {
//             headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
//           },
//         );

//         const invitees = inviteeRes.data.collection;
//         if (!invitees || invitees.length === 0) continue;

//         const invitee = invitees[0];

//         // Store exactly as received
//         await db.promise().query(
//           `INSERT INTO calendly_events 
//            (calendly_event_id, invitee_name, invitee_email, event_start, event_end, timezone, status)
//            VALUES (?, ?, ?, ?, ?, ?, ?)
//            ON DUPLICATE KEY UPDATE
//            invitee_name = VALUES(invitee_name),
//            invitee_email = VALUES(invitee_email),
//            event_start = VALUES(event_start),
//            event_end = VALUES(event_end),
//            timezone = VALUES(timezone),
//            status = VALUES(status)`,
//           [
//             eventId,
//             invitee.name,
//             invitee.email,
//             event.start_time, // Store exactly "2026-02-18T03:30:00.000000Z"
//             event.end_time, // Store exactly "2026-02-18T04:00:00.000000Z"
//             invitee.timezone || "UTC",
//             event.status,
//           ],
//         );

//         // Verify what was stored
//         const [stored] = await db
//           .promise()
//           .query(
//             "SELECT event_start, event_end FROM calendly_events WHERE calendly_event_id = ?",
//             [eventId],
//           );

//         console.log("💾 STORED IN DB:", {
//           eventId,
//           stored_start: stored[0]?.event_start,
//           stored_end: stored[0]?.event_end,
//           match: stored[0]?.event_start === event.start_time ? "✅" : "❌",
//         });
//       }

//       nextPage = eventsRes.data.pagination.next_page;
//     }

//     console.log("✅ Calendly auto sync completed");
//   } catch (error) {
//     console.error("❌ Cron Sync Error:", error.message);
//   }
// };

// /* ================================
//    🔹 CRON JOB (Every 5 Minutes)
// ================================ */

// cron.schedule("*/5 * * * *", async () => {
//   console.log("Auto syncing Calendly...");
//   await syncCalendlyEventsInternal();
// });

// export const syncCalendlyEvents = async (req, res) => {
//   try {
//     await syncCalendlyEventsInternal();

//     res.json({
//       success: true,
//       message: "Calendly events synced successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getCalendlyEvents = async (req, res) => {
//   try {
//     const [rows] = await db.promise().query(`
//       SELECT 
//         id,
//         calendly_event_id,
//         invitee_name,
//         invitee_email,
//         event_start,
//         event_end,
//         status,
//         timezone,
//         created_at
//       FROM calendly_events
//       ORDER BY event_start DESC
//     `);

//     res.json({
//       success: true,
//       data: rows,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//       data: [],
//     });
//   }
// };

// export const getTodayActiveMeetings = async (req, res) => {
//   try {
//     const now = new Date();

//     // Get today's date in UTC
//     const todayUTC = new Date(
//       Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
//     );

//     const todayStr = todayUTC.toISOString().split("T")[0];

//     console.log("🔍 Searching for meetings on UTC date:", todayStr);

//     const [rows] = await db.promise().query(
//       `
//       SELECT 
//         id,
//         calendly_event_id,
//         invitee_name,
//         invitee_email,
//         event_start,
//         event_end,
//         status,
//         timezone,
//         created_at
//       FROM calendly_events
//       WHERE status = 'active'
//       AND DATE(event_start) = ?
//       ORDER BY event_start ASC
//       `,
//       [todayStr],
//     );

//     console.log(`📊 Found ${rows.length} meetings for today:`);
//     rows.forEach((row) => {
//       console.log(`  - ${row.invitee_name}: ${row.event_start}`);
//     });

//     res.json({
//       success: true,
//       data: rows,
//       debug: {
//         queryDate: todayStr,
//         serverTime: new Date().toISOString(),
//         count: rows.length,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error in getTodayActiveMeetings:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//       data: [],
//     });
//   }
// };



import axios from "axios";
import db from "../config/db.js";
import cron from "node-cron";

const CALENDLY_TOKEN = process.env.CALENDLY_PAT;

/* ================================
   🔹 INTERNAL SYNC FUNCTION
================================ */

const syncCalendlyEventsInternal = async () => {
  try {
    const userRes = await axios.get("https://api.calendly.com/users/me", {
      headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
    });

    const userUri = userRes.data.resource.uri;

    let nextPage = `https://api.calendly.com/scheduled_events?user=${userUri}&status=active`;

    while (nextPage) {
      const eventsRes = await axios.get(nextPage, {
        headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
      });

      const events = eventsRes.data.collection;

      for (let event of events) {
        const eventId = event.uri.split("/").pop();

        // Normalize to ISO UTC
        const startUTC = new Date(event.start_time).toISOString();
        const endUTC = new Date(event.end_time).toISOString();

        console.log("📥 RAW FROM CALENDLY:", {
          eventId,
          start_time: startUTC,
          end_time: endUTC,
        });

        const inviteeRes = await axios.get(
          `https://api.calendly.com/scheduled_events/${eventId}/invitees`,
          {
            headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
          },
        );

        const invitees = inviteeRes.data.collection;
        if (!invitees || invitees.length === 0) continue;

        const invitee = invitees[0];

        await db.promise().query(
          `INSERT INTO calendly_events 
           (calendly_event_id, invitee_name, invitee_email, event_start, event_end, timezone, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           invitee_name = VALUES(invitee_name),
           invitee_email = VALUES(invitee_email),
           event_start = VALUES(event_start),
           event_end = VALUES(event_end),
           timezone = VALUES(timezone),
           status = VALUES(status)`,
          [
            eventId,
            invitee.name,
            invitee.email,
            startUTC,
            endUTC,
            invitee.timezone || "UTC",
            event.status,
          ],
        );

        // Fetch stored value
        const [stored] = await db
          .promise()
          .query(
            "SELECT event_start, event_end FROM calendly_events WHERE calendly_event_id = ?",
            [eventId],
          );

        if (stored.length > 0) {
          const dbStart = new Date(stored[0].event_start).getTime();
          const calStart = new Date(startUTC).getTime();

          console.log("💾 STORED IN DB:", {
            eventId,
            stored_start: stored[0].event_start,
            stored_end: stored[0].event_end,
            match: dbStart === calStart ? "✅" : "❌",
          });
        }
      }

      nextPage = eventsRes.data.pagination.next_page;
    }

    console.log("✅ Calendly auto sync completed");
  } catch (error) {
    console.error("❌ Cron Sync Error:", error.message);
  }
};

/* ================================
   🔹 CRON JOB (Every 5 Minutes)
================================ */

cron.schedule("*/5 * * * *", async () => {
  console.log("🔄 Auto syncing Calendly...");
  await syncCalendlyEventsInternal();
});

/* ================================
   🔹 MANUAL SYNC API
================================ */

export const syncCalendlyEvents = async (req, res) => {
  try {
    await syncCalendlyEventsInternal();

    res.json({
      success: true,
      message: "Calendly events synced successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   🔹 GET ALL EVENTS
================================ */

export const getCalendlyEvents = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        id,
        calendly_event_id,
        invitee_name,
        invitee_email,
        event_start,
        event_end,
        status,
        timezone,
        created_at
      FROM calendly_events
      ORDER BY event_start DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

/* ================================
   🔹 GET TODAY ACTIVE MEETINGS (UTC SAFE)
================================ */

export const getTodayActiveMeetings = async (req, res) => {
  try {
    const now = new Date();

    const todayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1);

    const todayISO = todayUTC.toISOString();
    const tomorrowISO = tomorrowUTC.toISOString();

    console.log("🔍 Searching meetings between:", todayISO, "AND", tomorrowISO);

    const [rows] = await db.promise().query(
      `
      SELECT 
        id,
        calendly_event_id,
        invitee_name,
        invitee_email,
        event_start,
        event_end,
        status,
        timezone,
        created_at
      FROM calendly_events
      WHERE status = 'active'
      AND event_start >= ?
      AND event_start < ?
      ORDER BY event_start ASC
      `,
      [todayISO, tomorrowISO],
    );

    console.log(`📊 Found ${rows.length} meetings for today`);

    res.json({
      success: true,
      data: rows,
      debug: {
        from: todayISO,
        to: tomorrowISO,
        serverTime: new Date().toISOString(),
        count: rows.length,
      },
    });
  } catch (error) {
    console.error("❌ Error in getTodayActiveMeetings:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};