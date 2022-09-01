module.exports = mongoose.model(
  "User",
  new Schema(
    {
      name: { type: Schema.Types.String, min: 3, required: true },
      phone: {
        type: Schema.Types.String,
        min: 8,
        required: true,
        unique: [true, "Phone is already in use"],
      },
      password: { type: Schema.Types.String, min: 10, required: true },
      email: {
        type: Schema.Types.String,
        unique: [true, "Email is already in use"],
        sparse: true,
      },
      address: { type: Schema.Types.String },
    },
    { timestamps: true }
  )
);
