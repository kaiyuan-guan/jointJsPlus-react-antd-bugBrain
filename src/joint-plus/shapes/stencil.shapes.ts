/*! JointJS+ v4.0.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2024 client IO

 2024-02-18 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import { mvc, dia, shapes } from '@joint/plus';

import {
    FONT_FAMILY,
    PADDING_L,
    LIGHT_COLOR,
    MAIN_COLOR,
    MESSAGE_ICON,
    USER_INPUT_ICON,
} from '../../theme';

export enum ShapeTypesEnum {
    NODE = 'stencil.Node',
    MESSAGE = 'stencil.Message',
    FLOWCHART_START = 'stencil.FlowchartStart',
    FLOWCHART_END = 'stencil.FlowchartEnd',
}

const SHAPE_SIZE = 48;

const FlowchartStart = dia.Element.define(ShapeTypesEnum.FLOWCHART_START, {
    name: 'FlowchartStart',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: MAIN_COLOR,
            stroke: 'none',
            cx: 'calc(0.5 * w)',
            cy: 'calc(0.5 * h)',
            r: 'calc(0.5 * w)',
        },
        icon: {
            d: 'M 2 8 L 4.29 5.71 L 1.41 2.83 L 2.83 1.41 L 5.71 4.29 L 8 2 L 8 8 Z M -2 8 L -8 8 L -8 2 L -5.71 4.29 L -1 -0.41 L -1 -8 L 1 -8 L 1 0.41 L -4.29 5.71 Z',
            fill: '#FFFFFF',
            transform: 'translate(calc(0.5 * w), calc(0.5 * h))'
        },
        label: {
            text: 'Start',
            x: `calc(w + ${PADDING_L})`,
            y: 'calc(0.5 * h)',
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
} as mvc.ObjectHash, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'path',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }],
});

const FlowchartEnd = dia.Element.define(ShapeTypesEnum.FLOWCHART_END, {
    name: 'FlowchartEnd',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: MAIN_COLOR,
            stroke: 'none',
            cx: 'calc(0.5 * w)',
            cy: 'calc(0.5 * h)',
            r: 'calc(0.5 * w)'
        },
        icon: {
            d: 'M 5 -8.45 L 6.41 -7.04 L 3 -3.635 L 1.59 -5.04 Z M -4.5 3.95 L -1 3.95 L -1 -1.63 L -6.41 -7.04 L -5 -8.45 L 1 -2.45 L 1 3.95 L 4.5 3.95 L 0 8.45 Z',
            fill: '#FFFFFF',
            transform: 'translate(calc(0.5 * w), calc(0.5 * h))'
        },
        label: {
            text: 'End',
            x: `calc(w + ${PADDING_L})`,
            y: 'calc(0.5 * h)',
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        },
    }
} as mvc.ObjectHash, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'path',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }],
});

// 定义名为 Message 的图形元素
// const Message = dia.Element.define(ShapeTypesEnum.MESSAGE, {
//     // 设置图形元素的名称为 'Message'
//     name: 'Message',
//     // 指定图形元素的尺寸为 SHAPE_SIZE x SHAPE_SIZE
//     size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
//     // 指定图形元素的属性
//     attrs: {
//         // 设置图形元素的主体样式
//         body: {
//             fill: LIGHT_COLOR, // 设置填充颜色为 LIGHT_COLOR
//             stroke: '#E8E8E8', // 设置边框颜色为 #E8E8E8
//             cx: 'calc(0.5 * w)', // 设置圆心 X 坐标为宽度的一半
//             cy: 'calc(0.5 * h)', // 设置圆心 Y 坐标为高度的一半
//             r: 'calc(0.5 * w)' // 设置半径为宽度的一半
//         },
//         // 设置图形元素的图标样式
//         icon: {
//             width: 20, // 设置宽度为 20
//             height: 20, // 设置高度为 20
//             x: 'calc(0.5 * w - 10)', // 设置 X 坐标为宽度一半减去 10
//             y: 'calc(0.5 * h - 10)', // 设置 Y 坐标为高度一半减去 10
//             xlinkHref: MESSAGE_ICON // 设置图标链接
//         },
//         // 设置图形元素的标签样式
//         label: {
//             text: 'Component', // 设置文本内容为 'Component'
//             x: `calc(w + ${PADDING_L})`, // 设置 X 坐标为宽度加上 PADDING_L
//             y: 'calc(0.5 * h)', // 设置 Y 坐标为高度的一半
//             textAnchor: 'start', // 设置文本水平对齐方式为起始位置
//             textVerticalAnchor: 'middle', // 设置文本垂直对齐方式为中间位置
//             fill: '#242424', // 设置填充颜色为 #242424
//             fontFamily: FONT_FAMILY, // 设置字体系列为 FONT_FAMILY
//             fontSize: 13 // 设置字体大小为 13
//         }
//     }
// } as mvc.ObjectHash, {
//     // 指定在画布上呈现图形元素时使用的 SVG 元素结构
//     markup: [{
//         tagName: 'circle', // 创建圆形元素
//         selector: 'body' // 设置选择器为 'body'
//     }, {
//         tagName: 'image', // 创建图像元素
//         selector: 'icon' // 设置选择器为 'icon'
//     }, {
//         tagName: 'text', // 创建文本元素
//         selector: 'label' // 设置选择器为 'label'
//     }]
// });


const Message = dia.Element.define(ShapeTypesEnum.MESSAGE, {
    name: 'Node',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: LIGHT_COLOR,
            stroke: '#E8E8E8',
            cx: 'calc(0.5 * w)',
            cy: 'calc(0.5 * h)',
            r: 'calc(0.5 * w)',
        },
        icon: {
            xlinkHref: USER_INPUT_ICON,
            x: 'calc(0.5 * w - 10)',
            y: 'calc(0.5 * h - 10)',

        },
        label: {
            text: 'Node',
            x: `calc(w + ${PADDING_L})`,
            y: 'calc(0.5 * h)',
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
} as mvc.ObjectHash, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'image',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }]
});


Object.assign(shapes, {
    stencil: {
        Message,
        Node,
        FlowchartStart,
        FlowchartEnd,
    }
});
