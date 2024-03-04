import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Input, Button } from 'antd';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { useHistory } from 'react-router-dom';
import './JsonEditor.scss';
import eventBusServiceContext from '../../../services/event-bus-service.context';
import { SharedEvents } from '../../../joint-plus/controller';

// 定义组件的属性接口
interface Props {
    content: Object; // 内容属性，应该是一个对象
}

// 定义 debounce 时间（以毫秒为单位）
const DEBOUNCE_TIME_MS = 500;

// JsonEditor 组件
const JsonEditor = (props: Props): ReactElement => {
    const history = useHistory();
    const returnHome = () => {
        history.push('/')
    };

    // 定义占位符和内容状态
    const [placeholder] = useState('e.g. { "cells": [{ "type": "app.Message"}] }');
    const [content, setContent] = useState<string | Object>(null);

    // 创建一个用于发送 JSON 内容更改的 Subject
    const [contentSubject] = useState(new Subject<Object>());

    // 获取事件总线服务
    const eventBusService = useContext(eventBusServiceContext);

    // 在组件挂载时设置对内容更改的监听
    useEffect(() => {
        // 使用 debounceTime 进行内容更改的防抖处理
        contentSubject.pipe(debounceTime(DEBOUNCE_TIME_MS)).subscribe((json: Object) => {
            // 发送 JSON 内容更改事件
            eventBusService.emit(SharedEvents.JSON_EDITOR_CHANGED, json);
        });
    }, [contentSubject, eventBusService]);

    // 在组件挂载时设置 props.content 到内容状态
    useEffect(() => {
        if (props.content) {
            setContent(props.content);
        }
    }, [props.content]);

    // 解析 JSON 字符串并发送更改事件
    const parseJSON = (jsonString: string): void => {
        // 设置内容状态为解析后的 JSON 字符串
        setContent(jsonString);
        let json;
        // 解析 JSON 字符串，如果为空则创建空对象
        if (!jsonString) {
            json = { cells: [] };
        } else {
            try {
                json = JSON.parse(jsonString);
            } catch (e) {
                // JSON 解析失败，返回
                return;
            }
        }
        // 发送 JSON 内容更改事件
        contentSubject.next(json);
    };

    // 格式化 JSON 内容
    const formatJSON = (json: string | Object): string => {
        if (!json) {
            return '';
        }
        // 如果是字符串则直接返回，否则使用 JSON.stringify 进行格式化
        return typeof json === 'string' ? json : JSON.stringify(json, null, 2);
    };
    const dayin = () => {
        console.log(formatJSON(content))
    }
    // 渲染 JsonEditor 组件
    return (
        <div className="chatbot-json-editor">
            {/* <textarea placeholder={placeholder}
                      spellCheck="false"
                      value={formatJSON(content)}
                      onChange={(e) => parseJSON(e.target.value)}
            /> */}
            <Button type="primary" className='button'>start</Button>
            <Button className='button'>test</Button>
            <Button className='button' onClick={returnHome}>Home</Button>
            <Button className='button' onClick={dayin}>consol</Button>
        </div>
    );
};

// 导出 JsonEditor 组件
export default JsonEditor;
