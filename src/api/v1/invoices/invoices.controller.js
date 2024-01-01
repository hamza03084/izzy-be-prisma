const { default: axios } = require("axios")
const catchAsync = require("../../../utils/catchAsync")

const XERO_URL = process.env.XERO_BASE_URL

exports.getAllInvoices = catchAsync(async(req,res,next)=>{

    const {XeroTenantId,XeroToken} = req.query;
    if(!XeroTenantId,!XeroToken) return res.status(401).send({message:"XeroTenantId and XeroToken are required."})

    const {data} = await axios.get(`${XERO_URL}/invoices`,{
        headers: {
            'Authorization': `Bearer ${XeroToken}`,
            'Xero-tenant-id': XeroTenantId
        }
    })

    res.send({message:"Success.",data:data.Invoices})
})