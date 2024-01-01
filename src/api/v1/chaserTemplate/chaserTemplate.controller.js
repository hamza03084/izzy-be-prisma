const prisma = require("../../../prisma-client");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const validateIdFormat = require("../../../utils/validateIdFormat");

exports.createChaserTemplate = catchAsync(async (req, res, next) => {
  const chaserTemplate = await prisma.chasertemplate.create({ data: req.body });
  res.status(200).json({
    status: "success",
    chaserTemplate,
  });
});

exports.getChaserTemplates = catchAsync(async (req, res, next) => {
  const chaserTemplates = await prisma.chasertemplate.findMany();
  res.status(200).json({
    status: "success",
    chaserTemplates,
  });
});

exports.updateChaserTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  validateIdFormat(id);

  const updatedChaserTemplate = await prisma.chasertemplate.update({
    where: { id: parseInt(id) },
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    updatedChaserTemplate,
  });
});

exports.deleteChaserTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  validateIdFormat(id);

  const deletedTemplate = await prisma.chasertemplate.delete({
    where: { id: parseInt(id) },
  });
  res.status(202).json({
    status: "success",
    message: "Chaser template deleted.",
    data:deletedTemplate
  });
});

exports.getChaseTemplateById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  validateIdFormat(id);
  const chaserTemplate = await prisma.chasertemplate.findUnique({
    where: { id: parseInt(id) },
  });

  res.status(200).json({
    status: "success",
    chaserTemplate,
  });
});
