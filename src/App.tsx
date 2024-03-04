import React, { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, useHistory } from 'react-router-dom';
import homePage from './components/homePage'
import { Button } from 'antd';
import Chatbot from './components/Chatbot/Chatbot';

const App = (): ReactElement => {

    return (
        <Router>

            <Route path="/" exact component={homePage} />

            <Route path="/game" exact component={Chatbot} />
        </Router>

    );
};

export default App;
