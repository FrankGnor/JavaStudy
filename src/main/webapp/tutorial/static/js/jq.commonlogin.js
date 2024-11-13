/**
 * 待优化：
 * LoginModal 的配置项设计
 * 滑块验证的优化
 * 网络请求时按钮的 loading 状态
 * Enter 自动提交表单的代码是否可省略
 * 微信登录、注册方式的通用性
 * Object.assign 支持深度合并
 * 动画效果
 */

"use strict";

var tabletRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i;

var Support = (function Support (win) {
	return {
		touch: (win.navigator.maxTouchPoints > 0) || ("ontouchstart" in win),
		passiveListener: (function checkPassiveListener () {
			var supportPassive = false;
			try {
				var opts = Object.defineProperty({}, "passive", {
					get: function () {
						supportPassive = true;
					}
				});
				win.addEventListener("testPassiveListener", null, opts);
			} catch (e) { /* no support */ }
			return supportPassive;
		})()
	};
})(window);

var Event = (function Event () {
	return {
		preventDefault: function (event) { if (typeof event.cancelable !== "boolean" || event.cancelable) event.preventDefault(); }
	};
})();

var Utils = $.extend(window.Utils || {}, {
	cookie: {
		setItem: function (key, value, expires) {
			expires = expires ? new Date( new Date().getTime() + expires*24*60*60*1000) : "";	// 未提供 expires 则浏览器关闭后自动清除
			document.cookie = key + "=" + value + ";expires=" + expires;
		},
		getItem: function (key) {
			if (!key) return;
			var matchResult = document.cookie.match(new RegExp("(^|\\s)" + key + "=([^;]*)(;|$)"));
			return matchResult && matchResult[2];
		},
		getAll: function () {
			var cookieObj = {};
			document.cookie.split("; ").forEach(function (item) {
				var pair = item.split("=");
				cookieObj[pair[0]] = pair[1];
			});
			return cookieObj;
		}
	},

	/**
	 * 获取 GET 查询参数
	 * Tips : 查询参数的 键 与 值 若含有特殊字符(如 ? &)，需要使用 encodeURIComponent 进行编码
	 */
	getQuery: function () {
		if (window.location.search === "") return {};
		var query = {};
		var queryArr = window.location.search.substring(1).split("&");
		for (var i = 0; i < queryArr.length; i++) {
			var pair = queryArr[i].split("=");
			query[window.decodeURIComponent(pair[0])] = window.decodeURIComponent(pair[1] || "").replace("&amp;", "&");
		}

		if(typeof query["refer"] != 'undefined'){
			query["refer"] = query["refer"].replace(/@/, '?').replace(/\|/, '=');
		}

		return query;
	},

	isWechat: function () {
		return !!navigator.userAgent.match(/MicroMessenger/i);
	},

	isMobile: tabletRE.test(navigator.userAgent)
});

var lm_utils = {
	// 根据 size 计算类名前缀
	computedPrefixCls: function (size) {
		var inputPrefixCls, btnPrefixCls;
		switch (size) {
			case "default":
				inputPrefixCls = "lm-input";
				btnPrefixCls = "lm-btn";
				break;
			case "large":
				inputPrefixCls = "lm-input-lg";
				btnPrefixCls = "lm-btn-lg";
				break;
			default:
				inputPrefixCls = "lm-input-" + size;
				btnPrefixCls = "lm-input-" + size;
		}
		return { input: inputPrefixCls, btn: btnPrefixCls };
	},
	computedInputCls: function (size) {
		var inputPrefixCls = this.computedPrefixCls(size).input;
		var base = size === "default" ? "lm-input" : ("lm-input" + " " + inputPrefixCls),
			prefix = size === "default" ? "lm-input-prefix" : "lm-input-prefix" + " " + (inputPrefixCls + "-prefix"),
			suffix = size === "default" ? "lm-input-suffix" : "lm-input-suffix" + " " + (inputPrefixCls + "-suffix"),
			withPrefix = inputPrefixCls + "-with-prefix",
			withSuffix = inputPrefixCls + "-with-suffix";
		return {base: base, suffix: suffix, prefix: prefix, withSuffix: withSuffix, withPrefix: withPrefix};
	},
	computedBtnCls: function (size) {
		var btnPrefixCls = this.computedPrefixCls(size).btn;
		var base = size === "default" ? "lm-btn" : "lm-btn" + " " + btnPrefixCls;
		return {base: base};
	},

	// 获取注册、登录渠道
	getFromId: function () {
		var fromId = Utils.getQuery().fromid || "";
		if (!fromId && Utils.isMobile) fromId = "9";
		return fromId;
	}
};


/**
 * 滑动拼图验证
 * @param {Object} options
 */
!function (win, doc, $) {
    function SlideImgAuthcode (options) {
		this.options = $.extend({}, this.constructor.default, options);
		
		// 视图层
        this.$slideImg = this.create$SlideImg(this.options);
        this.$slideBar = this.create$SlideBar(this.options);
        this.$authcode = this.create$Authcode(this.options);

        if (this.options.immediate) this.refresh();
        this.options.el && this.mount(this.options.el);
    }

    SlideImgAuthcode.default = {
		el: null,		// 挂载目标，CSS选择器 或 原生DOM元素 或 jQuery元素
		immediate: true,// 创建时是否立即获取验证图片
        imgWidth: 260,	// 图片的宽度
		imgHeight: 116,	// 图片的高度
		barBtnSize: 32,	// 滑块按钮的尺寸 (注：只为内部使用，未做实际的样式设置，对所能滑动的最大距离有影响)
		onRefresh: null,// 图片更新的回调函数，传出自定义的状态码与提示信息
        onSuccess: null,// 验证成功后的回调函数
        onFail: null	// 验证失败后的回调函数
    }

    var _proto = SlideImgAuthcode.prototype;
    $.extend(_proto, {
		mount: function (el) {
            if (!(el instanceof $)) el = $(el);
			el.eq(0).empty().append(this.$authcode);
		},
		

		/* ↓↓↓↓↓↓↓ 创建 DOM 并绑定事件 ↓↓↓↓↓↓↓ */
        create$SlideImg: function (options) {
			return $('<div class="slide-img"></div>').css({height: options.imgHeight});
        },
        create$SlideBar: function () {
            var slideBarTpl = '' +
                '<div class="slide-bar">' +
                    '<div class="slide-bar-text" onselectstart="return false">向右滑动完成拼图</div>'+
                    '<div class="slide-bar-bg" onselectstart="return false"></div>'+
                    '<div class="slide-bar-btn"><i class="i-icon i-icon-arrow-right"></i></div>'+
                '</div>';
			return $(slideBarTpl);
        },
        create$Authcode: function (options) {
            return $('<div class="slideImgAuthcode"></div>')
                    .css("width", options.imgWidth)
                    .append(this.$slideImg)
                    .append(this.$slideBar);
		},


		/* ↓↓↓↓↓↓↓ methods ↓↓↓↓↓↓↓ */
		addSlideEvent: function () {
			var _this = this;
			var $sliceImg = this.$slideImg.find(".slice");
			var $slideBar = this.$slideBar;
			var $slideBarBtn = $slideBar.find(".slide-bar-btn"),
				$slideBarBg = $slideBar.find(".slide-bar-bg");
			var slideEvent = this.slideEvent(),
				passiveListener = Support.passiveListener ? { passive: false, capture: false } : false;

			// 允许滑动的最大、最小距离
			var moveMin = 0,
				moveMax = this.options.imgWidth - this.options.barBtnSize;

			// 元素改变的距离
			var changeDistance = 0;
			
			$slideBarBtn.css("cursor", "move").on(slideEvent.start, function (e) {
				e.preventDefault();
				
				var startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX,
					moveX = 0;
				
				doc.body.style.cursor = "move";

				var dragMoveFn = function (e) {
					e.preventDefault();
					moveX = (e.type === "touchmove" ? e.touches[0].clientX : e.clientX) - startX;
					changeDistance = Math.min(Math.max(moveMin, moveX), moveMax);

					$slideBarBtn.css("left", changeDistance);
					$slideBarBg.css("width", _this.options.barBtnSize + changeDistance);
					$sliceImg.css("left", changeDistance);
				}

				doc.addEventListener(slideEvent.move, dragMoveFn, passiveListener);

				$(document).on(slideEvent.end, function (e) {
					e.preventDefault();

					doc.removeEventListener(slideEvent.move, dragMoveFn, passiveListener);
					$(this).off(slideEvent.end);
					$slideBarBtn.off(slideEvent.start);

					$.ajax("/dragcheck", {
						type: "POST",
						dataType: "json",
						data: {point: changeDistance},
						beforeSend: function () {
							doc.body.style.cursor = "default";
							$slideBarBtn.css("cursor", "default");
							$slideBarBtn.find(".i-icon").removeClass("i-icon-arrow-right").addClass("i-icon-loading");
						},
						success: function (res) {
							$slideBarBtn.css("left", moveMax);
							$slideBarBg.css("width", _this.options.imgWidth);
							$slideBarBtn.find(".i-icon").removeClass("i-icon-loading").addClass("i-icon-arrow-right");

							if (res.statusCode === 200) {
								$slideBarBg.text("验证成功");
								_this.options.onSuccess && _this.options.onSuccess();
							} else {
								$slideBarBg.addClass("slide-bar-bg-error").text("验证失败");
								win.setTimeout(_this.refresh.bind(_this), 600);
								_this.options.onFail && _this.options.onFail();
							}
						}
					});
				});
			});
		},

		// 更新授权码
        refresh: function () {
			var _this = this;
			
			// 重置滑动条
			this.$slideBar.find(".slide-bar-btn").css("left", 0);
			this.$slideBar.find(".slide-bar-bg").css("width", this.options.barBtnSize).removeClass("slide-bar-bg-error").text("");

            $.ajax("/register_1", {
                type: "POST",
                dataType: "json",
                beforeSend: function () { _this.$slideImg.append('<div class="tip"><div class="tip-inner">图片更新中</div></div>') },
                success: function (res) {
					_this.$slideImg.empty();
					if (res.statusCode === 200) {
						var data = res.data.data;
						data.data.forEach(function (item) {
							var positionX = +item[0] === 0 ? 0 : (-item[0] + "px"),
								positionY = +item[1] === 0 ? 0 : (-item[1] + "px");
							var $point = $('<div class="point"></div>');
								$point.css({background: "url(" + data.bg_pic_src + ") no-repeat " + positionX + " " + positionY});
							_this.$slideImg.append($point);
						})
	
						// 待拼接的图片
						var $slice = $('<div class="slice"></div>');
							$slice.css({
								top: data.y_point,
								left: 0,
								width: data.ico_pic.w,
								height: data.ico_pic.h,
								background: "url(" + data.ico_pic.src + ") no-repeat"
							})
						_this.$slideImg.append($slice);
						_this.addSlideEvent();
					} else {
						_this.$slideImg.append('<div class="tip"><div class="tip-inner">' + res.message + '</div></div>');
					}
					_this.options.onRefresh && _this.options.onRefresh(res.statusCode, res.message);
                }
            })
		},

		/* ↓↓↓ methods ↓↓↓ */
		slideEvent: function () {
			if (Support.touch) {
				return {
					start: "touchstart",
					move: "touchmove",
					end: "touchend"
				}
			} else {
				return {
					start: "mousedown",
					move: "mousemove",
					end: "mouseup"
				}
			}
		}
    });

    win.SlideImgAuthcode = SlideImgAuthcode;
}(window, document, jQuery);


