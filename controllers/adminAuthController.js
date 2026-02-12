import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const addAdmin = async (req, res) => {
  const { name, email, contact_number, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO admins (name, email, contact_number, password)
    VALUES (?,?,?,?)
  `;

  db.query(sql, [name, email, contact_number, hashedPassword], (err) => {
    if (err) return res.status(500).json(err);
    res.json({
      success: true,
      message: "Admin created successfully",
    });
  });
};

export const loginAdmin = (req, res) => {
  const { contact_number, password } = req.body;

  const sql = `
    SELECT * FROM admins
    WHERE contact_number = ?
  `;

  db.query(sql, [contact_number], async (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length)
      return res.status(401).json({ message: "Invalid credentials" });

    const admin = rows[0];

    if (admin.status === 0)
      return res.status(403).json({ message: "Admin account inactive" });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      success: true,
      message: "Admin login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        role: admin.role,
      },
    }); 
  });
};

export const getAllAdmins = (req, res) => {
  const sql = `
    SELECT id, name, email, contact_number, role, status, created_at
    FROM admins
    ORDER BY id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
export const updateAdminStatus = (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE admins SET status=? WHERE id=?",
    [status, req.params.id],
    () =>
      res.json({
        success: true,
        message: "Admin status updated",
      }),
  );
};

export const deleteUser = (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], () =>
    res.json({ success: true, message: "User deleted" }),
  );
};
export const updateAdminProfile = async (req, res) => {
  const { name, email, contact_number, password } = req.body;
  const adminId = req.params.id;

  try {
    let updateFields = [];
    let values = [];

    if (name) {
      updateFields.push("name=?");
      values.push(name);
    }

    if (email) {
      updateFields.push("email=?");
      values.push(email);
    }

    if (contact_number) {
      updateFields.push("contact_number=?");
      values.push(contact_number);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password=?");
      values.push(hashedPassword);
    }

    if (!updateFields.length) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const sql = `
      UPDATE admins SET
      ${updateFields.join(", ")}
      WHERE id = ?
    `;

    values.push(adminId);

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const { admin_id } = req.params;

    // 🔥 This line is the FIX
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, name, email, contact_number FROM admins WHERE id = ?",
        [admin_id]
      );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Get Admin By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default {
  addAdmin,
  loginAdmin,
  updateAdminStatus,
  deleteUser,
  updateAdminProfile,
  getAllAdmins,
  getAdminById,
};
