module.exports = mongoose.model(
  "Config",
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      unitCharge: { type: Schema.Types.Number, default: 12 },
    },
    { timestamps: true }
  )
);
