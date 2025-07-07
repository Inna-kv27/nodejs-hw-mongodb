import Contact from '../models/contact.js';
import cloudinary from '../utils/cloudinary/cloudinary.js'; // Імпортуємо налаштований Cloudinary

export const listContacts = async (
  userId,
  {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  },
) => {
  const skip = (page - 1) * perPage;

  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortCriteria = { [sortBy]: sortDirection };

  const filter = { userId: userId };
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite;
  }

  const contacts = await Contact.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort(sortCriteria);
  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId: userId });
  return contact;
};

export const createContact = async (payload, photo) => {
  // Приймаємо об'єкт фото
  let photoUrl = null;
  if (photo) {
    // ОНОВЛЕНО: Використовуємо photo.buffer замість photo.path
    const result = await cloudinary.uploader.upload(
      `data:${photo.mimetype};base64,${photo.buffer.toString('base64')}`,
    );
    photoUrl = result.secure_url; // Отримуємо URL завантаженого фото
  }
  const contact = await Contact.create({ ...payload, photo: photoUrl }); // Зберігаємо URL фото
  return contact;
};

export const updateContact = async (contactId, userId, payload, photo) => {
  // Приймаємо об'єкт фото
  let photoUrl = null;
  if (photo) {
    // ОНОВЛЕНО: Використовуємо photo.buffer замість photo.path
    const result = await cloudinary.uploader.upload(
      `data:${photo.mimetype};base64,${photo.buffer.toString('base64')}`,
    );
    photoUrl = result.secure_url; // Отримуємо URL завантаженого фото
  }

  const updatedPayload = { ...payload };
  if (photoUrl) {
    updatedPayload.photo = photoUrl; // Додаємо URL фото до оновлених даних
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId: userId },
    updatedPayload,
    { new: true },
  );
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: contactId,
    userId: userId,
  });
  return deletedContact;
};
