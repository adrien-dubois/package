import { useContext } from 'react'
import { KeycloakContext } from '../KeycloakProvider/context';

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

const useKeycloakUser = () => {
    const context: IContext = useContext(KeycloakContext);
  return context;
}

export default useKeycloakUser