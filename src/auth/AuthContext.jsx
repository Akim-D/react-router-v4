import React from 'react';

import Auth from './services/Auth';

const auth = new Auth();

export const AuthContext = React.createContext({
  auth,
});
