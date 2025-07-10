import { Schema, model } from 'mongoose';

// Визначаємо схему сесії.
const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Посилання на ID користувача з моделі User
      required: true,
      ref: 'User', // Вказуємо, що це посилання на модель 'User'
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date, // Дата і час, до якого access token дійсний
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date, // Дата і час, до якого refresh token дійсний
      required: true,
    },
  },
  {
    timestamps: true, // Автоматично додає поля createdAt та updatedAt
  },
);

// Створюємо модель Session з визначеною схемою.
const Session = model('Session', sessionSchema);

// Експортуємо модель Session як дефолтний експорт.
export default Session;
