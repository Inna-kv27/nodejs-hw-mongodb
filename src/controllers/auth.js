import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  findUserByEmail,
  updateUserPassword,
} from '../services/auth.js';
import Session from '../models/Session.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import sendMail from '../utils/sendMail.js';

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser({ name, email, password });
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const session = await loginUser({ email, password });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    secure: true,
    sameSite: 'Lax',
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  const newSession = await refreshUserSession(refreshToken);

  res.cookie('refreshToken', newSession.refreshToken, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
    secure: true,
    sameSite: 'Lax',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const session = await Session.findOne({ refreshToken });

    if (session) {
      await logoutUser(session._id);
    }
  }

  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign({ email }, getEnvVar('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const appDomain = getEnvVar('APP_DOMAIN');
  const resetLink = `${appDomain}/reset-password?token=${resetToken}`;

  const emailHtml = `
    <h1>Reset Your Password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link is valid for 5 minutes.</p>
  `;

  try {
    await sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: emailHtml,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  let email;
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
    email = decoded.email;
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await updateUserPassword(user._id, hashedPassword);

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
