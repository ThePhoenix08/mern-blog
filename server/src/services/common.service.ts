import type { Document, FilterQuery, Model, UpdateQuery } from "mongoose";
import type { ZodType } from "zod";
import type { IUser } from "@models/user.model";
import type AuthRequest from "types/express";
import Blog from "@models/blog.model";
import Blogger from "@models/blogger.model";
import Comment from "@models/comment.model";
import Notif, { INotif } from "@models/notif.model";
import Report from "@models/report.model";
import User from "@models/user.model";
import ApiError from "@utils/ApiError.util";
import { handleFileUpload, deleteOldUpload } from "@utils/cloudinary.util";

export interface IFile {
  identifier: string;
  path: string;
  url?: string;
  old_url: string | null;
}

interface IPaginatedResult<T> {
  documents: T[];
  total: number;
  pages: number;
}

type ModelName = "user" | "blog" | "comment" | "report" | "blogger" | "notif";

// Model mapping
const modelNameToModel: Record<ModelName, Model<any>> = {
  user: User,
  blog: Blog,
  comment: Comment,
  report: Report,
  blogger: Blogger,
  notif: Notif,
};

const validateZodSchema = <T>(schema: ZodType<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success)
    throw ApiError.validation(
      "Invalid or incomplete data provided in request",
      {
        slug: "VALIDATION_ERROR",
        zodError: result.error.format(),
      }
    );
  return result.data;
};

const uploadFiles = async (files: IFile[]): Promise<IFile[]> => {
  const uploadPromises = files.map(async (file) => {
    const uploadedFile = await handleFileUpload(file.path, file.identifier);
    if (!uploadedFile)
      throw ApiError.internal("Error while uploading file to cloudinary", {
        slug: "UPLOAD_ERROR",
      });
    file.url = uploadedFile;

    if (typeof file.old_url === "string") {
      await deleteOldUpload(file.old_url);
    }

    return file;
  });

  return await Promise.all(uploadPromises);
};

const getUserFromRequest = async (req: AuthRequest): Promise<IUser> => {
  if (!(req && req.user))
    throw ApiError.unauthorized("Unauthorized request, request is undefined", {
      slug: "UNAUTHORIZED_REQUEST",
    });
  const user = req.user;
  if (!user)
    throw ApiError.unauthorized("Unauthorized request, user is undefined", {
      slug: "UNAUTHORIZED_REQUEST",
    });
  return user;
};

const getDocumentById = async <T extends Document>(
  modelName: ModelName,
  id: string,
  objectOnly: boolean = true
): Promise<T> => {
  const model = modelNameToModel[modelName];
  const query = model.findById(id);
  const document = objectOnly ? await query.lean() : await query;

  if (!document) {
    throw ApiError.notFound(`Document not found for model: ${modelName}`, {
      slug: "DOCUMENT_NOT_FOUND",
    });
  }
  return document as T;
};

const getDocumentByQuery = async <T extends Document>(
  modelName: ModelName,
  query: FilterQuery<T>,
  objectOnly: boolean = true
): Promise<T> => {
  const model = modelNameToModel[modelName];
  const queryBuilder = model.findOne(query);
  const document = (
    objectOnly ? await queryBuilder.lean() : await queryBuilder
  ) as T;

  if (!document)
    throw ApiError.notFound(
      `Error while fetching document by query for model ${modelName}`,
      {
        slug: "DOCUMENT_NOT_FOUND",
      }
    );

  return document as T;
};

const getDocumentsByQuery = async <T extends Document>(
  modelName: ModelName,
  query: FilterQuery<T>,
  objectOnly: boolean = true
): Promise<T[]> => {
  const model = modelNameToModel[modelName];
  const queryBuilder = model.find(query);
  const documents = (
    objectOnly ? await queryBuilder.lean() : await queryBuilder
  ) as T[];

  if (!documents)
    throw ApiError.notFound(
      `Error while fetching documents by query for model ${modelName}`,
      {
        slug: "DOCUMENT_NOT_FOUND",
      }
    );

  return documents;
};

