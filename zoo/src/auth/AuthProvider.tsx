import React, { useCallback, useEffect, useState } from 'react';
import PropTypes, { func } from 'prop-types';
import { login as loginApi } from './authApi';


type LoginFn = (email?: string, password?: string) => void;

export interface AuthState {
    authenticationError: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login?: LoginFn;
    logout?: () => void;
    pendingAuthentication?: boolean;
    email?: string;
    password?: string;
    token: string | null;
}

const initialState: AuthState = localStorage.getItem("token") == null ? {
    isAuthenticated: false,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    token: '',
} : {
    isAuthenticated: true,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    token: localStorage.getItem("token"),
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>(initialState);
    const { isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token } = state;
    const login = useCallback<LoginFn>(loginCallback, []);
    const logout = useCallback(logoutCallback, []);
    useEffect(authenticationEffect, [pendingAuthentication]);
    const value = { isAuthenticated, login, logout, isAuthenticating, authenticationError, token };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    function loginCallback(email?: string, password?: string): void {
        setState({
            ...state,
            pendingAuthentication: true,
            email,
            password
        });
    }

    function logoutCallback(): void {
        setState({
            ...state,
            isAuthenticated: false,
            token: ''
        });
        localStorage.removeItem("token");
    }

    function authenticationEffect() {
        let canceled = false;
        authenticate();
        return () => {
            canceled = true;
        }

        async function authenticate() {
            if (!pendingAuthentication) {
                return;
            }
            try {
                setState({
                    ...state,
                    isAuthenticating: true,
                });
                const { email, password } = state;
                const token = await loginApi(email, password);
                console.log(token);
                localStorage.setItem("token", token.data.token);
                if (canceled) {
                    return;
                }
                setState({
                    ...state,
                    token: token.data.token,
                    pendingAuthentication: false,
                    isAuthenticated: true,
                    isAuthenticating: false,
                });
            } catch (error) {
                if (canceled) {
                    return;
                }
                setState({
                    ...state,
                    authenticationError: error as Error,
                    pendingAuthentication: false,
                    isAuthenticating: false,
                });
            }
        }
    }
};