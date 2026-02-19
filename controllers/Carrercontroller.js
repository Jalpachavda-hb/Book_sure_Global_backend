import db from "../config/db.js";
import mailTransporter from "../config/Mail.js";
import path from "path";
export const submitCareerApplication = (req, res) => {
  const { full_name, position, email, phone } = req.body || {};

  const resume = req.file ? req.file.filename : null;

  // ✅ Validation
  if (!full_name || !position || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be filled",
    });
  }

  // 1️⃣ Save application
  db.query(
    `INSERT INTO career_applications  
     (full_name, position, email, phone, resume)
     VALUES (?,?,?,?,?)`,
    [full_name, position, email, phone, resume],
    (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to submit application",
        });
      }

      // 2️⃣ Fetch active HR emails
      db.query(
        "SELECT email FROM career_emails WHERE is_active = 1",
        async (err, rows) => {
          if (err) {
            console.error("Email fetch error:", err);
            return res.json({
              success: true,
              message: "Application saved (email fetch error)",
            });
          }

          // ✅ SAME WORKING PATTERN AS INQUIRY
          const adminEmails = (rows || []).map((r) => r.email).filter(Boolean);

          if (!adminEmails.length) {
            console.warn("No active career emails found");
            return res.json({
              success: true,
              message: "Application submitted (no HR emails configured)",
            });
          }

          try {
       await mailTransporter.sendMail({
  from: `"BookSure Global - Careers" <${process.env.MAIL_USER}>`,
  to: adminEmails.join(","),
  replyTo: email,
  subject: `📄 New Job Application – ${position}`,
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 30px;">
    
    <div style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      
      <!-- Header -->
      <div style="background: #102654; padding: 22px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; letter-spacing: 0.5px;">
          New Career Application
        </h2>
      </div>

      <!-- Body -->
      <div style="padding: 30px;">
        <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
          A new candidate has submitted a job application through the website.
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 10px; font-weight: bold; width: 30%;">Full Name:</td>
            <td style="padding: 10px;">${full_name}</td>
          </tr>
          <tr style="background-color: #f9fafc;">
            <td style="padding: 10px; font-weight: bold;">Position Applied:</td>
            <td style="padding: 10px;">${position}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Email Address:</td>
            <td style="padding: 10px;">${email}</td>
          </tr>
          <tr style="background-color: #f9fafc;">
            <td style="padding: 10px; font-weight: bold;">Phone Number:</td>
            <td style="padding: 10px;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Resume:</td>
            <td style="padding: 10px;">
              ${resume ? "Attached with this email." : "No resume uploaded."}
            </td>
          </tr>
        </table>

        <div style="margin-top: 25px; padding: 15px; background: #f1f3f6; border-left: 4px solid #102654;">
          <p style="margin: 0; font-size: 13px; color: #666;">
            📌 Please review the candidate details and resume attachment for further evaluation.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f1f3f6; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        This email was automatically generated from the BookSure Global careers page.
        <br/>
        © ${new Date().getFullYear()} BookSure Global. All rights reserved.
      </div>

    </div>
  </div>
  `,
  attachments: resume
    ? [
        {
          filename: resume,
          path: `uploads/resume/${resume}`,
        },
      ]
    : [],
});

            console.log("Career mail sent to:", adminEmails);
          } catch (mailErr) {
            console.error("Career mail failed:", mailErr);
          }

          // 3️⃣ Always return success to user
          res.json({
            success: true,
            message: "Application submitted successfully",
          });
        },
      );
    },
  );
};

const addCareerEmail = (req, res) => {
  db.query(
    "INSERT INTO career_emails (email) VALUES (?)",
    [req.body.email],
    () => res.json({ success: true }),
  );
};

const getCareerEmails = (req, res) => {
  db.query("SELECT * FROM career_emails", (_, rows) =>
    res.json({ success: true, data: rows }),
  );
};

const updateCareerEmailStatus = (req, res) => {
  db.query(
    "UPDATE career_emails SET is_active=? WHERE id=?",
    [Number(req.body.is_active), req.params.id],
    () => res.json({ success: true }),
  );
};

const deleteCareerEmail = (req, res) => {
  db.query("DELETE FROM career_emails WHERE id=?", [req.params.id], () =>
    res.json({ success: true }),
  );
};

const getCareerApplications = (req, res) => {
  const REACT_BASE_URL = `${req.protocol}://${req.get("host")}`;

  db.query(
    "SELECT * FROM career_applications ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      // ✅ Attach Full Resume URL
      const updatedRows = rows.map((item) => ({
        ...item,
        resume: item.resume
          ? `${REACT_BASE_URL}/uploads/resume/${item.resume}`
          : null,
      }));

      res.json({
        success: true,
        message: "Career Applications fetched successfully ✅",
        data: updatedRows,
      });
    },
  );
};
const deleteCareerApplication = (req, res) => {
  db.query("DELETE FROM career_applications WHERE id=?", [req.params.id], () =>
    res.json({ success: true }),
  );
};

export default {
  submitCareerApplication,
  addCareerEmail,
  getCareerEmails,
  updateCareerEmailStatus,
  deleteCareerEmail,
  getCareerApplications,
  deleteCareerApplication,
};
