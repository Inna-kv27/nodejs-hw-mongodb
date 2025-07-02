import User from '../models/User.js';
import Session from '../models/Session.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import crypto from 'node:crypto';

export const registerUser = async (payload) => {
  const { email, password, name } = payload;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const userResponse = newUser.toObject();
  delete userResponse.password;
  return userResponse;
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  await Session.deleteOne({ userId: user._id });

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

export const refreshUserSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired = new Date() > session.refreshTokenValidUntil;
  if (isRefreshTokenExpired) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Refresh token expired');
  }

  const newAccessToken = crypto.randomBytes(30).toString('base64');
  const newRefreshToken = crypto.randomBytes(30).toString('base64');

  const newAccessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const newRefreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  const newSession = await Session.findByIdAndUpdate(
    session._id,
    {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: newAccessTokenValidUntil,
      refreshTokenValidUntil: newRefreshTokenValidUntil,
    },
    { new: true },
  );

  return newSession;
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const updateUserPassword = async (userId, newHashedPassword) => {
  return User.findByIdAndUpdate(
    userId,
    { password: newHashedPassword },
    { new: true },
  );
};
