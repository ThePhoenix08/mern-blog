import type { INotif } from "@models/notif.model";
import type { FilterQuery } from "mongoose";
import {
  checkIfDocumentsExist,
  deleteDocumentById,
  getPaginatedDocumentsByQuery,
  getUserFromRequest,
  updateDocumentById,
  validateZodSchema,
} from "@services/common.service";
import ApiError from "@utils/ApiError.util";
import asyncHandler from "@utils/asyncHandler.util";
import { idSchema } from "@validators/common.validator";
import { getNotifsSchema } from "@validators/notif.validator";

const getNotifs = asyncHandler(async (req, res) => {
  const data = validateZodSchema(getNotifsSchema, req.body);
  const { id: userId } = await getUserFromRequest(req);
  const page = data.page || 1;
  const limit = data.limit || 10;
  const unreadOnly = data.unread || false;

  const query: FilterQuery<INotif> = { user: userId };
  if (unreadOnly) query.isRead = false; // dont include read notifs

  const {
    documents: notifications,
    pages,
    total,
  } = await getPaginatedDocumentsByQuery<INotif>("notif", query, page, limit);
  res.status(200).json({
    statusCode: 200,
    data: {
      returnedNotifs: notifications,
      pagination: { page, limit, total, pages },
    },
    message: "Notifications of user fetched successfully.",
  });
});
const markAsRead = asyncHandler(async (req, res) => {
  const { id: notificationId } = validateZodSchema(idSchema, req.params);

  const docs = await checkIfDocumentsExist<INotif>("notif", [notificationId]);
  if (!docs || !docs.length || docs.length !== 1) {
    throw ApiError.notFound("Notification not found", {
      slug: "NOTIFICATION_NOT_FOUND",
    });
  }
  const oldNotification = docs[0];
  if (oldNotification.isRead) {
    throw ApiError.conflict("Notification already marked as read", {
      slug: "NOTIFICATION_ALREADY_READ",
    });
  }

  const notification = await updateDocumentById<INotif>(
    "notif",
    notificationId,
    { isRead: true }
  );

  res.status(200).json({
    statusCode: 200,
    data: notification,
    message: "Notification updated successfully.",
  });
});
const deleteNotif = asyncHandler(async (req, res) => {
  const { id: notificationId } = validateZodSchema(idSchema, req.params);

  const docs = await checkIfDocumentsExist<INotif>("notif", [notificationId]);
  if (!docs || !docs.length || docs.length !== 1) {
    throw ApiError.notFound("Notification not found", {
      slug: "NOTIFICATION_NOT_FOUND",
    });
  }

  await deleteDocumentById<INotif>("notif", notificationId);

  res.status(200).json({
    statusCode: 200,
    message: "Notification deleted successfully.",
  });
});

export { getNotifs, markAsRead, deleteNotif };
