import '../css/Menus.css'
import './RequestChildComponents.css'
import { useEffect, useState } from 'react';
import { UseAccount } from '../../Context/AccountContext';
import { UseFriend } from '../../Context/FriendsContext';

const PendingRequests = () => {

    const { user } = UseAccount();
    const { GetFriendRequests, AcceptFriendRequest, RejectFriendRequest, friendRequests } = UseFriend();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (mounted) {
            updateFriendRequests();
        } else {
            setMounted(true)
        }
    }, [user])

    const updateFriendRequests = async () => {
        await GetFriendRequests()
    }

    const acceptFriendRequest = (friendName: string) => {
        console.log(friendName+" accepted");
        AcceptFriendRequest(friendName);
    }

    const rejectFriendRequest = (friendName: string) => {
        console.log(friendName+" rejected");
        RejectFriendRequest(friendName);
    }

    return (
        <>
            {
                friendRequests.length > 0 &&
                    friendRequests.map((friend, index) => (
                        <div key={index} className='request-div'>
                            <img className='request-div-avatar' src={friend.avatar} alt="" />
                            <div className='request-div-div'>
                                <p className='friend-id'>ID: {friend.friendId}</p>
                                <p className='font-small'>{friend.username}</p>
                            </div>
                            <button className='accept-friend-button' onClick={() => {acceptFriendRequest(friend.username)}}>+</button>
                            <button className='reject-friend-button' onClick={() => {rejectFriendRequest(friend.username)}}>x</button>
                        </div>
                    ))
            }
        </>
    )
}

export default PendingRequests