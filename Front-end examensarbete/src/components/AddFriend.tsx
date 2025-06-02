import { useState } from 'react';
import './css/Menus.css'
import { UseFriend } from '../Context/FriendsContext';

const AddFriend = () => {

    const { SendFriendRequest } = UseFriend();

    const [addFriendInput, setAddFriendInput] = useState("");

    const SubmitAddFriendForm = () => {
        const validationError = validateForm(addFriendInput);

        if (Object.keys(validationError).length > 0) {
            setError(validationError);
            setReturnMessage("");
            console.log("finns errors");
        } else {
            setError("");
            console.log("inga errors");
            postToDb();
        }
    }

    const postToDb = async () => {
        console.log(addFriendInput);
        setReturnMessage(await SendFriendRequest(addFriendInput));
        console.log(returnMessage);
    }
    const [error, setError] = useState("");
    const [returnMessage, setReturnMessage] = useState("");

    // validerar formuläret
    const validateForm = (data: string) => {
        let validationError: string = "";

        if (!data) {
            validationError = "name can't be left empty"
        } else {
            if (data.length < 3) {
                validationError = "name must be atleast 3 characters long"
            } else if (data.length > 15){
                validationError = "Username cant be longer than 15 characters long"
            }
        }

        return validationError;
    }

    return (
        <div className='color-primary text-primary add-friend-div'>
            <form onSubmit={e => {
                e.preventDefault();
                SubmitAddFriendForm();
            }}>

                <label htmlFor="code" className='text-primary font-large'>Friend name:</label>
                <input type="text" name="code" id="code" value={addFriendInput} onChange={(e) => { setAddFriendInput(e.target.value); }} />
                {error && <span className="text-primary input-error">{error}</span>}
                {returnMessage && <span className="text-primary input-error">{returnMessage}</span>}
                <button type="submit" className='text-primary color-secondary image-change-button'>Add friend</button>
            </form>

        </div>
    )
}

export default AddFriend