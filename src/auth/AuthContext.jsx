import React from 'react';

import Auth from './services/Auth';

const dummyAuth = Object.create(Auth.prototype);

export const AuthContext = React.createContext({ auth: dummyAuth });
