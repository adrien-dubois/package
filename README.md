# NSE - Keycloak React


**API** : instance Axios à utiliser pour envoyer les tokens à Keycloak et refresh les tokens

```js
const searchOrders = (orderDatas: any) => API.post('/api/orders', orderDatas);
```

**useAccess(["role1","role2"])** : hook de test pour protéger la route, envoyer un tableau de rôle pour privatiser la route pour le rôle souhaité, par exemple pour un rôle admin :

```js
{ useAccess(['admin']) &&
    <>
        <Route path="/consult-order" element={<ConsultOrder/>} />
        <Route path="/consumptions-indicators" element={<Consumptions/>} />
        <Route path="/contractual-indicators" element={<Contractuals/>} />
    </>
}
```

**isLogged** : hook permettant de vérifier si la connexion à Keycloak est effective, permets donc d'afficher ou non des pages entre autres.
En reprenant l'exemple précédent, nous allons afficher les pages souhaitées seulement aux personnes connectées et étant admins :

```js

{ isLogged && useAccess(['admin']) &&
    <>
        <Route path="/consult-order" element={<ConsultOrder/>} />
        <Route path="/consumptions-indicators" element={<Consumptions/>} />
        <Route path="/contractual-indicators" element={<Contractuals/>} />
    </>
}
```

**KeycloakProvider & useKeycloakUser()** : wrapper pour récupérer les infos de l'utilisateur connecté, envoyer le token à Keycloak et refresh en auto

```js

const keycloak = {
  realms: "master",
  clientId: "react-app",
  baseURL: "http://localhost:8080"
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Router>
    <KeycloakProvider value={keycloak}>
      <App />
    </KeycloakProvider>
  </Router>
);
```

Et ensuite dans l'application pour récupérer les infos utilisateur, avec la possibilité d'obtenir les infos suivantes :
-  Roles
-  Nom complet
-  Nom de famille
-  Prénom
-  Email

```js
const user = useKeycloakUser();
const email = user.email;
const roles = user.roles;
// etc....

```