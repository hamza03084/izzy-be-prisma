const express = require("express");
const {
  createChaserTemplate,
  deleteChaserTemplate,
  getChaserTemplates,
  updateChaserTemplate,
  getChaseTemplateById,
} = require("./chaserTemplate.controller");
const router = express.Router();
router.route("/").get(getChaserTemplates).post(createChaserTemplate);
router
  .route("/:id")
  .put(updateChaserTemplate)
  .delete(deleteChaserTemplate)
  .get(getChaseTemplateById);
module.exports = router;
