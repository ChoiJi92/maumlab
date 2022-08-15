import React from "react";
import styled from "styled-components";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
const Menu = () => {
  return (
    <Container>
      <div>
        <PersonIcon />
        <p>유저 목록</p>
      </div>
      <div>
        <ChatBubbleOutlineIcon/>
      <p>1:1 채팅</p>
      </div>
      <div>
        <PeopleAltOutlinedIcon/>
      <p>그룹 채팅</p>
      </div>

    </Container>
  );
};

const Container = styled.div`
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
`;
export default Menu;
