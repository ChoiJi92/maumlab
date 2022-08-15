import React, { useRef } from "react";
import styled from "styled-components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import Link from "../components/Link";
import { addDoc, collection } from "firebase/firestore";
import { useForm } from "react-hook-form";

const Signup = () => {
  const router = useRouter();
  interface formData {
    id: string;
    nickname: string;
    password: string;
    passwordCheck: string;
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<formData>();
  const onSubmit = async (data: formData) => {
    if (data.password !== data.passwordCheck) {
      setError(
        "passwordCheck",
        {
          message: "비밀번호를 확인해 주세요 :)",
        },
        { shouldFocus: true }
      );
    }
    try{
    await createUserWithEmailAndPassword(auth, data.id, data.password);
    await addDoc(collection(db, "users"), {
      user_id: data.id,
      name: data.nickname,
    });
    window.alert('회원가입이 완료 되었습니다 :)')
    router.push("/home");
    }catch(error){
      window.alert('이미 등록된 아이디 입니다!')
    }
  };
  return (
    <>
      <Container>
        <div style={{ fontSize: "2rem", marginBottom: "20px" }}>Sign Up</div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input>
            <label htmlFor="inputId">아이디 *</label>
            <input
              id="inputId"
              type="email"
              {...register("id", {
                required: true,
                pattern: {
                  value:
                    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
                  message: "아이디는 이메일 형식 입니다 :)",
                },
              })}
              placeholder="이메일"
            ></input>
            <p className="errorMessage">
              {errors.id?.type === "required" &&
                "아이디는 필수 입력사항 입니다 :)"}
              {errors.id?.type === "pattern" && errors.id?.message}
            </p>
          </Input>
          <Input>
            <label htmlFor="inputName">닉네임 *</label>
            <input
              id="inputName"
              {...register("nickname", {
                required: true,
                pattern: {
                  value: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9]{2,8}$/,
                  message: "닉네임은 한글, 영어, 숫자 조합 3~8자 입니다 :)",
                },
              })}
              placeholder="닉네임"
            ></input>
            <p className="errorMessage">
              {errors.nickname?.type === "required" &&
                "닉네임은 필수 입력사항 입니다 :)"}
              {errors.nickname?.type === "pattern" && errors.nickname?.message}
            </p>
          </Input>
          <Input>
            <label htmlFor="inputPassword">비밀번호 *</label>
            <input
              id="inputPassword"
              type="password"
              {...register("password", {
                required: true,
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@$!%*#?&])[0-9a-zA-Z@$!%*#?&]{8,10}$/,
                  message:
                    "비밀번호는 8 ~ 10자 영문, 숫자 및 특수문자조합으로 입력해 주세요 :)",
                },
              })}
              placeholder="숫자, 영문, 특수문자 조합 8~10자"
            ></input>
            <p className="errorMessage">
              {errors.password?.type === "required" &&
                "비밀번호는 8 ~ 10자 영문, 숫자 및 특수문자조합으로 입력해 주세요 :)"}
              {errors.password?.type === "pattern" && errors.password?.message}
            </p>
            <input
              id="inputPasswordCheck"
              type="password"
              {...register("passwordCheck", {
                required: true,
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@$!%*#?&])[0-9a-zA-Z@$!%*#?&]{8,10}$/,
                  message:
                    "비밀번호를 확인해 주세요 :)",
                },
              })}
              placeholder="비밀번호 확인"
            ></input>
            <p className="errorMessage">
              {errors.passwordCheck?.type === "required" &&
                "비밀번호를 확인해 주세요 :)"}
              {errors.passwordCheck?.type === "pattern" &&
                errors.passwordCheck?.message}
            </p>
          </Input>
          <Button type="submit">회원가입</Button>
        </Form>
        <Link href="/home">홈으로</Link>
      </Container>
    </>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  width: 80%;
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Input = styled.div`
  display: flex;
  flex-direction: column;
  color: #ff6161;
  font-size: 1.5rem;
  width: 30%;
  label {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
  p {
    color: red;
    font-size: 0.8rem;
  }
  input {
    width: 100%;
    height: 40px;
    border-radius: 7px;
    border: 1px solid #d9d9d9;
    padding-left: 10px;
    outline: none;
    :focus {
      border: 1px solid #ff6161;
    }
  }
`;

const Button = styled.button`
  width: 30%;
  height: 40px;
  background-color: #ff6161;
  margin: 10px;
  border-radius: 7px;
  color: white;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
`;
export default Signup;
