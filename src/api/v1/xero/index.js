const express = require("express")
const { CreateXeroConnectUrl,xeroCallBack } = require("./xero.controller")

const router = express.Router()

router.route("/connect-url").get(CreateXeroConnectUrl)
router.route("/callback").get(xeroCallBack)

module.exports = router