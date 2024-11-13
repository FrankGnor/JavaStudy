
(function (root, factory) {
    if (typeof define === 'function' && define.amd) // amd
        define(factory);
    else
        root.Scroll = factory();
}(window, function () { 'use strict';
    var docEl = document.documentElement;
    var overflowScrollReg = /scroll|auto/i;


    /**
     * 判断值是否为DOM元素
     */
    function isElement(v) {
        return v && v.nodeType && v.nodeType === 1;
    }


    /**
     * 获取页面大小 : 页面宽高
     */
    function getPageSize() {
        return {
            width: docEl.scrollWidth,
            height: docEl.scrollHeight
        };
    }


    /**
     * 获取浏览器的垂直滚动距离
     */
    function getRootScrollTop() {
        return window.scrollY || window.pageYOffset || docEl.scrollTop || document.body.scrollTop || 0;
    }


    /**
     * 获取浏览器的横向滚动距离
     */
    function getRootScrollLeft() {
        return window.scrollX || window.pageXOffset || docEl.scrollLeft || document.body.scrollLeft || 0;
    }


    /**
     * 获取浏览器的滚动距离
     */
    function getRootScrollInfo() {
        return {
            scrollTop: getRootScrollTop(),
            scrollLeft: getRootScrollLeft()
        };
    }


    /**
     * 获取元素的垂直滚动距离，若不传参或参数不是 DOM 元素，则返回浏览器的垂直滚动距离
     */
    function getScrollTop(el) {
        if (el === void 0 || el === window) return getRootScrollTop();
        if (!isElement(el)) el = document.querySelector(el);
        if (!el) console.error('getScrollTop Function: Cannot found DOM element');
        return el.scrollTop || 0;
    }


    /**
     * 获取元素的横向滚动距离，若不传参或参数不是 DOM 元素，则返回浏览器的横向滚动距离
     */
    function getScrollLeft(el) {
        if (el === void 0 || el === window) return getRootScrollLeft();
        if (!isElement(el)) el = document.querySelector(el);
        if (!el) console.error('getScrollLeft Function: Cannot found DOM element');
        return el.scrollLeft || 0;
    }


    /**
     * 设置垂直滚动距离
     */
    function setScrollTop(el, value) {
        if ('scrollTop' in el) {
            el.scrollTop = value;
        } else {
            el.scrollTo(el.scrollX, value);
        }
    }


    /**
     * 设置水平滚动距离
     */
    function setScrollLeft(el, value) {
        if ('scrollLeft' in el) {
            el.scrollLeft = value;
        } else {
            el.scrollTo(value, el.scrollY);
        }
    }


    /**
     * 获取元素大小及其相对于页面左上角的位置
     * @description 模仿 getBoundingClientRect，无 x、y 属性
     */
    function getBoundingPageRect (el) {
        if (!isElement(el)) el = document.querySelector(el);
        if (!el) console.error('getBoundingPageRect Function: Cannot found DOM element');

        var DOMRect = el.getBoundingClientRect();
        var scrollInfo = getRootScrollInfo();
        var top = DOMRect.top + scrollInfo.scrollTop;
        var left = DOMRect.left + scrollInfo.scrollLeft;
        return {
            top: top,
            left: left,
            right: left + DOMRect.width,
            bottom: top + DOMRect.height,
            width: DOMRect.width,
            height: DOMRect.height
        };
    }


    /**
     * 获取元素与视口的距离（视口大小不计算滚动条）
     */
    function getDistanceClientRect (el) {
        if (!isElement(el)) el = document.querySelector(el);
        if (!el) console.error('getDistanceClientRect Function: Cannot found DOM element');

        var DOMRect = el.getBoundingClientRect();
        return {
            top: DOMRect.top,
            left: DOMRect.left,
            right: docEl.clientWidth - DOMRect.right,
            bottom: docEl.clientHeight - DOMRect.bottom,
            width: DOMRect.width,
            height: DOMRect.height
        };
    }


    /**
     * 获取元素与页面的距离
     */
    function getDistancePageRect (el) {
        if (!isElement(el)) el = document.querySelector(el);
        if (!el) console.error('getDistancePageRect Function: Cannot found DOM element');

        var boundingPageRect = getBoundingPageRect(el);
        var pageSize = getPageSize();
        return {
            top: boundingPageRect.top,
            left: boundingPageRect.left,
            right: pageSize.width - boundingPageRect.right,
            bottom: pageSize.height - boundingPageRect.bottom,
            width: boundingPageRect.width,
            height: boundingPageRect.height
        };
    }


    return {
        getPageSize: getPageSize,

        getRootScrollTop: getRootScrollTop,
        getRootScrollLeft: getRootScrollLeft,
        getRootScrollInfo: getRootScrollInfo,

        getScrollTop: getScrollTop,
        getScrollLeft: getScrollLeft,

        setScrollTop: setScrollTop,

        getBoundingPageRect: getBoundingPageRect,

        getDistanceClientRect: getDistanceClientRect,
        getDistancePageRect: getDistancePageRect
    };
}));
