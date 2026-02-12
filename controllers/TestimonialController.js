import db from "../config/db.js";

const getTestimonials = (req, res) => {
  const sql = "SELECT * FROM testimonialmastertable";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  });
};

const deleteTestimonial = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM testimonialmastertable
    WHERE TestimonialMasterId = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  });
};


const updateTestimonialStatus = (req, res) => {
  const { id } = req.params;

  // 🛡 SAFETY CHECK
  if (!req.body || typeof req.body.Is_Active === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Is_Active is required in request body",
    });
  }
  console.log("REQ BODY:", req.body);
  const { Is_Active } = req.body;

  if (Is_Active !== 0 && Is_Active !== 1) {
    return res.status(400).json({
      success: false,
      message: "Is_Active must be 0 or 1",
    });
  }

  const sql =
    "UPDATE testimonialmastertable SET Is_Active = ? WHERE TestimonialMasterId = ?";

  db.query(sql, [Is_Active, id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
    });
  });
};




const addTestimonial = (req, res) => {
  const {
    TestimonialMessage,
    TestimonialClientName,
    TestimonialClientRole,
    TestimonialCompanyName,
    TestimonialCompanyType,
    Is_Active,
    CreatedBy,
    Updated_By,
  } = req.body;

  // Validation
  if (!TestimonialMessage || !TestimonialClientName) {
    return res.status(400).json({
      success: false,
      message: "TestimonialMessage and TestimonialClientName are required",
    });
  }

  const status = Is_Active === 0 ? 0 : 1;

  const sql = `
    INSERT INTO testimonialmastertable
    (
      TestimonialMessage,
      TestimonialClientName,
      TestimonialClientRole,
      TestimonialCompanyName,
      TestimonialCompanyType,
      Is_Active,
      Created_at,
      CreatedBy,
      UpdatedOn,
      Updated_By
    )
    VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)
  `;

  const values = [
    TestimonialMessage,
    TestimonialClientName,
    TestimonialClientRole || null,
    TestimonialCompanyName || null,
    TestimonialCompanyType || null,
    status,
    CreatedBy || null,
    Updated_By || null,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.sqlMessage,
      });
    }

    res.status(201).json({
      success: true,
      message: "Testimonial added successfully",
      testimonial_id: result.insertId,
    });
  });
};

const getTestimonialById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Testimonial ID is required",
    });
  }

  const sql = `
    SELECT
      TestimonialMasterId,
      TestimonialMessage,
      TestimonialClientName,
      TestimonialClientRole,
      TestimonialCompanyName,
      TestimonialCompanyType,
      Is_Active,
      Created_at,
      CreatedBy,
      UpdatedOn,
      Updated_By
    FROM testimonialmastertable
    WHERE TestimonialMasterId = ?
    LIMIT 1
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  });
};

const getActiveTestimonials = (req, res) => {
  const sql = `
    SELECT
      TestimonialMasterId,
      TestimonialMessage,
      TestimonialClientName,
      TestimonialClientRole,
      TestimonialCompanyName,
      TestimonialCompanyType,
      Is_Active,
      Created_at,
      CreatedBy,
      UpdatedOn,
      Updated_By
    FROM testimonialmastertable
    WHERE Is_Active = 1
    ORDER BY TestimonialMasterId DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  });
};

const getInActiveTestimonials = (req, res) => {
  const sql = `
    SELECT
      TestimonialMasterId,
      TestimonialMessage,
      TestimonialClientName,
      TestimonialClientRole,
      TestimonialCompanyName,
      TestimonialCompanyType,
      Is_Active,
      Created_at,
      CreatedBy,
      UpdatedOn,
      Updated_By
    FROM testimonialmastertable
    WHERE Is_Active = 0
    ORDER BY TestimonialMasterId DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  });
};



const editTestimonial = (req, res) => {
  const { id } = req.params;

  const {
    TestimonialMessage,
    TestimonialClientName,
    TestimonialClientRole,
    TestimonialCompanyName,
    TestimonialCompanyType,
    Is_Active,
    Updated_By,
  } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Testimonial ID is required",
    });
  }

  const sql = `
    UPDATE testimonialmastertable
    SET
      TestimonialMessage      = COALESCE(?, TestimonialMessage),
      TestimonialClientName   = COALESCE(?, TestimonialClientName),
      TestimonialClientRole   = COALESCE(?, TestimonialClientRole),
      TestimonialCompanyName  = COALESCE(?, TestimonialCompanyName),
      TestimonialCompanyType  = COALESCE(?, TestimonialCompanyType),
      Is_Active               = COALESCE(?, Is_Active),
      UpdatedOn               = NOW(),
      Updated_By              = COALESCE(?, Updated_By)
    WHERE TestimonialMasterId = ?
  `;

  const values = [
    TestimonialMessage ?? null,
    TestimonialClientName ?? null,
    TestimonialClientRole ?? null,
    TestimonialCompanyName ?? null,
    TestimonialCompanyType ?? null,
    Is_Active ?? null,
    Updated_By ?? null,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.sqlMessage,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
    });
  });
};

export default {
  getTestimonials,
  deleteTestimonial,
  updateTestimonialStatus,
  addTestimonial,
  getTestimonialById,
  getActiveTestimonials,
  editTestimonial,getInActiveTestimonials
};
