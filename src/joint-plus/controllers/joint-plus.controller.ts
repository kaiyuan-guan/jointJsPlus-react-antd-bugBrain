/*! JointJS+ v4.0.0 - HTML5 Diagramming Framework - TRIAL VERSION
   版权声明和版本信息
*/

import { dia, shapes, util } from '@joint/plus'; // 导入所需的模块和库
import JointPlusService from '../../services/joint-plus.service'; // 导入自定义的服务类
import { Controller, SharedEvents } from '../controller'; // 导入控制器基类和共享事件枚举
import * as actions from '../actions'; // 导入操作函数
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '../../theme'; // 导入缩放相关的常量

const DEBOUNCE_TIME_MS = 500; // 设置防抖时间间隔，单位为毫秒

export class JointPlusController extends Controller { // 定义 JointPlusController 类，继承自 Controller 基类

    startListening() { // 启动监听函数

        const { graph, paper, toolbar, history, eventBusService } = this.service; // 从服务中获取所需的对象

        this.listenTo(eventBusService, { // 监听事件总线服务
            [SharedEvents.GRAPH_START_BATCH]: onGraphStartBatch, // 监听 GRAPH_START_BATCH 事件，触发执行 onGraphStartBatch 函数
            [SharedEvents.GRAPH_STOP_BATCH]: onGraphStopBatch, // 监听 GRAPH_STOP_BATCH 事件，触发执行 onGraphStopBatch 函数
        });

        this.listenTo(graph, { // 监听图形对象
            'add': onCellAdd, // 添加元素事件
            'remove': onCellRemove, // 移除元素事件
            'change:ports': onElementPortsChange, // 元素端口变化事件
        });

        this.listenTo(history, { // 监听历史记录对象
            'stack': util.debounce(onHistoryChange, DEBOUNCE_TIME_MS), // 监听历史记录栈变化，使用防抖函数
        });

        this.listenTo(paper, { // 监听画布对象
            'paper:pinch': onPaperPinch, // 捏合事件
            'paper:pan': onPaperPan, // 拖动事件
            'blank:pointerdown': onPaperBlankPointerdown, // 空白区域鼠标按下事件
            'cell:pointerup': onPaperCellPointerup, // 元素鼠标释放事件
            'cell:tool:remove': onPaperCellToolRemove, // 元素工具移除事件
            'element:pointermove': onPaperElementPointermove, // 元素鼠标移动事件
            'element:pointerup': onPaperElementPointerup, // 元素鼠标释放事件
            'element:port:add': onPaperElementPortAdd, // 元素端口添加事件
            'element:port:remove': onPaperElementPortRemove, // 元素端口移除事件
            'scale': onPaperScale, // 画布缩放事件
        });

        this.listenTo(toolbar, { // 监听工具栏对象
            'png:pointerclick': onToolbarPNGPointerclick, // 导出 PNG 图片点击事件
        });
    }
}

// 以下是各个监听函数的定义和功能

// Event Bus Service

function onGraphStartBatch(service: JointPlusService, batchName: string): void {
    const { graph } = service; // 从服务中获取图形对象
    graph.startBatch(batchName); // 开始批处理
}

function onGraphStopBatch(service: JointPlusService, batchName: string): void {
    const { graph } = service; // 从服务中获取图形对象
    graph.stopBatch(batchName); // 结束批处理
}

// Graph

function onCellAdd(service: JointPlusService, cell: dia.Cell): void {
    if (cell.isLink()) return; // 如果是连接线，则返回
    actions.setSelection(service, [cell]); // 设置选中元素
    actions.updateLinksRouting(service); // 更新连接线路由
}

function onCellRemove(service: JointPlusService, removedCell: dia.Cell): void {
    const { selection } = service; // 从服务中获取选中元素
    if (!selection.includes(removedCell)) return; // 如果移除的元素不在选中列表中，则返回
    actions.setSelection(service, selection.filter(cell => cell !== removedCell)); // 移除选中元素中的移除的元素
    if (removedCell.isElement()) { // 如果移除的是元素
        actions.updateLinksRouting(service); // 更新连接线路由
    }
}

