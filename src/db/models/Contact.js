// src/db/models/Contact.js
import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: false },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      required: true,
      enum: ['personal', 'work', 'family', 'other'],
    }, // Приклад enum
  },
  { timestamps: true },
);

const Contact = model('Contact', contactSchema);

export default Contact;
