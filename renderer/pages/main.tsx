import { signOut } from "firebase/auth";
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
import Link from "../components/Link";
import Menu from "../components/Menu";
import { auth, db } from "../firebase";
import { currentUser, userList } from "../recoil/atom";

const Main = () => {
  const [user, setUser] = useRecoilState(currentUser);
  const [userLists, setUserLists] = useRecoilState(userList);
  const router = useRouter();
  // const nickName = localStorage.getItem("nickName");
  useEffect(() => {
    const loadUser = async () => {
      const docRef = collection(db, "users");
      console.log(user, "현재 유저");
      const q = query(docRef, where("name", "!=", user));
      let userList: string[] = [];
      const nickname = await getDocs(q);
      nickname.forEach((doc) => {
        userList.push(doc.data().name);
      });
      setUserLists([...userList]);
    };
    loadUser();
  }, []);
  const queryClient = useQueryClient();
  const createRoom = useMutation(
    ["createRoom"],
    async (data: data) => {
      const q = query(
        collection(db, "room")
        // where("userList", "==", data.userList)
      );
      const roomData = await getDocs(q);
      let roomId: string;
      let roomName: string;
      roomData.forEach((doc) => {
        if (
          doc.data().userList.includes(user) &&
          doc.data().userList.includes(data.roomName)
        ) {
          roomId = doc.id;
          roomName = doc.data().userList.filter((v:string)=>v !== user);
        }
      });
      if (roomId) {
        router.push({
          pathname: `/chat/${roomId}`,
          query: { roomId: roomId, roomName: roomName[0] },
        });
      } else {
        console.log("여기 엘스문");
        const docRef = await addDoc(collection(db, "room"), data);
        const room = await getDoc(docRef);
        const roomData : any = { id: room.id, ...room.data() };
        const roomId = roomData.id
        const roomName = roomData.userList.filter((v:string)=>v !== user)
        router.push({
          pathname: `/chat/${roomId}`,
          query: { roomId: roomId, roomName: roomName[0] },
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("content");
      },
    }
  );
  interface data {
    roomName: string;
    userList: string[];
    max: number;
  }
  const createPrivateRoom = (v: string) => {
    const data = {
      roomName: v,
      userList: [v, user],
      max: 2,
    };
    createRoom.mutate(data);
  };
  return (
    <Container>
      <Menu />
      <Wrap>
        <Header>
          <div>
            <img src="/images/profile.png" alt="프로필"></img>
            <p>{user}</p>
          </div>
          <button
            onClick={() => {
              signOut(auth);
              setUser("");
              router.push("/home");
            }}
          >
            로그아웃
          </button>
        </Header>
        {userLists.map((v) => (
          <div
            className="user"
            key={v}
            onClick={() => {
              createPrivateRoom(v);
            }}
          >
            <img src="/images/profile.png" alt="프로필"></img>
            <p>{v}</p>
          </div>
        ))}
      </Wrap>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: row;
`;
const Wrap = styled.div`
  width: 80%;
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .user {
    margin-bottom: 10px;
    margin-left: 20px;
    cursor: pointer;
  }
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
  button {
  }
`;
const Header = styled.div`
  width: 100%;
  height: 70px;
  border-bottom: 1px solid;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 10px;
  margin-bottom: 10px;
  p {
    font-size: 1rem;
    margin-right: 10px;
  }
  button {
    border: none;
    background-color: transparent;
    font-size: 1rem;
    cursor: pointer;
    :hover {
      color: #ff6161;
    }
  }
`;
export default Main;
