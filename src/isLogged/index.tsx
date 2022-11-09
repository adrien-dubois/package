import { useContext, useEffect, useState } from "react";
import { KeycloakContext } from "../KeycloakProvider/context";
import IsEmpty from "../utils/IsEmpty";


function isLogged(){
    const context = useContext(KeycloakContext);
    const [logged, setLogged] = useState<boolean>(false);
    useEffect(() => {
        if(!IsEmpty(context?.name)){
            setLogged(true)
        }
    }, [])

    return logged
}

export default isLogged