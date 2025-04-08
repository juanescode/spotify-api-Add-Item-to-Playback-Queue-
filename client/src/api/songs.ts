import axios from "./axios";

export const getSongs = (query: string) => {
  return axios.get(`/search?q=${encodeURIComponent(query)}`);
};

export const addToQueueRequest = (uri: string) => {
  return axios.post("/token", { uri }); 
};
