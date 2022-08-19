import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { db } from "../firebase";
import { currentUser, groupChatList, userList } from "../recoil/atom";

const GroupChat = () => {
  const user = useRecoilValue(currentUser);
  const [groupChat, setGroupChat] = useRecoilState(groupChatList);
  const router = useRouter();
  interface room {
    id: string;
    roomName?: string;
    userList?: string[];
  }
  const createGroupChat = async () => {
    const data = {
      roomName: `${user}님의 그룹채팅방`,
      userList: [user],
    };
    const docRef = await addDoc(collection(db, "grouproom"), data);
    const room = await getDoc(docRef);
    const roomData: room = { id: room.id, ...room.data() };
    const roomId = roomData.id;
    const userCount = roomData.userList.length;
    router.push({
      pathname: `/groupchat/${roomId}`,
      query: { roomId: roomId, userCount: userCount },
    });
  };
  useEffect(() => {
    const loadGroupChat = async () => {
      const docRef = collection(db, "grouproom");
      const q = query(docRef);
      let groupChatList: room[] = [];
      const groupChat = await getDocs(q);
      groupChat.forEach((doc) => {
        groupChatList.push({ id: doc.id, ...doc.data() });
      });
      setGroupChat([...groupChatList]);
    };
    loadGroupChat();
  }, []);
  const joinGroupChat = async(data:room)=>{
    const docRef = doc(db, "grouproom", data.id);
    await updateDoc(docRef, {userList :arrayUnion(user)});

    router.push({
        pathname: `/groupchat/${data.id}`,
        query: { roomId: data.id, userCount: data.userList.includes(user) ? data.userList.length : data.userList.length +1 },
      });
  }
  return (
    <Container>
      <button
        onClick={() => {
          createGroupChat();
        }}
      >
        그룹채팅방 만들기
      </button>
      {groupChat.map((v) => (
        <List
          key={v.id}
          onClick={() => {
            joinGroupChat(v)
          }}
        >
          <img src="/images/profile.png" alt="프로필"></img>
          <div>
            <p>{v.roomName}</p>
            <p style={{fontSize:'0.8rem'}}>참여인원 : {v.userList.length}명</p>
          </div>
        </List>
      ))}
    </Container>
  );
};

const Container = styled.div`
  button {
    margin-left: 20px;
    margin-bottom: 20px;
  }
`;
const List = styled.div`
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
    margin-right: 5px;
    border: 1px solid;
  }
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      margin: 0;
      font-size: 1rem;
    }
  }
`;
export default GroupChat;
