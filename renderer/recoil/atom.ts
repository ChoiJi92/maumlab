import {atom} from 'recoil'
export const currentUser = atom({
    key:'currentUser',
    default:""
})
export const userList = atom({
    key:'userList',
    default:[]
})
export const chatList = atom({
    key:'chatList',
    default:[]
})