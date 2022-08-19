import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import GroupChat from "../components/GroupChat";
import Link from "../components/Link";
import Menu from "../components/Menu";
import PrivateChat from "../components/PrivateChat";
import User from "../components/User";
import { auth } from "../firebase";
import { currentUser, menu } from "../recoil/atom";

const Main = () => {
  const [user, setUser] = useRecoilState(currentUser);
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useRecoilState(menu);
  useEffect(()=>{
    let nickName = localStorage.getItem('nickName')
    setUser(nickName)
  },[])
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
              setCurrentMenu("user");
              router.push("/home");
            }}
          >
            로그아웃
          </button>
        </Header>
        {currentMenu === "user" ? (
          <User />
        ) : currentMenu === "privateChat" ? (
          <PrivateChat />
        ) : (
          <GroupChat />
        )}
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
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
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
