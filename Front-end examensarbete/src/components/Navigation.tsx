import FriendsIcon from '../assets/friend_icon.png'
import GroupsIcon from '../assets/group_icon.png'
import ArrowIcon from '../assets/back_arrow_icon.png'
import './css/Navigation.css'
import ChatProfileNavigation from './ProfileNavigation';
import { useEffect, useState } from 'react';
import { UseAccount } from '../Context/AccountContext';
import { User } from "../Types/User.types";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Message } from '../Types/faces.types';
import Chatroom from './ChatComponents/Chatroom';
import { UseFriend } from '../Context/FriendsContext';

const ChatNavigation = () => {

    const [chatsMenuClasses, setChatsMenuClasses] = useState('color-primary chats-menu chats-menu-hidden');
    const [directChatSwitchClasses, setDirectChatSwitchClasses] = useState('color-secondary text-primary chat-switch active');
    const [groupChatSwitchClasses, setGroupChatSwitchClasses] = useState('color-secondary text-primary chat-switch');
    const [connection, setConnection] = useState<HubConnection>();
    const [messages, setMessages] = useState<Message[]>();
    const [currentChat, setCurrentChat] = useState('');

    const openChatsMenu = () => {
        if (chatsMenuClasses == 'color-primary chats-menu chats-menu-hidden') {
            setChatsMenuClasses('color-primary chats-menu')
        } else {
            setChatsMenuClasses('color-primary chats-menu chats-menu-hidden')
        }
    }

    // används för att anropa funktion i ChatProfileNavigation
    const [closeMenu] = useState(0);
    const { user, changeChatMembers } = UseAccount();
    const { friends, GetFriends } = UseFriend();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (mounted) {
            updateFriends();
        } else {
            console.log("mounted");
            setMounted(true)
        }
    }, [user])

    const updateFriends = async () => {
        await GetFriends()
    }

    // Skapar chatroom id med båda användares id
    const checkAlp = async (fr: User, event: HTMLElement) => {

        // tar bort active klassen på alla element i map
        if (event.parentElement) {
            for (let index = 0; index < event.parentElement.children.length; index++) {
                event.parentElement.children[index].classList.remove("active")
            }
        }
        // lägger till active klassen på elementet som klickats på
        event.classList.add("active")
        let chatroom = "";
        if (user) {
            if (user?.username > fr.username) {
                console.log("myname is greater");
                console.log(`${fr.friendId}-${user.friendId}`);
                chatroom = `${fr.friendId}-${user.friendId}`;

            } else if (user?.username < fr.username) {
                console.log("fr is greater");
                console.log(`${user.friendId}-${fr.friendId}`);
                chatroom = `${user.friendId}-${fr.friendId}`;
            }

        }
        console.log(chatroom);
        let members: User[] = []
        if (user) {
            members.push(user)
            members.push(fr)
        }
        changeChatMembers(members)
        setCurrentChat(fr.username);

        if (user) {
            JoinChatRoom(user.username, fr.username, chatroom, event);
        }
    }

    const JoinChatRoom = async (username: string, friend: string, chatroom: string, div: HTMLElement) => {
        try {
            const conn = new HubConnectionBuilder().withUrl("http://localhost:5054/chat")
                .configureLogging(LogLevel.Information).build();

            conn.on("ReceiveSenderStart", (name: any, msg: any, times: any) => {
                setMessages([]);
                for (let index = 0; index < msg.length; index++) {
                    setMessages(messages => [...(messages || []),
                    {
                        sender: true, username: name, message: msg[index],
                        dateTime: times[index], date: new Date(times[index])
                    }])
                }
            });

            conn.on("ReceiveReceiverStart", (name: any, msg: any, times: any) => {
                for (let index = 0; index < msg.length; index++) {
                    setMessages(messages => [...(messages || []),
                    {
                        sender: false, username: name, message: msg[index],
                        dateTime: times[index], date: new Date(times[index])
                    }])
                }
            });

            conn.on("ReceiveSpecificMessage", (name: any, msg: any) => {
                let sender: boolean;
                if (user?.username == name) {
                    sender = true
                } else {
                    sender = false
                }
                let date: Date = new Date()
                let todayDate: string = (new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000))).toISOString()
                let dateTime: string = `${todayDate.substring(0, 10)} ${todayDate.substring(11, 19)}`
                setMessages(messages => [...(messages || []), 
                {
                    sender: sender, message: msg, username: name, dateTime: dateTime, date: todayDate
                }])
            });

            await conn.start();
            await conn.invoke("JoinSpecificChatRoom", { username, chatroom, friend });
            div.addEventListener('click', () => {
                conn.stop();
            })

            setConnection(conn);
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessage = async (message: string) => {
        let sender = user?.username;
        let receiver = currentChat;
        try {
            if (connection) {
                await connection.invoke("SendMessage", message, sender, receiver);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {
                !connection
                    ? <p>Anslut till chatt</p>
                    : <Chatroom messages={messages} sendMessage={sendMessage} />
            }
            <img className='open-chats-arrow' src={ArrowIcon} alt="View chats" onClick={openChatsMenu} />
            <section className={chatsMenuClasses}>
                <h1 className='text-primary'>Chats</h1>
                <img className='back-chats-arrow' src={ArrowIcon} alt="Close chats" onClick={openChatsMenu} />

                <div className='color-secondary text-primary chat-switch-menu'>

                    <button className={directChatSwitchClasses} onClick={() => {
                        if (directChatSwitchClasses == "color-secondary text-primary chat-switch active") {
                            setDirectChatSwitchClasses("color-secondary text-primary chat-switch")
                        } else {
                            setDirectChatSwitchClasses("color-secondary text-primary chat-switch active")
                            setGroupChatSwitchClasses("color-secondary text-primary chat-switch")
                        }
                    }}>
                        <img src={FriendsIcon} alt="Friends" />
                        <p className='font-large'>Friends</p>
                    </button>

                    <button className={groupChatSwitchClasses} onClick={() => {
                        if (groupChatSwitchClasses == "color-secondary text-primary chat-switch active") {
                            setGroupChatSwitchClasses("color-secondary text-primary chat-switch ")
                        } else {
                            setGroupChatSwitchClasses("color-secondary text-primary chat-switch active")
                            setDirectChatSwitchClasses("color-secondary text-primary chat-switch")
                        }
                    }}>
                        <img src={GroupsIcon} alt="Groups" />
                        <p className='font-large'>Groups</p>
                    </button>

                </div>
                <div className='friends-menu text-primary'>
                    {
                        friends.length > 0 ?
                            friends.map((friend) => (
                                <button key={friend.username} className='color-primary text-primary friend-div pos-rel' 
                                onClick={(e) => { checkAlp(friend, e.currentTarget) }}>
                                    <p>{friend.username}</p>
                                </button>
                            )) : <p>No friends</p>
                    }
                </div>
                < ChatProfileNavigation closeMenu={closeMenu} />
            </section>
        </>

    )
}

export default ChatNavigation