const prisma = require("../../../prisma-client");
const catchAsync = require("../../../utils/catchAsync");
const validateIdFormat = require("../../../utils/validateIdFormat");

const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });

const {
  SchedulerClient,
  CreateScheduleCommand,
} = require("@aws-sdk/client-scheduler"); // CommonJS import
const AppError = require("../../../utils/appError");

exports.createEmailChaser = catchAsync(async (req, res, next) => {
  const { Name, ScheduleExpression, Timezone, ...rest } = req.body;
  const emailChaser = await prisma.emailchaser.create({ data: rest });

  res.status(200).json({
    status: "success",
    emailChaser,
  });
});

//testing creation chaser
exports.createChaserTest = catchAsync(async (req, res, next) => {
  const { DueDate,email,Name,InvoiceID,Total,AmountPaid,subject,body,ScheduleExpression } = req.body;
  let Timezone = 'Asia/Karachi';
  
  const description = `Schedule ${Name} triggers as per ${ScheduleExpression} in timezone ${Timezone}`;

  const inputPayload = JSON.stringify({ DueDate,email,Name,InvoiceID,Total,AmountPaid,subject,body,ScheduleExpression });

  const client = new SchedulerClient({ region: 'eu-west-2' });

  const params = {
    Name,
    Description: description,
    ScheduleExpression,
    ScheduleExpressionTimezone: Timezone,
    State: 'ENABLED',
    FlexibleTimeWindow: {
      'Mode': 'OFF'
    },
    Target: {
      Arn: 'arn:aws:lambda:eu-west-2:026066253580:function:email-sender',
      RoleArn: 'arn:aws:iam::026066253580:role/schedular-lambda-invoke-access',
      Input: inputPayload
    },
    ActionAfterCompletion: 'NONE'
  };

  const command = new CreateScheduleCommand(params);
  const response = await client.send(command); // the shadulearn we will store in db so we will be able to edit it


  res.status(200).json({
    status: "success",
    response
  });
});

exports.getEmailChasersByTemplateId = catchAsync(async (req, res, next) => {
  const { templateId } = req.query;
  if (!templateId) {
    return next(new AppError("templateId not found", 404));
  }
  validateIdFormat(templateId);

  const emailChasers = await prisma.emailchaser.findMany({
    where: { template_id: parseInt(templateId) },
  });
  res.status(200).json({
    status: "success",
    emailChasers,
  });
});
exports.getEmailChaserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  validateIdFormat(id);

  const emailChaser = await prisma.emailchaser.findUnique({
    where: { id: parseInt(id) },
  });
  res.status(200).json({
    status: "success",
    emailChaser,
  });
});

exports.updateEmailChaser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  validateIdFormat(id);
  const updatedEmailCaser = await prisma.emailchaser.update({
    where: { id: parseInt(id) },
    data: req.body,
  });
  res.status(202).json({
    status: "success",
    updatedEmailCaser,
  });
});

exports.copyEmailChaser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { template_id } = req.query;
  validateIdFormat(id);

  const emailChaser = await prisma.emailchaser.findUnique({
    where: { id: parseInt(id) },
  });

  const { subject, email_body, active } = emailChaser;
  const newEmailChaser = await prisma.emailchaser.create({
    data: { subject, email_body, active, template_id: Number(template_id) },
  });

  res.status(202).json({
    status: "success",
    emailChaser: newEmailChaser,
  });
});

exports.deleteEmailChaser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  validateIdFormat(id);
  const deletedEmailChaser = await prisma.emailchaser.delete({ where: { id: parseInt(id) } });

  res.status(202).json({
    status: "success",
    message: "Email chaser deleted.",
    data:deletedEmailChaser
  });
});
