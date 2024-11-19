import { Blogger } from "@/data/types";
import { MdOutlineVerified } from "react-icons/md";

export const handleBadges = (user: Partial<Blogger>) => {
  const badges: {
    name: string;
    icon: JSX.Element;
  }[] = [];

  badges.push({
    name: "Email Verified",
    icon: <MdOutlineVerified className="w-6 h-6 text-green-600" />,
  });

  return badges;
};

/* 
{/* {user.isEmailVerified && <span>Email Verified Badge</span>}
{isBlogger && <span>Blogger Badge</span>}
{isBlogger &&
  user.totalSubscribers &&
  user.totalSubscribers > 100 && <span>100+ Subscribers Badge</span>}
{isBlogger &&
  user.totalSubscribers &&
  user.totalSubscribers > 500 && <span>500+ Subscribers Badge</span>}
{isBlogger &&
  user.totalSubscribers &&
  user.totalSubscribers > 1000 && <span>1000 Subscribers Badge</span>} 
*/