const getPaginatedDocumentsByQuery = async <T extends Document>(
  modelName: ModelName,
  query: FilterQuery<T>,
  page: number,
  limit: number
): Promise<IPaginatedResult<T>> => {
  const model = modelNameToModel[modelName];
  const skip = (page - 1) * limit;

  const [documents, total] = await Promise.all([
    model.find(query).skip(skip).limit(limit).lean(),
    model.countDocuments(query).lean(),
  ]);

  if (!documents || !total)
    throw ApiError.notFound(
      `Error while fetching paginated documents for model ${modelName}`,
      {
        slug: "DOCUMENT_NOT_FOUND",
      }
    );

  return {
    documents: documents as T[],
    total,
    pages: Math.ceil(total / limit),
  };
};

const deleteDocumentsByQuery = async <T extends Document>(
  modelName: ModelName,
  query: FilterQuery<T>
): Promise<number> => {
  const model = modelNameToModel[modelName];
  const deletedDocuments = await model.deleteMany(query).lean();

  if (!deletedDocuments)
    throw ApiError.internal(
      `Error while deleting documents for model ${modelName}`,
      {
        slug: "DOCUMENT_DELETION_ERROR",
      }
    );

  return deletedDocuments.deletedCount || 0;
};

const deleteDocumentById = async <T extends Document>(
  modelName: ModelName,
  id: string
) => {
  const model = modelNameToModel[modelName];
  const deletedDocument = await model.findByIdAndDelete(id).lean();

  if (!deletedDocument)
    throw ApiError.internal(
      `Error while deleting document for model ${modelName}`,
      {
        slug: "DOCUMENT_DELETION_ERROR",
      }
    );

  return deletedDocument as T;
};

const updateDocumentById = async <T extends Document>(
  modelName: ModelName,
  id: string,
  updateData: UpdateQuery<T>,
  validate: boolean = true
) => {
  const model = modelNameToModel[modelName];
  const document = await model.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: validate || true,
    context: "query",
  });
  if (!document)
    throw ApiError.internal(
      `Error while updating document for model ${modelName}`,
      {
        slug: "DOCUMENT_UPDATE_ERROR",
      }
    );
  return document as T;
};

/** <ModelType>(modelName, query) => orphanedDocs */
const orphanDocumentsOfModel = async <T extends Document>(
  modelName: ModelName,
  query: FilterQuery<T>
) => {
  const model = modelNameToModel[modelName] as Model<T>;
  const orphanedDocuments = await model.updateMany(query, {
    $set: {
      orphaning: {
        orphanedAt: Date.now(),
        isOrphaned: true,
      },
    },
  });

  if (!orphanedDocuments)
    throw ApiError.internal(
      `Error while orphaning documents for model ${modelName}`,
      {
        slug: "DOCUMENT_ORPHANING_ERROR",
      }
    );

  return orphanedDocuments.modifiedCount || 0;
};

const createNewDocument = async <T extends Document>(
  modelName: ModelName,
  data: Object,
  validate: boolean = true
) => {
  const model = modelNameToModel[modelName];
  const document = new model(data);

  await document.save({
    validateModifiedOnly: validate,
    validateBeforeSave: !validate,
  });
  return document as T;
};

const checkIfDocumentsExist = async <T extends Document>(
  modelName: ModelName,
  ids?: string[],
  givenQuery?: FilterQuery<T>
) => {
  const query: Record<string, any> = givenQuery || { _id: { $in: ids } };
  const documentsExists = await getDocumentsByQuery<T>(modelName, query);
  if (!documentsExists)
    throw ApiError.internal(
      `Error while validating document ids for model ${modelName}`,
      {
        slug: "DOCUMENT_VALIDATION_ERROR",
      }
    );
  return documentsExists as T[];
};

const sendNotification = async (
  userId: string,
  content: string,
  type: "comment" | "blog",
  itemId: string
) => {
  const notif = await createNewDocument<INotif>("notif", {
    user: userId,
    type,
    relatedItem: {
      [type]: itemId,
    },
    content,
    isRead: false,
  });
  return notif;
};

export {
  checkIfDocumentsExist,
  createNewDocument,
  deleteDocumentById,
  deleteDocumentsByQuery,
  getDocumentById,
  getDocumentByQuery,
  getDocumentsByQuery,
  getPaginatedDocumentsByQuery,
  getUserFromRequest,
  orphanDocumentsOfModel,
  updateDocumentById,
  uploadFiles,
  validateZodSchema,
  sendNotification,
};
