/*! JointJS+ v4.0.0 - HTML5 Diagramming Framework - TRIAL VERSION
   版本声明和许可信息
*/

import { Subscription } from 'rxjs'; // 导入 RxJS 中的 Subscription 类，用于管理订阅
import { dia, ui } from '@joint/plus'; // 导入 JointJS+ 中的 dia 和 ui 模块

import { EventBusService } from './event-bus.service'; // 导入事件总线服务
import { Controller } from '../joint-plus/controller'; // 导入控制器类
import { createPlugins } from '../joint-plus/plugins'; // 导入插件创建函数
import { JointPlusController, KeyboardController } from '../joint-plus/controllers'; // 导入控制器类

export class JointPlusService {
    // 公共属性定义
    public controllers: { joint: Controller, keyboard: Controller }; // 控制器对象
    public graph: dia.Graph; // 图形对象
    public history: dia.CommandManager; // 命令管理器
    public keyboard: ui.Keyboard; // 键盘对象
    public paper: dia.Paper; // 画布对象
    public selection: dia.Cell[] = []; // 选择的图形元素数组，默认为空数组
    public scroller: ui.PaperScroller; // 画布滚动条对象
    public stencil: ui.Stencil; // 模板对象
    public toolbar: ui.Toolbar; // 工具栏对象
    public tooltip: ui.Tooltip; // 提示框对象

    // 私有属性定义
    private subscriptions = new Subscription(); // 订阅管理对象

    // 构造函数
    constructor(
        private scopeElement: Element, // 作用域元素，通常为包含画布的 DOM 元素
        paperElement: Element, // 画布元素
        stencilElement: Element, // 模板元素
        toolbarElement: Element, // 工具栏元素
        public readonly eventBusService: EventBusService, // 事件总线服务
    ) {
        // 使用插件创建函数创建并初始化各个组件，并将其属性赋值给当前对象
        Object.assign(this, createPlugins(scopeElement, paperElement, stencilElement, toolbarElement));

        // 初始化控制器对象，并将其添加到控制器集合中
        this.controllers = {
            joint: new JointPlusController(this), // 图形控制器
            keyboard: new KeyboardController(this) // 键盘控制器
        };

        // 订阅事件总线服务的事件，并将 RxJS 的通知转换为 Backbone 事件
        this.subscriptions.add(
            eventBusService.events().subscribe(({ name, value }) => eventBusService.trigger(name, value))
        );
    }

    // 销毁函数，用于清理资源
    public destroy(): void {
        // 获取各个组件对象，并调用其 remove 方法移除
        const { paper, scroller, stencil, toolbar, tooltip, controllers, subscriptions } = this;
        paper.remove(); // 移除画布
        scroller.remove(); // 移除画布滚动条
        stencil.remove(); // 移除模板
        toolbar.remove(); // 移除工具栏
        tooltip.remove(); // 移除提示框

        // 停止监听控制器对象的事件
        Object.keys(controllers).forEach(name => (controllers as any)[name].stopListening());

        // 取消订阅所有订阅对象
        subscriptions.unsubscribe();
    }
}

export default JointPlusService; // 导出 JointPlusService 类
