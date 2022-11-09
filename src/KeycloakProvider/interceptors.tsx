import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { iInterceptors, IToken } from './context';


/**
 * Base Axios instance
 */

const API = axios.create({
    
    headers: {
        "Content-Type": "application/json"
    }
});

const AxiosInterceptors = (
    { clientId, baseURL, realms, children }: iInterceptors
) => {
    

    /**
     * Instance for refresh tokens
     */
    const refreshInstance = axios.create({
        baseURL: baseURL,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })

    /**
     * Get infos that are needed to refresh token
     */
    let keyCloakStorage = JSON.parse(localStorage.getItem('keycloak'));
    const keyCloakToken = keyCloakStorage?.refresh_token;
    const keyCloakState = {
        grant_type: 'refresh_token',
        client_id: clientId,
        refresh_token: keyCloakToken
    }

    /**
     * Method for refreshing tokens
     */
    const refreshToken = async () => {
        try {
            const { data } = await refreshInstance.post(`/realms/${realms}/protocol/openid-connect/token`, new URLSearchParams(keyCloakState));

            localStorage.setItem("refresh", JSON.stringify({ ...data }));

            return data;

        } catch (error) {
            console.log(error)
        }
    }
    
    
    useEffect(() => {

        /**
         * Prepare the request
         * @param config 
         * @returns children 
         */
        const handleRequest = (config: AxiosRequestConfig) => {
            
            /**
             * Getting the refresh informations in localStorage 
             */
            let keyCloakStorage = JSON.parse(localStorage.getItem('refresh'));

             /**
              * If there is the refresh item, the get the access token and pass to keyCloak via setting the headers.
              */
             if(keyCloakStorage)
             {
                let keyCloakToken = keyCloakStorage.access_token;
                config.headers['Authorization'] = 'Bearer ' + keyCloakToken;
                config.baseURL = baseURL;
             }
             return config;
        }

        /**
         * Get the response
         */
        const handleResponse = (response: AxiosResponse) => {
            return response;
        }

        /**
         * Handle errors and refreshing token
         * @param error 
         */
        const handleError = async (error: any) => {

            const config = error?.config;

            if(error.response?.status === 401)
            {
                const result: IToken = await refreshToken();

                if(result?.access_token) {
                    config.headers = {
                        ...config.headers,
                        authorization: `Bearer ${result.access_token}`
                    }
                }

                return config;
            }

            return Promise.reject(error);
        }

        const requestInterceptor = API.interceptors.request.use(handleRequest);
        const responseInterceptor = API.interceptors.response.use(handleResponse, handleError);


        return () => {
            API.interceptors.request.eject(requestInterceptor);
            API.interceptors.response.eject(responseInterceptor);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return children;
    
}

export { AxiosInterceptors };
export default API;