/**
 * 账号登录表单
 * @param {Object} options
 * 	Tip：登录成功后优先判断是否重定向，其次判断是否重载当前页面，若不重载会调用 checkHeader
 */
!function (win, $) {
	function LoginForm (options) {
		this.options = $.extend({}, this.constructor.default, options);
		this.needScode = Utils.cookie.getItem("loginErr") >= 3;
		this.inputCls = lm_utils.computedInputCls(this.options.size);
		this.btnCls = lm_utils.computedBtnCls(this.options.size);
 
		// 数据层
		this.data = {
			fromid: lm_utils.getFromId(),
			username: "",
			password: "",
			remember: "1",
			scode: ""
		};
		
		// 视图层
		this.$formItem_username = this.create$FormItem_username();
		this.$formItem_password = this.create$FormItem_password();
		this.$formItem_remember = this.create$FormItem_remember();
		this.$formItem_scode = this.create$FormItem_scode();
		this.$formItem_submit = this.create$FormItem_submit();
		this.$form = this.create$Form();

		this.options.el && this.mount(this.options.el);
	}

	LoginForm.default = {
		el: null,		// 挂载目标，CSS选择器 或 原生DOM元素 或 jQuery元素
		size: "default",// 表单、按钮的大小，可选值为 "large(40px)"、"default(32px)"
		isRedirect: !1,	// 登录成功后是否重定向，优先跳 refer 页，其次跳首页
		isReload: !0,	// 登录成功后是否重载页面，前提是不设置重定向
		onSuccess: null	// 登录成功后的回调函数，一定会执行
	};

	var _proto = LoginForm.prototype;
	$.extend(_proto, {
		mount: function (el) {
            if (!(el instanceof $)) el = $(el);
            el.eq(0).empty().append(this.$form);
		},
		

		/* ↓↓↓↓↓↓↓ 创建 DOM 并绑定事件 ↓↓↓↓↓↓↓ */
		create$FormItem_username: function () {
			var _this = this;
			var usernameTpl = '' +
				'<div class="lm-form-item">' +
					'<div class="lm-input-wrapper">' +
						'<input type="text" placeholder="学号/手机号/邮箱" class="' + this.inputCls.base + ' ' + this.inputCls.withPrefix + '">' +
						'<span class="' + this.inputCls.prefix + '"><i class="i-icon i-icon-user"></i></span>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_username = $(usernameTpl);
				$formItem_username.find("input")
					.on("input", function () { _this.data.username = $(this).val(); })
					.on("blur", this.validateUser.bind(this))
					.on("keypress", function (e) { if (e.keyCode === 13 && _this.validate()) _this.loginRequest() });
			return $formItem_username;
		},
		create$FormItem_password: function () {
			var _this = this;
			var passwordTpl = '' +
				'<div class="lm-form-item">' +
					'<div class="lm-input-wrapper">' +
						'<input type="password" placeholder="登录密码" class="' + this.inputCls.base + ' ' + this.inputCls.withPrefix + ' ' + this.inputCls.withSuffix + '">' +
						'<span class="' + this.inputCls.prefix + '"><i class="i-icon i-icon-lock-outline"></i></span>' +
						'<span class="' + this.inputCls.suffix + '"><i class="i-icon i-icon-eye-close hover-icon"></i></span>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_password = $(passwordTpl);
			var $input = $formItem_password.find("input");
			
			$formItem_password.find(".i-icon-eye-close").on("click", function () {
				if ($(this).hasClass("i-icon-eye-close")) {
					$(this).removeClass("i-icon-eye-close").addClass("i-icon-eye");
					$input.prop("type", "text");
				} else {
					$(this).removeClass("i-icon-eye").addClass("i-icon-eye-close");
					$input.prop("type", "password");
				}
			})
			$input
				.on("input", function () { _this.data.password = $(this).val(); })
				.on("blur", this.validatePwd.bind(this))
				.on("keypress", function (e) { if (e.keyCode === 13 && _this.validate()) _this.loginRequest() });

			return $formItem_password;
		},
		create$FormItem_remember: function () {
			var rememberTpl = '' +
				'<div class="clearfix lm-form-item">' +
					'<label class="lm-checkbox-wrapper">' +
						'<span class="lm-checkbox">' +
							'<input type="checkbox" checked class="lm-checkbox-input">' +
							'<span class="lm-checkbox-inner"></span>' +
						'</span>' +
						'<span class="lm-checkbox-word">7天内自动登录</span>' +
					'</label>' +
					'<a class="fr findpwd" href="/checkmphone?type=findpwd" target="_blank">找回密码</a>' +
				'</div>';
			var $formItem_remember = $(rememberTpl);
				$formItem_remember.find("input").on("change", function (e) { this.data.remember = e.target.checked ? "1" : "0"; }.bind(this));
			return $formItem_remember;
		},
		create$FormItem_scode: function () {
			var _this = this;
			var scodeImgCls = this.options.size === "default" ? "scode-img" : "scode-img scode-img-" + this.options.size;
			var scodeTpl = '' +
				'<div class="lm-form-item scode">' +
					'<div class="lm-input-wrapper">' +
						'<input type="text" placeholder="请输入验证码" maxlength="4" autocomplete="off" class="' + this.inputCls.base + ' ' + this.inputCls.withSuffix + '">' +
						'<span class="' + this.inputCls.suffix + '"><i class="i-icon i-icon-refresh hover-icon" title="更新验证码"></i></span>' +
						'<div class="' + scodeImgCls + '"><img src="/scode" alt="更新验证码" title="点击更新验证码" height="100%"></div>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_scode = $(scodeTpl);
				$formItem_scode.find(".i-icon-refresh").on("click", this.updateScodeImg.bind(this));
				$formItem_scode.find(".scode-img").on("click", this.updateScodeImg.bind(this));
				$formItem_scode.find("input")
					.on("input", function () { _this.data.scode = $(this).val(); })
					.on("blur", this.validateScode.bind(this))
					.on("keypress", function (e) { if (e.keyCode === 13 && _this.validate()) _this.loginRequest() });
			this.needScode ? $formItem_scode.show() : $formItem_scode.hide();
			return $formItem_scode;
		},
		create$FormItem_submit: function () {
			var submitTpl = '' +
				'<div class="lm-form-item">' +
					'<button type="submit" class="' + this.btnCls.base + ' lm-btn-block lm-btn-primary">登录</button>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_submit = $(submitTpl);
				$formItem_submit.find("button").on("click", function (e) {
					e.preventDefault();
					if (this.validate()) this.loginRequest();
				}.bind(this));
			return $formItem_submit;
		},
		create$Form: function () {
			return $('<form class="lm-form login-form"></form')
					.append(this.$formItem_username)
					.append(this.$formItem_password)
					.append(this.$formItem_scode)
					.append(this.$formItem_remember)
					.append(this.$formItem_submit);
		},


		/* ↓↓↓↓↓↓↓ 表单校验与重置 ↓↓↓↓↓↓↓ */
		validateUser: function () {
			if (this.data.username) {
				this.removeError(this.$formItem_username);
				return true;
			} else {
				this.setError(this.$formItem_username, "请输入正确的学号 / 手机号 / 邮箱");
				return false;
			}
		},
		validatePwd: function () {
			if (!this.data.password) {
				this.setError(this.$formItem_password, "请输入密码后再登录");
				return false;
			}
			this.removeError(this.$formItem_password);
			return true;
		},
		validateScode: function () {
			if (this.needScode && this.data.scode.length !== 4) {
				this.setError(this.$formItem_scode, "请输入右侧图片显示的 4 位数验证码");
				return false;
			} else {
				this.removeError(this.$formItem_scode);
				return true;
			}
		},
		validate: function () {
			return new Array(this.validateUser(), this.validatePwd(), this.validateScode()).every(function (value) { return value; })
		},

		// 重置表单
		resetFields: function () {
			// 清除错误状态
			this.removeError(this.$form.find(".lm-form-item-error"));

			// 清除视图层
			this.$form.find("input[type=text]").val("");
			this.$form.find("input[type=password]").val("");
			this.$form.find("input[type=checkbox]").prop("checked", true);

			// 清除数据层
			for (var key in this.data) {
				if (key === "remember") {
					this.data[key] = "1";
				} else {
					this.data[key] = "";
				}
			}

			// 恢复密码框
			var $formItem_password_eyeIcon = this.$formItem_password.find(".i-icon");
			if ($formItem_password_eyeIcon.hasClass("i-icon-eye")) $formItem_password_eyeIcon.trigger("click");
		},


		/* ↓↓↓↓↓↓↓ methods ↓↓↓↓↓↓↓ */
		// 更新验证码
		updateScodeImg: function () {
			this.$formItem_scode.find(".scode-img > img").attr("src", "/scode?" + new Date().getTime());
			this.$formItem_scode.find("input").val("");
			this.data.scode = "";
		},

		// 登录请求
		loginRequest: function () {
			var _this = this;
			$.ajax("/checklogin_1", {
				type: "POST",
				dataType: "json",
				data: this.data,
				beforeSend: function () { _this.removeError(_this.$form.find(".lm-form-item-error")) },
				success: function (res) {
					if (res.statusCode === 200) {	// 登录成功
						_this.options.onSuccess && _this.options.onSuccess();
						if (_this.options.isRedirect) {
							win.location.href = _this.getRefer();
						} else if (_this.options.isReload) {
							win.location.reload();
						} else {
							_this.resetFields();
							win.checkHeader && win.checkHeader();
						}
					} else {
						switch (res.statusCode) {
							case 301:	// 用户不存在 或 密码错误 或 账号被禁
								_this.setError(_this.$formItem_submit, res.message);
								if (res.data >= 3) {
									_this.needScode = true;
									_this.$formItem_scode.show();
								}
								break;
							case 302:	// 验证码错误
								_this.setError(_this.$formItem_scode, res.message);
								break;
							case 303:	// 已登录
								if (win.location.pathname === '/login') {
									win.location.href = _this.getRefer();
								} else {
									win.location.reload();
									// _this.setError(_this.$formItem_submit, "您已登录，请刷新页面");
								}
								break;
							default:	// 其它错误
								_this.setError(_this.$formItem_submit, res.message);
						}
						_this.updateScodeImg();
					}
				}
			});
		},

		// 获取重定向页面
		getRefer: function () {
			return Utils.getQuery()["refer"] || "/";
		},

		// 表单错误状态的显示 / 移除
		setError: function (jqEl, message) {
			jqEl.addClass("lm-form-item-error").find(".lm-form-item-error-tip").text(message);
		},
		removeError: function (jqEl) {
			jqEl.removeClass("lm-form-item-error").find(".lm-form-item-error-tip").text("");
		}
	});

	win.LoginForm = LoginForm;
}(window, jQuery);


