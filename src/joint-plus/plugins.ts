/*! JointJS+ v4.0.0 - HTML5 Diagramming Framework - TRIAL VERSION
   版本声明和许可信息
*/

import { dia, shapes, ui } from '@joint/plus'; // 导入 JointJS+ 中的 dia、shapes、ui 模块

import { enableVirtualRendering } from './features/virtual-rendering'; // 导入启用虚拟渲染的函数
import { toolbarConfig } from './config/toolbar.config'; // 导入工具栏配置
import { BACKGROUND_COLOR, SECONDARY_BACKGROUND_COLOR, GRID_SIZE, PADDING_L, PADDING_S } from '../theme'; // 导入主题颜色和间距常量
import './shapes/index'; // 导入图形形状定义

// 创建并返回一组插件
export function createPlugins(
    scopeElement: Element, // 作用域元素，通常为包含画布的 DOM 元素
    paperElement: Element, // 画布元素
    stencilElement: Element, // 模板元素
    toolbarElement: Element // 工具栏元素
) {
    // Graph 图形对象
    const graph = new dia.Graph({}, { cellNamespace: shapes }); // 创建一个空的图形对象

    // Paper 画布对象
    const paper = new dia.Paper({
        model: graph, // 设置画布的模型为图形对象
        async: true, // 异步渲染
        sorting: dia.Paper.sorting.APPROX, // 排序方式
        gridSize: GRID_SIZE, // 网格大小
        linkPinning: false, // 连接是否固定
        multiLinks: false, // 是否允许多连接
        snapLinks: true, // 是否捕捉连接
        moveThreshold: 5, // 移动阈值
        magnetThreshold: 'onleave', // 磁力吸附阈值
        background: { color: BACKGROUND_COLOR }, // 背景颜色
        cellViewNamespace: shapes, // 元素视图命名空间
        interactive: {
            labelMove: true, // 是否允许标签移动
            linkMove: false // 是否允许连接移动
        },
        defaultRouter: { // 默认路由器配置
            name: 'manhattan', // 路由器名称
            args: {
                padding: { bottom: PADDING_L, vertical: PADDING_S, horizontal: PADDING_S }, // 路由器参数
                step: GRID_SIZE // 路由器参数
            }
        },
        defaultConnector: { name: 'rounded' }, // 默认连接器
        defaultLink: () => new shapes.app.Link(), // 默认连接对象的创建函数
        validateConnection: ( // 连接验证函数
            sourceView: dia.CellView,
            sourceMagnet: SVGElement,
            targetView: dia.CellView,
            targetMagnet: SVGElement
        ) => {
            // 验证连接是否合法
            if (sourceView === targetView) return false; // 源视图与目标视图相同时，不合法
            if (targetView.findAttribute('port-group', targetMagnet) !== 'in') return false; // 目标视图不是输入端口时，不合法
            if (sourceView.findAttribute('port-group', sourceMagnet) !== 'out') return false; // 源视图不是输出端口时，不合法
            return true; // 其他情况下，连接合法
        }
    });

    // PaperScroller 插件（滚动和缩放）
    const scroller = new ui.PaperScroller({
        paper, // 设置关联的画布对象
        autoResizePaper: true, // 自动调整画布大小
        contentOptions: {
            padding: 100,
            allowNewOrigin: 'any',
            allowNegativeBottomRight: true,
            useModelGeometry: true
        },
        scrollWhileDragging: true, // 拖动时滚动
        cursor: 'grab', // 光标样式
        baseWidth: 1000, // 基础宽度
        baseHeight: 1000 // 基础高度
    });
    paperElement.appendChild(scroller.el); // 将滚动条元素添加到画布元素中
    scroller.render().center(); // 渲染并居中显示

    // 渲染用户看到的内容，保持渲染的单元格数量最小
    enableVirtualRendering(scroller, { threshold: 50 }); // 启用虚拟渲染

    // Stencil 插件（元素调色板）
    const stencil = new ui.Stencil({
        paper: scroller, // 设置关联的画布对象
        width: 240, // 宽度
        scaleClones: true, // 是否缩放副本
        dropAnimation: true, // 是否启用拖放动画
        paperOptions: {
            sorting: dia.Paper.sorting.NONE, // 排序方式
            background: {
                color: SECONDARY_BACKGROUND_COLOR // 背景颜色
            }
        },
        dragStartClone: (element: dia.Element) => { // 拖动开始时的副本创建函数
            const name = element.get('name'); // 获取元素名称
            // @ts-ignore
            const Shape = shapes.app[name]; // 获取元素形状类
            if (!Shape) throw new Error(`Invalid stencil shape name: ${name}`); // 若未找到对应的形状类，则抛出错误
            return Shape.fromStencilShape(element); // 返回从模板形状创建的元素
        },
        layout: {
            columnWidth: 110, // 列宽度
            columns: 1, // 列数
            rowGap: PADDING_S, // 行间距
            rowHeight: 'auto', // 行高度
            marginY: PADDING_S, // Y 方向的边距
            marginX: -PADDING_L // X 方向的边距
        }
    });
    stencilElement.appendChild(stencil.el); // 将模板元素添加到 DOM 中
    stencil.render(); // 渲染模板

    // Command Manager 插件（撤销 / 重做）
    const history = new dia.CommandManager({
        graph // 设置关联的图形对象
    });

    // Toolbar 插件
    const toolbar = new ui.Toolbar({
        tools: toolbarConfig.tools, // 工具配置
        autoToggle: true, // 自动切换
        references: {
            paperScroller: scroller, // 画布滚动条对象
            commandManager: history // 命令管理器对象
        }
    });
    toolbarElement.appendChild(toolbar.el); // 将工具栏元素添加到 DOM 中
    toolbar.render(); // 渲染工具栏

    // Tooltip 插件
    const tooltip = new ui.Tooltip({
        rootTarget: scopeElement, // 根目标元素
        container: scopeElement, // 容器
        target: '[data-tooltip]', // 目标选择器
        direction: ui.Tooltip.TooltipArrowPosition.Auto, // 提示框箭头方向
        padding: PADDING_S, // 内边距
        animation: true // 动画效果
    });

    // Keyboard 插件
    const keyboard = new ui.Keyboard(); // 创建键盘对象

    // 返回所有插件对象
    return { graph, paper, scroller, stencil, toolbar, tooltip, keyboard, history };
}
