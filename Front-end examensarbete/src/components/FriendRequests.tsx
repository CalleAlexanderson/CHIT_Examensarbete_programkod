import './css/Menus.css'
import AcceptedRequests from './RequestChildComponents/AcceptedRequests'
import PendingRequests from './RequestChildComponents/PendingRequests'
import { useState } from 'react';

const FriendRequests = () => {

    const [pendingClasses, setPendingClasses] = useState('font-large color-primary text-primary current-side');
    const [acceptedClasses, setAcceptedClasses] = useState('font-large color-primary text-primary');

    const [pendingDivClasses, setPendingDivClasses] = useState('');
    const [acceptedDivClasses, setAcceptedDivClasses] = useState('hidden');
    
        const switchSide = () => {
            if (pendingClasses == 'font-large color-primary text-primary current-side') {
                setAcceptedClasses('font-large color-primary text-primary current-side')
                setPendingClasses('font-large color-primary text-primary')
                setAcceptedDivClasses('')
                setPendingDivClasses('hidden')
            } else {
                setAcceptedClasses('font-large color-primary text-primary')
                setPendingClasses('font-large color-primary text-primary current-side')
                setAcceptedDivClasses('hidden')
                setPendingDivClasses('')
            }
        }

    return (
        <div className='color-primary text-primary friend-request-div'>
            <div className='friend-request-buttons-div'>
                <button className={pendingClasses} onClick={switchSide}>Pending</button>
                <span></span>
                <button className={acceptedClasses} onClick={switchSide}>Accepted</button>
            </div>
            <div>
                <div className={acceptedDivClasses}>
                    < AcceptedRequests />
                </div>
                <div className={pendingDivClasses}>
                    <PendingRequests />
                </div>
            </div>
        </div>
    )
}

export default FriendRequests