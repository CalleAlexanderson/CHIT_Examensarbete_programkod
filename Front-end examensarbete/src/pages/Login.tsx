import { useEffect, useState } from 'react';
import Logo from '../assets/chit_logo.png'
import './Login.css'
import { UseAccount } from '../Context/AccountContext';
import { LoginCredentials } from '../Types/User.types';
import { useNavigate } from 'react-router-dom';
import { UseFriend } from '../Context/FriendsContext';

const LoginPage = () => {

    const { login, user } = UseAccount()
    const { GetFriends } = UseFriend();

    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState<LoginCredentials>({
        username: "",
        password: "",
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (mounted) {
            updateFriends();
            navigate('/');
        } else {
            setMounted(true)
        }
    }, [user])

    const updateFriends = async () => {
        await GetFriends()
    }

    const SubmitLoginForm = () => {
        console.log("logga in");
        const validationErrors = validateForm(loginForm);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("finns errors");
        } else {
            setErrors({});
            console.log("inga errors");
            postToDb();
        }
    }

    const postToDb = async () => {
        console.log("posted login");
        console.log(loginForm);

        if (loginForm.username && loginForm.password) {
            const credentials: LoginCredentials = {
                username: loginForm.username,
                password: loginForm.password
            }
            await login(credentials);
            navigate('/');

        }

        console.log(localStorage.getItem('jwt'));
        console.log(localStorage.getItem('user'));
    }

    const [errors, setErrors] = useState<LoginCredentials>({});

    // validerar formuläret
    const validateForm = (data: LoginCredentials) => {

        const validationErrors: LoginCredentials = {};

        if (!data.username) {
            validationErrors.username = "Username can't be left empty"
        } else {
            if (data.username.length < 3) {
                validationErrors.username = "Username must be atleast 3 characters long"
            } else if (data.username.length > 15) {
                validationErrors.username = "Username cant be longer than 15 characters long"
            }
        }

        if (!data.password) {
            validationErrors.password = "Password can't be left empty"
        } else {
            if (data.password.length < 8) {
                validationErrors.password = "Password must be atleast 8 characters long"
            }
        }

        return validationErrors;
    }

    return (
        <>
            <div className='color-primary login-background-div'>
                <img className='logo' src={Logo} alt="Chit logo" />
                <div className='color-secondary login-div'>
                    <form onSubmit={e => {
                        e.preventDefault();
                        SubmitLoginForm();
                    }}>
                        <div>
                            <label className='text-primary font-large' htmlFor="username">Username:</label>
                            <input className='font-large' id='username' name='username' type="text" value={loginForm.username} onChange={(e) => { setLoginForm({ ...loginForm, username: e.target.value }); }} placeholder='username' />
                            {errors.username && <span className="text-primary input-error">{errors.username}</span>}
                        </div>
                        <div>
                            <label className='text-primary font-large' htmlFor="password">Password:</label>
                            <input className='font-large' id='password' name='password' type="text" value={loginForm.password} onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }); }} placeholder='password' />
                            {errors.password && <span className="text-primary input-error">{errors.password}</span>}
                        </div>
                        <button className='font-large login-button' type="submit">Login</button>
                        <p className='font-small text-primary switch-login'>Dont have an account? <button role="link" className='color-secondary text-primary login-link' onClick={() => {
                            navigate("/signup")
                        }}>Sign up</button></p>
                    </form>
                </div>
            </div>
        </>

    )
}

export default LoginPage