import { Router } from 'express';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js'; // ДЕФОЛТНИЙ імпорт, як і має бути
import {
  registerUserSchema,
  loginUserSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import authenticate from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', authenticate, ctrlWrapper(logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
