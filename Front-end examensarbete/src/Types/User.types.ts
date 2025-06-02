// användaren
export interface User {
    friendId: string,
    email: string,
    username: string,
    avatar: string
}

export interface SignUpCredentials {
    email?: string,
    username?: string,
    password?: string,
    confirmPassword?: string
}

// det som skickas med i login
export interface LoginCredentials {
    username?: string,
    password?: string
}

// används för att skapa LoginContext
export interface AccountContextType {
    user: User | null,
    chatMembers: User[] | [],
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    registerAccount: (credentials: SignUpCredentials) => Promise<void>;
    checkJwt: () => Promise<boolean>;
    changeUsername: (newName: string) => Promise<void>;
    changeAvatar: (newImg: string) => Promise<void>;
    changeChatMembers: (members: User[]) => void;
}

// används för att skapa LoginContext
export interface FriendContextType {
    friends: User[] | [],
    friendRequests: User[] | [],
    GetFriends: () => Promise<User[]>;
    SendFriendRequest: (friendName: string) => Promise<string>;
    GetFriendRequests: () => Promise<User[]>;
    AcceptFriendRequest: (friendName: string) => Promise<void>;
    RejectFriendRequest: (friendName: string) => Promise<void>;
    RemoveFriend: (friendName: string) => Promise<void>;
}