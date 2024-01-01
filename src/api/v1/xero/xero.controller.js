const { XeroClient } = require('xero-node');
const catchAsync = require('../../../utils/catchAsync');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirectUrl = process.env.REDIRECT_URI;
const scopes = 'openid profile email accounting.settings accounting.reports.read accounting.journals.read accounting.contacts accounting.attachments accounting.transactions offline_access';

const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(' '),
});

if (!client_id || !client_secret || !redirectUrl) {
    throw Error('Environment Variables not all set - please check your .env file in the project root or create one!')
}

exports.CreateXeroConnectUrl = catchAsync(async (req, res, next) => {
    const consentUrl = await xero.buildConsentUrl();
    res.send({
        message: "Success",
        url: consentUrl
    });
})

exports.xeroCallBack = catchAsync(async (req, res, next) => {
    const { code, session_state } = req.query;

    if (!code || !session_state) return res.status(400).send({ message: 'code and session_state are required.' })

    const tokenSet = await xero.apiCallback(`/callback?code=${code}&scope=${scopes}&session_state=${session_state}`);
    await xero.updateTenants();

    res.send({
        message: "Success",
        data: { ...tokenSet, activeTenant: xero.tenants[0] }
    });

})