import React, { ReactElement } from 'react';
import { Button } from 'antd'
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';

const homePage = (): ReactElement => {
    const history = useHistory();
    const gameStart = () => {
        history.push('/game')
    };
    return (
        <div style={{
            display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'
        }}>
            <Button type="primary" onClick={gameStart}>开始游戏</Button>
        </div >

    );
};
export default homePage;
