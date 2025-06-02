import './css/ProfileNavigation.css'
import Placeholder from '../assets/placeholder_img.png'
import AddFriendIcon from '../assets/add_friend_icon.png'
import Notification from '../assets/noti_friend_icon.png'
import Edit from '../assets/edit_icon.png'
import { useEffect, useState } from 'react'
import Profile from './Profile'
import AddFriend from './AddFriend'
import FriendRequests from './FriendRequests'
import { UseAccount } from '../Context/AccountContext'
import { UseFriend } from '../Context/FriendsContext';

const ChatProfileNavigation = (closeMenu: any) => {

    useEffect(() => {
        if (closeMenu) {
            console.log("stänger menyer");
            
            closeMenus();
        }
    }, [closeMenu]);

    const { user } = UseAccount();
    const { GetFriendRequests } = UseFriend();

    const [profileMenuClasses, setProfileMenuClasses] = useState('color-secondary profile-menu');

    const openProfileMenu = () => {
        if (profileMenuClasses == 'color-secondary profile-menu open') {
            setProfileMenuClasses('color-secondary profile-menu')
        } else {
            setProfileMenuClasses('color-secondary profile-menu open')
        }
    }

    const [profileClasses, setprofileClasses] = useState('hidden');

    const showProfile = () => {
        
        if (profileClasses == 'hidden') {
            setprofileClasses('')
            setAddFriendClasses('hidden')
            setFriendRequestClasses('hidden')
        } else {
            setprofileClasses('hidden')
        }
    }

    const [addFriendClasses, setAddFriendClasses] = useState('hidden');

    const showAddFriend = () => {
        if (addFriendClasses == 'hidden') {
            setAddFriendClasses('')
            setprofileClasses('hidden')
            setFriendRequestClasses('hidden')
        } else {
            setAddFriendClasses('hidden')
        }
    }

    const [friendRequestClasses, setFriendRequestClasses] = useState('hidden');

    const showFriendRequest = () => {
        GetFriendRequests();

        setTimeout(function () {
            if (friendRequestClasses == 'hidden') {
                setFriendRequestClasses('')
                setprofileClasses('hidden')
                setAddFriendClasses('hidden')
            } else {
                setFriendRequestClasses('hidden')
            }
        }, 100);
    }

    const closeMenus = () => {
        setprofileClasses('hidden')
        setAddFriendClasses('hidden')
        setFriendRequestClasses('hidden')
    }

    return (
        <>
            <div className={profileMenuClasses}>
                <button className='text-primary profile-menu-open' onClick={openProfileMenu}>
                    <img src={user?.avatar} className='navigation-profile' alt="Profile image" />
                    <p>{user?.username}</p>
                </button>
                <button className='text-primary profile-menu-nav' onClick={showAddFriend}>
                    <img src={AddFriendIcon} alt="Add friend" />
                    <p>Add friend</p>
                </button>
                <button className='text-primary profile-menu-nav' onClick={showProfile}>
                    <img src={Edit} alt="Edit profile" />
                    <p>Edit profile</p>
                </button>
                <button className='text-primary profile-menu-nav' onClick={showFriendRequest}>
                    <img src={Notification} alt="Notifications" />
                    <p>Friend requests</p>
                </button>
            </div>
            <div className={addFriendClasses}>
                <AddFriend />
            </div>
            <div className={profileClasses}>
                <Profile />
            </div>
            <div className={friendRequestClasses}>
                <FriendRequests />
            </div>
        </>
    )
}

export default ChatProfileNavigation