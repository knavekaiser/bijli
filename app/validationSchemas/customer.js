const yup = require("yup");
const commonYup = require("./commonYup");

module.exports = {
  create: yup.object({
    body: yup.object({
      name: yup.string().required(),
      phone: yup.string().required(),
      address: yup.string(),
      startingUnit: yup.number().required().typeError("Enter a valid Number"),
    }),
  }),
  update: yup.object({
    body: yup.object({
      name: yup.string().required(),
      phone: yup.string().required(),
      address: yup.string(),
      startingUnit: yup.number().required().typeError("Enter a valid Number"),
    }),
  }),
};
