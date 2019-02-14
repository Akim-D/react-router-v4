import React from 'react';
import {Route} from "react-router-dom";

import './App.css';
import Landing from "./Landing";

const App = () => (
  <Route path='/' exact component={Landing} />
);

export default App;
