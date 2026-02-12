import db from "../config/db.js";
import mailTransporter from "../config/Mail.js";

export const getContactPageInfo = (req, res) => {
  const sql = "SELECT * FROM contact_page_info WHERE is_active = 1 LIMIT 1";

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error! Please try again later.",
        error: err.message, // optional, can remove in production
      });
    }

    // If no data
    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No data found",
        data: null,
      });
    }

    // If data found
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: rows[0],
    });
  });
};

export const updateContactPageInfo = (req, res) => {
  const { title, description, address, phone, email, is_active } = req.body;

  const fields = [];
  const values = [];

  if (title !== undefined) (fields.push("title=?"), values.push(title));
  if (description !== undefined)
    (fields.push("description=?"), values.push(description));
  if (address !== undefined) (fields.push("address=?"), values.push(address));
  if (phone !== undefined) (fields.push("phone=?"), values.push(phone));
  if (email !== undefined) (fields.push("email=?"), values.push(email));
  if (is_active !== undefined)
    (fields.push("is_active=?"), values.push(is_active));

  // If no fields provided
  if (fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields provided to update",
    });
  }

  const sql = `UPDATE contact_page_info SET ${fields.join(", ")} WHERE id = 1`;

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error! Unable to update contact page.",
        error: err.message, // optional - remove in production
      });
    }

    // If nothing updated (optional)
    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: false,
        message: "No record found to update",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact page updated successfully",
    });
  });
};

