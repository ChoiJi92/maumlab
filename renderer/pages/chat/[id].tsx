import { DefaultEventsMap } from "@socket.io/component-emitter";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { io } from "socket.io-client";
import styled from "styled-components";
import Menu from "../../components/Menu";
import { auth } from "../../firebase";
import { chatList, currentUser } from "../../recoil/atom";

const Chat = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useRecoilState(currentUser);
  const [chat, setChat] = useRecoilState(chatList);
  const chatBoxRef = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>(null);
  const socket = useRef(null)
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };
  const roomName = id + user;
  useEffect(() => {
    socket.current = io("http://localhost:3000");
    socket.current.emit("join-room", 1, user);
    socket.current.on("welcome", (nickname: string) => {
      //   setChat([
      //     ...chat,
      //     { messageChat: `${nickname}님이 입장하셨습니다.`, user: "system" },
      //   ]);
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);
  useEffect(() => {
    socket.current.on("message", (messageChat: string, user: string) => {
      setChat([...chat, { messageChat, user }]);
    });
    scrollToBottom();
    //   socket.on("welcome", (nickname:string) => {
    //       console.log('socket',nickname)
    //     setChat([
    //       ...chat,
    //       { messageChat: `${nickname}님이 입장하셨습니다.`, user: "system" },
    //     ]);
    //   });
    //   socket.on("bye", (nickname:string) => {
    //     setChat([
    //       ...chat,
    //       { messageChat: `${nickname}님이 퇴장하셨습니다.`, user: "system" },
    //     ]);
    //   });
  }, [chat]);
  console.log(chat)
  const sendMessage = (message: string) => {
    if (message !== "") {
      socket.current.emit("chat_message", message, user, 1);
      setChat([...chat, { messageChat: message, user: user }]);
      inputRef.current.value = "";
    }
  };
  const onKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      if (inputRef.current.value !== "") {
        sendMessage(inputRef.current.value);
      }
    }
  };
 
  return (
    <Container>
      <Menu />
      <Wrap>
        <div className="header">
          <div>
            <img src="/images/profile.png"></img>
            <p>{id}</p>
          </div>
          <div>
            <button
              onClick={() => {
                router.back();
              }}
            >
              뒤로가기
            </button>
            <button
              onClick={() => {
                signOut(auth);
                setUser("");
                router.push("/home");
              }}
            >
              로그아웃
            </button>
          </div>
        </div>
        <ChatList>
          {chat.map((v, i) =>
            v.user !== user ? (
              i === 0 || v.user !== chat[i - 1].user ? (
                <div className="message" key={`${v}-${i}`}>
                  <p>{v.user}</p>
                  <div>{v.messageChat}</div>
                </div>
              ) : (
                <div className="sameUserMessage" key={`${v}-${i}`}>
                  <div>{v.messageChat}</div>
                </div>
              )
            ) : (
              <div className="myMessage" key={`${v}-${i}`}>
                <div>{v.messageChat}</div>
              </div>
            )
          )}
        </ChatList>
        <InputWrap>
          <input
            ref={inputRef}
            placeholder="메세지를 입력해 주세요 :)"
            onKeyPress={onKeyPress}
          ></input>
          <button
            onClick={() => {
              sendMessage(inputRef.current.value);
            }}
          >
            전송
          </button>
        </InputWrap>
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
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid;
    height: 70px;
    div {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    button {
      margin-right: 10px;
      border: none;
      background-color: transparent;
      font-size: 0.9rem;
      cursor: pointer;
      :hover {
        color: #ff6161;
      }
    }
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 1px solid;
      margin-right: 10px;
    }
    p {
      font-size: 0.9rem;
    }
  }
`;
const ChatList = styled.div`
  height: 80%;
  background-color: #ffe0e0;
  overflow-y: auto;
  padding: 21px 16.26px 21px 11.13px;

  .message {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    p {
      margin-bottom: 5px;
    }
    div {
      border-radius: 6px 20px 20px 20px;
      border: 1px solid;
      padding: 5px 10px 5px 10px;
    }
  }
  .sameUserMessage {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 5px;
    div {
      border-radius: 6px 20px 20px 20px;
      border: 1px solid;
      padding: 5px 10px 5px 10px;
    }
  }
  .myMessage {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
    margin-right: 10px;
    div {
      border-radius: 20px 20px 6px 20px;
      border: 1px solid;
      padding: 5px 10px 5px 10px;
    }
  }
`;
const InputWrap = styled.div`
  margin-top: 20px;
  height: 8%;

  input {
    width: 80%;
    height: 100%;
    outline: none;
    padding: 10px;
  }
  button {
    width: 20%;
    height: 100%;
  }
`;
export default Chat;
