import React, { useRef, useState } from "react";
import Head from "next/head";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "../components/Link";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {currentUser} from '../recoil/atom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      paddingTop: theme.spacing(4),
    },
  })
);

function Home() {
  const classes = useStyles({});
  const id = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const router = useRouter()
  const [user, setUser] = useRecoilState(currentUser)
  const login = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        id.current.value,
        password.current.value
      );
      const docRef= collection(db,'users')
      const q = query(docRef, where('user_id', '==', auth.currentUser?.email))
      let currentuser : string;
      const user = await getDocs(q)
      user.forEach((doc) => {
          currentuser = doc.data().name
      }
      )
      setUser(currentuser)
      router.push('/main')
    } catch {
      window.alert("아이디와 비밀번호를 확인해 주세요 :)");
    }
  };
  const onKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      login();
    }
  };
  return (
    <React.Fragment>
      <Head>
        <title>마음연구소 채팅 프로그램</title>
      </Head>
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Log In
        </Typography>
        <img src="/images/maumLogo.webp" />
        <InputWrap>
          <input type="email" id="id" placeholder="아이디" ref={id}></input>
          <input
            type="password"
            id="password"
            placeholder="비밀번호"
            ref={password}
            onKeyPress={onKeyPress}
          ></input>
          <button onClick={login}>로그인</button>
          <div>
            <p>아직 회원이 아니신가요?</p>
            <Link href="/signup">회원가입</Link>
          </div>
        </InputWrap>
      </div>
    </React.Fragment>
  );
}

const InputWrap = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  input {
    width: 30%;
    height: 40px;
    border-radius: 7px;
    border: 1px solid #d9d9d9;
    margin-bottom: 10px;
    padding-left: 10px;
    outline: none;
    :focus {
      border: 1px solid #ff6161;
    }
  }
  button {
    width: 30%;
    background-color: #ff6161;
    border: none;
    height: 40px;
    border-radius: 7px;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
  }
  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    p {
      margin-right: 10px;
    }
  }
`;
export default Home;
