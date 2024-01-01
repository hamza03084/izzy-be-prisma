const express = require("express");
const {
  createEmailChaser,
  deleteEmailChaser,
  updateEmailChaser,
  getEmailChaserById,
  copyEmailChaser,
  createChaserTest,
  getEmailChasersByTemplateId,
} = require("./emailChaser.controller");

const router = express.Router();
router.route("/").get(getEmailChasersByTemplateId).post(createEmailChaser);
router.route("/:id/copy").put(copyEmailChaser);
router.route("/test-chaser").post(createChaserTest);


router
  .route("/:id")
  .put(updateEmailChaser)
  .delete(deleteEmailChaser)
  .get(getEmailChaserById);
module.exports = router;
