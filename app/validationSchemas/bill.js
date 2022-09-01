const yup = require("yup");
const commonYup = require("./commonYup");

module.exports = {
  create: yup.object({
    body: yup.object({
      date: yup.string().required(),
      paid: yup.boolean().required(),
      customer: yup.string().required(),
      currentUnit: yup.number().min(0).required(),
    }),
  }),
  update: yup.object({
    body: yup.object({
      date: yup.string().required(),
      paid: yup.boolean().required(),
      customer: yup.string().required(),
      currentUnit: yup.number().min(0).required(),
    }),
  }),
};
