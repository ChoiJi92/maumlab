import { signOut } from 'firebase/auth';
import { collection, getDocs, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useRecoilState} from 'recoil';
import styled from 'styled-components';
import Link from '../components/Link';
import Menu from '../components/Menu';
import { auth, db } from '../firebase';
import { currentUser } from '../recoil/atom';

const Main = () => {
    const [user, setUser] = useRecoilState(currentUser)
    const router = useRouter()
    useEffect( () =>{
        const loadUser = async ()=>{
        const docRef= collection(db,'users')
        const q = query(docRef)
        let userList : string[] = [];
        const user = await getDocs(q)
        user.forEach((doc) => {
            userList.push (doc.data().name)
        }
        )
    }
    loadUser()
    },[])
    return (
        <Container>
            <Menu/>
            <Wrap>
            
           <button onClick={()=>{
            signOut(auth)
            setUser("")
            router.push('/home')
           }}>로그아웃</button>
           </Wrap>
        </Container>
    );
};
const Container= styled.div`
    display: flex;
    flex-direction: row;
`
const Wrap = styled.div`
    width: 80%;
    border: 1px solid;
`
export default Main;