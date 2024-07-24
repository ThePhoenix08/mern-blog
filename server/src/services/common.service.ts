import ApiError from "utils/ApiError.util";
import { deleteOldUpload, handleFileUpload } from "utils/cloudinary.util";
import { ZodSchema } from "zod";

import User, { IUser } from "models/user.model";
import Blog from "models/blog.model";
import Blogger from "models/blogger.model";
import Comment from "models/comment.model";
import Report from "models/report.model";
import Notif from "models/notif.model";
import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import AuthRequest from "types/express";

interface IFile {
  identifier: string;
  path: string;
  url?: string;
  old_url?: string;
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

class ValidationError extends ApiError {
  constructor(message: string) {
    super({
      message,
      errorType: "ValidationError",
    });
    this.errorType = "ValidationError";
  }
}

const validateZodSchema = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) throw new ValidationError("Zod Validation failed");
  return result.data;
};

const uploadFiles = async (files: IFile[]): Promise<IFile[]> => {
  const uploadPromises = files.map(async (file) => {
    const uploadedFile = await handleFileUpload(file.path, file.identifier);
    if (!uploadedFile)
      throw new ApiError({
        errorType: "FileUploadError",
        message: "Error while uploading file to cloudinary.",
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
    throw new ApiError({
      errorType: "RequestUndefinedError",
      message: "Request undefined",
    });
  const user = req.user;
  if (!user)
    throw new ApiError({
      errorType: "UnauthorizedRequestError",
      message: "Unauthorized request",
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
    throw new ApiError({
      errorType: "DocumentNotFoundError",
      message: `Document not found for model: ${modelName}`,
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
    throw new ApiError({
      errorType: "DocumentNotFoundError",
      message: `Error while fetching documents for model ${modelName}`,
    });

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
    throw new ApiError({
      errorType: "DocumentNotFoundError",
      message: `Error while fetching documents for model ${modelName}`,
    });

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

  if (!documents || !total || total === 0)
    throw new ApiError({
      errorType: "DocumentNotFoundError",
      message: `Error while fetching documents for model ${modelName}`,
    });

  return {
    documents: documents as T[],
    total,
    pages: Math.ceil(total / limit),
  };
};

const deleteDocumentsByQuery = async <T extends Document>(
  modelName: ModelName,
  query: FilterQuery<T>
): Promise<{ deletedDocumentsCount: number }> => {
  const model = modelNameToModel[modelName];
  const deletedDocuments = await model.deleteMany(query).lean();

  if (!deletedDocuments)
    throw new ApiError({
      errorType: "DocumentNotFoundError",
      message: `Error while deleting documents for model ${modelName}`,
    });

  return { deletedDocumentsCount: deletedDocuments.deletedCount || 0 };
};

const deleteDocumentById = async <T extends Document>(
  modelName: ModelName,
  id: string
) => {
  const model = modelNameToModel[modelName];
  const deletedDocument = await model.findByIdAndDelete(id).lean();

  if (!deletedDocument)
    throw new ApiError({
      errorType: "DocumentNotFoundError",
      message: `Error while deleting document for model ${modelName}`,
    });

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
    throw new ApiError({
      errorType: "DocumentNotFoundError",
      message: `Error while updating document for model ${modelName}`,
    });
  return document as T;
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

export {
  validateZodSchema,
  uploadFiles,
  getDocumentById,
  getDocumentByQuery,
  getDocumentsByQuery,
  getPaginatedDocumentsByQuery,
  deleteDocumentById,
  deleteDocumentsByQuery,
  updateDocumentById,
  createNewDocument,
  getUserFromRequest,
};