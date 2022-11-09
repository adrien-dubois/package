import { AxiosInterceptors } from "./interceptors"
import { IWrapper, KcUserContext } from './context';
import React from "react";


export const KeycloakProvider = ({ value, children }: IWrapper) => {
  return (

    <AxiosInterceptors 
        realms={value.realms} 
        clientId={value.clientId} 
        baseURL={value.baseURL} 
    >
        <KcUserContext 
            realms={value.realms} 
            baseURL={value.baseURL} 
        >
            { children }
        </KcUserContext>
    </AxiosInterceptors>
  )
}
