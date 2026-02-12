import db from "../../config/db.js";

export const addService = (req, res) => {
  const { service_name, slug ,description } = req.body;

  if (!service_name || !slug || !description) {
    return res.status(400).json({
      success: false,
      message: "Service name, slug, and description are required ❌",
    });
  }

  db.query(
    `INSERT INTO services (service_name, slug, description)
     VALUES (?, ?, ?)`,
    [service_name, slug, description],
    (err, result) => {
      if (err) {
        console.error("Add Service Error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to add service ❌",
        });
      }

      res.json({
        success: true,
        message: "Service Added Successfully ✅",
        id: result.insertId,
      });
    },
  );
};

export const getActiveServices = (req, res) => {
  db.query(
    `SELECT * FROM services WHERE is_active=1 ORDER BY id DESC`,
    (err, rows) => {
      if (err) {
        console.error("Get Active Services Error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch active services ❌",
        });
      }

      res.json({
        success: true,
        data: rows,
      });
    },
  );
};

export const getInactiveServices = (req, res) => {
  db.query(
    `SELECT * FROM services WHERE is_active=0 ORDER BY id DESC`,
    (err, rows) => {
      if (err) {
        console.error("Get Inactive Services Error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch inactive services ❌",
        });
      }

      res.json({
        success: true,
        data: rows,
      });
    },
  );
};

export const updateService = (req, res) => {
  const { id } = req.params;
  const { service_name, slug, description } = req.body;

  db.query(
    `UPDATE services SET service_name=?, slug=?, description=? WHERE id=?`,
    [service_name, slug, description, id],
    (err) => {
      if (err) {
        console.error("Update Service Error:", err);
        return res.status(500).json({
          success: false,
          message: "Service Update Failed ❌",
        });
      }

      res.json({
        success: true,
        message: "Service Updated Successfully ✅",
      });
    },
  );
};

export const updateServiceStatus = (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  db.query(
    `UPDATE services SET is_active=? WHERE id=?`,
    [is_active, id],
    (err) => {
      if (err) {
        console.error("Service Status Error:", err);
        return res.status(500).json({
          success: false,
          message: "Status Update Failed ❌",
        });
      }

      res.json({
        success: true,
        message: "Service Status Updated ✅",
      });
    },
  );
};

export const deleteService = (req, res) => {
  const { id } = req.params;

  db.query(`DELETE FROM services WHERE id=?`, [id], (err) => {
    if (err) {
      console.error("Delete Service Error:", err);
      return res.status(500).json({
        success: false,
        message: "Service Delete Failed ❌",
      });
    }

    res.json({
      success: true,
      message: "Service Deleted Successfully ✅",
    });
  });
};

export const getServiceById = (req, res) => {
  const { id } = req.params;

  db.query(`SELECT * FROM services WHERE id=?`, [id], (err, rows) => {
    if (err) {
      console.error("Get Service By ID Error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch service ❌",
      });
    }

    // ✅ If Service Not Found
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found ❌",
      });
    }

    res.json({
      success: true,
      data: rows[0], // ✅ return single object
    });
  });
};



export default {
  addService,
  getActiveServices,
  getInactiveServices,
  updateService,
  updateServiceStatus,
  deleteService,getServiceById
};
