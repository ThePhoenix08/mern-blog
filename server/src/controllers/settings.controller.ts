import type { IUser } from "@models/user.model";
import {
  getUserFromRequest,
  updateDocumentById,
  validateZodSchema,
} from "@services/common.service";
import asyncHandler from "@utils/asyncHandler.util";
import { updateSettingsSchema } from "@validators/settings.validator";

const getUserSettings = asyncHandler(async (req, res) => {
  const { userSettings } = await getUserFromRequest(req);
  res.status(200).json({
    statusCode: 200,
    data: userSettings,
    message: "User settings fetched successfully.",
  });
});
const updateUserSettings = asyncHandler(async (req, res) => {
  const { id: userId } = await getUserFromRequest(req);
  const data = validateZodSchema(updateSettingsSchema, req.body);
  const updatedUser = await updateDocumentById<IUser>("user", userId, {
    userSettings: data,
  });
  res.status(200).json({
    statusCode: 200,
    data: updatedUser.userSettings,
    message: "User settings updated successfully.",
  });
});

export { getUserSettings, updateUserSettings };
