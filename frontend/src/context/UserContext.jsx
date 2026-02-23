import {createContext, useContext, useState} from 'react';

const DEV_USER = {
    id: 1,
    username: 'testuser',
    token: 'dev-static-token'
}

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(DEV_USER);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUser must be used within the UserProvider context')
    return ctx
}