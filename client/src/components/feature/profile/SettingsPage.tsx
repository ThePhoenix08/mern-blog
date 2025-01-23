import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPen, Settings, Palette, Bell } from "lucide-react";
import { FormInputControl } from "../authentication/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdOutlineIndeterminateCheckBox } from "react-icons/md";
import { Label } from "@/components/ui/label";

type ModalState = {
  open: boolean;
  imageType: "avatar" | "cover";
  mode: "edit" | "view";
};

type SettingsBlueprint = {
  email: string;
  fullname: string;
  role: "user" | "blogger";
  bio: string;
  publicEmail: boolean;
  publicFullname: boolean;
  publicSavedBlogs: boolean;
  publicSubscribedTo: boolean;
  theme: "dark" | "light" | "system";
  language: "en" | "fa" | "ar";
  emailNotifications: boolean;
};

const tabs: {
  value: string;
  icon: JSX.Element;
}[] = [
  { value: "profile", icon: <UserPen /> },
  { value: "account", icon: <Settings /> },
  { value: "appearance", icon: <Palette /> },
  { value: "notifications", icon: <Bell /> },
];

const SettingsPage = () => {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    imageType: "avatar",
    mode: "view",
  });
  const [files, setFiles] = useState<File[]>([]);
  const user = useSelector(selectCurrentUser);
  const role = user.role === "user" ? "user" : "blogger";
  const [settingsState, setSettingsState] = useState<SettingsBlueprint>({
    email: user.email || "",
    fullname: user.fullname || "",
    role: role,
    bio: user.bio || "",
    publicEmail: user.userSettings?.publiclyVisibleInfo.email || false,
    publicFullname: user.userSettings?.publiclyVisibleInfo.fullname || false,
    publicSavedBlogs:
      user.userSettings?.publiclyVisibleInfo.savedBlogs || false,
    publicSubscribedTo:
      user.userSettings?.publiclyVisibleInfo.subscribedTo || false,
    theme: user.userSettings?.darkMode ? "dark" : "light",
    language: (user.userSettings?.language as "en" | "fa" | "ar") || "en",
    emailNotifications: user.userSettings?.emailNotifications || false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettingsState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="Profile h-full w-full">
      <Card className="profileMain h-full flex flex-col">
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <Tabs defaultValue="profile" className="flex flex-col h-full">
            <TabsList className="w-full h-fit flex justify-around items-center gap-2">
              {tabs.map((tabData, idx) => (
                <TabsTrigger
                  key={idx}
                  value={tabData.value}
                  className="flex flex-col gap-2 w-full"
                >
                  <div className="icon">{tabData.icon}</div>
                  <span>{capitalize(tabData.value)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="profile" className="flex-grow">
              <Card className="h-full">
                <CardContent>
                  <FormInputControl
                    label="Email"
                    id="email"
                    type="email"
                    onChange={handleChange}
                  />
                  <FormInputControl
                    label="Full Name"
                    id="fullName"
                    type="text"
                    onChange={handleChange}
                  />
                  <FormSelectControl
                    label="Role"
                    id="role"
                    value={settingsState.role}
                    onChange={(value: "user" | "blogger") => {
                      setSettingsState((prev) => ({
                        ...prev,
                        role: value,
                      }));
                    }}
                    options={["user", "blogger"]}
                  />
                  {/* <FormTextAreaControl /> */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="account" className="flex-grow">
              <Card className="h-full">
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="appearance" className="flex-grow">
              <Card className="h-full">
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="flex-grow">
              <Card className="h-full">
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const FormSelectControl = ({
  label,
  id,
  value,
  onChange,
  options,
  helperText,
}: {
  label: string;
  id: string;
  value: "user" | "blogger";
  onChange: (value: "user" | "blogger") => void;
  options: string[];
  helperText?: string;
}) => {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="">
          <SelectValue placeholder={capitalize(value)} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, idx) => (
            <SelectItem value={option} key={idx}>
              {capitalize(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p className="text-xs md:text-sm text-neutral-700">{helperText}</p>
      )}
    </>
  );
};

// const FormTextAreaControl = ({
  
// }: {

// }): JSX.Element => {
//   return (

//   );
// };