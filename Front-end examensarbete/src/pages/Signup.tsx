import { useState } from 'react';
import Logo from '../assets/chit_logo.png'
import './Login.css'
import { UseAccount } from '../Context/AccountContext';
import { SignUpCredentials } from '../Types/User.types';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const { registerAccount } = UseAccount()
    const navigate = useNavigate();

    const [signUpForm, setSignUpForm] = useState<SignUpCredentials>({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const signUp = () => {
        console.log("sign up");
        const validationErrors = validateForm(signUpForm);

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
        console.log(signUpForm);

        if (signUpForm.username && signUpForm.password) {
            const credentials: SignUpCredentials = {
                email: signUpForm.email,
                username: signUpForm.username,
                password: signUpForm.password
            }
            await registerAccount(credentials)
            navigate('/login');
        }
    }

    const [errors, setErrors] = useState<SignUpCredentials>({});

    // validerar formuläret
    const validateForm = (data: SignUpCredentials) => {
        const validationErrors: SignUpCredentials = {};

        if (!data.email) {
            validationErrors.email = "Email can't be left empty"
        }

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

        if (!data.confirmPassword) {
            validationErrors.confirmPassword = "Confirm password can't be left empty"
        } else {
            if (data.password != data.confirmPassword) {
                validationErrors.confirmPassword = "Password and Confirm password must be the same"
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
                        signUp();
                    }}>
                        <div>
                            <label className='text-primary font-large' htmlFor="email">Email:</label>
                            <input className='font-large' id='email' name='email' type="email" value={signUpForm.email} onChange={(e) => { setSignUpForm({ ...signUpForm, email: e.target.value }); }} placeholder='email' />
                            {errors.email && <span className="text-primary input-error">{errors.email}</span>}
                        </div>
                        <div>
                            <label className='text-primary font-large' htmlFor="username">Username:</label>
                            <input className='font-large' id='username' name='username' type="text" value={signUpForm.username} onChange={(e) => { setSignUpForm({ ...signUpForm, username: e.target.value }); }} placeholder='username' />
                            {errors.username && <span className="text-primary input-error">{errors.username}</span>}
                        </div>
                        <div>
                            <label className='text-primary font-large' htmlFor="password">Password:</label>
                            <input className='font-large' id='password' name='password' type="text" value={signUpForm.password} onChange={(e) => { setSignUpForm({ ...signUpForm, password: e.target.value }); }} placeholder='password' />
                            {errors.password && <span className="text-primary input-error">{errors.password}</span>}
                        </div>
                        <div>
                            <label className='text-primary font-large' htmlFor="confirmPassword">Confirm password:</label>
                            <input className='font-large' id='confirmPassword' name='confirmPassword' type="text" value={signUpForm.confirmPassword} onChange={(e) => { setSignUpForm({ ...signUpForm, confirmPassword: e.target.value }); }} placeholder='password' />
                            {errors.confirmPassword && <span className="text-primary input-error">{errors.confirmPassword}</span>}
                        </div>
                        <button className='font-large login-button' type="submit">Sign up</button>
                        <p className='font-small text-primary switch-login'>Already have an account? <button role="link" className='color-secondary text-primary login-link' onClick={() => {
                            navigate("/login")
                        }}>Login</button></p>
                    </form>
                </div>
            </div>
        </>

    )
}
export default SignUpPage