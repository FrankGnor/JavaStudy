(function () {
    window.requestAnimationFrame = window.requestAnimationFrame || function (fn) { return window.setTimeout(fn, 1000 / 60); };
    window.cancelAnimationFrame = window.cancelAnimationFrame || function (id) { window.clearTimeout(id); };
    moment.locale('zh-cn');

    var query = Qs.parse(window.location.href.split('?')[1]);
    var SECOND = 1000,
        MINUTE = 60 * SECOND,
        HOUR = 60 * MINUTE,
        DAY = 24 * HOUR;

    var loginModal;

    // 活动相关的工具函数
    var actUtils = (function (win, doc) {
        var docEl = doc.documentElement;

        return {
            // 对个位数进行补零，n 是补零后的位数
            formatNumber: function (v, n) {
                v = v.toString();
                if (n === void 0) n = 2;
                if (v.length >= n) {
                    return v;
                } else {
                    return '0'.repeat(n - v.length) + v;
                }
            },

            // 获取页面的滚动距离
            getRootScrollInfo: function () {
                return {
                    top: win.pageYOffset || docEl.scrollTop || document.body.scrollTop || 0,
                    left: win.pageXOffset || docEl.scrollLeft || document.body.scrollLeft || 0
                };
            },

            // 获取元素的大小及其与视口的距离（不会将滚动条计算在内）
            getToWindowRect: function (el) {
                var rect = el.getBoundingClientRect();
                return {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left,
                    right: docEl.clientWidth - rect.right,
                    bottom: docEl.clientHeight - rect.bottom
                };
            },

            getToPageRect: function (el) {
                var rootScrollInfo = this.getRootScrollInfo(),
                    toWindowRect = this.getToWindowRect(el);
                return {
                    width: toWindowRect.width,
                    height: toWindowRect.height,
                    top: toWindowRect.top + rootScrollInfo.top,
                    bottom: toWindowRect.top + rootScrollInfo.top + toWindowRect.height
                };
            }
        };
    })(window, document);

    var ActMixin = {
        data() {
            // 将后端的时间字符串转换为毫秒值
            function getTime (v) { return new Date(v.replace(/-/g, '/')).getTime(); }

            var ua = window.navigator.userAgent;
            var tabletRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i;
            var wechatRE = /micromessenger/i;

            return {
                actId: phpData.actId,
                system: phpData.system || 'web',
                isMobile: tabletRE.test(ua),
                isWechat: wechatRE.test(ua),
                imgBaseURL: 'https://7n.w3cschool.cn/statics/images/activity/doubleEleven',
                avatarBaseURL: 'https://atts.w3cschool.cn/attachments/avatar2',

                nowTime: getTime(phpData.nowTime),              // 当前时间
                startTime: getTime(phpData.startTime),          // 开始时间
                endTime: getTime(phpData.endTime),              // 结束时间
                todayEndTime: getTime(phpData.nowTime.split(' ')[0]) + DAY,  // 今日结束时间
            };
        },
        computed: {
            isApp() { return this.system !== 'web'; },
            isIosApp() { return this.system === 'ios'; }
        }
    };

    // App相关
    var AppMixin = {
        methods: {
            convertAppURL(o) {
                var appQuery;
                if (o.appFunction === 'orther') {
                    var winName = o.win || '';
                    var winURL = 'widget://html/' + winName + '.html';
                    var winParam = o.param || {};
                    appQuery = 'appfunction=orther&appwinname=' + winName + '&appwinurl=' + encodeURIComponent(winURL) + '&apppageparam=' + encodeURIComponent(JSON.stringify(winParam));
                    return window.location.href + (window.location.search ? '&' : '?') + appQuery;
                } else {
                    appQuery = 'appfunction=' + encodeURIComponent(o.function || '') + '&appvalue=' + encodeURIComponent(o.value || '');
                    return window.location.href + (window.location.search ? '&' : '?') + appQuery;
                }
            },
            navigatorToApp(o) {
                window.location.href = this.convertAppURL(o);
            }
        }
    };

    // vip相关
    var VipMixin = {
        computed: {
            vipSalePrice: function () { return this.isIosApp ? '388' : '365'; }
        },
        methods: {
            toOpenvip(type, quantity) {
                if (!this.isApp && !this.isLogin) {
                    this.toLogin();
                    return;
                }
                var fcode = 'activity_' + this.actId;
                $.ajax('/activity/setUseLog', {
                    method: 'post',
                    data: {
                        system: this.system,
                        fcode: fcode,
                        type: type,
                    }
                });
                if (this.isApp) {
                    let vipGroup = 0;
                    if (quantity === 12) {
                        vipGroup = 12;
                    } else if (quantity === 24) {
                        vipGroup = 1188;
                    }
                    this.navigatorToApp({
                        appFunction: 'orther',
                        win: 'myVip_win',
                        param: {
                            goPay: vipGroup > 0 ? 1 : 0,
                            vipGroup: vipGroup
                        }
                    });
                } else if (this.isMobile) {
                    let vipGroup = 0;
                    if (quantity === 12) {
                        vipGroup = 12;
                    } else if (quantity === 24) {
                        vipGroup = 1188;
                    }
                    window.open('/vip?' + Qs.stringify({
                        fcode: fcode,
                        goPay: vipGroup > 0 ? 1 : 0,
                        vipgroup: vipGroup
                    }));
                } else {
                    let openjoinindex = 0;
                    if (quantity === 12) {
                        openjoinindex = 1;
                    } else if (quantity === 24) {
                        openjoinindex = 2;
                    }
                    window.open('/vip?' + Qs.stringify({
                        fcode: fcode,
                        openjoin: quantity > 0 ? 1 : 0,
                        openjointype: 'svip',
                        openjoinindex: openjoinindex
                    }));
                }
            }
        }
    };

    // 用户信息
    var UserInfoMixin = {
        data: function () {
            return { userInfo: phpData.userInfo };
        },
        computed: {
            isLogin: function () { return this.userInfo.uid > 0; },
            isVip: function () { return this.isLogin && this.userInfo.viptype > 0; },
            isSvip: function () { return this.isLogin && this.userInfo.viptype === '2'; }
        },
        methods: {
            toLogin: function () {
                if (!loginModal) loginModal = new LoginModal();
                loginModal.open();
            }
        }
    };

    // 活动倒计时
    var CountDownMixin = {
        data() {
            return {
                isDuration: false,  // 是否在活动期间
                actMessage: '',     // 活动信息：未开始 或 已结束
                countdownMessage: '',
                remainTimeData: {
                    days: '00',
                    hours: '00',
                    minutes: '00',
                    seconds: '00',
                }
            };
        },
        created() {
            this.initCountDown();
        },
        methods: {
            initCountDown() {
                if (this.nowTime < this.startTime) {
                    this.isDuration = false;
                    this.actMessage = '活动将于11月01日零点上线，敬请期待';
                } else if (this.nowTime > this.endTime) {
                    this.isDuration = false;
                    this.actMessage = '活动已经结束，期待下次与你相遇';
                } else {
                    this.isDuration = true;
                }
                if (this.isDuration) {
                    this.countdownMessage = '距今日活动结束';
                    this.countDownTick(Date.now());
                }
            },
            countDownTick(prev) {
                var remain = this.todayEndTime - this.nowTime;
                if (remain > 0) {
                    var curr = Date.now();
                    this.setRemain(remain);
                    this.nowTime += curr - prev;
                    window.requestAnimationFrame(this.countDownTick.bind(this, curr));
                }
            },
            setRemain(remain) {
                this.remainTimeData.days = actUtils.formatNumber(Math.floor(remain / DAY), 2);
                this.remainTimeData.hours = actUtils.formatNumber(Math.floor(remain % DAY / HOUR), 2);
                this.remainTimeData.minutes = actUtils.formatNumber(Math.floor(remain % HOUR / MINUTE), 2);
                this.remainTimeData.seconds = actUtils.formatNumber(Math.floor(remain % MINUTE / SECOND), 2);
            },
        }
    };

    new Vue({
        el: '#activity',
        mixins: [ActMixin, AppMixin, VipMixin, UserInfoMixin, CountDownMixin],
        bodyPrevStyle: document.body.style.cssText,
        data() {
            return {
                payLog: phpData.payLog.map((item) => {
                    let nickname = item.nickname,
                        serverno = item.serverno;
                    item.nickname = nickname[0] + '*' + nickname[nickname.length - 1]; // .repeat(nickname.length - 2) + nickname[nickname.length - 1]
                    item.addtime = moment(item.addtime).from(this.nowTime);
                    if (serverno === '2') {
                        item.serverno = 'VIP买1年送1年福利';
                    } else if (serverno === '4') {
                        item.serverno = 'VIP买2年送终身福利';
                    } else {
                        item.serverno = '';
                    }
                    return item;
                }),
                showRules: false,
                showFooter: false,
            };
        },
        watch: {
            showRules: function (v) {
                if (v) {
                    this.$options.bodyPrevStyle = document.body.style.cssText;
                    document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.cssText = this.$options.bodyPrevStyle;
                }
            }
        },
        mounted() {
            var distance = actUtils.getToPageRect(this.$refs.cell1Ref).bottom;
            window.addEventListener('scroll', () => {
                this.showFooter = window.scrollY >= distance;
            });

            if (this.payLog.length > 0) {
                new Swiper('.act-main-order', {
                    loop: true,
                    autoplay: true,
                    direction: 'vertical',
                    allowTouchMove: false,
                });
            }
        }
    });
}());
