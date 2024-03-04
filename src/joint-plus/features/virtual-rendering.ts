/*!
 * JointJS+ v4.0.0 - HTML5 绘图框架 - 试用版本
 * 版权所有 (c) 2024 client IO
 * 2024-02-18
 * 
 * 本源代码形式受 JointJS+ 试用许可证第 2.0 版的条款约束。
 * 如果未随此文件分发 JointJS+ 许可证的副本，
 * 您可以在 https://www.jointjs.com/license
 * 或从由 client IO 分发的 JointJS+ 存档中获取。
 * 请参阅 LICENSE 文件。
 */

// 导入所需的模块
import { g, mvc, ui } from '@joint/plus';

// 定义虚拟渲染选项接口
interface VirtualRenderingOptions {
    threshold?: number; // 阈值参数，默认为0
}

/**
 * 启用虚拟渲染功能
 * @param scroller - PaperScroller 对象
 * @param options - 虚拟渲染选项
 */
export function enableVirtualRendering(scroller: ui.PaperScroller, options: VirtualRenderingOptions = {}) {
    // 从参数中获取 PaperScroller 对象和选项
    const { paper } = scroller.options;
    const { threshold = 0 } = options;

    let viewportArea: g.Rect;

    // 定义函数，用于更新视口区域
    function updateViewportArea() {
        // 获取 PaperScroller 的可见区域，并根据阈值进行调整
        viewportArea = scroller.getVisibleArea().inflate(threshold);
    }

    // 设置监听器，以便在滚动或缩放时更新视口区域
    updateViewportArea();
    scroller.on('scroll', updateViewportArea);
    paper.on('scale', updateViewportArea);

    // 设置 Paper 的 viewport 选项，用于控制元素的显示与隐藏
    paper.options.viewport = (view: mvc.View<any>) => {
        const { model } = view;
        // 获取元素的边界框
        const bbox = model.getBBox();
        if (model.isLink()) {
            // 如果是连接线，则进行微调以确保其可见性
            bbox.inflate(1);
        }
        // 检查元素的边界框是否与视口区域相交，以确定是否显示元素
        return viewportArea.intersect(bbox) !== null;
    };
}
