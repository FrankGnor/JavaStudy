/**
 * @author Roger Wu
 * reference:dwz.drag.js, dwz.dialogDrag.js, dwz.resize.js, dwz.taskBar.js
 */
(function($){
	$.pdialog = {
		_op:{height:300, width:580, minH:40, minW:50, total:20, max:false, mask:false, resizable:true, drawable:true, maxable:true,minable:true,fresh:true,iframe:false,fullH:false, enddrag:false},
		_openop:{},
		_current:null,
		_zIndex:1042,
		getCurrent:function(){
			return this._current;
		},
		reload:function(url, options){
			var op = $.extend({data:{}, dialogId:"", callback:null}, options);
			var dialog = (op.dialogId && $("body").data(op.dialogId)) || this._current;
			if (dialog){
				var jDContent = dialog.find(".dialogContent");
				jDContent.ajaxUrl({
					type:"POST", url:url, data:op.data, callback:function(response){
						jDContent.find("[layoutH]").layoutH(jDContent);
						$(".pageContent", dialog).width($(dialog).width()-14);
						$(":button.close", dialog).click(function(){
							$.pdialog.close(dialog);
							return false;
						});
						if ($.isFunction(op.callback)) op.callback(response);
					}
				});
			}
		},
		//打开一个层
		open:function(url, dlgid, title, options) {
			var op = $.extend({},$.pdialog._op, options);
			if(options.fullH != undefined){
				$.pdialog._op.fullH = options.fullH;
			}

			$.pdialog._openop = options;
			
			var dialog = $("body").data(dlgid);
			//重复打开一个层
			if(dialog) {
				if(dialog.is(":hidden")) {
					dialog.show();
				}
				if(op.fresh || url != $(dialog).data("url")){
					dialog.data("url",url);
					dialog.find(".dialogHeader").find("h1").html(title);
					this.switchDialog(dialog);
					var jDContent = dialog.find(".dialogContent");
					jDContent.loadUrl(url, {}, function(){
						jDContent.find("[layoutH]").layoutH(jDContent);
						$(".pageContent", dialog).width($(dialog).width()-14);
						$("button.close").click(function(){

							$.pdialog.close(dialog);
							
							return false;
						});
					});
				}
			
			} else { //打开一个全新的层
			
				$("body").append($("#dialogTemplate").html());
				dialog = $(">.dialog:last-child", "body");
				//console.log(dlgid);
				dialog.addClass(dlgid+"-dialog");
				dialog.data("id",dlgid);
				dialog.data("url",url);
				if(options.close) dialog.data("close",options.close);
				if(options.param) dialog.data("param",options.param);
				($.fn.bgiframe && dialog.bgiframe());
				
				dialog.find(".dialogHeader").find("h1").html(title);
				$(dialog).css("zIndex", ($.pdialog._zIndex+=2));
				$("div.shadow").css("zIndex", $.pdialog._zIndex - 3).show();
				$.pdialog._init(dialog, options);
				$(dialog).click(function(){
					$.pdialog.switchDialog(dialog);
				});
				
				if(op.resizable)
					dialog.jresize();
				if(op.drawable)
				 	dialog.dialogDrag();
				$("a.dialogClose", dialog).click(function(event){ 
					
					$.pdialog.close(dialog,options);
					return false;
				});
				if (op.maxable) {
					$("a.maximize", dialog).show().click(function(event){
						$.pdialog.switchDialog(dialog);
						$.pdialog.maxsize(dialog);
						dialog.jresize("destroy").dialogDrag("destroy");
						return false;
					});
				} else {
					$("a.maximize", dialog).hide();
				}
				$("a.restore", dialog).click(function(event){
					$.pdialog.restore(dialog);
					dialog.jresize().dialogDrag();
					return false;
				});
				if (op.minable) {
					$("a.minimize", dialog).show().click(function(event){
						$.pdialog.minimize(dialog);
						return false;
					});
				} else {
					$("a.minimize", dialog).hide();
				}
				$("div.dialogHeader a", dialog).mousedown(function(){
					return false;
				});
				$("div.dialogHeader", dialog).dblclick(function(){
					if($("a.restore",dialog).is(":hidden"))
						$("a.maximize",dialog).trigger("click");
					else
						$("a.restore",dialog).trigger("click");
				});
				if(op.max) {
//					$.pdialog.switchDialog(dialog);
					$.pdialog.maxsize(dialog);
					dialog.jresize("destroy").dialogDrag("destroy");
				}
				$("body").data(dlgid, dialog);
				$.pdialog._current = dialog;
				$.pdialog.attachShadow(dialog);
				//load data
				var jDContent = $(".dialogContent",dialog);
				domID = /^#[a-zA-Z0-9_\-]+$/;
				isDomID = domID.test(url);
				if(isDomID){ //load page html data
					jDContent.html($(url).html());
				}else{ //load url html data
					if(op.iframe){
						jDContent.html('<iframe src="'+url+'" width="100%" height="100%" ></iframe>');
						return;
					}
					jDContent.loadUrl(url, {}, function(){
						jDContent.find("[layoutH]").layoutH(jDContent);
						$(".pageContent", dialog).width($(dialog).width()-14);
						$("button.close").click(function(){
							
							$.pdialog.close(dialog);
							return false;
						});
					});
				}
			}
			if (op.mask) {
				$(dialog).css("zIndex", 1000);
				$("a.minimize",dialog).hide();
				$(dialog).data("mask", true);
				$("#dialogBackground").show();
			}else {
				//add a task to task bar
				//if(op.minable) $.taskBar.addDialog(dlgid,title);
			}
		},
		/**
		 * 切换当前层
		 * @param {Object} dialog
		 */
		switchDialog:function(dialog) {
			var index = $(dialog).css("zIndex");
			$.pdialog.attachShadow(dialog);
			if($.pdialog._current) {
				var cindex = $($.pdialog._current).css("zIndex");
				$($.pdialog._current).css("zIndex", index);
				$(dialog).css("zIndex", cindex);
				$("div.shadow").css("zIndex", cindex - 1);
				$.pdialog._current = dialog;
			}
			//$.taskBar.switchTask(dialog.data("id"));
		},
		/**
		 * 给当前层附上阴隐层
		 * @param {Object} dialog
		 */
		attachShadow:function(dialog) {
			
			var shadow = $("div.shadow");
			if(shadow.is(":hidden")) shadow.show();
			shadow.css({
				top: parseInt($(dialog)[0].style.top) - 2,
				left: parseInt($(dialog)[0].style.left) - 4,
				height: parseInt($(dialog).height()) + 8,
				width: parseInt($(dialog).width()) + 8,
				zIndex:parseInt($(dialog).css("zIndex")) - 1000
			});
			$(".shadow_c", shadow).children().andSelf().each(function(){
				$(this).css("height", $(dialog).outerHeight() - 4);
			});
		},
		_init:function(dialog, options) {
			var op = $.extend({}, this._op, options);
			var height = op.height>op.minH?op.height:op.minH;
			var width = op.width>op.minW?op.width:op.minW;

			// if(isNaN(dialog.height()) || dialog.height() < height){

			// 	$(dialog).height(height+"px");
			// 	$(".dialogContent",dialog).height(height - $(".dialogHeader", dialog).outerHeight() - $(".dialogFooter", dialog).outerHeight() - 6);
			// }

			$(dialog).height(height+"px");
			$(".dialogContent",dialog).height(height - $(".dialogHeader", dialog).outerHeight() - $(".dialogFooter", dialog).outerHeight() - 6);
			
			if(isNaN(dialog.css("width")) || dialog.width() < width) {
				$(dialog).width(width+"px");
			}
			
			var iTop = ($(window).height()-dialog.height())/2;
			dialog.css({
				left: ($(window).width()-dialog.width())/2,
				top: iTop > 0 ? iTop : 0
			});
		},
		/**
		 * 初始化半透明层
		 * @param {Object} resizable
		 * @param {Object} dialog
		 * @param {Object} target
		 */
		initResize:function(resizable, dialog,target) {
			$("body").css("cursor", target + "-resize");
			resizable.css({
				top: $(dialog).css("top"),
				left: $(dialog).css("left"),
				height:$(dialog).css("height"),
				width:$(dialog).css("width")
			});
			resizable.show();
		},
		/**
		 * 改变阴隐层
		 * @param {Object} target
		 * @param {Object} options
		 */
		repaint:function(target,options){
			var shadow = $("div.shadow");
			if(target != "w" && target != "e") {
				shadow.css("height", shadow.outerHeight() + options.tmove);
				$(".shadow_c", shadow).children().andSelf().each(function(){
					$(this).css("height", $(this).outerHeight() + options.tmove);
				});
			}
			if(target == "n" || target =="nw" || target == "ne") {
				shadow.css("top", options.otop - 2);
			}
			if(options.owidth && (target != "n" || target != "s")) {
				shadow.css("width", options.owidth + 8);
			}
			if(target.indexOf("w") >= 0) {
				shadow.css("left", options.oleft - 4);
			}
		},
		/**
		 * 改变左右拖动层的高度
		 * @param {Object} target
		 * @param {Object} tmove
		 * @param {Object} dialog
		 */
		resizeTool:function(target, tmove, dialog) {
			$("div[class^='resizable']", dialog).filter(function(){
				return $(this).attr("tar") == 'w' || $(this).attr("tar") == 'e';
			}).each(function(){
				$(this).css("height", $(this).outerHeight() + tmove);
			});
		},
		/**
		 * 改变原始层的大小
		 * @param {Object} obj
		 * @param {Object} dialog
		 * @param {Object} target
		 */
		resizeDialog:function(obj, dialog, target) {
			var oleft = parseInt(obj.style.left);
			var otop = parseInt(obj.style.top);
			var height = parseInt(obj.style.height);
			var width = parseInt(obj.style.width);
			if(target == "n" || target == "nw") {
				tmove = parseInt($(dialog).css("top")) - otop;
			} else {
				tmove = height - parseInt($(dialog).css("height"));
			}
			$(dialog).css({left:oleft,width:width,top:otop,height:height});
			$(".dialogContent", dialog).css("width", (width) + "px");//shuter
			$(".pageContent", dialog).css("width", (width-14) + "px");
			if (target != "w" && target != "e") {
				var content = $(".dialogContent", dialog);
				content.css({height:height - $(".dialogHeader", dialog).outerHeight() - $(".dialogFooter", dialog).outerHeight()});//shuter
				content.find("[layoutH]").layoutH(content);
				$.pdialog.resizeTool(target, tmove, dialog);
			}
			$.pdialog.repaint(target, {oleft:oleft,otop: otop,tmove: tmove,owidth:width});
			
			$(window).trigger(AjaxDo.eventType.resizeGrid);
		},
		close:function(dialog,options) {
			if(typeof dialog == 'string') dialog = $("body").data(dialog);

			if(typeof options != 'undefined' && options.closecallback != "false"){
				eval(options.closecallback);
			}

			var close = dialog.data("close");
			var go = true;
			if(close && $.isFunction(close)) {
				var param = dialog.data("param");
				if(param && param != ""){
					param = AjaxDo.jsonEval(param);
					go = close(param);
				} else {
					go = close();
				}
				if(!go) return;
			}
			$(dialog).hide();
			$("div.shadow").hide();
			if($(dialog).data("mask")){
				$("#dialogBackground").hide();
			} else{
				//if ($(dialog).data("id")) $.taskBar.closeDialog($(dialog).data("id"));
			}

			$("body").removeData($(dialog).data("id"));
			$(dialog).trigger(AjaxDo.eventType.pageClear).remove();
		},
		closeCurrent:function(opt){
			this.close($.pdialog._current,opt);
		},
		checkTimeout:function(){
			var $conetnt = $(".dialogContent", $.pdialog._current);
			var json = AjaxDo.jsonEval($conetnt.html());
			if (json && json.statusCode == AjaxDo.statusCode.timeout) this.closeCurrent();
		},
		maxsize:function(dialog) {
			$(dialog).data("original",{
				top:$(dialog).css("top"),
				left:$(dialog).css("left"),
				width:$(dialog).css("width"),
				height:$(dialog).css("height")
			});
			
			$("a.maximize",dialog).hide();
			$("a.restore",dialog).show();
			var iContentW = $(window).width();
			if($.pdialog._op.fullH){ // 充满整个屏幕的高度
				var iContentH = $(window).height();
			}else{
				var iContentH = $(window).height() - 34;
			}
			

			$(dialog).css({top:"0px",left:"0px",width:iContentW+"px",height:iContentH+"px"});
			$.pdialog._resizeContent(dialog,iContentW,iContentH);
		},
		restore:function(dialog) {
			var original = $(dialog).data("original");
			var dwidth = parseInt(original.width);
			var dheight = parseInt(original.height);
			$(dialog).css({
				top:original.top,
				left:original.left,
				width:dwidth,
				height:dheight
			});
			$.pdialog._resizeContent(dialog,dwidth,dheight);
			$("a.maximize",dialog).show();
			$("a.restore",dialog).hide();
			$.pdialog.attachShadow(dialog);
		},
		minimize:function(dialog){
			$(dialog).hide();
			$("div.shadow").hide();
			/**
			var task = $.taskBar.getTask($(dialog).data("id"));
			$(".resizable").css({
				top: $(dialog).css("top"),
				left: $(dialog).css("left"),
				height:$(dialog).css("height"),
				width:$(dialog).css("width")
			}).show().animate({top:$(window).height()-60,left:task.position().left,width:task.outerWidth(),height:task.outerHeight()},250,function(){
				$(this).hide();
				$.taskBar.inactive($(dialog).data("id"));
			});
			*/
		},
		_resizeContent:function(dialog,width,height) {
			var content = $(".dialogContent", dialog);
			content.css({width:(width) + "px",height:height - $(".dialogHeader", dialog).outerHeight() - $(".dialogFooter", dialog).outerHeight()});//shuter
			content.find("[layoutH]").layoutH(content);
			$(".pageContent", dialog).css("width", (width-14) + "px");
			
			$(window).trigger(AjaxDo.eventType.resizeGrid);
		}
	};
})(jQuery);
(function($){
 	$.fn.extend({
	 	jresize:function(options) {
	        if (typeof options == 'string') {
                if (options == 'destroy'){
					return this.each(function() {
						var dialog = this;		
						$("div[class^='resizable']",dialog).each(function() {
							$(this).hide();
						});
	                });
				}
	        }
			return this.each(function(){
				var dialog = $(this);			
				var resizable = $(".resizable");
				$("div[class^='resizable']",dialog).each(function() {
					var bar = this;
					$(bar).mousedown(function(event) {
						$.pdialog.switchDialog(dialog);
						//console.log(event);
						$.resizeTool.start(resizable, dialog, event, $(bar).attr("tar"));
						return false;
					}).show();
				});
			});
		}
	});
	$.resizeTool = {
		start:function(resizable, dialog, e, target) {

			$.pdialog.initResize(resizable, dialog, target);

			$.data(resizable[0], 'layer-drag', {
				options: $.extend($.pdialog._op, {target:target, dialog:dialog,stop:$.resizeTool.stop})
			});

			$.layerdrag.start(resizable[0], e, $.pdialog._op);
		},
		stop:function(){
			var data = $.data(arguments[0], 'layer-drag');
			$.pdialog.resizeDialog(arguments[0], data.options.dialog, data.options.target);
			$("body").css("cursor", "");
			$(arguments[0]).hide();
		}
	};
	$.layerdrag = { 
		start:function(obj, e, options) {
			if (!$.layerdrag.current) {
				$.layerdrag.current = {
					el: obj,
					oleft: parseInt(obj.style.left) || 0,
					owidth: parseInt(obj.style.width) || 0,
					otop: parseInt(obj.style.top) || 0,
					oheight:parseInt(obj.style.height) || 0,
					ox: e.pageX || e.screenX,
					oy: e.pageY || e.clientY
				};
				$(document).bind('mouseup', $.layerdrag.stop);
				$(document).bind('mousemove', $.layerdrag.drag);
			}
			return $.layerdrag.preventEvent(e);
		},
        drag: function(e) {
            if (!e) var e = window.event;
            var current = $.layerdrag.current;
			var data = $.data(current.el, 'layer-drag');
			var lmove = (e.pageX || e.screenX) - current.ox;
			var tmove = (e.pageY || e.clientY) - current.oy;
			if((e.pageY || e.clientY) <= 0 || (e.pageY || e.clientY) >= ($(window).height() - $(".dialogHeader", $(data.options.dialog)).outerHeight())) return false;
			var target = data.options.target;	
			var width = current.owidth;	
			var height = current.oheight;		
			if (target != "n" && target != "s") {
				width += (target.indexOf("w") >= 0)?-lmove:lmove;
			}
			if (width >= $.pdialog._op.minW) {
				if (target.indexOf("w") >= 0) {
					current.el.style.left = (current.oleft + lmove) + 'px';
				}
				if (target != "n" && target != "s") {
					current.el.style.width = width + 'px';
				}
			}
			if (target != "w" && target != "e") {
				height += (target.indexOf("n") >= 0)?-tmove:tmove;
			}
			if (height >= $.pdialog._op.minH) {
				if (target.indexOf("n") >= 0) {
					current.el.style.top = (current.otop + tmove) + 'px';
				}
				if (target != "w" && target != "e") {
					current.el.style.height = height + 'px';
				}
			}
			return $.layerdrag.preventEvent(e);
        },     
        stop: function(e) {
            var current = $.layerdrag.current;
            var data = $.data(current.el, 'layer-drag');
			$(document).unbind('mousemove', $.layerdrag.drag);
			$(document).unbind('mouseup', $.layerdrag.stop);
            if (data.options.stop) {
                    data.options.stop.apply(current.el, [ current.el ]);
            }
            $.layerdrag.current = null;
			return $.layerdrag.preventEvent(e);
        },
		preventEvent:function(e) {
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
            return false;
		}
	};
	$.fn.dialogDrag = function(options){
        if (typeof options == 'string') {
            if (options == 'destroy') 
				return this.each(function() {
					var dialog = this;		
					$("div.dialogHeader", dialog).unbind("mousedown");
                });
        }
		return this.each(function(){
			var dialog = $(this);
			$("div.dialogHeader", dialog).mousedown(function(e){
				$.pdialog.switchDialog(dialog);
				dialog.data("task",true);
				setTimeout(function(){
					if(dialog.data("task"))$.dialogDrag.start(dialog,e);
				},100);
				return false;
			}).mouseup(function(e){
				dialog.data("task",false);

				return false;
			});
		});
	};
	$.dialogDrag = {
		currId:null,
		_init:function(dialog) {
			this.currId = new Date().getTime();
			var shadow = $("#dialogProxy");
			if (!shadow.size()) {
				shadow = $("#dialogProxyTem").html();
				$("body").append(shadow);
			}
			$("h1", shadow).html($(".dialogHeader h1", dialog).text());
		},
		start:function(dialog,event){
			this._init(dialog);
			var sh = $("#dialogProxy");
			sh.css({
				left: dialog.css("left"),
				top: dialog.css("top"),
				height: dialog.css("height"),
				width: dialog.css("width"),
				zIndex:parseInt(dialog.css("zIndex")) + 1
			}).show();
			$("div.dialogContent",sh).css("height",$("div.dialogContent",dialog).css("height"));
			sh.data("dialog",dialog);
			dialog.css({left:"-10000px",top:"-10000px"});
			$(".shadow").hide();				
			$(sh).jDrag({
				selector:".dialogHeader",
				stop: this.stop,
				event:event
			});
			return false;
		},
		stop:function(){
			var sh = $(arguments[0]);
			var dialog = sh.data("dialog");

			if($.pdialog._openop.enddrag === 'true'){ // 触发拖拽停止事件
				//console.log("触发...");
				$(document).triggerHandler('dialogDragEnd');
			}
			
			$(dialog).css({left:$(sh).css("left"),top:$(sh).css("top")});
			$.pdialog.attachShadow(dialog);
			$(sh).hide();
		}
	};
	$.fn.jDrag = function(options){
		if (typeof options == 'string') {
			if (options == 'destroy') 
				return this.each(function(){
					$(this).unbind('mousedown', $.rwdrag.start);
					$.data(this, 'pp-rwdrag', null);
				});
		}
		return this.each(function(){
			var el = $(this);
			$.data($.rwdrag, 'pp-rwdrag', {
				options: $.extend({
					el: el,
					obj: el
				}, options)
			});
			if (options.event) 
				$.rwdrag.start(options.event);
			else {
				var select = options.selector;
				$(select, obj).bind('mousedown', $.rwdrag.start);
			}
		});
	};
	$.rwdrag = {
		start: function(e){
			document.onselectstart=function(e){return false};//禁止选择

			var data = $.data(this, 'pp-rwdrag');
			var el = data.options.el[0];
			$.data(el, 'pp-rwdrag', {
				options: data.options
			});
			if (!$.rwdrag.current) {
				$.rwdrag.current = {
					el: el,
					oleft: parseInt(el.style.left) || 0,
					otop: parseInt(el.style.top) || 0,
					ox: e.pageX || e.screenX,
					oy: e.pageY || e.screenY
				};
				$(document).bind("mouseup", $.rwdrag.stop).bind("mousemove", $.rwdrag.drag);
			}
		},
		drag: function(e){
			if (!e)  var e = window.event;
			var current = $.rwdrag.current;
			var data = $.data(current.el, 'pp-rwdrag');
			var left = (current.oleft + (e.pageX || e.clientX) - current.ox);
			var top = (current.otop + (e.pageY || e.clientY) - current.oy);
			if (top < 1) top = 0;
			if (data.options.move == 'horizontal') {
				if ((data.options.minW && left >= $(data.options.obj).cssv("left") + data.options.minW) && (data.options.maxW && left <= $(data.options.obj).cssv("left") + data.options.maxW)) 
					current.el.style.left = left + 'px';
				else if (data.options.scop) {
					if (data.options.relObj) {
						if ((left - parseInt(data.options.relObj.style.left)) > data.options.cellMinW) {
							current.el.style.left = left + 'px';
						}
					} else 
						current.el.style.left = left + 'px';
				}
			} else if (data.options.move == 'vertical') {
					current.el.style.top = top + 'px';
			} else {
				var selector = data.options.selector ? $(data.options.selector, data.options.obj) : $(data.options.obj);
				if (left >= -selector.outerWidth() * 2 / 3 && top >= 0 && (left + selector.outerWidth() / 3 < $(window).width()) && (top + selector.outerHeight() < $(window).height())) {
					current.el.style.left = left + 'px';
					current.el.style.top = top + 'px';
				}
			}
			
			if (data.options.drag) {
				data.options.drag.apply(current.el, [current.el, e]);
			}
			
			return $.rwdrag.preventEvent(e);
		},
		stop: function(e){
			var current = $.rwdrag.current;
			var data = $.data(current.el, 'pp-rwdrag');
			$(document).unbind('mousemove', $.rwdrag.drag).unbind('mouseup', $.rwdrag.stop);
			if (data.options.stop) {
				data.options.stop.apply(current.el, [current.el, e]);
			}
			$.rwdrag.current = null;

			document.onselectstart=function(e){return true};//启用选择
			return $.rwdrag.preventEvent(e);
		},
		preventEvent:function(e){
			if (e.stopPropagation) e.stopPropagation();
			if (e.preventDefault) e.preventDefault();
			return false;			
		}
	};
})(jQuery);