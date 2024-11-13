/**
 * W3C 自适应布局方案
 *  1.设置 meta 标签：
 *      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
 *      其中：viewport-fit=cover 是为刘海屏设置的
 * 
 *  2.rem 计算方式：1rem = deviceWidth / 7.5 (即：屏幕宽度 / 7.5)
 *      建议：用 iPhone6 作为视觉稿标准，物理像素宽为 750，便于计算
 *      在 750px 的视觉稿中：1rem = 100px，1px = 0.01rem
 * 
 *  3.rem 与 px 的转换关系：
 *      1rem = (屏幕宽度 / 7.5) px；1px = (7.5 / 屏幕宽度) rem
 *      例：
 *          在 iPhone 5 中：
 *              1rem = (320 / 7.5)px = 42.7px
 *              1px = (7.5 / 320)rem = 0.0234rem
 *          在 iPhone6 中：
 *              1rem = (375 / 7.5)px = 50px
 *              1px = (7.5 / 375)rem = 0.02rem
 *          在 iPhone6 Plus 中：
 *              1rem = (414 / 7.5)px = 55.2px
 *              1px = (7.5 / 414)rem = 0.0181rem
 * 
 *  4.rem 的自适应范围：320 ~ 576
 *      当屏幕小于 320 或 大于 576，就不再继续缩小、放大
 * 
 *  说明：
 *      在 IE 中，必须让 setRemUnit 函数以同步方式先执行一次，否则页面加载时 css 的 rem 单位无法正确计算，其它浏览器可以使用 "DOMContentLoaded" 事件监听；
 *
 *  待增加：
 *      增加 m 端标识、区分出微信浏览器；
 *      增加常见电脑分辨率标识：[1440, 1366, 1280, 1024]
 *      最后：在移动端使用 rem 布局，PC 端使用分辨率标识
 */

!function (win, doc) {
    var docEl = doc.documentElement;
    var dpr = win.devicePixelRatio || 1;

    // set 1rem = deviceWidth / 7.5 ( in 750px device：1 rem = 100px )
    var setRemUnit = (function setRemUnitFn () {
        var clientWidth = Math.min(Math.max(320, docEl.clientWidth), 576);
        var rem = clientWidth / 7.5;

        docEl.style.fontSize = rem + 'px';
        
        return setRemUnitFn;
    })();

    // reset rem unit on page resize
    if (win.addEventListener) {
        win.addEventListener('resize', setRemUnit, !1);
        doc.addEventListener('DOMContentLoaded', setRemUnit, !1);
        win.addEventListener('pageshow', function (e) {
            e.persisted && setRemUnit();
        }, !1);
    }

    // 添加一些标识：
    // detect 0.5px supports：add className called hairlines if it support
    if (dpr >= 2) {
        var fakeBody = document.createElement('body'),
            testElement = document.createElement('div');

        testElement.style.border = '.5px solid transparent';

        fakeBody.appendChild(testElement);
        docEl.appendChild(fakeBody);

        1 === testElement.offsetHeight && docEl.classList.add('hairline');

        docEl.removeChild(fakeBody);
    }

    docEl.setAttribute('data-dpr', dpr);
}(window, document);