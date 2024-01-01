const express = require("express")
const { getAllInvoices } = require("./invoices.controller")

const router = express.Router()

router.route("/").get(getAllInvoices)

module.exports = router
