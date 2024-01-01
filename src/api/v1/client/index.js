const express = require("express");
const {
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  getAllClientsByTemplateId,
} = require("./client.controller");

const router = express.Router();

router.route("/").post(createClient).get(getAllClientsByTemplateId);

router
  .route("/:clientId")
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

module.exports = router;
