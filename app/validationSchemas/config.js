const yup = require("yup");
const commonYup = require("./commonYup");

module.exports = {
  update: yup.object({
    body: yup.object({
      print: yup.object().shape({
        currency: yup.string(),
        itemColumns: yup
          .array()
          .of(yup.string().typeError("Please provide strings only")),
      }),
      unitCharge: yup
        .number()
        .min(1)
        .required()
        .typeError("unitCharge must be a number"),
    }),
  }),
};
