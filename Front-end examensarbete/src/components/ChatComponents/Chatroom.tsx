import { useEffect, useRef, useState } from "react";
import { Props } from "../../Types/faces.types";
import './Chatroom.css'
import { UseAccount } from "../../Context/AccountContext";

const Chatroom = ({ messages, sendMessage }: Props) => {
    const [message, setMessage] = useState('');
    messages?.sort((a, b) => a.date - b.date);
    const { chatMembers } = UseAccount();

    const containerRef = useRef<null | HTMLDivElement>(null); 

    useEffect(() => {
        const element = containerRef.current;
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }, [messages]); 

    return (
        <div className="chat-div" ref={containerRef}>
            {
                messages?.map((msg, index) => (
                    <div key={index}>
                        {
                            msg.sender ? <div className="sent-message">
                                <div className="message-name-sent"><p>{msg.username}</p><img className="message-avatar" src={chatMembers[0].avatar} alt={msg.username + "profile img"} /></div>
                                <p className="text-primary">{msg.message}</p>
                                <p className="font-small message-time-sent">{msg.dateTime}</p>
                            </div> : <div className="received-message">
                                <div className="message-name-receive"><img className="message-avatar" src={chatMembers[1].avatar} alt={msg.username + "profile img"} /><p>{msg.username}</p></div>
                                <p className="text-primary">{msg.message}</p>
                                <p className="font-small message-time-receive">{msg.dateTime}</p>
                            </div>
                        }
                    </div>
                ))}

            <div className="color-primary message-div">
                <form onSubmit={e => {
                    e.preventDefault();
                    sendMessage(message);
                    setMessage('');
                }}>
                    <input type="text" className="color-secondary text-primary message-input" onChange={e => { setMessage(e.target.value) }} value={message} />
                    <button type="submit" className="message-send-button" disabled={!message}>Send</button>
                </form>
            </div>
        </div>
    )
}

export default Chatroom;