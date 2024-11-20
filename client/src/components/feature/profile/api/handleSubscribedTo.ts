import axiosInstance from "@/axios/axiosInstance";
import { restEndpoints } from "@/data/endpoints";

const handleSubscribedTo = (subscribedTo?: string[]): [boolean, any[]] => {
  if (!subscribedTo) return [false, []];
  const hasSubscribed = subscribedTo.length > 0;
  if (!hasSubscribed) return [false, []];

  const endpoint = restEndpoints.getSubscribedTo.endpoint;
  const subscribedToBloggers = axiosInstance.get(endpoint);
  subscribedToBloggers
    .then((response) => {
      console.log(response.data);
      if (response.status === 200) return [true, response.data];
      else return [false, []];
    })
    .catch((error) => {
      console.log(error);
      return [false, []];
    });
  return [false, []];
};

export default handleSubscribedTo;
