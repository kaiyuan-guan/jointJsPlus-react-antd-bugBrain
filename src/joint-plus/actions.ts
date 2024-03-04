/*! JointJS+ v4.0.0 - HTML5 Diagramming Framework - TRIAL VERSION
   版权声明和版本信息 */

import { dia, ui, shapes, format } from '@joint/plus';
// 引入所需的模块和库

import JointPlusService from '../services/joint-plus.service';
// 导入 JointPlusService 服务，用于操作 JointJS+ 的功能

import { SharedEvents } from './controller';
// 导入控制器中定义的共享事件

import { addCellTools } from './tools';
// 导入添加单元格工具的函数

import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from '../theme';
// 导入缩放相关的常量

import { stencilConfig } from './config/stencil.config';
// 导入 stencil 配置文件，用于加载 stencil 形状

import { ShapeTypesEnum } from './shapes/app.shapes';
// 导入图形类型的枚举

import { PADDING_L } from '../theme';
// 导入页面边距常量

// Selection

/**
 * 设置选择项
 * @param service JointPlusService 实例
 * @param selection 选择的单元格数组
 */
export function setSelection(service: JointPlusService, selection: dia.Cell[]): void {
    const { paper, selection: previousSelection, eventBusService } = service;
    // 从服务中获取所需属性
    paper.removeTools();
    // 移除所有工具
    previousSelection.forEach(cell => {
        const cellView = cell.findView(paper);
        if (cellView) {
            cellView.vel.removeClass('selected');
        }
    });
    // 遍历之前的选择，移除选中状态
    service.selection = selection;
    // 更新当前选择
    selection.forEach(cell => {
        const cellView = cell.findView(paper);
        if (cellView) {
            cellView.vel.addClass('selected');
            addCellTools(cellView);
        }
    });
    // 遍历新的选择，添加选中状态并添加工具
    eventBusService.emit(SharedEvents.SELECTION_CHANGED, selection);
    // 发送选择变化的事件
}

/**
 * 移除选择项
 * @param service JointPlusService 实例
 */
export function removeSelection(service: JointPlusService) {
    const { selection, graph } = service;
    if (selection.length === 0) return;
    graph.removeCells(selection);
    // 如果有选择项，则从图中移除
}

// Zooming

/**
 * 缩放以适应视图
 * @param service JointPlusService 实例
 */
export function zoomToFit(service: JointPlusService) {
    const { scroller } = service;
    scroller.zoomToFit({
        minScale: ZOOM_MIN,
        maxScale: ZOOM_MAX,
        scaleGrid: ZOOM_STEP,
        useModelGeometry: true,
        padding: PADDING_L
    });
    // 缩放以适应整个图的大小
}

/**
 * 放大
 * @param service JointPlusService 实例
 */
export function zoomIn(service: JointPlusService) {
    const { scroller } = service;
    scroller.zoom(ZOOM_STEP, {
        min: ZOOM_MIN,
        max: ZOOM_MAX,
    });
    // 放大
}

/**
 * 缩小
 * @param service JointPlusService 实例
 */
export function zoomOut(service: JointPlusService) {
    const { scroller } = service;
    scroller.zoom(-ZOOM_STEP, {
        min: ZOOM_MIN,
        max: ZOOM_MAX,
    });
    // 缩小
}

// Import / Export

/**
 * 导出为 PNG 格式
 * @param service JointPlusService 实例
 */
export function exportToPNG(service: JointPlusService): void {
    const { paper } = service;
    paper.hideTools();
    // 隐藏所有工具
    paper.dumpViews();
    // 清理视图，仅保留可见部分
    format.toPNG(paper, (dataURL: string): void => {
        paper.showTools();
        // 显示工具
        openImageDownloadDialog(service, dataURL);
    }, {
        padding: 10,
        useComputedStyles: false
    });
    // 将画布导出为 PNG 图像
}

/**
 * 打开图片下载对话框
 * @param service JointPlusService 实例
 * @param dataURL 图片的数据 URL
 * @param fileName 图片文件名，默认为 'Joint'
 */
export function openImageDownloadDialog(service: JointPlusService, dataURL: string, fileName: string = 'Joint'): void {
    const { keyboard, controllers } = service;
    const { keyboard: keyboardCtrl } = controllers;
    keyboardCtrl.stopListening();
    // 暂停键盘事件监听
    const lightbox = new ui.Lightbox({
        image: dataURL,
        downloadable: true,
        fileName
    });
    // 创建图片展示的轻箱
    lightbox.on('action:close', () => {
        keyboardCtrl.startListening();
    });
    // 监听关闭动作，恢复键盘事件监听
    lightbox.listenTo(keyboard, 'escape', () => {
        keyboardCtrl.startListening();
        lightbox.close();
    });
    // 监听键盘事件，按下 ESC 键关闭轻箱
    lightbox.open();
    // 打开轻箱
}

/**
 * 从 JSON 数据导入图形
 * @param service JointPlusService 实例
 * @param json JSON 数据
 */
export function importGraphFromJSON(service: JointPlusService, json: any): void {
    setSelection(service, []);
    // 清除当前选择
    const { graph, history } = service;
    console.log(json)
    const shapeTypes = Object.values(ShapeTypesEnum);
    history.reset();
    try {
        if (json.cells.some((cell: any) => !shapeTypes.includes(cell.type))) {
            throw new Error('Invalid JSON: Unknown Cell Type');
        }
        // 如果 JSON 中存在未知类型的单元格，则抛出异常
        graph.fromJSON(json);
    } catch (e) {
        // 捕获异常，处理无效的 JSON 格式
    }
}

// Stencil

/**
 * 加载 stencil 形状
 * @param service JointPlusService 实例
 */
export function loadStencilShapes(service: JointPlusService): void {
    const { stencil } = service;
    // 获取 stencil 对象
    // @ts-ignore
    const stencilShapes = stencilConfig.shapes.map(shape => new shapes.stencil[shape.name](shape));
    // 从配置中创建 stencil 形状
    stencil.load(stencilShapes);
    // 加载 stencil 形状
}

// Paper

/**
 * 更新连接线的路由
 * @param service JointPlusService 实例
 */
export function updateLinksRouting(service: JointPlusService): void {
    const { paper, graph } = service;
    graph.getLinks().forEach(link => {
        const linkView = link.findView(paper) as dia.LinkView;
        if (linkView) {
            linkView.requestConnectionUpdate();
        }
    });
    // 更新所有连接线的路由
}

// History

/**
 * 撤销操作
 * @param service JointPlusService 实例
 */
export function undoAction(service: JointPlusService) {
    const { history } = service;
    history.undo();
    // 执行撤销操作
}

/**
 * 重做操作
 * @param service JointPlusService 实例
 */
export function redoAction(service: JointPlusService) {
    const { history } = service;
    history.redo();
    // 执行重做操作
}

