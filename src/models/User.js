import { Schema, model } from 'mongoose';

// Визначаємо схему користувача.
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Гарантує унікальність email
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Автоматично додає поля createdAt та updatedAt
  },
);

// Створюємо модель User з визначеною схемою.
const User = model('User', userSchema);

// Експортуємо модель User як дефолтний експорт.
export default User;