function onElementPortsChange(_service: JointPlusService, message: shapes.app.Message): void {
    message.toggleAddPortButton('out'); // 切换输出端口按钮状态
}

function onHistoryChange(service: JointPlusService): void {
    const { graph, eventBusService } = service; // 从服务中获取图形对象和事件总线服务
    eventBusService.emit(SharedEvents.GRAPH_CHANGED, graph.toJSON()); // 发送图形变化事件
}

// Paper

function onPaperBlankPointerdown(service: JointPlusService, evt: dia.Event): void {
    const { scroller } = service; // 从服务中获取滚动对象
    actions.setSelection(service, []); // 清空选中列表
    scroller.startPanning(evt); // 开始平移操作
}

function onPaperPinch(service: JointPlusService, evt: dia.Event, ox: number, oy: number, scale: number) {
    const { scroller } = service; // 从服务中获取滚动对象
    evt.preventDefault(); // 阻止默认事件
    scroller.zoom(scale - 1, { min: ZOOM_MIN, max: ZOOM_MAX, grid: ZOOM_STEP, ox, oy }); // 缩放画布
}

function onPaperPan(service: JointPlusService, evt: dia.Event, tx: number, ty: number) {
    const { scroller } = service; // 从服务中获取滚动对象
    evt.preventDefault(); // 阻止默认事件
    scroller.el.scrollLeft += tx; // 水平滚动
    scroller.el.scrollTop += ty; // 垂直滚动
}

function onPaperCellPointerup(service: JointPlusService, cellView: dia.CellView): void {
    actions.setSelection(service, [cellView.model]); // 设置选中元素
}

function onPaperElementPointermove(service: JointPlusService, elementView: dia.ElementView, evt: dia.Event): void {
    const { paper } = service; // 从服务中获取画布对象
    const { data } = evt; // 获取事件数据
    // 仅在第一次鼠标移动事件触发时执行以下代码
    if (data.pointermoveCalled) return;
    data.pointermoveCalled = true; // 标记已触发过鼠标移动事件
    paper.hideTools(); // 隐藏元素工具
}

function onPaperElementPointerup(service: JointPlusService, _elementView: dia.ElementView, evt: dia.Event): void {
    const { paper } = service; // 从服务中获取画布对象
    const { data } = evt; // 获取事件数据
    if (!data.pointermoveCalled) return; // 如果没有触发过鼠标移动事件，则返回
    paper.showTools(); // 显示元素工具
    actions.updateLinksRouting(service); // 更新连接线路由
}

function onPaperElementPortAdd(_service: JointPlusService, elementView: dia.ElementView, evt: dia.Event): void {
    evt.stopPropagation(); // 阻止事件冒泡
    const message = elementView.model as shapes.app.Message; // 获取元素模型
    message.addDefaultPort(); // 添加默认端口
}

function onPaperElementPortRemove(_service: JointPlusService, elementView: dia.ElementView, evt: dia.Event): void {
    evt.stopPropagation(); // 阻止事件冒泡
    const portId = elementView.findAttribute('port', evt.target); // 获取端口 ID
    const message = elementView.model as shapes.app.Message; // 获取元素模型
    message.removePort(portId); // 移除端口
}

function onPaperCellToolRemove(_service: JointPlusService, cellView: dia.CellView, _evt: dia.Event): void {
    cellView.model.remove(); // 移除元素
}

function onPaperScale(service: JointPlusService): void {
    const { tooltip } = service; // 从服务中获取提示对象
    tooltip.hide(); // 隐藏提示
}

// Toolbar

function onToolbarPNGPointerclick(service: JointPlusService): void {
    actions.exportToPNG(service); // 导出 PNG 图片
}
