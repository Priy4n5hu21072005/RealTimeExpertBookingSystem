const mongoose = require("mongoose");

const appointmentSchema =
  new mongoose.Schema(
    {
      customer: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      expert: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "ExpertProfile",
      },

      appointmentDate: {
        type: Date,
        required: true,
      },

      status: {
        type: String,
        default: "pending",
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Appointment",
    appointmentSchema
  );