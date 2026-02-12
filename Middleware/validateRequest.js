import { body, validationResult } from "express-validator";

export const validateHeroUpdate = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("button_link")
    .optional()
    .isURL()
    .withMessage("Button link must be a valid URL"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateHomeAboutUpdate = [
  body("mainimage").optional().isString().trim(),
  body("secondimage").optional().isString().trim(),
  body("year_experience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("year_experience must be a positive number"),
  body("toptitle").optional().isString().trim(),
  body("title").optional().isString().trim(),
  body("aboutcontent").optional().isString().trim(),

  // ✅ Final validator
  (req, res, next) => {
    // Check express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Check at least one field exists
    const allowedFields = [
      "mainimage",
      "secondimage",
      "year_experience",
      "toptitle",
      "title",
      "aboutcontent",
    ];

    const hasValidField = allowedFields.some(
      (field) => req.body[field] !== undefined
    );

    if (!hasValidField) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    next();
  },
];

export const validateAddSoftware = [
  body("title").notEmpty().withMessage("Title is required").isString().trim(),

  body("subtitle").optional().isString().trim(),

  body("logo_image")
    .notEmpty()
    .withMessage("Logo image is required")
    .isString()
    .trim(),

  body("created_by")
    .notEmpty()
    .withMessage("created_by is required")
    .isInt()
    .withMessage("created_by must be a valid integer"),

  // 🔒 Final validation handler
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];



 export const validateService = (req, res, next) => {
  const title = req.body?.title;
  const short_description = req.body?.short_description;

  if (!title || !short_description) {
    return res.status(400).json({
      success: false,
      message: "Title and short description are required",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Service image is required",
    });
  }

  next();
};

 export const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid service ID",
    });
  }

  next();
};

