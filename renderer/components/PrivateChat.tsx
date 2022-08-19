import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { db } from "../firebase";
import { currentUser, roomList } from "../recoil/atom";

const PrivateChat = () => {
  const [user, setUser] = useRecoilState(currentUser);
  const [roomLists, setRoomLists] = useRecoilState(roomList);
  const router = useRouter();
  useEffect(() => {
    const loadRoom = async () => {
      const docRef = collection(db, "room");
      const q = query(docRef, where("userList", "array-contains", user));
      interface room {
        id: string;
        roomName: string;
      }
      let roomList: room[] = [];
      const room = await getDocs(q);
      room.forEach((doc) => {
        roomList.push({
          id: doc.id,
          roomName: doc.data().userList.filter((v: string) => v !== user)[0],
        });
      });
      setRoomLists([...roomList]);
    };
    loadRoom();
  }, []);
  return (
    <>
      {roomLists.map((v) => (
        <Container
          key={v.id}
          onClick={() => {
            router.push({
              pathname: `/chat/${v.id}`,
              query: { roomId: v.id, roomName: v.roomName },
            });
          }}
        >
          <img src="/images/profile.png" alt="프로필"></img>
          <p>{v.roomName}님과의 대화방</p>
        </Container>
      ))}
    </>
  );
};

const Container = styled.div`
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
  :hover {
    p {
      color: #ff6161;
    }
  }
`;
export default PrivateChat;
