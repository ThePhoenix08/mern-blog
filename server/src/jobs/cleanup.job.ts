import cron from "node-cron";
import ENV_VARIABLES from "../constants";
import Blog from "@models/blog.model";
import Comment from "@models/comment.model";
import Report from "@models/report.model";
import Notif from "@models/notif.model";

cron.schedule(ENV_VARIABLES.cronJobsInterval, async () => {
  console.log("Running cleanup job");

  // orphanded: which no longer have a parent blog
  // Cleaning up orphaned comments
  const deletedComments = await Comment.deleteMany({
    blog: { $exists: false },
  });
  console.log(`Deleted ${deletedComments.deletedCount} comments`);

  // Cleaning up orphaned reports
  // parent: blog or comment does not exist
  const deletedReports = await Report.deleteMany({
    $and: [{ blog: { $exists: false } }, { comment: { $exists: false } }],
  });
  console.log(`Deleted ${deletedReports.deletedCount} reports`);

  // Cleaning up orphaned blogs
  // parent: blogger does not exist
  const deletedBlogs = await Blog.deleteMany({ blogger: { $exists: false } });
  console.log(`Deleted ${deletedBlogs.deletedCount} blogs`);

  // Cleaning up orphaned notifications
  // parents: user and blog does not exist
  const deletedNotifs = await Notif.deleteMany({
    $and: [{ user: { $exists: false } }, { blog: { $exists: false } }],
  });
  console.log(`Deleted ${deletedNotifs.deletedCount} notifications`);

  console.log("Cleanup job completed");
});
