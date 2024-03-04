/*! JointJS+ v4.0.0 - HTML5 Diagramming Framework - TRIAL VERSION
   版权声明和版本信息 */

import { dia, elementTools } from '@joint/plus';
// 导入 JointJS+ 的核心库和元素工具

// 定义 RemoveTool，继承自 elementTools.Remove
export const RemoveTool = elementTools.Remove.extend({
    options: {
        // 配置选项
        useModelGeometry: true, // 使用模型几何属性
        // 定义操作，点击工具时执行的动作
        action: (evt: dia.Event, cellView: dia.CellView): void => {
            cellView.notify('cell:tool:remove', evt);
            // 发送通知，指示移除操作
        },
        // 工具的标记，使用 SVG 元素定义
        markup: [{
            tagName: 'circle',
            selector: 'button', // 按钮选择器
            attributes: {
                'r': 10, // 半径
                'fill': '#FD0B88', // 填充颜色
                'cursor': 'pointer', // 鼠标样式
                'data-tooltip': 'Remove <i>(Del)</i>', // 提示信息
                'data-tooltip-position': 'bottom' // 提示位置
            }
        }, {
            tagName: 'path',
            selector: 'icon', // 图标选择器
            attributes: {
                'd': 'M -4 -4 4 4 M -4 4 4 -4', // 路径描述
                'fill': 'none', // 填充颜色
                'stroke': '#FFFFFF', // 边框颜色
                'stroke-width': 2, // 边框宽度
                'pointer-events': 'none' // 鼠标事件
            }
        }]
    }
});
