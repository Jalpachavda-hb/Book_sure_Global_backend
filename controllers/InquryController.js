import db from "../config/db.js";
import mailTransporter from "../config/Mail.js";

export const submitPricingInquiry = (req, res) => {
  const { plan, name, phone, email, message } = req.body;

  if (!plan || !name || !phone || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // 1️⃣ Save inquiry
  db.query(
    `INSERT INTO pricing_inquiries
     (pricing_model, name, phone, email, message)
     VALUES (?, ?, ?, ?, ?)`,
    [plan, name, phone, email, message],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to submit inquiry",
        });
      }

      // 2️⃣ Fetch admin emails
      db.query(
        "SELECT email FROM pricing_inquiry_emails WHERE is_active = 1",
        async (err, rows) => {
          if (err || !rows.length) {
            return res.json({
              success: true,
              message: "Inquiry submitted successfully",
            });
          }

          const adminEmails = rows.map((r) => r.email);

          try {
            // 3️⃣ Send mail from SERVER to ADMINS
            await mailTransporter.sendMail({
              from: `"Pricing Inquiry" <${process.env.MAIL_USER}>`,
              to: adminEmails.join(","), // ✅ ALL DB EMAILS
              replyTo: email, // ✅ reply goes to user
              subject: `New Pricing Inquiry – ${plan}`,
              html: `
                <h3>New Pricing Inquiry</h3>
                <p><strong>Plan:</strong> ${plan}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong><br/>${message}</p>
              `,
            });
          } catch (mailErr) {
            console.error("Mail failed:", mailErr);
          }

          res.json({
            success: true,
            message: "Inquiry submitted successfully",
          });
        },
      );
    },
  );
};
export const getPricingInquiries = (req, res) => {
  const sql = `
    SELECT *
    FROM pricing_inquiries
   
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error while fetching active inquiries.",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows,
    });
  });
};

export const addInquiryEmail = (req, res) => {
  const { email, created_by } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  db.query(
    `INSERT INTO pricing_inquiry_emails (email, created_by)
     VALUES (?, ?)`,
    [email, created_by || null],
    () =>
      res.json({
        success: true,
        message: "Email added successfully",
      }),
  );
};

export const getInquiryEmails = (req, res) => {
  db.query(
    "SELECT * FROM pricing_inquiry_emails WHERE is_active = 1 ORDER BY id DESC",
    (err, rows) => {
      res.json({
        success: true,
        data: rows,
      });
    },
  );
};

export const updateInquiryEmail = (req, res) => {
  const { email, updated_by } = req.body;

  db.query(
    `UPDATE pricing_inquiry_emails
     SET email=?, updated_by=?
     WHERE id=?`,
    [email, updated_by || null, req.params.id],
    () =>
      res.json({
        success: true,
        message: "Email updated successfully",
      }),
  );
};

export const deleteInquiryEmail = (req, res) => {
  db.query(
    "DELETE FROM pricing_inquiry_emails WHERE id=?",
    [req.params.id],
    () =>
      res.json({
        success: true,
        message: "Email deleted successfully",
      }),
  );
};

export const updateInquiryEmailStatus = (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  /* ✅ Validate ID */
  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Valid Email ID is required.",
    });
  }

  /* ✅ Validate is_active */
  if (is_active === undefined || is_active === null) {
    return res.status(400).json({
      success: false,
      message: "is_active value is required (0 or 1).",
    });
  }

  const activeValue = Number(is_active);

  if (activeValue !== 0 && activeValue !== 1) {
    return res.status(400).json({
      success: false,
      message: "is_active must be either 0 or 1.",
    });
  }

  /* ✅ SQL Query */
  const sql = `
    UPDATE pricing_inquiry_emails 
    SET is_active = ? 
    WHERE id = ?
  `;

  db.query(sql, [activeValue, id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error while updating email status.",
      });
    }

    /* ✅ If Email Not Found */
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "No contact email found with this ID.",
      });
    }

    /* ✅ Success Response */
    return res.status(200).json({
      success: true,
      message:
        activeValue === 0
          ? "Email deleted successfully ✅"
          : "Email activated successfully ✅",
    });
  });
};

export default {
  submitPricingInquiry,
  getPricingInquiries,
  addInquiryEmail,
  getInquiryEmails,
  updateInquiryEmail,
  deleteInquiryEmail,
  updateInquiryEmailStatus,
};
