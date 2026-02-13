import db from "../../config/db.js";
const CLIENT_URL = process.env.CLIENT_URL || "https://booksureglobal.com";

export const getWhyChooseUs = (req, res) => {
  const sql = `SELECT * FROM whychosseusmaster LIMIT 1`;

  db.query(sql, (err, rows) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Database error ❌",
      });

    if (!rows.length)
      return res.json({
        success: false,
        message: "Data Not Found ❌",
      });

    const data = rows[0];

    data.speciality_list = JSON.parse(data.speciality_list || "[]");

data.whychosseus_image = data.whychosseus_image
  ? `${CLIENT_URL}/uploads/whychosseus/${data.whychosseus_image}`
  : null;

    res.json({
      success: true,
      data,
    });
  });
};

export const updateWhyChooseUs = (req, res) => {
  const {
    section_title,
    section_subtitle,
    content_title,
    content_para,
    speciality_list,
  } = req.body;

  /* ✅ Image */
  const newImage = req.file?.filename || null;

  /* ✅ Convert speciality_list safely */
  let specialityArray = [];

  try {
    specialityArray = JSON.parse(speciality_list || "[]");
  } catch (error) {
    specialityArray = [];
  }

  const sql = `
    UPDATE whychosseusmaster SET
      section_title=?,
      section_subtitle=?,
      content_title=?,
      content_para=?,
      speciality_list=?,
      whychosseus_image = COALESCE(?, whychosseus_image)
    WHERE id=1
  `;

  db.query(
    sql,
    [
      section_title,
      section_subtitle,
      content_title,
      content_para,
      JSON.stringify(specialityArray),
      newImage,
    ],
    (err) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Update Failed ❌",
        });

      res.json({
        success: true,
        message: "Updated Successfully ✅",
      });
    },
  );
};
export default {
  getWhyChooseUs,
  updateWhyChooseUs,
};
