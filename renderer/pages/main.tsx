import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
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
  useEffect(() => {
    const loadUser = async () => {
      const docRef = collection(db, "users");
      console.log(user, "현재 유저");
      const q = query(docRef, where("name", "!=", user));
      let userList: string[] = [];
      const nickName = await getDocs(q);
      nickName.forEach((doc) => {
        userList.push(doc.data().name);
      });
      setUserLists([...userList]);
    };
    loadUser();
  }, []);
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
          <div className="user" key={v} onClick={()=>{
            router.push(`/chat/${v}`)
          }}>
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
  .user{
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
  p{
    font-size: 1rem;
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
  p{
    font-size: 1rem;
    margin-right: 10px;
  }
  button{
    border: none;
    background-color: transparent;
    font-size: 1rem;
    cursor: pointer;
    :hover{
        color: #ff6161;
    }
  }
`;
export default Main;
