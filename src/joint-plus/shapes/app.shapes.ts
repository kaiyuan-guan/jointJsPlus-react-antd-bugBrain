/*! JointJS+ v4.0.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2024 client IO

 2024-02-18 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import { util, dia, g, shapes } from '@joint/plus';
import {
    MAX_PORT_COUNT,
    FONT_FAMILY,
    OUT_PORT_HEIGHT,
    OUT_PORT_WIDTH,
    OUT_PORT_LABEL,
    PORT_BORDER_RADIUS,
    PADDING_L,
    PADDING_S,
    ADD_PORT_SIZE,
    REMOVE_PORT_SIZE,
    BACKGROUND_COLOR,
    LIGHT_COLOR,
    DARK_COLOR,
    MAIN_COLOR,
    LINE_WIDTH,
    NODE_COLOR,
    USER_INPUT_ICON
} from '../../theme';

export enum ShapeTypesEnum {
    NODE = 'app.Node',
    BASE = 'app.Base',
    MESSAGE = 'app.Message',
    FLOWCHART_START = 'app.FlowchartStart',
    FLOWCHART_END = 'app.FlowchartEnd',
    LINK = 'app.Link'
}

const outputPortPosition = (portsArgs: dia.Element.Port[], elBBox: dia.BBox): g.Point[] => {
    const step = OUT_PORT_WIDTH + PADDING_S;
    return portsArgs.map((port: dia.Element.Port, index: number) => new g.Point({
        x: PADDING_L + OUT_PORT_WIDTH / 2 + index * step,
        y: elBBox.height
    }));
};

const Base = dia.Element.define(ShapeTypesEnum.BASE, {
    // no default attributes
}, {
    getBoundaryPadding: function () {
        return util.normalizeSides(this.boundaryPadding);
    },

    toJSON: function () {
        // Simplify the element resulting JSON
        const json = dia.Element.prototype.toJSON.call(this);
        // Remove port groups and angle for better readability
        delete json.ports.groups;
        delete json.angle;
        return json;
    }
}, {

    fromStencilShape: function (element: dia.Element) {
        const attrs = {
            label: {
                text: element.attr(['label', 'text'])
            },
            body: {
                stroke: element.attr(['body', 'stroke']),
                fill: element.attr(['body', 'fill'])
            },
            icon: {
                xlinkHref: element.attr(['icon', 'xlinkHref'])
            }
        };
        return new this({ attrs });
    }

});


// const Message = Base.define(ShapeTypesEnum.MESSAGE, { // 定义名为 Message 的图形元素
//     size: { width: 368, height: 80 }, // 指定消息图形元素的宽度和高度
//     ports: { // 定义图形元素的端口
//         groups: { // 端口分组
//             in: { // 输入端口
//                 position: { // 端口位置
//                     name: 'manual', // 手动指定位置
//                     args: { x: PADDING_L, y: 0 } // 端口位置参数
//                 },
//                 size: { width: 16, height: 16 }, // 端口大小
//                 attrs: { // 端口样式
//                     portBody: { // 端口主体
//                         magnet: 'passive', // 被连接时是被动的
//                         width: 'calc(w)', // 宽度
//                         height: 'calc(h)', // 高度
//                         y: 'calc(-0.5 * h)', // Y轴位置
//                         rx: PORT_BORDER_RADIUS, // 圆角半径
//                         ry: PORT_BORDER_RADIUS, // 圆角半径
//                         fill: LIGHT_COLOR, // 填充颜色
//                         stroke: DARK_COLOR, // 边框颜色
//                         strokeWidth: LINE_WIDTH // 边框宽度
//                     }
//                 },
//                 markup: [{ tagName: 'rect', selector: 'portBody' }] // 端口标记
//             },
//             out: { // 输出端口
//                 position: outputPortPosition, // 端口位置
//                 size: { width: OUT_PORT_WIDTH, height: OUT_PORT_HEIGHT }, // 端口大小
//                 attrs: { // 端口样式
//                     portBody: { // 端口主体
//                         magnet: 'active', // 被连接时是主动的
//                         width: 'calc(w)', // 宽度
//                         height: 'calc(h)', // 高度
//                         x: 'calc(-0.5 * w)', // X轴位置
//                         y: 'calc(-0.5 * h)', // Y轴位置
//                         fill: DARK_COLOR, // 填充颜色
//                         ry: PORT_BORDER_RADIUS, // 圆角半径
//                         rx: PORT_BORDER_RADIUS // 圆角半径
//                     },
//                     portLabel: { // 端口标签
//                         pointerEvents: 'none', // 禁止指针事件
//                         fontFamily: FONT_FAMILY, // 字体系列
//                         fontWeight: 400, // 字体粗细
//                         fontSize: 13, // 字体大小
//                         fill: LIGHT_COLOR, // 填充颜色
//                         textAnchor: 'start', // 文本对齐方式
//                         textVerticalAnchor: 'middle', // 文本垂直对齐方式
//                         textWrap: { // 文本换行
//                             width: - REMOVE_PORT_SIZE - PADDING_L - PADDING_S, // 宽度
//                             maxLineCount: 1, // 最大行数
//                             ellipsis: true // 使用省略号
//                         },
//                         x: PADDING_L - OUT_PORT_WIDTH / 2 // X轴位置
//                     },
//                     portRemoveButton: { // 移除端口按钮
//                         cursor: 'pointer', // 鼠标指针样式
//                         event: 'element:port:remove', // 事件名称
//                         transform: `translate(calc(0.5 * w - ${PADDING_L}), 0)`, // 变换
//                         dataTooltip: 'Remove Output Port', // 提示信息
//                         dataTooltipPosition: 'top' // 提示信息位置
//                     },
//                     portRemoveButtonBody: { // 移除端口按钮主体
//                         width: REMOVE_PORT_SIZE, // 宽度
//                         height: REMOVE_PORT_SIZE, // 高度
//                         x: -REMOVE_PORT_SIZE / 2, // X轴位置
//                         y: -REMOVE_PORT_SIZE / 2, // Y轴位置
//                         fill: LIGHT_COLOR, // 填充颜色
//                         rx: PORT_BORDER_RADIUS, // 圆角半径
//                         ry: PORT_BORDER_RADIUS // 圆角半径
//                     },
//                     portRemoveButtonIcon: { // 移除端口按钮图标
//                         d: 'M -4 -4 4 4 M -4 4 4 -4', // 图标路径
//                         stroke: DARK_COLOR, // 描边颜色
//                         strokeWidth: LINE_WIDTH // 描边宽度
//                     }
//                 },
//                 markup: [{ tagName: 'rect', selector: 'portBody' }, { tagName: 'text', selector: 'portLabel' }, { // 端口标记
//                     tagName: 'g',
//                     selector: 'portRemoveButton',
//                     children: [{ tagName: 'rect', selector: 'portRemoveButtonBody' }, { // 移除端口按钮主体
//                         tagName: 'path',
//                         selector: 'portRemoveButtonIcon'
//                     }]
//                 }]
//             }
//         },
//         items: [{ group: 'in' }, { group: 'out', attrs: { portLabel: { text: OUT_PORT_LABEL } } }] // 端口配置项
//     },
//     attrs: { // 图形元素的属性
//         body: { // 主体
//             width: 'calc(w)', // 宽度
//             height: 'calc(h)', // 高度
//             fill: LIGHT_COLOR, // 填充颜色
//             strokeWidth: LINE_WIDTH / 2, // 边框宽度
//             stroke: '#D4D4D4', // 边框颜色
//             rx: 3, // 圆角半径
//             ry: 3, // 圆角半径
//         },
//         label: { // 标签
//             x: 54, // X轴位置
//             y: PADDING_L, // Y轴位置
//             fontFamily: FONT_FAMILY, // 字体系列
//             fontWeight: 600, // 字体粗细
//             fontSize: 16, // 字体大小
//             fill: '#322A49', // 填充颜色
//             text: 'Label', // 文本内容
//             textWrap: { // 文本换行
//                 width: - 54 - PADDING_L, // 宽度
//                 maxLineCount: 1, // 最大行数
//                 ellipsis: true // 使用省略号
//             },
//             textVerticalAnchor: 'top', // 文本垂直对齐方式
//         },
//         description: { // 描述
//             x: 54, // X轴位置
//             y: 38, // Y轴位置
//             fontFamily: FONT_FAMILY, // 字体系列
//             fontWeight: 400, // 字体粗细
//             fontSize: 13, // 字体大小
//             lineHeight: 13, // 行高
//             fill: '#655E77', // 填充颜色
//             textVerticalAnchor: 'top', // 文本垂直对齐方式
//             text: 'Description', // 文本内容
//             textWrap: { // 文本换行
//                 width: - 54 - PADDING_L, // 宽度
//                 maxLineCount: 2, // 最大行数
//                 ellipsis: true // 使用省略号
//             }
//         },
//         icon: { // 图标
//             width: 20, // 宽度
//             height: 20, // 高度
//             x: PADDING_L, // X轴位置
//             y: 24, // Y轴位置
//             xlinkHref: 'https://image.flaticon.com/icons/svg/151/151795.svg' // 图标链接
//         },
//         portAddButton: { // 添加端口按钮
//             cursor: 'pointer', // 鼠标指针样式
//             fill: MAIN_COLOR, // 填充颜色
//             event: 'element:port:add', // 事件名称
//             transform: 'translate(calc(w - 28), calc(h))', // 变换
//             dataTooltip: 'Add Output Port', // 提示信息
//             dataTooltipPosition: 'top' // 提示信息位置
//         },
//         portAddButtonBody: { // 添加端口按钮主体
//             width: ADD_PORT_SIZE, // 宽度
//             height: ADD_PORT_SIZE, // 高度
//             rx: PORT_BORDER_RADIUS, // 圆角半径
//             ry: PORT_BORDER_RADIUS, // 圆角半径
//             x: -ADD_PORT_SIZE / 2, // X轴位置
//             y: -ADD_PORT_SIZE / 2, // Y轴位置
//         },
//         portAddButtonIcon: { // 添加端口按钮图标
//             d: 'M -4 0 4 0 M 0 -4 0 4', // 图标路径
//             stroke: '#FFFFFF', // 描边颜色
//             strokeWidth: LINE_WIDTH // 描边宽度
//         }
//     }
// }, {
//     markup: [{ // 标记，用于指定在画布上呈现图形元素时使用的 SVG 元素结构
//         tagName: 'rect', selector: 'body', // 主体矩形
//     }, {
//         tagName: 'text', selector: 'label', // 标签文本
//     }, {
//         tagName: 'text', selector: 'description', // 描述文本
//     }, {
//         tagName: 'image', selector: 'icon', // 图标
//     }, {
//         tagName: 'g', selector: 'portAddButton', // 添加端口按钮容器
//         children: [{ // 添加端口按钮容器内部的元素
//             tagName: 'rect', selector: 'portAddButtonBody' // 添加端口按钮主体
//         }, {
//             tagName: 'path', selector: 'portAddButtonIcon' // 添加端口按钮图标
//         }]
//     }],

//     boundaryPadding: { // 边界填充，用于在连接时提供额外的空间
//         horizontal: PADDING_L, // 水平边界填充
//         top: PADDING_L, // 顶部边界填充
//         bottom: OUT_PORT_HEIGHT / 2 + PADDING_L // 底部边界填充
//     },

//     addDefaultPort: function () { // 添加默认输出端口的方法
//         if (!this.canAddPort('out')) return; // 如果无法添加输出端口，则返回
//         this.addPort({ group: 'out', attrs: { portLabel: { text: OUT_PORT_LABEL } } }); // 否则添加输出端口
//     },

//     canAddPort: function (group: string): boolean { // 检查是否可以添加指定类型的端口的方法
//         return Object.keys(this.getGroupPorts(group)).length < MAX_PORT_COUNT; // 返回当前端口数量是否小于最大端口数量
//     },

//     toggleAddPortButton: function (group: string): void { // 启用或禁用添加端口按钮的方法
//         const buttonAttributes = this.canAddPort(group) // 根据是否可以添加端口设置按钮样式
//             ? { fill: MAIN_COLOR, cursor: 'pointer' } // 可以添加端口时的样式
//             : { fill: '#BEBEBE', cursor: 'not-allowed' }; // 无法添加端口时的样式
//         this.attr(['portAddButton'], buttonAttributes, { dry: true }); // 设置按钮的样式，dry: true 表示忽略命令管理器
//     }
// });


const FlowchartStart = Base.define(ShapeTypesEnum.FLOWCHART_START, {
    size: { width: 48, height: 48 },
    ports: {
        groups: {
            out: {
                position: { name: 'bottom' },
                attrs: {
                    portBody: {
                        fill: DARK_COLOR,
                        stroke: BACKGROUND_COLOR,
                        strokeWidth: 6,
                        paintOrder: 'stroke',
                        magnet: 'active',
                        r: 'calc(0.5 * d)',
                    }
                },
                size: { width: 10, height: 10 },
                markup: [{
                    tagName: 'circle',
                    selector: 'portBody'
                }]
            }
        },
        items: [{ group: 'out' }]
    },
    attrs: {
        number: {
            val: '100'
        },
        body: {
            fill: MAIN_COLOR,
            stroke: 'none',
            cx: 'calc(0.5 * w)',
            cy: 'calc(0.5 * h)',
            r: 24
        },
        icon: {
            d: 'M 2 8 L 4.29 5.71 L 1.41 2.83 L 2.83 1.41 L 5.71 4.29 L 8 2 L 8 8 Z M -2 8 L -8 8 L -8 2 L -5.71 4.29 L -1 -0.41 L -1 -8 L 1 -8 L 1 0.41 L -4.29 5.71 Z',
            fill: LIGHT_COLOR,
            transform: 'translate(calc(0.5 * w), calc(0.5 * h))'
        },
        label: {
            text: 'Flowchart start',
            textWrap: {
                width: 200,
                height: 100,
                ellipsis: true
            },
            x: 'calc(0.5 * w)',
            y: -PADDING_L,
            textAnchor: 'middle',
            textVerticalAnchor: 'bottom',
            fill: '#55627B',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
}, {
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
    boundaryPadding: {
        horizontal: PADDING_L,
        top: PADDING_S,
        bottom: PADDING_L
    }
});

const FlowchartEnd = Base.define(ShapeTypesEnum.FLOWCHART_END, {
    size: { width: 48, height: 48 },
    ports: {
        groups: {
            in: {
                position: { name: 'top' },
                attrs: {
                    number: {
                        val: '0'
                    },
                    portBody: {
                        fill: DARK_COLOR,
                        stroke: BACKGROUND_COLOR,
                        strokeWidth: 6,
                        paintOrder: 'stroke',
                        magnet: 'passive',
                        r: 'calc(0.5 * d)'
                    }
                },
                size: { width: 10, height: 10 },
                markup: [{
                    tagName: 'circle',
                    selector: 'portBody'
                }]
            }
        },
        items: [{ group: 'in' }]
    },
    attrs: {
        body: {
            fill: MAIN_COLOR,
            stroke: 'none',
            cx: 'calc(0.5 * w)',
            cy: 'calc(0.5 * h)',
            r: 24
        },
        icon: {
            d: 'M 5 -8.45 L 6.41 -7.04 L 3 -3.635 L 1.59 -5.04 Z M -4.5 3.95 L -1 3.95 L -1 -1.63 L -6.41 -7.04 L -5 -8.45 L 1 -2.45 L 1 3.95 L 4.5 3.95 L 0 8.45 Z',
            fill: LIGHT_COLOR,
            transform: 'translate(calc(0.5 * w), calc(0.5 * h))'
        },
        label: {
            text: 'Flowchart end',
            textWrap: {
                width: 200,
                height: 100,
                ellipsis: true
            },
            x: 'calc(0.5 * w)',
            y: `calc(h + ${PADDING_L})`,
            textAnchor: 'middle',
            textVerticalAnchor: 'top',
            fill: '#55627B',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
}, {
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
    boundaryPadding: {
        horizontal: PADDING_L,
        top: PADDING_L,
        bottom: PADDING_S
    }
});








const Message = Base.define(ShapeTypesEnum.MESSAGE, { // 定义名为 FlowchartStart 的图形元素
    size: { width: 48, height: 48 }, // 指定起始图形元素的宽度和高度
    ports: { // 定义图形元素的端口
        groups: { // 端口分组
            in: { // 输入端口
                position: { name: 'top' }, // 端口位置
                attrs: { // 端口样式
                    portBody: { // 端口主体
                        fill: LIGHT_COLOR, // 填充颜色
                        stroke: DARK_COLOR, // 边框颜色
                        strokeWidth: 6, // 边框宽度
                        paintOrder: 'stroke', // 绘制顺序
                        magnet: 'passive', // 被连接时是被动的
                        r: 'calc(0.5 * d)' // 半径
                    }
                },
                size: { width: 10, height: 10 }, // 端口大小
                markup: [{ tagName: 'circle', selector: 'portBody' }] // 端口标记
            },
            out: { // 输出端口
                position: { name: 'bottom' }, // 端口位置
                attrs: { // 端口样式
                    portBody: { // 端口主体
                        fill: DARK_COLOR, // 填充颜色
                        stroke: BACKGROUND_COLOR, // 边框颜色
                        strokeWidth: 6, // 边框宽度
                        paintOrder: 'stroke', // 绘制顺序
                        magnet: 'active', // 被连接时是主动的
                        r: 'calc(0.5 * d)', // 半径
                    }
                },
                size: { width: 10, height: 10 }, // 端口大小
                markup: [{ tagName: 'circle', selector: 'portBody' }] // 端口标记
            }
        },
        items: [{ group: 'out' }, { group: 'in' }] // 端口配置项
    },
    attrs: { // 图形元素的属性
        body: { // 主体
            fill: NODE_COLOR, // 填充颜色
            stroke: 'none', // 无边框
            cx: 'calc(0.5 * w)', // 圆心 X 坐标
            cy: 'calc(0.5 * h)', // 圆心 Y 坐标
            r: 24 // 半径
        },
        number: {
            val: '100'
        },
        // 图标
        icon: {
            xlinkHref: USER_INPUT_ICON,
            fill: NODE_COLOR, // 填充颜色
            transform: 'translate(calc(0.5 * w), calc(0.5 * h))' // 变换
        },
        label: { // 标签
            text: 'Flowchart start', // 文本内容
            textWrap: { // 文本换行
                width: 200, // 宽度
                height: 100, // 高度
                ellipsis: true // 使用省略号
            },
            x: 'calc(0.5 * w)', // X轴位置
            y: -PADDING_L, // Y轴位置
            textAnchor: 'middle', // 文本水平对齐方式
            textVerticalAnchor: 'bottom', // 文本垂直对齐方式
            fill: '#55627B', // 填充颜色
            fontFamily: FONT_FAMILY, // 字体系列
            fontSize: 13 // 字体大小
        }
    }
}, {
    markup: [{ // 标记，用于指定在画布上呈现图形元素时使用的 SVG 元素结构
        tagName: 'circle', selector: 'body' // 圆形主体
    }, {
        tagName: 'path', selector: 'icon' // 图标路径
    }, {
        tagName: 'text', selector: 'label' // 标签文本
    }],
    boundaryPadding: { // 边界填充，用于在连接时提供额外的空间
        horizontal: PADDING_L, // 水平边界填充
        top: PADDING_S, // 顶部边界填充
        bottom: PADDING_L // 底部边界填充
    }
});







export const Link = dia.Link.define(ShapeTypesEnum.LINK, {
    attrs: {
        root: {
            cursor: 'pointer'
        },
        line: {
            fill: 'none',
            connection: true,
            stroke: DARK_COLOR,
            strokeWidth: LINE_WIDTH
        },
        wrapper: {
            fill: 'none',
            connection: true,
            stroke: 'transparent',
            strokeWidth: 10
        },
        arrowhead: {
            d: 'M -5 -2.5 0 0 -5 2.5 Z',
            stroke: DARK_COLOR,
            fill: DARK_COLOR,
            atConnectionRatio: 0.55,
            strokeWidth: LINE_WIDTH
        }
    },
    labels: [{
        attrs: {
            labelText: {
                text: 'Label',
            }
        },
        position: {
            distance: 0.25
        }
    }]
}, {
    markup: [{
        tagName: 'path',
        selector: 'line'
    }, {
        tagName: 'path',
        selector: 'wrapper'
    }, {
        tagName: 'path',
        selector: 'arrowhead'
    }],
    defaultLabel: {
        markup: [{
            tagName: 'rect',
            selector: 'labelBody'
        }, {
            tagName: 'text',
            selector: 'labelText'
        }],
        attrs: {
            labelText: {
                fontFamily: FONT_FAMILY,
                fontSize: 13,
                textWrap: {
                    width: 200,
                    height: 100,
                    ellipsis: true
                },
                cursor: 'pointer',
                fill: DARK_COLOR,
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
                pointerEvents: 'none'
            },
            labelBody: {
                ref: 'labelText',
                fill: BACKGROUND_COLOR,
                stroke: BACKGROUND_COLOR,
                strokeWidth: 2,
                width: 'calc(w)',
                height: 'calc(h)',
                x: 'calc(x)',
                y: 'calc(y)'
            }
        }
    }
});

Object.assign(shapes, {
    app: {
        Node,
        Base,
        Message,
        FlowchartStart,
        FlowchartEnd,
        Link
    }
});