/**
 * 手机短信登录
 * @param {Object} options
 * Tip：登录成功后优先判断是否重定向，其次判断是否重载当前页面，若不重载会调用 checkHeader
 */
!function (win, $) {
	function SmsLoginForm (options) {
		this.options = $.extend({}, this.constructor.default, options);
		this.sendMCodeTimer = null;
		this.inputCls = lm_utils.computedInputCls(this.options.size);
		this.btnCls = lm_utils.computedBtnCls(this.options.size);

		// 数据层
		this.data = {
			fromid: lm_utils.getFromId(),
			mphone: "",
			mcode: "",
			remember: "1"
		};

		// 视图层
		this.$formItem_mphone = this.create$FormItem_mphone();
		this.$formItem_mcode = this.create$FormItem_mcode();
		this.$formItem_remember = this.create$FormItem_remember();
		this.$formItem_submit = this.create$FormItem_submit();
		this.$form = this.create$Form();

		if (this.options.el) this.mount(this.options.el);
	}

	SmsLoginForm.default = {
		el: null,		// 挂载目标，CSS选择器 或 原生DOM元素 或 jQuery元素
		size: "default",// 表单、按钮的大小，可选值为 "large(40px)"、"default(32px)" 或者不设置
		isRedirect: !1,	// 登录成功后是否重定向，优先跳 refer 页，其次跳首页
		isReload: !0,	// 登录成功后是否重载页面，前提是不设置重定向
		onSuccess: null	// 登录成功后的回调函数，一定会执行
	}

	var _proto = SmsLoginForm.prototype;
	$.extend(_proto, {
		mount: function (el) {
			if (!(el instanceof $)) el = $(el);
			el.eq(0).empty().append(this.$form);
		},


		/* ↓↓↓↓↓↓↓ 创建 DOM 并绑定事件 ↓↓↓↓↓↓↓ */
		create$FormItem_mphone: function () {
			var _this = this;
			var mphoneTpl = '' +
				'<div class="lm-form-item">' +
					'<div class="lm-input-wrapper">' +
						'<input type="text" placeholder="请输入手机号码" class="' + this.inputCls.base + ' ' + this.inputCls.withPrefix + '">' +
						'<span class="' + this.inputCls.prefix + '"><i class="i-icon i-icon-mobile"></i></span>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_mphone = $(mphoneTpl);
				$formItem_mphone.find("input")
					.on("input", function () { _this.data.mphone = $(this).val() })
					.on("blur", this.validateMphone.bind(this))
					.on("keypress", function (e) { if (e.keyCode === 13 && _this.validate()) _this.loginRequest() });
			return $formItem_mphone;
		},
		create$FormItem_mcode: function () {
			var _this = this;
			var mcodeTpl = '' +
				'<div class="lm-form-item mcode">' +
					'<div class="lm-input-wrapper">' +
						'<input type="text" maxlength="4" autocomplete="off" placeholder="请输入短信验证码" class="' + this.inputCls.base + '">' +
						'<button type="button" class="' + this.btnCls.base + ' lm-btn-text">获取验证码</button>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_mcode = $(mcodeTpl);
				$formItem_mcode.find("input")
					.on("input", function () { _this.data.mcode = $(this).val() })
					.on("blur", this.validateMcode.bind(this))
					.on("keypress", function (e) { if (e.keyCode === 13 && _this.validate()) _this.loginRequest() });
				$formItem_mcode.find("button").on("click", function () { if (_this.validateMphone()) _this.sendMcodeRequest() });
			return $formItem_mcode;
		},
		create$FormItem_remember: function () {
			var rememberTpl = '' +
				'<div class="lm-form-item">' +
					'<label class="lm-checkbox-wrapper">' +
						'<span class="lm-checkbox">' +
							'<input type="checkbox" checked class="lm-checkbox-input">' +
							'<span class="lm-checkbox-inner"></span>' +
						'</span>' +
						'<span class="lm-checkbox-word">7天内自动登录</span>' +
					'</label>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_remember = $(rememberTpl); 
				$formItem_remember.find("input").on("change", function (e) { this.data.remember = e.target.checked ? "1" : "0"; }.bind(this));
			return $formItem_remember;
		},
		create$FormItem_submit: function () {
			var submitTpl = '' +
				'<div class="lm-form-item">' +
					'<button type="submit" class="' + this.btnCls.base + ' lm-btn-block lm-btn-primary">登录</button>'
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_submit = $(submitTpl);
				$formItem_submit.find("button").on("click", function (e) {
					e.preventDefault();
					if (this.validate()) this.loginRequest();
				}.bind(this));
			return $formItem_submit;
		},
		create$Form: function () {
			return $('<div class="lm-form smsLogin-form"></div>')
					.append(this.$formItem_mphone)
					.append(this.$formItem_mcode)
					.append(this.$formItem_remember)
					.append(this.$formItem_submit);
		},
		

		/* ↓↓↓↓↓↓↓ 表单校验与重置 ↓↓↓↓↓↓↓ */
		validateMphone: function () {
			if (!this.data.mphone) {
				this.setError(this.$formItem_mphone, "请输入你的手机号码");
                return false;
            } 
            if (!/^1\d{10}$/.test(this.data.mphone)) {
				this.setError(this.$formItem_mphone, "手机号码格式不正确，请重新输入");
                return false;
			}
			
			this.removeError(this.$formItem_mphone);
			return true;
		},
		validateMcode: function () {
			if (this.data.mcode && /^\d{4}$/.test(this.data.mcode)) {
				this.removeError(this.$formItem_mcode);
				return true;
			} else {
				this.setError(this.$formItem_mcode, "请输入正确的验证码");
				return false;
			}
		},
		validate: function () {
			return new Array(this.validateMphone(), this.validateMcode()).every(function (value) { return value });
		},

		// 重置表单
		resetFields: function () {
			// 重置视图层
			this.$form.find("input[type=text]").val("");
			this.$form.find("input[type=password]").val("");
			this.$form.find("input[type=checkbox]").prop("checked", true);

			this.removeError(this.$form.find(".lm-form-item-error"));
			this.sendMcodeCountdown(0);

			// 重置数据层
			for (var key in this.data) {
				if (key === "remember") {
					this.data[key] = "1";
				} else {
					this.data[key] = "";
				}
			}
		},


		/* ↓↓↓↓↓↓↓ methods ↓↓↓↓↓↓↓ */
		// 短信验证码请求 与 倒计时
		sendMcodeRequest: function () {
			var _this = this;
			$.ajax("/sendPhoneLogin", {
				type: "POST",
				data: {mphone: this.data.mphone},
				dataType: "json",
				beforeSend: function () {
					_this.$formItem_mcode.find("button").off("click");	// 解除事件，防止多次触发

					// 清除验证码数据与错误信息
					_this.data.mcode = "";
					_this.$formItem_mcode.find("input").val("");
					_this.removeError(_this.$formItem_mcode);
				},
				success: function (res) {
					switch (res.statusCode) {
						case 200:	// 发送成功
							_this.sendMcodeCountdown(60);
							break;
						case 300:	// 手机号不正确 / 未注册 / 短信达上限
							_this.setError(_this.$formItem_mphone, res.message);
							break;
						default:	// 其它错误，主要是 303
							_this.setError(_this.$formItem_mphone, res.message);
					}

					// 事件重新绑定
					_this.$formItem_mcode.find("button").on("click", function () { if (_this.validateMphone()) _this.sendMcodeRequest() });
				}
			})
		},
		sendMcodeCountdown: function (second) {
			var _this = this;
			var $sendMcodeBtn = _this.$formItem_mcode.find("button");

			win.clearTimeout(this.sendMCodeTimer);
			if (second > 0) {
				$sendMcodeBtn.text("重新获取 (" + second + "s)").prop("disabled", true);
				this.sendMCodeTimer = win.setInterval(function () {
					if (--second <= 0) {
						win.clearInterval(_this.sendMCodeTimer);
						$sendMcodeBtn.text("重新获取").prop("disabled", false);
					} else {
						$sendMcodeBtn.text("重新获取 (" + second + "s)");
					}
				}, 1000)
			} else {
				$sendMcodeBtn.text("获取验证码").prop("disabled", false);
			}
		},

		// 登录请求
		loginRequest: function () {
			var _this = this;
			$.ajax("/smsLogin", {
				type: "POST",
				data: this.data,
				dataType: "json",
				beforeSend: function () { _this.removeError(_this.$form.find(".lm-form-item-error")) },
				success: function (res) {
					switch (res.statusCode) {
						case 200:
							_this.options.onSuccess && _this.options.onSuccess();

							if (_this.options.isRedirect) {
								win.location.href = _this.getRefer();
							} else if (_this.options.isReload) {
								win.location.reload();
							} else {
								_this.resetFields();
								win.checkHeader && win.checkHeader();
							}
							break;
						case 301:	// 手机号不正确
							_this.setError(_this.$formItem_mphone, res.message);
							break;
						case 302:	// 验证码错误
							_this.setError(_this.$formItem_mcode, "验证码错误，请重新输入");
							break;
						case 303:	// 用户不存在 或 被封
							_this.setError(_this.$formItem_mphone, res.message);
							break;
						default:
							_this.setError(_this.$formItem_submit, res.message);
					}
				}
			})
		},

		// 获取重定向页面
		getRefer: function () {
			return Utils.getQuery()["refer"] || "/";
		},

		// 表单错误状态的设置与移除
		setError: function (jqEl, message) {
			jqEl.addClass("lm-form-item-error").find(".lm-form-item-error-tip").text(message);
		},
		removeError: function (jqEl) {
			jqEl.removeClass("lm-form-item-error").find(".lm-form-item-error-tip").text("");
		}
	})

	win.SmsLoginForm = SmsLoginForm;
}(window, jQuery);


