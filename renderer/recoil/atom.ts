import { collection, getDocs, query } from "firebase/firestore";
import { atom, selector } from "recoil";
import { db } from "../firebase";
export const currentUser = atom({
  key: "currentUser",
  default: "",
});
export const userList = atom({
  key: "userList",
  default: [],
});
export const chatList = atom({
  key: "chatList",
  default: [],
});
export const roomList = atom({
  key: "roomList",
  default: [],
});
export const groupChatList = atom({
  key: "groupChatList",
  default: [],
});
export const menu = atom({
  key: "menu",
  default: 'user',
});

