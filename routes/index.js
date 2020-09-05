const express = require("express"),
  router = express.Router();

/* Signature authentication must be working ;) */
router.get("/", (req, res, _next) => {
  res.json({ application_id: req.application_id, authenticated: true });
});

module.exports = router;
