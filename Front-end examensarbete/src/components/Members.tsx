import GroupsIcon from '../assets/group_icon.png'
import { useState } from 'react';
import './css/Members.css'
import { UseAccount } from '../Context/AccountContext';

const MembersMenu = () => {
    const [membersMenuClasses, setMembersMenuClasses] = useState('color-primary members-menu members-menu-hidden');
    const { chatMembers } = UseAccount();

    const openMembersMenu = () => {
        if (membersMenuClasses == 'color-primary members-menu members-menu-hidden') {
            setMembersMenuClasses('color-primary members-menu')
        } else {
            setMembersMenuClasses('color-primary members-menu members-menu-hidden')
        }
    }

    return (
        <>
            {
                chatMembers.length > 0 && <>
                    <img className='open-members-icon' src={GroupsIcon} alt="View members" onClick={openMembersMenu} />


                    <section className={membersMenuClasses}>
                        <img className='back-members-icon' src={GroupsIcon} alt="Close members" onClick={openMembersMenu} />
                        <div className='color-secondary text-primary members-div'>

                            <h1 className='text-primary'>Members - {chatMembers.length}</h1>

                            <div className='friends-menu text-primary'>
                                {

                                    chatMembers.map((friend, index) => (
                                        <div key={index} className='member-div pos-rel'>
                                            <img src={friend.avatar} alt={friend.username + " profile picture"} />
                                            <p className='middle-text'>{friend.username}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </section></>
            }

        </>
    )
}

export default MembersMenu