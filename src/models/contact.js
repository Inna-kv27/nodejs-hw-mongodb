import { Schema, model } from 'mongoose';

// Визначаємо схему контакту.
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false, // Email може бути необов'язковим
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['personal', 'work', 'family', 'other'], // Обмежені значення для типу контакту
      required: true,
      default: 'personal',
    },
    userId: {
      // НОВЕ ПОЛЕ: ID користувача, якому належить контакт
      type: Schema.Types.ObjectId, // Тип ObjectId для посилання на інший документ
      required: true, // Поле є обов'язковим
      ref: 'User', // Вказуємо, що це посилання на модель 'User'
    },
  },
  {
    timestamps: true, // Автоматично додає поля createdAt та updatedAt
    versionKey: false, // Відключає поле __v
  },
);

// Створюємо модель Contact з визначеною схемою.
const Contact = model('Contact', contactSchema);

// Експортуємо модель Contact як дефолтний експорт.
export default Contact;
