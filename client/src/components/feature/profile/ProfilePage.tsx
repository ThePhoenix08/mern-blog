import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, updateAvatar } from "@/redux/slices/authSlice";
import fallbackBanner from "@/assets/banner-fallback.jpg";
import { Eye, Mail, Pencil, User } from "lucide-react";
import handleSubscribedTo from "../../../api/user/handleSubscribedTo";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import updateAvatarRequest from "@/api/user/UpdateAvatar";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [fileState, setFile] = useState<File | null>(null);
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
  const [avatar, setAvatar] = useState<string | null | ArrayBuffer>(
    user.avatar || "https://avatar.iran.liara.run/public/boy"
  );
  const dispatch = useDispatch();

  const handleFileChange = (event: any) => {
    const target = event.target as HTMLInputElement & {
      files: FileList;
    };

    if (!target.files || target.files.length !== 1) {
      setFile(null);
      console.log("no file");
      return;
    }

    setFile(target.files[0]);

    const file = new FileReader();
    file.onload = () => {
      setAvatar(file.result);
    };

    console.log(file.result);

    file.readAsDataURL(target.files[0]);

    handleAvatarUpload();
  };

  const handleAvatarUpload = async () => {
    try {
      const data = new FormData();
      data.append("avatar", fileState as any);

      const response = await updateAvatarRequest(data);
      if (response.status && response.updatedUser) {
        setAvatar(response.updatedUser.avatar);
        toast.success("Avatar updated successfully");
        dispatch(updateAvatar(response.updatedUser.avatar));
      } else {
        toast.error("Error while uploading avatar");
        console.error(response.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred while uploading avatar");
      console.error(error);
    }
  };

  const updateReduxAvatar = async (avatar: string) => {
    dispatch(updateAvatar(avatar));
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
                <div className="content">
                  <div className="left grid place-items-center gap-4">
                    <AvatarViewModalDiv
                      src={avatar as string | null}
                      alt={user.username}
                      fallback={
                        <img src={avatar as string} alt={user.username} />
                      }
                    />
                    {avatarModalActionType === "edit" && (
                      <DialogFooter className="grid grid-cols-2 gap-2">
                        <Button
                          type="submit"
                          onClick={() => {
                            updateReduxAvatar(avatar as string);
                          }}
                        >
                          Save
                        </Button>
                        <Button type="button">New</Button>
                      </DialogFooter>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="file-input-control">
                      <Label htmlFor="file">File</Label>
                      <Input
                        id="file"
                        type="file"
                        placeholder="File"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                    <Button>Upload</Button>
                  </div>
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
