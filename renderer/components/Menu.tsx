import React from "react";
import styled from "styled-components";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { menu } from "../recoil/atom";
const Menu = () => {
  const router = useRouter()
  const [currentMenu, setCurrentMenu] = useRecoilState(menu)
  return (
    <Container menu={currentMenu}>
      <div className="user" onClick={()=>{
        setCurrentMenu('user')
        router.push('/main')
      }}>
        <PersonIcon />
        <p>유저 목록</p>
      </div>
      <div className="privateChat" onClick={()=>{
        setCurrentMenu('privateChat')
        router.push('/main')
      }}>
        <ChatBubbleOutlineIcon/>
      <p>1:1 채팅</p>
      </div>
      <div className="groupChat" onClick={()=>{
        setCurrentMenu('groupChat')
        router.push('/main')
      }}>
        <PeopleAltOutlinedIcon/>
      <p>그룹 채팅</p>
      </div>

    </Container>
  );
};

const Container = styled.div<{menu:string}>`
  width: 20%;
  height: 100vh;
  background-color: #ff6161;
  padding: 10px;
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    :hover{
        color: black;
    }
    p{
        margin-left: 10px;
    }
  }
  .${(props)=>props.menu}{
    color: black;
  }
`;
export default Menu;
