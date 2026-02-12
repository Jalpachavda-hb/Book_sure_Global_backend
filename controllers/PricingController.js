import db from "../config/db.js";

const getPricingSection = (req, res) => {
  db.query("SELECT * FROM pricing_section LIMIT 1", (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch pricing section",
        error: err,
      });
    }

    res.json({
      success: true,
      data: rows[0] || null,
    });
  });
};

const updatePricingSection = (req, res) => {
  const { title, subtitle, is_active, updated_by } = req.body;

  const fields = [];
  const values = [];

  if (title !== undefined) {
    fields.push("title=?");
    values.push(title);
  }

  if (subtitle !== undefined) {
    fields.push("subtitle=?");
    values.push(subtitle);
  }

  if (is_active !== undefined) {
    if (is_active !== 0 && is_active !== 1) {
      return res.status(400).json({
        success: false,
        message: "is_active must be 0 or 1",
      });
    }
    fields.push("is_active=?");
    values.push(is_active);
  }

  if (updated_by !== undefined) {
    fields.push("updated_by=?");
    values.push(updated_by);
  }

  if (!fields.length) {
    return res.status(400).json({
      success: false,
      message: "No fields provided to update",
    });
  }

  const sql = `
    UPDATE pricing_section
    SET ${fields.join(", ")}
    WHERE id = 1
  `;

  db.query(sql, values, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to update pricing section",
        error: err,
      });
    }

    res.json({
      success: true,
      message: "Pricing section updated successfully",
    });
  });
};

export const addPricingModel = (req, res) => {
  const { title, price, short_description, features, created_by } = req.body;

  if (!title || !features) {
    return res.status(400).json({
      success: false,
      message: "Title and features are required",
    });
  }

  db.query(
    `INSERT INTO pricing_models
     (title, price, short_description, features, created_by)
     VALUES (?,?,?,?,?)`,
    [
      title,
      price || 0,
      short_description || null,
      JSON.stringify(features),
      created_by || null,
    ],
    (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to add pricing model",
        });
      }

      res.status(201).json({
        success: true,
        message: "Pricing model added successfully ✅",
        id: result.insertId,
      });
    }
  );
};

export const getPricingModelById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM pricing_models WHERE id=?", [id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Pricing model not found",
      });
    }

    res.json({
      success: true,
      data: {
        ...rows[0],
        price: rows[0].price, // ✅ Included
        features: JSON.parse(rows[0].features),
      },
    });
  });
};
export const updatePricingModelById = (req, res) => {
  const { id } = req.params;

  const {
    title,
    price, // ✅ NEW
    short_description,
    features,
    button_text,
    button_link,
    is_featured,
    is_active,
    updated_by,
  } = req.body;

  const fields = [];
  const values = [];

  if (title !== undefined) (fields.push("title=?"), values.push(title));

  if (price !== undefined)
    // ✅ NEW
    (fields.push("price=?"), values.push(price));

  if (short_description !== undefined)
    (fields.push("short_description=?"), values.push(short_description));

  if (features !== undefined)
    (fields.push("features=?"), values.push(JSON.stringify(features)));

  if (button_text !== undefined)
    (fields.push("button_text=?"), values.push(button_text));

  if (button_link !== undefined)
    (fields.push("button_link=?"), values.push(button_link));

  if (is_featured !== undefined)
    (fields.push("is_featured=?"), values.push(is_featured));

  if (is_active !== undefined)
    (fields.push("is_active=?"), values.push(is_active));

  if (updated_by !== undefined)
    (fields.push("updated_by=?"), values.push(updated_by));

  if (!fields.length) {
    return res.status(400).json({
      success: false,
      message: "No fields provided to update",
    });
  }

  db.query(
    `UPDATE pricing_models SET ${fields.join(", ")} WHERE id=?`,
    [...values, id],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err });

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Pricing model not found",
        });
      }

      res.json({
        success: true,
        message: "Pricing model updated successfully",
      });
    },
  );
};

export const updatePricingModelStatus = (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (is_active !== 0 && is_active !== 1) {
    return res.status(400).json({
      success: false,
      message: "is_active must be 0 or 1",
    });
  }

  db.query(
    "UPDATE pricing_models SET is_active=? WHERE id=?",
    [is_active, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: err });
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Pricing model not found",
        });
      }

      res.json({
        success: true,
        message: "Pricing model status updated",
      });
    },
  );
};
export const getActivePricingModels = (req, res) => {
  db.query(
    "SELECT * FROM pricing_models WHERE is_active=1 ORDER BY id",
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: err });

      res.json({
        success: true,
        data: rows.map((r) => ({
          ...r,
          price: r.price, // ✅ Included
          features: JSON.parse(r.features),
        })),
      });
    },
  );
};
export const getInactivePricingModels = (req, res) => {
  db.query(
    "SELECT * FROM pricing_models WHERE is_active=0 ORDER BY id",
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: err });

      res.json({
        success: true,
        data: rows.map((r) => ({
          ...r,
          price: r.price, // ✅ Included
          features: JSON.parse(r.features),
        })),
      });
    },
  );
};
export const deletePricingModel = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM pricing_models WHERE id=?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err });
    }

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Pricing model not found",
      });
    }

    res.json({
      success: true,
      message: "Pricing model deleted successfully",
    });
  });
};
export const getPricingModelTitles = (req, res) => {
  db.query(
    "SELECT id, title, price FROM pricing_models ORDER BY id",
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch pricing model titles",
          error: err,
        });
      }

      res.json({
        success: true,
        data: rows,
      });
    },
  );
};

// ==================inquery===============

export default {
  getPricingSection,
  getPricingModelTitles,
  deletePricingModel,
  getInactivePricingModels,
  getActivePricingModels,
  updatePricingModelStatus,
  updatePricingSection,
  updatePricingModelById,
  addPricingModel,
  getPricingModelById,
};