/**
 * 注册表单
 * @param {Object} options
 * Tip：注册成功后优先判断是否重定向，其次判断是否重载当前页面，若不重载会调用 checkHeader
 */
!function (win, $) {
	function RegistForm (options) {
		this.options = $.extend({}, this.constructor.default, options);
		this.sendMcodeTimer = null;
		this.inputCls = lm_utils.computedInputCls(this.options.size);
		this.btnCls = lm_utils.computedBtnCls(this.options.size);

		// 数据层：表单所需提交的数据
		this.data = {
			fromid: lm_utils.getFromId(),
			mphone: "",
			mcode: "",
			password: "",
		};
		// 数据层：表单无需提交的数据，前端验证
		this.frontData = {
			agree: !0
		};

		// 视图层：注册步骤一
		this.$formItem_mphone = this.create$FormItem_mphone();
		this.$formItem_agree = this.create$FormItem_agree();
		this.$formItem_auth = this.create$FormItem_auth();
		this.$stepFirst = this.create$StepFirst();
		// 视图层：注册步骤二
		this.$formItem_stepSecondTip = this.create$FormItem_stepSecondTip();
		this.$formItem_mcode = this.create$FormItem_mcode();
		this.$formItem_password = this.create$FormItem_password();
		this.$formItem_submit = this.create$FormItem_submit();
		this.$formItem_backFirst = this.create$FormItem_backFirst();
		this.$stepSecond = this.create$StepSecond();
		// 视图层：总表单
		this.$form = this.create$Form();

		this.options.el && this.mount(this.options.el);
	}

	RegistForm.default = {
		el: null,		// 挂载目标，CSS选择器 或 原生DOM元素 或 jQuery元素
		isRedirect: !1,	// 注册成功后是否重定向，优先跳 refer 页，其次跳首页
		isReload: !0,	// 注册成功后是否重载页面，前提是不设置重定向		
		toLogin: null,	// 跳往登录的函数
		onSuccess: null	// 注册成功后的回调函数，一定会执行
	}

	var _proto = RegistForm.prototype;
	$.extend(_proto, {
		mount: function (el) {
            if (!(el instanceof $)) el = $(el);
            el.eq(0).empty().append(this.$form);
        },


		/* ↓↓↓↓↓↓↓ 创建 DOM 并绑定事件 ↓↓↓↓↓↓↓ */
		// 注册步骤一
		create$FormItem_mphone: function () {
			var _this = this;
			var mphoneTpl = '' +
				'<div class="lm-form-item">' +
					'<div class="lm-input-wrapper">' +
						'<input type="text" placeholder="请输入注册手机号" class="' + this.inputCls.base + ' ' + this.inputCls.withPrefix + '">' +
						'<span class="' + this.inputCls.prefix + '"><i class="i-icon i-icon-mobile"></i></span>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_mphone = $(mphoneTpl);
				$formItem_mphone.find("input")
					.on("input", function () { _this.data.mphone = $(this).val(); })
					.on("blur", this.validateMphone.bind(this));
			return $formItem_mphone;
		},
		create$FormItem_auth: function () {
			var _this = this;
			var authTpl = '' +
				'<div class="lm-form-item auth">' +
                    '<button type="button" class="' + this.btnCls.base + ' lm-btn-block lm-btn-primary" onselectstart="return false">点击按钮进行验证</button>' +
					'<div class="popup">' +
						'<div class="popup-close"><i class="i-icon i-icon-close"></i></div>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_auth = $(authTpl);
			var $popup = $formItem_auth.find(".popup");
			var slideImgAuthcode = new win.SlideImgAuthcode({
				immediate: false,
				onRefresh: function (statusCode, message) {
					if (statusCode === 200) {
						$popup.show();
					} else {
						_this.setError(_this.$formItem_mphone, message)
					};
				},
				onSuccess: function () {
					// 同时执行两个异步，且异步都完成时再跳到注册的步骤二
					var closePopupAsync = false,
						sendMcodeAsync = false;
					var mcodeRes = null;

					// 处理短信验证码请求的响应
					var dealRes = function () {
						switch (mcodeRes.statusCode) {
							case 200:	// 短信发送成功
								_this.$formItem_stepSecondTip.find(".tel").text(_this.data.mphone);
								_this.toStepSecond();
								_this.sendMcodeCountdown(60);
								break;
							case 301:	// 拼图验证错误或已失效
								_this.setError(_this.$formItem_auth, mcodeRes.message);
								break;
							case 302:	// 短信达到上限
							case 303:	// 短信发送频率受限
							case 310:	// 手机号格式不正确
								_this.setError(_this.$formItem_mphone, mcodeRes.message);
								break;
							case 320:	// 手机号已注册
								_this.setError(_this.$formItem_mphone, mcodeRes.message);
								_this.options.toLogin && _this.$formItem_mphone.find(".lm-form-item-error-tip").css("cursor", "pointer").one("click", function () {
									_this.options.toLogin();
									$(this).css("cursor", "default");
								});
								break;
							default:	// 其它：主要是 304 返回的
								_this.setError(_this.$formItem_auth, mcodeRes.message);
								break;
						}
					};

					// 两个异步
					win.setTimeout(function () {
						closePopupAsync = true;
						if (closePopupAsync && sendMcodeAsync) {
							$popup.hide();
							dealRes();
						};
					}, 400);
					$.ajax("/sendPhoneCode", {
						type: "POST",
						dataType: "json",
						data: { mphone: _this.data.mphone },
						beforeSend: function () { _this.removeError(_this.$stepFirst.find(".lm-form-item-error")) },
						success: function (res) {
							sendMcodeAsync = true;
							mcodeRes = res;
							if (closePopupAsync && sendMcodeAsync) {
								$popup.hide();
								dealRes();
							}
						}
					});
				}
			});
			$popup.append(slideImgAuthcode.$authcode);
			$popup.find(".popup-close").on("click", function () { $popup.hide() });
			$formItem_auth.find("button").on("click", function () { if (_this.isAllowAuthcode()) slideImgAuthcode.refresh() });

            return $formItem_auth;
		},
		create$FormItem_agree: function () {
			var agreeTpl = '' +
				'<div class="lm-form-item">' +
					'<label class="lm-checkbox-wrapper">' +
						'<span class="lm-checkbox">' +
							'<input type="checkbox" checked class="lm-checkbox-input">' +
							'<span class="lm-checkbox-inner"></span>' +
						'</span>' +
						'<span class="lm-checkbox-word">我已阅读并同意<a class="regist-agreement" href="/webagreement" target="_blank">《用户注册协议》</a></span>' +
					'</label>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_agree = $(agreeTpl);
				$formItem_agree.find("input").on("change", function (e) { this.frontData.agree = e.target.checked }.bind(this));
			return $formItem_agree;
		},
		create$StepFirst: function () {
			return $("<div></div>")
					.append(this.$formItem_mphone)
					.append(this.$formItem_auth)
					.append(this.$formItem_agree);
		},

		// 注册步骤二
		create$FormItem_mcode: function () {
			var _this = this;
			var mcodeTpl = '' +
				'<div class="lm-form-item mcode">' +
					'<div class="lm-input-wrapper">' +
						'<input type="text" placeholder="请输入短信验证码" maxlength="4" autocomplete="off" class="' + this.inputCls.base + '">' +
						'<button type="button" class="' + this.btnCls.base + ' lm-btn-text">获取验证码</button>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_mcode = $(mcodeTpl);
				$formItem_mcode.find("input")
					.on("input", function () { _this.data.mcode = $(this).val() })
					.on("blur", this.validateMcode.bind(this));
			return $formItem_mcode;
		},
		create$FormItem_password: function () {
			var _this = this;
			var passwordTpl = '' +
				'<div class="lm-form-item">' +
					'<div class="lm-input-wrapper">' +
						'<input type="password" placeholder="设置密码，下次可使用此密码登录" autocomplete="off" class="' + this.inputCls.base + ' ' + this.inputCls.withPrefix + ' ' + this.inputCls.withSuffix + '">' +
						'<span class="' + this.inputCls.prefix + '"><i class="i-icon i-icon-lock-outline"></i></span>' +
						'<span class="' + this.inputCls.suffix + '"><i class="i-icon i-icon-eye-close hover-icon"></i></span>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_password = $(passwordTpl);
			var $input = $formItem_password.find("input");

			$formItem_password.find(".i-icon-eye-close").on("click", function () {
				if ($(this).hasClass("i-icon-eye-close")) {
					$(this).removeClass("i-icon-eye-close").addClass("i-icon-eye");
					$input.prop("type", "text");
				} else {
					$(this).removeClass("i-icon-eye").addClass("i-icon-eye-close");
					$input.prop("type", "password");
				}
			})

			$input
				.on("input", function () { _this.data.password = $(this).val(); })
				.on("blur", this.validatePwd.bind(this));

			return $formItem_password;
		},
		create$FormItem_submit: function () {
			var _this = this;
			var submitTpl = '' +
				'<div class="lm-form-item">' +
					'<button type="submit" class="' + this.btnCls.base + ' lm-btn-block lm-btn-primary">注册</button>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_submit = $(submitTpl);
				$formItem_submit.find("button").on("click", function (e) {
					e.preventDefault();
					if (!_this.validate()) return;

					_this.checkMcodeRequest(function (res) {
						if (res.statusCode === 200) {
							_this.registRequest();
						} else {
							_this.setError(_this.$formItem_mcode, res.message);
						}
					})
				});
			return $formItem_submit;
		},
		create$FormItem_stepSecondTip: function () {
			var stepSecondTipTpl = '' +
				'<div class="text-center lm-form-item">' +
					'<div>填写短信验证码、密码完成注册</div>' +
					'<div>短信验证码已发送至&nbsp;+86&nbsp;<span class="tel"></span></div>' +
				'</div>';
			return $(stepSecondTipTpl);
		},
		create$FormItem_backFirst: function () {
			var _this = this;
			var backFirstTpl = '' +
				'<div class="text-center lm-form-item">' +
					'<button type="button" class="lm-btn lm-btn-text">返回修改手机号</button>' +
				'</div>';
			var $formItem_backFirst = $(backFirstTpl);
				$formItem_backFirst.find("button").on("click", function () {
					_this.toStepFirst();
					_this.sendMcodeCountdown(0);
				});
			return $formItem_backFirst;
		},
		create$StepSecond: function () {
			return $("<div></div>")
					.append(this.$formItem_stepSecondTip)
					.append(this.$formItem_mcode)
					.append(this.$formItem_password)
					.append(this.$formItem_submit)
					.append(this.$formItem_backFirst)
					.hide();
		},

		// 总表单
		create$Form: function () {
			return $('<form class="lm-form regist-form" autocomplete="off"></form>')
					.append('<input type="text" style="display: none;">')		// 防止注册表单被自动填充前两个 input，特别是 chrome 浏览器
					.append('<input type="password" style="display: none;">')
					.append(this.$stepFirst)
					.append(this.$stepSecond);
		},


		/* ↓↓↓↓↓↓↓ 表单校验与重置 ↓↓↓↓↓↓↓ */
		validateMphone: function () {
			if (!this.data.mphone) {
				this.setError(this.$formItem_mphone, "请输入注册手机号");
                return false;
            } 
            if (!/^1\d{10}$/.test(this.data.mphone)) {
				this.setError(this.$formItem_mphone, "手机格式不正确，请重新输入");
                return false;
			}
			
			this.removeError(this.$formItem_mphone);
			return true;
		},
		validateAgree: function () {
			if (this.frontData.agree) {
				this.removeError(this.$formItem_agree);
				return true;
			} else {
				this.setError(this.$formItem_agree, "请先阅读用户注册协议并勾选同意");
				return false
			}
		},
		isAllowAuthcode: function () {
			return new Array(this.validateMphone(), this.validateAgree()).every(function (value) { return value; })
		},

		validateMcode: function () {
			if (this.data.mcode && /^\d{4}$/.test(this.data.mcode)) {
				this.removeError(this.$formItem_mcode);
				return true;
			} else {
				this.setError(this.$formItem_mcode, "请输入 " + this.data.mphone + " 收到的短信验证码");
				return false;
			}
		},
		validatePwd: function () {
			if (this.data.password && /^[^\u4e00-\u9fa5]{6,20}$/.test(this.data.password)) {
				this.removeError(this.$formItem_password);
				return true;
			} else {
				this.setError(this.$formItem_password, "请设置一个 6 - 20 位数的密码");
				return false;
			}
		},
		validate: function () {
			return new Array(this.validateMphone(), this.validateMcode(), this.validatePwd()).every(function (value) { return value; });
		},

		// 重置表单
		resetFirstFields: function () {
			// 重置视图层
			this.$stepFirst.find("input[type=text]").val("");
			this.$stepFirst.find("input[type=checkbox]").prop("checked", true);

			this.removeError(this.$stepFirst.find(".lm-form-item-error"));

			// 重置数据层
			this.data.mphone = "";
			this.frontData.agree = true;
		},
		resetSecondFields: function () {
			// 重置视图层
			this.$formItem_stepSecondTip.find(".tel").text(this.data.mphone);
			this.$stepSecond.find("input").val("");

			this.removeError(this.$stepSecond.find(".lm-form-item-error"));

			// 重置数据层
			this.data.mcode = "";
			this.data.password = "";

			// 重置验证码定时器
			this.sendMcodeCountdown(0);

			// 重置为密码框
			var $formItem_password_eyeIcon = this.$formItem_password.find(".i-icon");
			if ($formItem_password_eyeIcon.hasClass("i-icon-eye")) $formItem_password_eyeIcon.trigger("click");
		},
		resetFields: function () {
			this.resetFirstFields();
			this.resetSecondFields();
		},


		/* ↓↓↓↓↓↓↓ methods ↓↓↓↓↓↓↓ */
		// 短信验证码请求 与 倒计时
		sendMcodeRequest: function () {
			var _this = this;
			$.ajax("/sendPhoneCode", {
				type: "POST",
				dataType: "json",
				data: { mphone: this.data.mphone },
				beforeSend: function () {
					// 清除验证码数据与错误信息
					_this.data.mcode = "";
					_this.$formItem_mcode.find("input").val("");
					_this.removeError(_this.$formItem_mcode);
				},
				success: function (res) {
					switch (res.statusCode) {
						case 200:	// 发送成功
							_this.$formItem_stepSecondTip.find(".tel").text(_this.data.mphone);
							_this.sendMcodeCountdown(60);
							break;
						case 301:	// 拼图验证错误或已失效
							_this.setError(_this.$formItem_submit, "授权验证已失效，请返回修改手机号重新验证或刷新页面重试");
							break;
						case 302:	// 短信上限
						case 303:	// 短信发送频率受限
							_this.setError(_this.$formItem_mcode, res.message);
							break;
						default:
							_this.setError(_this.$formItem_submit, res.message);
							break;
					}
				}
			})
		},
		sendMcodeCountdown: function (second) {
			var _this = this;
			var $sendMcodeBtn = _this.$formItem_mcode.find("button");

			win.clearTimeout(this.sendMcodeTimer);
			if (second > 0) {
				$sendMcodeBtn.text("重新获取 (" + second + "s)").prop("disabled", true);
				this.sendMcodeTimer = win.setInterval(function () {
					if (--second <= 0) {
						win.clearInterval(_this.sendMcodeTimer);
						$sendMcodeBtn.text("重新获取").prop("disabled", false).one("click", _this.sendMcodeRequest.bind(_this));
					} else {
						$sendMcodeBtn.text("重新获取 (" + second + "s)");
					}
				}, 1000)
			} else {
				$sendMcodeBtn.text("获取验证码").prop("disabled", false);
			}
		},

		// 校验验证码请求
		checkMcodeRequest: function (success) {
			$.ajax("/checkPhoneCode", {
				type: "POST",
				data: {mcode: this.data.mcode},
				dataType: "json",
				success: success
			})
		},

		// 注册请求
		registRequest: function () {
			var _this = this;
			$.ajax("/submitReg_1", {
				type: "POST",
				dataType: "json",
				data: _this.data,
				beforeSend: function () { _this.removeError(_this.$stepSecond.find(".lm-form-item-error")) },
				success: function (res) {
					switch (res.statusCode) {
						case 200:
							_this.options.onSuccess && _this.options.onSuccess();
							
							if (_this.options.isRedirect) {
								win.location.href = _this.getRefer();
							} else if (_this.options.isReload) {
								win.location.reload();
							} else {
								_this.resetFields();
								win.checkHeader && win.checkHeader();
							}
							break;
						case 302:	// 滑动拼图的验证失效
							_this.setError(_this.$formItem_submit, "验证错误或已失效，请返回修改手机号重试");
							break;
						case 304:	// 验证码错误
							_this.setError(_this.$formItem_mcode, "验证码错误");
							break;
						default:
							_this.setError(_this.$formItem_submit, res.message);
							break;
					}
				}
			})
		},

		// 步骤跳转
		toStepFirst: function () {
			this.resetFirstFields();
			this.$stepFirst.show();
			this.$stepSecond.hide();
		},
		toStepSecond: function () {
			this.resetSecondFields();
			this.$stepFirst.hide();
			this.$stepSecond.show();
		},

		// 获取重定向页面
		getRefer: function () {
			return Utils.getQuery()["refer"] || "/";
		},

		// 表单错误状态的显示 / 移除
		setError: function (jqEl, message) {
			jqEl.addClass("lm-form-item-error").find(".lm-form-item-error-tip").text(message);
		},
		removeError: function (jqEl) {
			jqEl.removeClass("lm-form-item-error").find(".lm-form-item-error-tip").text("");
		}
    })
    
	win.RegistForm = RegistForm;
}(window, jQuery);


