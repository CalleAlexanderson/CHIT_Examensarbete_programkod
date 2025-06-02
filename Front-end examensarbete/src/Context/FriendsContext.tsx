import { createContext, useState, useContext, ReactNode } from "react";
import { FriendContextType, User  } from "../Types/User.types";

const FriendContext = createContext<FriendContextType | null>(null);

interface FriendProviderProps {
    children: ReactNode
}

export const FriendProvider: React.FC<FriendProviderProps> = ({ children }) => {
    const [friends, setFriends] = useState<User[]>([]);
    const [friendRequests, setFriendRequests] = useState<User[]>([]);

    // hämtar vänner
    const GetFriends = async () => {
        // hämtar jwt och user från storage
        const jwt = localStorage.getItem("jwt")
        const user = localStorage.getItem("user")
        console.log("getfriends");

        let tempFriends: User[] = []
        let key: string = "Bearer " + jwt;
        try {
            const response = await fetch(`http://localhost:5054/api/friend/${user}`, {
                method: "GET",
                headers: {
                    'authorization': key
                }
            })

            if (response.ok) {
                const data = await response.json() as any;
                for (let index = 0; index < data.length; index++) {
                    let friend: User = {
                        friendId: "",
                        email: "",
                        username: "",
                        avatar: ""
                    }

                    if (data[index].firstUser.username == user) {
                        console.log("friend second");

                        friend.username = data[index].secondUser.username;
                        friend.friendId = data[index].secondUser.friendId;
                        friend.email = data[index].secondUser.email;
                        friend.avatar = data[index].secondUser.avatar;
                        tempFriends.push(friend)
                    } else {
                        console.log("friend first");
                        friend.username = data[index].firstUser.username;
                        friend.friendId = data[index].firstUser.friendId;
                        friend.email = data[index].firstUser.email;
                        friend.avatar = data[index].firstUser.avatar;
                        tempFriends.push(friend)
                    }
                }

                console.log(tempFriends);

            }

        } catch (error) {
            console.log(error);

        }
        setFriends(tempFriends)
        return tempFriends;
    }

    // skicka friend request
    const SendFriendRequest = async (friendName: string) => {

        const jwt = localStorage.getItem("jwt")
        const user = localStorage.getItem("user")
        let key: string = "Bearer " + jwt;
        
        try {
            const response = await fetch(`http://localhost:5054/api/friend/requests/${user}/${friendName}`, {
                method: "POST",
                headers: {
                    'authorization': key,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    
                })
            })


            if (!response.ok) {
                console.log(response);
                if (response.status === 409) {
                    return "Friend already exists/friend request already sent"
                }
                if (response.status === 404) {
                    return "User not found"
                }
            }
            
        } catch (error) {
            throw error;
        }
        return "Friend request sent!"
    }

    // hämtar friend requests
    const GetFriendRequests = async () => {
        // hämtar jwt och user från storage
        const jwt = localStorage.getItem("jwt")
        const user = localStorage.getItem("user")
        console.log("getrequest");
        let tempFriendsRequests: User[] = []

        let key: string = "Bearer " + jwt;
        try {
            const response = await fetch(`http://localhost:5054/api/friend/requests/${user}`, {
                method: "GET",
                headers: {
                    'authorization': key
                }
            })

            if (response.ok) {
                const data = await response.json() as any;
                console.log(data);
                
                for (let index = 0; index < data.length; index++) {
                    let friend: User = {
                        friendId: "",
                        email: "",
                        username: "",
                        avatar: ""
                    }
                    friend.username = data[index].sender.username
                    friend.friendId = data[index].sender.friendId
                    tempFriendsRequests.push(friend)
                }

                console.log(tempFriendsRequests);

            }

        } catch (error) {
            console.log(error);

        }
        setFriendRequests(tempFriendsRequests)
        return tempFriendsRequests;
    }

    // lägg till ny vän 
    const AcceptFriendRequest = async (friendName: string) => {

        const jwt = localStorage.getItem("jwt")
        const user = localStorage.getItem("user")
        let key: string = "Bearer " + jwt;

        try {
            const response = await fetch(`http://localhost:5054/api/friend/${user}/${friendName}`, {
                method: "POST",
                headers: {
                    'authorization': key,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    
                })
            })


            if (!response.ok) {
                console.log(response);

            }

            const data = await response.json() as any;
            console.log(data);
            await GetFriendRequests();
            await GetFriends();
            
        } catch (error) {
            throw error;
        }
    }

    // reject friend request
    const RejectFriendRequest = async (friendName: string) => {

        const jwt = localStorage.getItem("jwt")
        const user = localStorage.getItem("user")
        let key: string = "Bearer " + jwt;
        console.log("friend request rejket");
        
        try {
            const response = await fetch(`http://localhost:5054/api/friend/requests/${user}/${friendName}`, {
                method: "DELETE",
                headers: {
                    'authorization': key,
                    'Content-Type': 'application/json'
                }
            })


            if (!response.ok) {
                console.log(response);

            }

            const data = await response.json() as any;
            console.log(data);
            await GetFriendRequests();
            
        } catch (error) {
            throw error;
        }
    }

    // skicka friend request
    const RemoveFriend = async (friendName: string) => {

        const jwt = localStorage.getItem("jwt")
        const user = localStorage.getItem("user")
        let key: string = "Bearer " + jwt;
        try {
            const response = await fetch(`http://localhost:5054/api/friend/${user}/${friendName}`, {
                method: "DELETE",
                headers: {
                    'authorization': key,
                    'Content-Type': 'application/json'
                }
            })


            if (!response.ok) {
                console.log(response);

            }

            await GetFriends();
            
        } catch (error) {
            throw error;
        }
    }

    return (
        <FriendContext.Provider value={{ friends, friendRequests, GetFriends, SendFriendRequest, GetFriendRequests, AcceptFriendRequest, RejectFriendRequest, RemoveFriend }}>
            {
                children
            }
        </FriendContext.Provider>
    )
}



// låter andra filer använda LoginContext
export const UseFriend = (): FriendContextType => {
    const context = useContext(FriendContext);

    if (!context) {
        throw new Error("useFriend måste har FriendProvider");
    }

    return context;
}