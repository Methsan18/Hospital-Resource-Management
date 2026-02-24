const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: [
        "pharmacist",
        "etu_head",
        "store_manager",
        "ward_nurse",
        "etu_nurse",
        "etu_doc",
        "opd_doc",
        "patient",
        "methaRole",
        "admin"
      ],
      required: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    mobile: {
      type: Number
    },
    address: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);


/* 
1 - admin
2 - pharmacist, chief pharmacist, ward nurse. (to check regarding the medicine and)
3 - doctor (for the doctor availability component)
4 - head nurse of all the wards, ward head nurse (to check bed occupency)
5 - few roles for seasonal illness part
6 - inventory manager (to manage medicine, equipemnts) 

*/