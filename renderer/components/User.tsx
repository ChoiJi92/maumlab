import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { db } from "../firebase";
import { currentUser, userList } from "../recoil/atom";

const User = () => {
  const [user, setUser] = useRecoilState(currentUser);
  const [userLists, setUserLists] = useRecoilState(userList);
  const router = useRouter();
  useEffect(() => {
    const loadUser = async () => {
      const docRef = collection(db, "users");
      const q = query(docRef, where("name", "!=", user));
      let userList: string[] = [];
      const nickname = await getDocs(q);
      nickname.forEach((doc) => {
        userList.push(doc.data().name);
      });
      setUserLists([...userList]);
    };
    loadUser();
  }, [user]);
  const createPrivateRoom = async (v: string) => {
    const data = {
      roomName: v,
      userList: [v, user],
      max: 2,
    };
    const q = query(collection(db, "room"));
    const roomData = await getDocs(q);
    let roomId: string;
    let roomName: string;
    roomData.forEach((doc) => {
      if (
        doc.data().userList.includes(user) &&
        doc.data().userList.includes(data.roomName)
      ) {
        roomId = doc.id;
        roomName = doc.data().userList.filter((v: string) => v !== user);
      }
    });
    if (roomId) {
      router.push({
        pathname: `/chat/${roomId}`,
        query: { roomId: roomId, roomName: roomName[0] },
      });
    } else {
      const docRef = await addDoc(collection(db, "room"), data);
      const room = await getDoc(docRef);
      const roomData: any = { id: room.id, ...room.data() };
      const roomId = roomData.id;
      const roomName = roomData.userList.filter((v: string) => v !== user);
      router.push({
        pathname: `/chat/${roomId}`,
        query: { roomId: roomId, roomName: roomName[0] },
      });
    }
  };
  return (
    <>
      {userLists.map((v) => (
        <Container
          key={v}
          onClick={() => {
            createPrivateRoom(v);
          }}
        >
          <img src="/images/profile.png" alt="프로필"></img>
          <p>{v}</p>
        </Container>
      ))}
    </>
  );
};

const Container = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  margin-left: 20px;
  cursor: pointer;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid;
    margin-right: 5px;
  }
  p {
    font-size: 1rem;
    margin-right: 10px;
  }
  :hover{
    p{
        color:#ff6161
    }
  }
`;
export default User;