/**
 * 微信授权登录、注册
 */
!function (win, $) {
	function WxAuth (options) {
		this.options = $.extend({}, this.constructor.default, options);
		this.isWechat = Utils.isWechat();
		this.inputCls = lm_utils.computedInputCls(this.options.size);
		this.btnCls = lm_utils.computedBtnCls(this.options.size);

		this.$wxAuthcode = this.create$WxAuthcode();
		this.$sweepCode = null;

		this.$formItem_mphone = null;
		this.$formItem_mcode = null;
		this.$formItem_submit = null;
		this.$bindForm = null;

		// 绑定表单的提交数据
		this.data = {
			mphone: "",
			mcode: "",
			sign: ""
		}
	}

	WxAuth.default = {
		isRedirect: !1,	// 注册登录成功后是否重定向，优先跳 refer，其次跳首页
		scene: ''		// 场景 : 自定义的场景标识
	};

	var _proto = WxAuth.prototype;
	$.extend(_proto, {
		// 获取微信授权
		getAuth: function (success) {
			if (this.isWechat) {
				success && success({type: "link", href: "/wechatLogin?refer=" + this.getRefer()});
			} else {
				this.data.sign = win.sessionStorage.getItem("scanpullcode");
				if (this.data.sign === null) {
					this.data.sign = Math.floor((Math.random() * 4294967295) + 1);
					win.sessionStorage.setItem("scanpullcode", this.data.sign);
				}
				$.ajax("/auth?platform=weixin&channel=" + this.options.scene, {
					type: "POST",
					dataType: "json",
					data: {
						sign: this.data.sign,
						refer: this.getRefer()
					},
					success: function (res) {
						if (res.statusCode === 200) {
							this.showSweepCode(res.data);
							this.scanpullTimer = win.setInterval(function () {
								this.scanpullRequest();
							}.bind(this), 3000);
							success && success({type: "qrcode", $wxAuthcode: this.$wxAuthcode});
						} else {
							//alert(res.message);	// 本地无法获取
						}
					}.bind(this)
				})
			}
		},


		/* ↓↓↓↓↓↓↓ 微信扫码流程的 DOM ↓↓↓↓↓↓↓ */
		create$WxAuthcode: function () {
			return $('<div class="lm-wxAuthcode"></div>');
		},

		// 二维码扫描
		create$sweepCode: function () {
			var sweepCodeTpl = '' +
				'<div class="lm-wxAuthcode">' +
					'<div class="qrcode"><img alt="微信二维码" width="100%"></img></div>' +
					'<p class="sweep-info"><i class="i-icon i-icon-wechat-circle"></i>微信扫码关注公众号注册登录</p>' +
				'</div>';
			return $(sweepCodeTpl);
		},
		showSweepCode: function (ticket) {
			if (this.$bindForm) this.$bindForm.detach();
			if (!this.$sweepCode) this.$sweepCode = this.create$sweepCode();
			this.$sweepCode.find(".qrcode > img").prop("src", "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + ticket);
			this.$wxAuthcode.append(this.$sweepCode);
		},

		// 绑定手机号的表单
		create$FormItem_mphone: function () {
			var _this = this;
			var mphoneTpl = '' +
				'<div class="lm-form-item">' +
					'<div class="lm-input-wrapper">' +
						'<input type="text" placeholder="请输入注册手机号" class="' + this.inputCls.base + ' ' + this.inputCls.withPrefix + '">' +
						'<span class="lm-input-prefix ' + this.inputCls.prefix + '"><i class="i-icon i-icon-mobile"></i></span>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_mphone = $(mphoneTpl);
				$formItem_mphone.find("input")
					.on("input", function () { _this.data.mphone = $(this).val() })
					.on("blur", this.validateMphone.bind(this))
					.on("keypress", function (e) { if (e.keyCode === 13 && _this.validate()) _this.bindRequest() });
			return $formItem_mphone;
		},
		create$FormItem_mcode: function () {
			var _this = this;
			var mcodeTpl = '' +
				'<div class="lm-form-item mcode">' +
					'<div class="lm-input-wrapper">' +
						'<input type="text" placeholder="请输入短信验证码" maxlength="4" autocomplete="off" class="' + this.inputCls.base + '">' +
						'<button type="button" class="' + this.btnCls.base + ' lm-btn-text">获取验证码</button>' +
					'</div>' +
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_mcode = $(mcodeTpl);
				$formItem_mcode.find("input")
					.on("input", function () { _this.data.mcode = $(this).val() })
					.on("blur", this.validateMcode.bind(this))
					.on("keypress", function (e) { if (e.keyCode === 13 && _this.validate()) _this.bindRequest() });
				$formItem_mcode.find("button").on("click", function () { if (_this.validateMphone()) _this.sendMcodeRequest() });
			return $formItem_mcode;
		},
		create$FormItem_submit: function () {
			var submitTpl = '' +
				'<div class="lm-form-item">' +
					'<button type="submit" class="' + this.btnCls.base + ' lm-btn-block lm-btn-primary">确认绑定</button>'
					'<div class="lm-form-item-error-tip"></div>' +
				'</div>';
			var $formItem_submit = $(submitTpl);
				$formItem_submit.find("button").on("click", function (e) {
					e.preventDefault();
					if (this.validate()) this.bindRequest();
				}.bind(this));
			return $formItem_submit;
		},
		create$FormItem_skip: function () {
			var skipTpl = '' +
				'<div class="text-center lm-form-item skip">' +
					'<button type="button" class="lm-btn lm-btn-text">快速注册</button>' +
				'</div>';
			var $formItem_skip = $(skipTpl);
				$formItem_skip.find("button").on("click", function () { win.location.href = "/auth/quickreg?sign=" + this.data.sign + "&refer=" + this.getRefer() }.bind(this));
			return $formItem_skip;
		},
		create$BindForm: function () {
			this.$formItem_mphone = this.create$FormItem_mphone(),
			this.$formItem_mcode = this.create$FormItem_mcode(),
			this.$formItem_submit = this.create$FormItem_submit();
			this.$formItem_skip = this.create$FormItem_skip();
			return $('<div class="lm-form wxbind-form"></div>')
					.append('<div class="lm-form-item text-center">为了您的账号安全，请绑定手机号</div>')
					.append(this.$formItem_mphone)
					.append(this.$formItem_mcode)
					.append(this.$formItem_submit)
					.append(this.$formItem_skip);
		},
		showBindForm: function () {
			if (this.$sweepCode) this.$sweepCode.detach();
			if (this.$bindForm) {
				this.resetFields();
			} else {
				this.$bindForm = this.create$BindForm();
			}
			this.$wxAuthcode.append(this.$bindForm);
		},

		// 绑定表单的校验与重置
		validateMphone: function () {
			if (!this.data.mphone) {
				this.setError(this.$formItem_mphone, "请输入你的手机号码");
                return false;
            } 
            if (!/^1\d{10}$/.test(this.data.mphone)) {
				this.setError(this.$formItem_mphone, "手机号码格式不正确，请重新输入");
                return false;
			}
			
			this.removeError(this.$formItem_mphone);
			return true;
		},
		validateMcode: function () {
			if (this.data.mcode && /^\d{4}$/.test(this.data.mcode)) {
				this.removeError(this.$formItem_mcode);
				return true;
			} else {
				this.setError(this.$formItem_mcode, "请输入正确的验证码");
				return false;
			}
		},
		validate: function () {
			return new Array(this.validateMphone(), this.validateMcode()).every(function (value) { return value });
		},
		resetFields: function () {
			this.$bindForm.find("input[type=text]").val("");
			this.$bindForm.find("input[type=password]").val("");

			this.removeError(this.$bindForm.find(".lm-form-item-error"));
			this.sendMcodeCountdown(0);

			for (var key in this.data) {
				this.data[key] = "";
			}
		},


		/* ↓↓↓↓↓↓↓ methods ↓↓↓↓↓↓↓ */
		getRefer: function () {
			if (this.options.isRedirect) {
				return Utils.getQuery()["refer"] || "/";
			} else {
				return win.location.pathname + win.location.search;
			}
		},
		scanpullRequest: function () {
			var _this = this;
			var code = win.sessionStorage.getItem("scanpullcode");
			if (code === null) return;
			$.ajax("/auth/scanpull", {
				type: "POST",
				dataType: "json",
				data: {sign: code},
				success: function (ret) {
					switch (ret.statusCode) {
						case 200:
							sessionStorage.removeItem("scanpullcode");
							win.clearInterval(_this.scanpullTimer);
							if (ret.message === "bind" ) {
								window.location.href = "/auth/mplogin?sign=" + code;
							} else {
								_this.showBindForm();
							}
							break;
						case 301:
							win.clearInterval(_this.scanpullTimer);
					}
				}
			});
		},

		// 短信验证码请求 与 倒计时
		sendMcodeRequest: function () {
			var _this = this;
			
			$.ajax("/sendsmscode", {
				type: "POST",
				data: {
					type: "wxbind",
					mphone: this.data.mphone
				},
				dataType: "json",
				beforeSend: function () {
					_this.$formItem_mcode.find("button").off("click");	// 解除事件，防止多次触发

					// 清除验证码数据与错误信息
					_this.data.mcode = "";
					_this.$formItem_mcode.find("input").val("");
					_this.removeError(_this.$formItem_mcode);
				},
				success: function (res) {
					if (res.statusCode === 200 || res.error_code === 0) _this.sendMcodeCountdown(60);	// 发送成功
					switch (res.statusCode) {
						case 300:	// 手机号不正确 / 未注册 / 短信达上限
							_this.setError(_this.$formItem_mphone, res.message);
							break;
						case 404:	// 手机号已绑定其它账号
							_this.setError(_this.$formItem_mphone, res.message);
							break;
					}

					// 事件重新绑定
					_this.$formItem_mcode.find("button").on("click", function () { if (_this.validateMphone()) _this.sendMcodeRequest() });
				}
			})
		},
		sendMcodeCountdown: function (second) {
			var _this = this;
			var $sendMcodeBtn = _this.$formItem_mcode.find("button");

			win.clearTimeout(this.sendMCodeTimer);
			if (second > 0) {
				$sendMcodeBtn.text("重新获取 (" + second + "s)").prop("disabled", true);
				this.sendMCodeTimer = win.setInterval(function () {
					if (--second <= 0) {
						win.clearInterval(_this.sendMCodeTimer);
						$sendMcodeBtn.text("重新获取").prop("disabled", false);
					} else {
						$sendMcodeBtn.text("重新获取 (" + second + "s)");
					}
				}, 1000)
			} else {
				$sendMcodeBtn.text("获取验证码").prop("disabled", false);
			}
		},

		// 绑定请求
		bindRequest: function () {
			var _this = this;
			$.ajax("/auth/authPhoneBind", {
				type: "POST",
				data: this.data,
				dataType: "json",
				beforeSend: function () { _this.removeError(_this.$bindForm.find(".lm-form-item-error")) },
				success: function (res) {
					switch (res.statusCode) {
						case 200:
							win.location.href = "/auth/quickreg?sign=" + _this.data.sign + "&refer=" + _this.getRefer();
							break;
						case 301:	// 手机号相关错误
							_this.setError(_this.$formItem_mphone, res.message);
							break;
						case 302:	// 验证码错误
							_this.setError(_this.$formItem_mcode, "验证码错误，请重新输入");
							break;
						default:
							_this.setError(_this.$formItem_submit, res.message);
					}
				}
			})
		},

		// 表单错误状态的设置与移除
		setError: function (jqEl, message) {
			jqEl.addClass("lm-form-item-error").find(".lm-form-item-error-tip").text(message);
		},
		removeError: function (jqEl) {
			jqEl.removeClass("lm-form-item-error").find(".lm-form-item-error-tip").text("");
		}
	});

	win.WxAuth = WxAuth;
}(window, jQuery);


/**
 * 登录、注册标签页
 * @param {Object} options
 */
!function (win, $) {
	function LoginTabs (options) {
		this.options = $.extend({}, this.constructor.default, options);
		this.isWechat = Utils.isWechat();

		// 登录、注册表单
		this.loginForm = new win.LoginForm($.extend({}, {size: "large", isRedirect: !0}, this.options.loginForm));
		this.smsLoginForm = new win.SmsLoginForm($.extend({}, {size: "large", isRedirect: !0}, this.options.smsLoginForm));
		this.registForm = new win.RegistForm($.extend({}, {size: "large", isRedirect: !0, toLogin: this.toSmsLogin.bind(this)}, this.options.registForm));
		this.wxAuth = new WxAuth($.extend({}, {
			isRedirect: !0,
			scene: this.options.scene
		}, this.options.wxAuth));

		// 按需创建登录、注册、微信面板
		this.$loginPanel = null;
		this.$registPanel = null;
		this.$wxAuthPanel = null;

		// 整体结构
		this.$tabsNav = this.create$TabsNav(this.options);
		this.$tabsContent = this.create$TabsContent();
		this.$tabs = this.create$Tabs();

		this.options.el && this.mount(this.options.el);
	}

	LoginTabs.default = {
		el: null,						// 挂载目标，CSS选择器 或 原生DOM元素 或 jQuery元素
		showTabsInk: true,				// tabsBar 是否显示横向滑块
		activeTab: 0,					// 面板激活的 tab，0 为登录，1 为注册
		loginType: Utils.isMobile ? 1 : 2,	// 默认登录方式，0 为密码登录，1 为短信验证码登录，2 为微信登录
		logonType: Utils.isMobile ? 0 : 1,	// 注册方式 : 0 为手机号注册，1 为微信注册
		loginForm: {},					// 登录表单的配置项
		smsLoginForm: {},				// 短信登录表单的配置项
		registForm: {},					// 注册表单的配置项
		wxAuth: {},						// 微信授权的配置项
		scene: ''						// 场景 : 自定义的场景标识
	};

	var _proto = LoginTabs.prototype;
	$.extend(_proto, {
		mount: function (el) {
            if (!(el instanceof $)) el = $(el);
			el.eq(0).empty().append(this.$tabs);
			this.init();
		},
		
		
		/* ↓↓↓↓↓↓↓ 创建 DOM 并绑定事件 ↓↓↓↓↓↓↓ */
		// 第三方平台
		create$Sns: function (type) {
			var _this = this;
			var snsTpl = '' +
				'<div class="sns">' +
					'<div class="sns-label">快捷登录</div>' +
					'<div class="sns-list"></div>' +
				'</div>';
			var $sns = $(snsTpl);
			if (this.isWechat || !Utils.isMobile) {
				$sns.find(".sns-list").append('<a class="sns-a sns-wechat" title="微信登录"><i class="i-icon i-icon-wechat-circle"></i></a>');
				$sns.find(".sns-wechat").on("click", function () {
					_this.wxAuthRequest.call(_this, type);
				});
			}
			if (!this.isWechat) {
				$sns.find(".sns-list")
					.append('<a href="/auth?refer=' + this.wxAuth.getRefer() + '" class="sns-a sns-qq" title="QQ登录"><i class="i-icon i-icon-qq-circle"></i></a>')
					.append('<a href="/auth?platform=github' + '" class="sns-a sns-github" title="Github登录"><i class="i-icon i-icon-github-circle"></i></a>')
					.append('<a href="/auth?platform=weibo" class="sns-a sns-weibo" title="微博登录"><i class="i-icon i-icon-weibo-circle"></i></a>');
			}
			return $sns;
		},

		// 登录面板
		create$LoginFooter: function () {
			var _this = this;
			var $sns = this.create$Sns(0);
			var loginFooterTpl = '' +
				'<div class="lm-tabpanel-footer">' +
					'<div class="lm-btn lm-btn-text switch-loginType">' + (this.options.loginType === 0 ? '手机短信登录' : '账号密码登录') + '</div>' +
				'</div>';
			var $loginFooter = $(loginFooterTpl);
				$loginFooter.append($sns);
				$loginFooter.find(".switch-loginType")
					.data("key", this.options.loginType)
					.on("click", function () {
						if ($(this).data("key") === 0) {
							$(this).data("key", 1).text("账号密码登录");
							_this.showLogin(1);
						} else {
							$(this).data("key", 0).text("手机短信登录");
							_this.showLogin(0);
						}
					});
			return $loginFooter;
		},
		create$LoginPanel: function () {
			var $login = $('<div class="lm-tabpanel lm-tabpanel-login"></div>');
				$login.append(this.options.loginType === 0 ? this.loginForm.$form : this.smsLoginForm.$form);
				$login.append(this.create$LoginFooter());
			return $login;
		},

		// 注册模块
		create$RegistFooter: function () {
			return $('<div class="lm-tabpanel-footer"></div>').append(this.create$Sns(1));
		},
		create$RegistPanel: function () {
			return $('<div class="lm-tabpanel lm-tabpanel-regist"></div>').append(this.registForm.$form).append(this.create$RegistFooter());
		},

		// 微信平台面板
		create$otherWayBtn: function (type) {
			var _this = this;
			// var $otherWayBtn = $('<div class="other-ways"><button type="button" class="lm-btn lm-btn-text"></button></div>');
			if (type === 0) {
				var $otherWayBtn = $(
					'<div class="other-ways" style="display: flex; justify-content: space-between; padding: 0 25px">\
						<button type="button" class="lm-btn lm-btn1 lm-btn-text"></button>\
						<button type="button" class="lm-btn lm-btn2 lm-btn-text"></button>\
					</div>'
				);
				// $otherWayBtn.find("button").text("使用其它方式登录").on("click", function () {
				// 	_this.options.loginType = 1;
				// 	_this.showLogin.call(_this);
				// });
				$otherWayBtn.find('.lm-btn1').text("手机短信登录").on("click", function () {
					_this.options.loginType = 1;
					_this.showLogin.call(_this);
					_this.showLogin(1);
				});
				$otherWayBtn.find('.lm-btn2').text("账号密码登录").on("click", function () {
					_this.options.loginType = 1;
					_this.showLogin.call(_this);
					_this.showLogin(0);
				});
			} else {
				var $otherWayBtn = $('<div class="other-ways"><button type="button" class="lm-btn lm-btn-text"></button></div>');
				$otherWayBtn.find("button").text("使用其它方式注册").on("click", function () {
					_this.options.logonType = 0;
					_this.showRegist.call(_this);
				});
			}
			return $otherWayBtn;
		},
		create$WxAuthPanel: function () {
			return $('<div class="lm-tabpanel lm-tabpanel-wxauth"></div>');
		},

		// Tabs
		create$TabsNav: function () {
			var _this = this;
			var tabsNavTpl = '' +
				'<div class="lm-tabs-nav">' +
					'<div class="lm-tabs-tab" data-key="0">登录</div>' +
					'<div class="lm-tabs-tab" data-key="1">注册</div>' +
					(this.options.showTabsInk ? '<div class="lm-tabs-ink"></div>' : '') +
				'</div>';
			var $tabsNav = $(tabsNavTpl);
				$tabsNav.find(".lm-tabs-tab").eq(this.options.activeTab).addClass("lm-tabs-tab-active");
				$tabsNav.find(".lm-tabs-tab").on("click", function () {
					if ($(this).hasClass("lm-tabs-tab-active")) return;
					$(this).addClass("lm-tabs-tab-active").siblings(".lm-tabs-tab").removeClass("lm-tabs-tab-active");
					_this.options.activeTab = $(this).data("key");
					_this.options.activeTab === 0 ? _this.showLogin() : _this.showRegist();
					_this.options.showTabsInk && $tabsNav.find(".lm-tabs-ink").css({
						left: $(this).position().left + win.parseFloat($(this).css("marginLeft")),
						width: $(this).innerWidth()
					});
				});
				this.options.showTabsInk && $tabsNav.css({borderBottom: "2px solid #e8eaec"});
			return $tabsNav;
		},
		create$TabsContent: function () {
			return $('<div class="lm-tabs-content"></div>');
		},
		create$Tabs: function () {
			var $tabs = $('<div class="lm-tabs"></div>');
				$tabs.append(this.$tabsNav).append(this.$tabsContent);
			this.options.activeTab === 0 ? this.showLogin() : this.showRegist();
			return $tabs;
		},

		// 初始化
		init: function () {
			var $activeTab = this.$tabsNav.find(".lm-tabs-tab-active");
			this.options.showTabsInk && this.$tabs.find(".lm-tabs-ink").css({
				left: $activeTab.position().left + win.parseFloat($activeTab.css("marginLeft")),
				width: $activeTab.innerWidth()
			});
		},


		/* ↓↓↓↓↓↓↓ methods ↓↓↓↓↓↓↓ */
		showLogin: function (type) {
			if (!this.$loginPanel) this.$loginPanel = this.create$LoginPanel();
			if (type === undefined) {
				type = this.options.loginType;
			} else {
				this.options.loginType = type;
			}
			if (type === 0) {
				this.smsLoginForm.$form.detach();
				this.loginForm.resetFields();
				this.$loginPanel.prepend(this.loginForm.$form).find(".switch-loginType").data("key", 0).text("手机短信登录");
			} else if (type === 1) {
				this.loginForm.$form.detach();
				this.smsLoginForm.resetFields();
				this.$loginPanel.prepend(this.smsLoginForm.$form).find(".switch-loginType").data("key", 1).text("账号密码登录");
			} else if (type === 2) {
				this.wxAuthRequest();
			}
			this.switchPanel(this.$loginPanel);
		},
		showRegist: function () {
			if (!this.$registPanel) this.$registPanel = this.create$RegistPanel();
			if (this.options.logonType === 1) {
				this.wxAuthRequest();
			} else {
				this.registForm.resetFields();
			}
			this.switchPanel(this.$registPanel);
		},
		showWxAuthcode: function (type, $wxAuthcode) {
			if (type === void 0) type = this.options.activeTab;
			if (!this.$wxAuthPanel) this.$wxAuthPanel = this.create$WxAuthPanel();
			this.$wxAuthPanel.empty().append($wxAuthcode).append(this.create$otherWayBtn(type));
			this.switchPanel(this.$wxAuthPanel);
			if (type === 0) {
				this.options.loginType = 2;
			} else if (type === 1) {
				this.options.logonType = 1;
			}
		},
		switchPanel: function (jqEl) {
			this.$tabsContent.find(".lm-tabpanel").detach();
			this.$tabsContent.append(jqEl);
		},

		// 微信登录注册授权：流程逻辑一样，type不同视图不同，0为登录，1为注册
		wxAuthRequest: function (type) {
			var _this = this;
			if (type === void 0) type = this.options.activeTab;
			this.wxAuth.getAuth(function (res) {
				if (res.type === "link") {
					win.location.href = res.href;
				} else if (res.type === "qrcode") {
					_this.showWxAuthcode(type, res.$wxAuthcode);
				}
			});
		},

		// 跳到手机短信登录
		toSmsLogin: function () {
			this.$tabsNav.find(".lm-tabs-tab").eq(0).trigger("click");
			this.showLogin(1);
			this.smsLoginForm.$formItem_mphone.find("input").val(this.smsLoginForm.data.mphone = this.registForm.data.mphone);
		},

		// 重置 Tabs
		reset: function () {
			this.loginForm.resetFields();
			this.smsLoginForm.resetFields();
			this.registForm.resetFields();
			this.$tabsNav.find(".lm-tabs-tab").eq(this.options.activeTab).trigger("click");
		}
	});

	win.LoginTabs = LoginTabs;
}(window, jQuery);


/**
 * 登录、注册模态框
 * @param {Object} options
 */
!function (win, doc) {
	function LoginModal (options) {
		this.options = $.extend({}, this.constructor.default, options);

		this.bodyPreStyle = "";
		this.loginTabs = new win.LoginTabs({
			scene: this.options.scene,
			showTabsInk: false,
			loginForm: {isRedirect: !1},
			smsLoginForm: {isRedirect: !1},
			registForm: {isRedirect: !1},
			wxAuth: {isRedirect: !1}
		});
		this.$modal = this.create$Modal(this.options);

		this.mount();
		if (this.options.immediate) this.open();
	}

	LoginModal.default = {
		zIndex: 1000,		// 模态框的层级
		maskClosable: !0,	// 点击蒙层是否允许关闭
		immediate: false	// 初始化时是否立即显示
	};

	var _proto = LoginModal.prototype;
	var passiveListener = Support.passiveListener ? {passive: false, capture: false} : false;
	$.extend(_proto, {
		open: function () {
			if (this.show) return;
			this.disablePageScroll();
			this.$modal.show();
			this.show = true;
		},
		close: function () {
			if (!this.show) return;
			this.enablePageScroll();
			this.$modal.hide();
			this.loginTabs.reset();
			this.show = false;
		},
		remove: function () {
			this.enablePageScroll();
			this.$modal.remove();
		},
		mount: function () {
			doc.body.appendChild(this.$modal[0]);
			this.$modal.hide();
			this.show = false;
		},


		/* ↓↓↓↓↓↓↓ 创建 DOM 并绑定事件 ↓↓↓↓↓↓↓ */
		create$Modal: function (options) {
			var _this = this;
			var modalTpl = '' +
				'<div>' +
					'<div class="lm-modal-mask"></div>' +
					'<div class="lm-modal-wrap">' +
						'<div class="lm-modal">' +
							'<div class="lm-modal-close"><i class="i-icon i-icon-close"></i></div>' +
							'<div class="lm-modal-header"></div>' +
							'<div class="lm-modal-body"></div>' +
						'</div>' +
					'</div>' +
				'</div>';
			var $modal = $(modalTpl);
				$modal.find(".lm-modal-mask, .lm-modal-wrap").css({zIndex: this.options.zIndex});
				$modal.find(".lm-modal-close").on("click", this.close.bind(this));
				$modal.find(".lm-modal-header").append(this.loginTabs.$tabsNav);
				$modal.find(".lm-modal-body").append(this.loginTabs.$tabsContent);
				options.maskClosable &&	$modal.find(".lm-modal-wrap").on("click", function (e) { if ($(e.target).hasClass("lm-modal-wrap")) _this.close() });
			return $modal;
		},

		/* ↓↓↓↓↓↓↓ methods ↓↓↓↓↓↓↓ */
		saveBodyStyle: function () { this.bodyPreStyle = doc.body.style.cssText },
		resetBodyStyle: function () { doc.body.style.cssText = this.bodyPreStyle; this.bodyPreStyle = ""; },
		disablePageScroll: function () {
			this.saveBodyStyle();
			doc.body.style.overflow = "hidden";
			doc.body.style.width = "calc(100% - " + (win.innerWidth - doc.documentElement.clientWidth) + "px)";
			Support.touch && doc.addEventListener("touchmove", Event.preventDefault, passiveListener);	// 支持 touch 事件的设备禁止页面滚动
		},
		enablePageScroll: function () {
			this.resetBodyStyle();
			Support.touch && doc.removeEventListener("touchmove", Event.preventDefault, passiveListener);
		}
	});

	win.LoginModal = LoginModal;
}(window, document);


