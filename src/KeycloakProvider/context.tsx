import axios from "axios";
import React, { createContext, useEffect, useState } from "react";


interface IContext {
    sub: string;
	email_verified: boolean;
	roles: string[];
	name: string;
	preferred_username: string;
	given_name: string;
	family_name: string;
	email: string;
}

export interface IToken {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    "not-before-policy": number;
    session_state: string;
    scope: string;
}

export interface IWrapper {
    value: ISetup;
    children: any;
}

export interface ISetup {
    realms?: string;
    baseURL?: string;
    clientId?: string;
}

export interface IConfig {
    children: JSX.Element | JSX.Element[],
    realms?: string;
    baseURL?: string;
    clientId?: string;
}

export interface iInterceptors {
    children: any,
    realms?: string;
    baseURL?: string;
    clientId?: string;
}

export const KeycloakContext = createContext< IContext | null>(null);


export const KcUserContext = ( 
    { realms, baseURL, children }: IConfig
    ) => {

    const [kcState, setKcState] = useState(null);
    
    const kcStorage = JSON.parse(localStorage.getItem('refresh'));
    const kcToken = kcStorage?.access_token;

    const instance = axios.create({
        baseURL: baseURL,
        headers: { 'Authorization': `Bearer `+ kcToken }
    });

    useEffect(() => {

        instance.get(`/realms/${realms}/protocol/openid-connect/userinfo`)
            .then(
                (response) => {
                    setKcState(response);
                }
            )
            .catch(
                (error) => console.log(error)
            )

    }, [])

    return (
        <KeycloakContext.Provider value={kcState}>
            { children }
        </KeycloakContext.Provider>
    )
}