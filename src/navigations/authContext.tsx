import { createContext } from "react";

export interface AuthContextData {
    nama: string,
    email: string,
    role: string
}

export interface AuthContextProps {
    SignIn: (data: AuthContextData) => void,
    SignOut: () => void
}

const AuthContextDefaultProps = {
    SignIn: () => { },
    SignOut: () => { }
}

const AuthContext = createContext<AuthContextProps>(AuthContextDefaultProps)

export default AuthContext