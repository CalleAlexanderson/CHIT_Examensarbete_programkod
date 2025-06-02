import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { AccountContextType, LoginCredentials, User, SignUpCredentials } from "../Types/User.types";

const AccountContext = createContext<AccountContextType | null>(null);

interface AccountProviderProps {
    children: ReactNode
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [chatMembers, setChatMembets] = useState<User[] | []>([])

    // logga in
    const login = async (credentials: LoginCredentials) => {
        console.log("account cotnext lgon");

        try {
            const response = await fetch(`http://localhost:5054/api/user/login/${credentials.username}/${credentials.password}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error;
            }

            const data = await response.json() as any;
            console.log(data);
            setUser(data.user)
            localStorage.setItem('jwt', data.token);
            localStorage.setItem('user', data.user.username);
        } catch (error) {
            console.log(error);

            throw error;
        }
    }

    // skapa konto
    const registerAccount = async (credentials: SignUpCredentials) => {

        try {
            const response = await fetch("http://localhost:5054/api/user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            })


            if (!response.ok) {
                console.log(response);

            }

            const data = await response.json() as any;
            console.log(data);

        } catch (error) {
            throw error;
        }
    }

    const changeChatMembers = (members: User[]) => {
        console.log(members);
        setChatMembets(members);
    }

    // ändra användarnamn
    const changeUsername = async (newName: string) => {
        console.log("change name");
        const jwt = localStorage.getItem("jwt")
        let key: string = "Bearer " + jwt;

        try {
            const response = await fetch(`http://localhost:5054/api/user/${user?.username}`, {
                method: "PUT",
                headers: {
                    'authorization': key,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newUsername: newName,
                    avatar: ""
                })
            })

            if (!response.ok) {
                throw new Error;
            }

            const data = await response.json() as any;
            console.log(data);

            localStorage.setItem('user', data.user.username);
            setUser(data.user);
        } catch (error) {
            console.log(error);

            throw error;
        }
    }

    // ändra användarnamn
    const changeAvatar = async (newImg: string) => {
        console.log("change avatar");
        const jwt = localStorage.getItem("jwt")
        let key: string = "Bearer " + jwt;
        let body = JSON.stringify({
            newUsername: user?.username,
            avatar: newImg
        })

        try {
            const response = await fetch(`http://localhost:5054/api/user/${user?.username}`, {
                method: "PUT",
                headers: {
                    'authorization': key,
                    'Content-Type': 'application/json'
                },
                body: body
            })

            if (!response.ok) {
                console.log(response);
            }

            const data = await response.json() as any;
            console.log(data);
            setUser(data.user);
        } catch (error) {

            console.log(error);

            throw error;
        }
    }

    // logga ut
    const logout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        setUser(null);
    }

    // kollar om JWT fortfarande är giltig
    const checkJwt = async () => {
        // hämtar jwt och user från storage
        const jwt = localStorage.getItem("jwt")
        const storedUser = localStorage.getItem("user")


        // kollar om JWT finns (om någon tidigare loggat in på sidan)
        if (!jwt) {
            return false;
        }
        console.log("checkar jwt");

        // kollar med backend om jwt är giltig om inte så loggas användaren ut
        let key: string = "Bearer " + jwt;
        try {
            const response = await fetch(`http://localhost:5054/api/user/verify/${storedUser}`, {
                method: "POST",
                headers: {
                    'authorization': key
                }
            })

            if (response.ok) {
                const data = await response.json() as any;
                console.log(data.user);

                setUser(data.user);
                
            }

            if (response.status == 401) {
                logout();
                return false;
            }

        } catch (error) {
            logout();
            return false;
        }
        return true;
    }

    useEffect(() => {
        checkJwt();
    }, [])

    return (
        <AccountContext.Provider value={{ user, chatMembers, login, logout, registerAccount, checkJwt, changeUsername, changeAvatar, changeChatMembers }}>
            {
                children
            }
        </AccountContext.Provider>
    )
}



// låter andra filer använda AccountContext
export const UseAccount = (): AccountContextType => {
    const context = useContext(AccountContext);

    if (!context) {
        throw new Error("useAccount måste har AccountProvider");
    }

    return context;
}