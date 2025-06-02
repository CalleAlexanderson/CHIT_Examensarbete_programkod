import '../css/Menus.css'
import './RequestChildComponents.css'
import FriendIcon from '../../assets/friend_icon.png'
import { UseFriend } from '../../Context/FriendsContext'

const AcceptedRequests = () => {

    const { friends, RemoveFriend } = UseFriend();

    const showFriendProfile = (friendName: string, element: HTMLElement) => {
        console.log(friendName + " prpfile");
        console.log(element.parentElement);
        console.log(element.parentElement?.parentElement);

        let divElement: HTMLElement;
        if (element.parentElement?.parentElement) {
            divElement = element.parentElement?.parentElement;
            for (let index = 0; index < divElement.children.length; index++) {
                console.log(divElement.children[index].children[4]);
                divElement.children[index].children[4].classList.add("hidden")
            }
            console.log(element.parentElement.children[4].classList.remove("hidden"));
        }
    }

    const hideFriendProfile = (element: HTMLElement) => {
        console.log(element.parentElement);
        element.parentElement?.classList.add("hidden")
    }

    const removeFriend = (friendName: string) => {
        console.log(friendName + " removed");
        RemoveFriend(friendName);
        // Måste se till att chatfönstret för vännen försvinner när vännen tas bort
    }

    return (
        <>

            {
                friends.length > 0 ?
                    friends.map((friend, index) => (
                        <div key={index} className='request-div'>
                            <img className='request-div-avatar' src={friend.avatar} alt="" />
                            <div className='request-div-div'>
                                <p className='friend-id'>ID: {friend.friendId}</p>
                                <p className='font-small'>{friend.username}</p>
                            </div>
                            <button className='profile-friend-button' onClick={(e) => { showFriendProfile(friend.username, e.currentTarget) }} ><img src={FriendIcon} alt="Profile" /></button>
                            <button className='reject-friend-button' onClick={() => { removeFriend(friend.username) }}>x</button>

                            <div className='color-primary text-primary friend-profile-div hidden'>
                                <button className='color-secondary text-primary close-friend-profile-btn' onClick={(e) => { hideFriendProfile(e.currentTarget) }}>X</button>
                                <div>
                                    <img src={friend.avatar} alt="Profile image" />
                                </div>
                                <div>
                                    <p className='font-small'>ID: {friend.friendId}</p>
                                    <p className='text-primary color-primary font-large'>{friend.username}</p>
                                </div>
                            </div>
                        </div>
                    )) : <p>No friends</p>
            }
        </>
    )
}

export default AcceptedRequests