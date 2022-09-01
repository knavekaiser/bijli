module.exports = mongoose.model(
  "Customer",
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: Schema.Types.String, required: true },
      phone: { type: Schema.Types.String },
      address: { type: Schema.Types.String },
      startingUnit: { type: Schema.Types.Number, required: true },
    },
    { timestamps: true }
  )
);
