import { getUserByQuery } from "services/common.service";

export const formSearchQuery = async (options: Record<string, any>) => {
  // populating query filters
  const query: Record<string, any> = {};

  if (!options.filters) {
    const { isPublished, tags, blogger, slug, date } = options.filters;

    if (isPublished) query.isPublished = isPublished;

    if (tags) query.tags = { $in: tags };

    if (blogger) {
      const bloggerUser = await getUserByQuery({ username: blogger });
      if (bloggerUser) query.blogger = (bloggerUser as any)._id;
    }

    if (slug) query.slug = slug;

    if (date) {
      query.createdAt = {};
      if (date.startDate) query.createdAt.$gte = date.startDate;
      if (date.endDate) query.createdAt.$lte = date.endDate;
    }
  }

  if (options?.searchTerm) {
    query.$or = [
      { title: { $regex: options.searchTerm, $options: "i" } },
      { content: { $regex: options.searchTerm, $options: "i" } },
      { tags: { $regex: options.searchTerm, $options: "i" } },
      { slug: { $regex: options.searchTerm, $options: "i" } },
    ];
  }

  return query;
};
