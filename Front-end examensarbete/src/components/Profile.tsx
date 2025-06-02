import { useState } from 'react';
import Placeholder from '../assets/placeholder_img.png'
import { UseAccount } from '../Context/AccountContext'
import './css/Menus.css'
import { User } from '../Types/User.types';

const Profile = () => {
    const { user, changeUsername, changeAvatar, chatMembers, changeChatMembers, logout } = UseAccount();
    const [newUsername, setNewUsername] = useState(user?.username);
    const [currentUsername, setCurrentUsername] = useState(user?.username);
    const [img, setImg] = useState(user?.avatar);
    const [newImg, setNewImg] = useState("");
    const [imgBtnDisabled, setImgBtnDisabled] = useState(true);



    const changeName = () => {
        if (newUsername) {
            const validationErrors = validateForm(newUsername);

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                console.log("finns errors");
            } else {
                setErrors("");
                console.log("inga errors");
                postToDb();

            }
        }
    }

    const changeImg = () => {

        if (newImg) {
            changeAvatar(newImg)
            // uppdaterar avatar i members
            let tempMembers: User[] = chatMembers;
            tempMembers[0].avatar = newImg;
            changeChatMembers(tempMembers);
        }
    }

    const postToDb = async () => {
        console.log("post to db");

        try {
            if (newUsername) {
                await changeUsername(newUsername);
                setCurrentUsername(newUsername);
                // uppdaterar namnet i members
                let tempMembers: User[] = chatMembers;
                tempMembers[0].username = newUsername;
                changeChatMembers(tempMembers);
            }
        } catch (error) {
            console.log(error);
            setNewUsername(currentUsername);
        }
    }

    const [errors, setErrors] = useState<string>("");

    // validerar formuläret
    const validateForm = (data: string) => {
        let validationErrors: string = "";

        if (!data) {
            validationErrors = "Username can't be left empty"
        } else {
            if (data.length < 3) {
                validationErrors = "Username must be atleast 3 characters long"
            } else if (data.length > 15) {
                validationErrors = "Username cant be longer than 15 characters long"
            } else if (data === currentUsername) {
                validationErrors = "Current username is already this"
            }
        }

        return validationErrors;
    }

    const previewFile = (file: any) => {
        console.log("funkar");
        // console.log(file);

        let reader = new FileReader();
        reader.onloadend = function () {
            let x = reader.result;

            if (x) {
                console.log(x);
                x = x?.toString();
                setImg(x);
                setNewImg(x);
            }
        }

        if (file) {
            reader.readAsDataURL(file);
            setImgBtnDisabled(false);
        } else {
            setImg(user?.avatar)
        }
    }



    return (
        <div className='color-primary text-primary profile-div'>
            <div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    changeImg();
                }}>
                    <img src={img} alt="Profile image" />
                    <label htmlFor="avatar" className='visually-hidden'>New profile image</label>
                    <input className='text-primary color-primary avatar-input' type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={e => {
                        if (e.target.files) {
                            previewFile(e.target.files[0]);
                        }
                    }} />
                    <button className='text-primary color-secondary font-small image-change-button' disabled={imgBtnDisabled}>Change image</button>
                </form>
            </div>
            <div>
                <p className='font-small'>ID: {user?.friendId}</p>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    changeName();

                }}>
                    <label htmlFor="username" className='visually-hidden'>Username</label>
                    <input className='text-primary color-primary font-large' type="text" name="username" id="username" value={newUsername} onChange={(e) => { setNewUsername(e.target.value) }} />
                    {errors && <span className="text-primary input-error">{errors}</span>}
                    <div className='profile-button-div'>
                        <button type='submit' className='text-primary color-secondary font-small name-change-button'>Change name</button>
                        <button type='button' className='text-primary color-secondary font-small name-change-button' onClick={() => {
                            logout();
                        }}>Log out</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile