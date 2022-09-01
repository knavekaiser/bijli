module.exports = mongoose.model(
  "Bill",
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
      },
      date: { type: Schema.Types.Date, required: true },
      unit: { type: Schema.Types.Number, required: true },
      paid: { type: Schema.Types.Boolean, required: true, default: false },
    },
    { timestamps: true }
  )
);
