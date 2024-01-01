const prisma = require("../../../prisma-client");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const validateIdFormat = require("../../../utils/validateIdFormat");

// CREATE a new client
exports.createClient = catchAsync(async (req, res, next) => {
  const client = await prisma.clientSchema.create({ data: req.body });
  res.status(201).json({ status: "success", client });
});

exports.getAllClientsByTemplateId = catchAsync(async (req, res, next) => {
  const { templateId } = req.query;
  if (!templateId) {
    return next(new AppError("templateId not found", 404));
  }

  validateIdFormat(templateId);
  const clients = await prisma.clientSchema.findMany({
    where: { template_id: parseInt(templateId) },
  });
  res.status(200).json({ status: "success", clients });
});

// READ a specific client by ID
exports.getClientById = catchAsync(async (req, res, next) => {
  const { clientId } = req.params;
  validateIdFormat(clientId);

  const client = await prisma.clientSchema.findUnique({
    where: { id: parseInt(clientId) },
  });

  if (!client) {
    return next(new AppError("Client not found", 404));
  }

  res.status(200).json({ status: "success", client });
});

// UPDATE a client by ID
exports.updateClient = catchAsync(async (req, res, next) => {
  const { clientId } = req.params;
  validateIdFormat(clientId);

  const updatedClient = await prisma.clientSchema.update({
    where: { id: parseInt(clientId) },
    data: req.body,
  });

  res.status(200).json({ status: "success", client: updatedClient });
});

// DELETE a client by ID
exports.deleteClient = catchAsync(async (req, res, next) => {
  const { clientId } = req.params;
  validateIdFormat(clientId);

  await prisma.clientSchema.delete({
    where: { id: parseInt(clientId) },
  });

  res.status(204).json({ status: "success", data: null });
});
