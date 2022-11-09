import { useContext } from "react";
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

const context: IContext = useContext(KeycloakContext);

export default function useAccess(
	testRoles: string[], 
	currentRoles: string[]  = context?.roles
)
{

    return currentRoles.some( (r: string) => testRoles.includes(r) )

}
