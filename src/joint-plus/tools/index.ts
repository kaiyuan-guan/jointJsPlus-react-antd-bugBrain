/*! JointJS+ v4.0.0 - HTML5 Diagramming Framework - TRIAL VERSION
   版权声明和版本信息 */

import { dia, elementTools, linkTools, shapes } from '@joint/plus';
// 导入 JointJS+ 的核心库和工具

import { RemoveTool } from './remove.tool';
// 导入自定义的 RemoveTool 工具

/**
 * 向单元格视图添加工具
 * @param cellView 单元格视图对象
 */
export function addCellTools(cellView: dia.CellView): void {
    if (cellView.model.isLink()) {
        // 如果是连接线，则添加连接线工具
        addLinkTools(cellView as dia.LinkView);
    } else {
        // 如果是元素，则添加元素工具
        addElementTools(cellView as dia.ElementView);
    }
}

/**
 * 向元素视图添加工具
 * @param elementView 元素视图对象
 */
export function addElementTools(elementView: dia.ElementView): void {
    const element = elementView.model as shapes.app.Base;
    const padding = element.getBoundaryPadding();
    // 获取元素边界的内边距
    const toolsView = new dia.ToolsView({
        tools: [
            // 添加边界工具，用于显示元素的边界
            new elementTools.Boundary({
                useModelGeometry: true,
                padding
            }),
            // 添加自定义的删除工具
            new RemoveTool({
                x: '100%',
                offset: {
                    x: padding.right,
                    y: -padding.top
                }
            })
        ]
    });
    // 创建工具视图，并添加到元素视图中
    elementView.addTools(toolsView);
}

/**
 * 向连接线视图添加工具
 * @param linkView 连接线视图对象
 */
export function addLinkTools(linkView: dia.LinkView): void {
    const toolsView = new dia.ToolsView({
        tools: [
            // 添加顶点工具，用于编辑连接线的顶点
            new linkTools.Vertices(),
            // 添加起始箭头工具
            new linkTools.SourceArrowhead(),
            // 添加目标箭头工具
            new linkTools.TargetArrowhead(),
            // 添加边界工具，用于显示连接线的边界
            new linkTools.Boundary({ padding: 15 }),
            // 添加自定义的删除工具
            new RemoveTool({ offset: -20, distance: 40 })
        ]
    });
    // 创建工具视图，并添加到连接线视图中
    linkView.addTools(toolsView);
}
