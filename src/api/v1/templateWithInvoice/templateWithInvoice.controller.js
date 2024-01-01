const prisma = require("../../../prisma-client");
const catchAsync = require("../../../utils/catchAsync");
const sendEmail = require("../../../utils/email");
const validateIdFormat = require("../../../utils/validateIdFormat");

exports.createTemplateInvoice = catchAsync(async (req, res, next) => {
  const templateData = req.body.template;
  const { template, ...rest } = req.body;

  const populatedTemplate = await replacePlaceholders(templateData, req.body);
  const templateInvoice = await prisma.invoiceSchema.create({ data: rest });

  const emailTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Template</title>
    <style>
      span {
        font-size: large;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <div
      style="
        gap: 15px;
        padding: 50px 400px;
      "
    >
      <h3>Dear ${rest.customer_name || "Customer"}</h3>

      <div>
        I'm Izzy, an automated Accounts Receivable Assistant at AIME. My
        objective is to help businesses efficiently manage outstanding invoices,
        automate payment requests, resolve disputes, and optimize cash flow.
      </div>

      <div>
        Please find attached an invoice
        <span>${rest.invoice_number || "Invoice Number"}</span>
        that requires your attention.
      </div>

      <div>
        Kindly make the payment of <span>${
          rest.amount || "X amount"
        }</span> within
        <span> ${
          rest.term_days || "Term "
        } Days </span> from this email, as per our contractual
        terms.
      </div>

      <div>
        If you have any questions or need assistance, feel free to contact me
        directly at ${rest.contact_info || "Contact Information"}.
      </div>

      <div>
        Thank you for your attention. Your prompt payment is greatly
        appreciated, enabling us to maximize cash flow and maintain excellent
        service.
      </div>

      <div>
        Best regards, <br />
        Izzy
      </div>

      <span>
        Accounts Receivable Assistant, <br />
        AIME
      </span>
    </div>
  </body>
  </html>
`;
  sendEmail({
    email: rest.email,
    subject: "Template Invoice",
    message: emailTemplate,
  });
  res.status(201).json({ templateInvoice, populatedTemplate });
});
exports.getTemplateInvoices = catchAsync(async (req, res, next) => {
  const templateInvoices = await prisma.invoiceSchema.findMany({
    include: { chaser_template: true },
  });
  res.json(templateInvoices);
});

function replacePlaceholders(template, data) {
  const placeholderRegex = /\\\[([^\\\]]+)\\\]/g;
  const replacements = {
    CustomerName: data.customer_name || "Customer",
    InvoiceNumber: data.invoice_number || "Invoice Number",
    Amount: data.amount || "X amount",
    ContactInformation: data.contact_info || "Contact Information",
    TermDays: data.term_days || "Term Days",
  };

  const replacedTemplate = template.replace(
    placeholderRegex,
    (match, placeholder) => {
      return replacements.hasOwnProperty(placeholder)
        ? replacements[placeholder]
        : match;
    }
  );

  return replacedTemplate;
}
