import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, updateAvatar } from "@/redux/slices/authSlice";
import fallbackBanner from "@/assets/banner-fallback.jpg";
import { Eye, Mail, Pencil, User } from "lucide-react";
import handleSubscribedTo from "./api/handleSubscribedTo";
import { handleBadges } from "./components/handleBadges";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import updateAvatarRequest from "./api/UpdateAvatar";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const user = useSelector(selectCurrentUser);
  const [isBlogger] = useState(user.role === "blogger");
  const [hasSubscribed, subscriberToBloggers] = handleSubscribedTo(
    user.subscribedTo
  );
  const badges = handleBadges(user);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarModalActionType, setAvatarModalActionType] = useState<
    "view" | "edit"
  >("view");
  const [avatar] = useState<string | null | ArrayBuffer>(
    user.avatar || "https://avatar.iran.liara.run/public/boy"
  );
  const dispatch = useDispatch();

  const handleFileChange = (newFiles: File[]) => {
    console.log(newFiles);
    setFiles(newFiles);
  };

  const handleUploadAvatar = async () => {
    if (!files[0]) {
      toast.error("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", files[0]);

    const result = await updateAvatarRequest(formData);
    if (!result.status) {
      toast.error("Error uploading avatar, request failed");
      return;
    }
    dispatch(updateAvatar(result.updatedUser.avatar));
    setAvatarModalOpen(false);
    toast.success("Avatar updated successfully");
  };

  return (
    <div className="Profile h-full w-full grid grid-cols-2 gap-2">
      <Card className="profileMain col-span-2 p-0">
        <CardContent className="p-0 flex flex-col">
          <div className="banner h-[20dvh]">
            <img
              className="object-cover rounded-tr rounded-tl overflow-hidden w-full h-full"
              src={user.cover || fallbackBanner}
              alt={user.username}
            />
          </div>
          <div className="lower flex-grow flex flex-col justify-center">
            <Dialog modal={avatarModalOpen}>
              <ContextMenu>
                <ContextMenuTrigger>
                  <Avatar className="relative h-16 w-16 -top-8 md:h-24 md:w-24 md:-top-12 rounded-full left-2 border-2 border-zinc-900">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>
                      <img
                        src="https://avatar.iran.liara.run/public"
                        alt={user.username}
                      />
                    </AvatarFallback>
                  </Avatar>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <DialogTrigger
                    asChild
                    onClick={() => {
                      setAvatarModalOpen(true);
                      setAvatarModalActionType("view");
                    }}
                  >
                    <ContextMenuItem className="flex gap-2">
                      <Eye /> <span>View</span>
                    </ContextMenuItem>
                  </DialogTrigger>
                  <DialogTrigger
                    asChild
                    onClick={() => {
                      setAvatarModalOpen(true);
                      setAvatarModalActionType("edit");
                    }}
                  >
                    <ContextMenuItem className="flex gap-2">
                      <Pencil /> <span>Edit</span>
                    </ContextMenuItem>
                  </DialogTrigger>
                </ContextMenuContent>
              </ContextMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{avatarModalActionType} Avatar</DialogTitle>
                  <DialogDescription>{""}</DialogDescription>
                </DialogHeader>
                <div className="content grid place-items-center">
                  {avatarModalActionType === "edit" ? (
                    <div className="p-2 flex flex-col gap-4">
                      <FileUpload onChange={handleFileChange} />
                      <div className="uploadButton">
                        <Button
                          variant="default"
                          onClick={handleUploadAvatar}
                          className="w-full"
                        >
                          Upload
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="">
                      <AvatarViewModalDiv
                        src={avatar as string | null}
                        alt={user.username}
                        fallback={
                          <img src={avatar as string} alt={user.username} />
                        }
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <div className="content pl-4 flex flex-col h-fit w-full gap-2 p-2">
              <span className="username text-2xl font-bold">
                {"@" + user.username}
              </span>
              <span className="bio">{user.bio}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="BasicInfo">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="row flex gap-2 items-center">
            <User className="icon w-8 h-8" />
            <div className="text flex flex-col">
              <span className="label">Full Name</span>
              <span className="value">{user.fullname}</span>
            </div>
          </div>
          <div className="row flex gap-2 items-center">
            <Mail className="icon w-8 h-8" />
            <div className="text flex flex-col">
              <span className="label">Email</span>
              <span className="value">{user.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={`SubscribedTo ${!isBlogger && "row-span-2"}`}>
        <CardHeader>
          <CardTitle>Subscribed</CardTitle>
        </CardHeader>
        <CardContent className="grid place-items-start h-full">
          {hasSubscribed ? (
            subscriberToBloggers.map((blogger) => {
              return (
                <Avatar>
                  <AvatarImage src={blogger.avatar} alt={blogger.username} />
                  <AvatarFallback>
                    <img
                      src="https://avatar.iran.liara.run/public"
                      alt={blogger.username}
                    />
                  </AvatarFallback>
                </Avatar>
              );
            })
          ) : (
            <div className="flex flex-col justify-center gap-2">
              <span className="text-xl font-bold">No Bloggers</span>
              <span className="text-sm">Subscribe to Bloggers to see here</span>
            </div>
          )}
        </CardContent>
      </Card>
      {isBlogger && (
        <Card className="BloggerInfo">
          <CardHeader>
            <CardTitle>Blogger Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="row flex gap-2 items-center">
              <div className="row">
                <span>Total Subscribers</span>
                <span className="text-xl font-bold"></span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Card className="BadgesBox">
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {badges.map((badge) => (
            <span className="badge" key={badge.name} aria-label={badge.name}>
              {badge.icon}
            </span>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

const AvatarViewModalDiv = ({
  src,
  alt,
  fallback,
}: {
  src?: string | null;
  alt?: string;
  fallback: JSX.Element;
}) => {
  const alternateTitle = alt || "user";
  const source = src || "";
  return (
    <div className="avatar-view w-48 h-48">
      <Avatar className="w-full h-full">
        <AvatarImage
          className="w-full h-full"
          src={source}
          alt={alternateTitle}
        />
        <AvatarFallback className="w-full h-full">{fallback}</AvatarFallback>
      </Avatar>
    </div>
  );
};