export const submitContactForm = (req, res) => {
  const { name, email, phone, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, Email and Message are required fields.",
    });
  }

  const insertSql = `
    INSERT INTO contact_messages (name, email, phone, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertSql, [name, email, phone || null, message], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to submit contact form due to database error.",
        error: err.message, // optional
      });
    }

    // Fetch recipient emails
    const fetchEmails =
      "SELECT email FROM contact_us_emails WHERE is_active = 1";

    db.query(fetchEmails, async (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch recipient emails.",
          error: err.message,
        });
      }

      // Send email to recipients (non-blocking)
      if (rows && rows.length > 0) {
        const toEmails = rows.map((r) => r.email).join(",");

        try {
          await mailTransporter.sendMail({
            from: `"Contact Us" <${process.env.MAIL_USER}>`,
            to: toEmails,
            replyTo: email,
            subject: "New Contact Message Received",
            html: `
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "-"}</p>
              <p><strong>Message:</strong><br/>${message}</p>
            `,
          });
        } catch (mailErr) {
          console.error("Mail sending failed:", mailErr);
          // We don't fail API here if mail fails
        }
      }

      // Final API response
      return res.status(200).json({
        success: true,
        message: "Your message has been submitted successfully.",
      });
    });
  });
};

export const getContactMessages = (req, res) => {
  const sql = "SELECT * FROM contact_messages ORDER BY created_at DESC";

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while fetching contact messages.",
        error: err.message, // optional
      });
    }

    // No data case
    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No contact messages found.",
        data: [],
      });
    }

    // Successful fetch
    return res.status(200).json({
      success: true,
      message: "Contact messages fetched successfully.",
      data: rows,
    });
  });
};
export const deleteContactMessage = (req, res) => {
  const { id } = req.params;

  // Validate id
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Message ID is required.",
    });
  }

  const sql = "DELETE FROM contact_messages WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while deleting message.",
        error: err.message, // optional
      });
    }

    // If no record deleted (non-existent ID)
    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: false,
        message: "No message found with this ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  });
};

export const addContactEmail = (req, res) => {
  const { email } = req.body;

  // Validation
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  // Optional: check for duplicate email
  const checkSql = "SELECT id FROM contact_us_emails WHERE email = ?";
  db.query(checkSql, [email], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while checking email.",
        error: err.message,
      });
    }

    if (rows && rows.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const insertSql = "INSERT INTO contact_us_emails (email) VALUES (?)";

    db.query(insertSql, [email], (err2, result) => {
      if (err2) {
        return res.status(500).json({
          success: false,
          message: "Failed to add contact email due to database error.",
          error: err2.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Email added successfully.",
      });
    });
  });
};

export const getContactEmails = (req, res) => { 
  const sql =
    "SELECT * FROM contact_us_emails WHERE is_active = 1 ORDER BY id DESC";

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while fetching contact emails.",
        error: err.message,
      });
    }

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active contact emails found.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Active contact emails fetched successfully.",
      data: rows,
    });
  });
};

export const updateContactEmailStatus = (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  // Validate ID
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Email ID is required.",
    });
  }

  // Validate is_active (must be 0 or 1)
  if (
    is_active !== 0 &&
    is_active !== 1 &&
    is_active !== "0" &&
    is_active !== "1"
  ) {
    return res.status(400).json({
      success: false,
      message: "is_active must be 0 or 1.",
    });
  }

  const sql = "UPDATE contact_us_emails SET is_active = ? WHERE id = ?";

  db.query(sql, [Number(is_active), id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while updating email status.",
        error: err.message, // optional
      });
    }

    // Not found
    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: false,
        message: "No contact email found with this ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact email status updated successfully.",
    });
  });
};

export const deleteContactEmail = (req, res) => {
  const { id } = req.params;

  // Validate
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Email ID is required.",
    });
  }

  const sql = "DELETE FROM contact_us_emails WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while deleting contact email.",
        error: err.message, // optional
      });
    }

    // If no record found to delete
    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: false,
        message: "No contact email found with this ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact email deleted successfully.",
    });
  });
};

export const getContactFaqSection = (req, res) => {
  const sql = "SELECT * FROM contact_faq_section WHERE is_active = 1 LIMIT 1";

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while fetching FAQ section.",
        error: err.message, // optional
      });
    }

    // No active entry found
    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No FAQ section data found.",
        data: null,
      });
    }

    // Successful fetch
    return res.status(200).json({
      success: true,
      message: "FAQ section fetched successfully.",
      data: rows[0],
    });
  });
};

export const updateContactFaqSection = (req, res) => {
  const { title, subtitle } = req.body;

  // Validation
  if (!title || !subtitle) {
    return res.status(400).json({
      success: false,
      message: "Title and Subtitle are required.",
    });
  }

  const sql = "UPDATE contact_faq_section SET title=?, subtitle=? WHERE id=1";

  db.query(sql, [title, subtitle], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while updating FAQ section.",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: false,
        message: "FAQ section not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ section updated successfully.",
    });
  });
};

export const addContactFaq = (req, res) => {
  const { question, answer } = req.body;

  // Validation
  if (!question || !answer) {
    return res.status(400).json({
      success: false,
      message: "Question and Answer are required.",
    });
  }

  const sql = "INSERT INTO contact_faqs (question, answer) VALUES (?, ?)";

  db.query(sql, [question, answer], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while adding FAQ.",
        error: err.message, // optional
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ added successfully.",
      inserted_id: result.insertId,
    });
  });
};

export const getActiveContactFaqs = (req, res) => {
  db.query("SELECT * FROM contact_faqs WHERE is_active=1", (_, rows) =>
    res.json({ success: true, data: rows }),
  );
};

export const getInactiveContactFaqs = (req, res) => {
  const sql = "SELECT * FROM contact_faqs WHERE is_active = 0 ORDER BY id DESC";

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while fetching inactive FAQs.",
        error: err.message, // optional
      });
    }

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No inactive FAQs found.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inactive FAQs fetched successfully.",
      data: rows,
    });
  });
};

export const updateContactFaqStatus = (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  // Validate ID
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "FAQ ID is required.",
    });
  }

  // Validate is_active (must be 0 or 1)
  if (
    is_active !== 0 &&
    is_active !== 1 &&
    is_active !== "0" &&
    is_active !== "1"
  ) {
    return res.status(400).json({
      success: false,
      message: "is_active must be 0 or 1.",
    });
  }

  const sql = "UPDATE contact_faqs SET is_active = ? WHERE id = ?";

  db.query(sql, [Number(is_active), id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while updating FAQ status.",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ status updated successfully.",
    });
  });
};

export const deleteContactFaq = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "FAQ ID is required.",
    });
  }

  const sql = "DELETE FROM contact_faqs WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while deleting FAQ.",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully.",
    });
  });
};

export default {
  getContactPageInfo,
  updateContactPageInfo,
  submitContactForm,
  getContactMessages,
  deleteContactMessage,
  getContactEmails,
  addContactEmail,
  updateContactEmailStatus,
  deleteContactEmail,
  getContactFaqSection,
  updateContactFaqSection,
  addContactFaq,
  getActiveContactFaqs,
  getInactiveContactFaqs,
  updateContactFaqStatus,
  deleteContactFaq,
};
