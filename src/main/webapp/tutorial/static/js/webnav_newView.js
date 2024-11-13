var cardList = [];
var indexDiffrence = 0;
var indexMax = 0;
var indexMin = 0;
var cardListIndex = 0;
// 修改数组
phpData.knlist.forEach(function (knItem, index) {
  knItem.forEach(function (item, index) {
    if (item.fid == 0) {
      cardList.push(item);
      cardListIndex ++;
      indexMin = index;
      cardList[cardListIndex - 1].contentList = [];
      cardList[cardListIndex - 1].isMore = false;
      cardList[cardListIndex - 1].refName = 'card' + cardListIndex;
      cardList[cardListIndex - 1].scrollIntoView = false;
    } else {
      cardList[cardListIndex - 1].contentList.push(item);
      indexMax = index;
      indexDiffrence = indexMax - indexMin;
      if (indexDiffrence > 10) cardList[cardListIndex - 1].isMore = true;
    }
  })
})

phpData.knlist = cardList;
$.ajax({
  url: "/project/iconsAPI?pid=" + pid,
  type: "post",
  data: {},
  success: function (msg) {
    msg = msg.replace(/\s/g, '');
    msg = msg.replace(/\n/g, '');
    msg = msg.replace(/&nbsp;/g, ' ');
    $("head").append("<style id='favicons'>" + msg + "</style>");
  }
});


$(".show-ksummary").on("click", function () {
  if ($(".list-card-ksummary").is(":hidden")) {
    $(".list-card-ksummary").show();
    $(".show-ksummary").html("<i class=\"icon-eye-close\"></i>关闭简介");
  } else {
    $(".list-card-ksummary").hide();
    $(".show-ksummary").html("<i class=\"icon-eye-open\"></i>打开简介");
  }
});

//访问网址的时候计数
$(".list-card-items").on('click', function (e) {

  var kename, countsObj, counts;
  kename = $(this).attr('kename');
  var url = $(this).attr('href');

  countsObj = $(this).next().next();
  counts = parseInt(countsObj.text()) + 1;
  countsObj = $("a[href='" + url + "']");
  countsObj.each(function () {
    $(this).parent().find(".counts").text(counts);
  });

  $.ajaxdo({
    url: "/project/setUrlViewCount",
    type: 'post',
    data: {
      "url": url,
    },
    success: function (msg) {
      console.log(msg);
    }
  });

});

// popover demo
// $("[data-toggle=popover]").popover();

//鼠标在网址上显示更多的按钮
$("#sortable_portlets").delegate(".list-card",'mouseenter',function(){
  $(".icon-ellipsis-horizontal",this).css({'visibility':'visible'});
}).delegate(".list-card", "mouseleave", function (event) {
  $(".icon-ellipsis-horizontal",this).css({'visibility':'hidden'});
});

$(".editpinfo,.editurl,.add-card-composer,.js-add-list,.cog,.dolike").on('click',function(){
  // toastr.success("请登录!");
  getWechatQR('web_tools_list_wx_scanner', window.location.href);
});

function collection() {
  var title = $(this).attr('title');
  AddFavorite(window.location.href, title);
}



window._bd_share_config = {
  "common": {
    "bdSnsKey": {},
    "bdText": "",
    "bdMini": "2",
    "bdMiniList": false,
    "bdPic": "",
    "bdStyle": "2",
    "bdSize": "16"
  }, "share": {}
};
with (document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'https://7n.w3cschool.cn/plugins/baidushare/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];

new Vue({
  el: '#layOut',
  data: {
    cardList: phpData.knlist,
    // 状态
    isChoose: 0,
    showNum: 10,
    isFixed: false,
    // 数据
    cardsArr: [],
    iconArr: [],
    cardsPageRectTop: [],
    cardsOpenHeight: [],
    cardsCloseHeight: 0,
    clickIndex: 0,
    isClicked: false
  },
  mounted: function () {
    var _this = this;

    // 加载更多
    var maxHeight = 0
    var minHeight = 0;

    this.cardsArr = document.querySelectorAll('.cardArea-main-hidden');
    this.iconArr = document.querySelectorAll('.i-icon-next');
    for (var i = 0; i < _this.cardsArr.length; i++) {
      minHeight = _this.cardsArr[i].offsetHeight;
      _this.cardsOpenHeight.push(_this.cardsArr[i].scrollHeight);
      if (minHeight > maxHeight) {
        maxHeight = minHeight;
        _this.cardsCloseHeight = maxHeight;
      }
    }

    // 楼梯式导航事件绑定
    var stairNavTop = Scroll.getBoundingPageRect(this.$refs.stairNav).top;
    this.getCardTop();

    var handleScroll = (function handleScrollFn () {
      _this.cardsPageRectTop.forEach(function (v, index) {
        // if (v - Scroll.getRootScrollTop() < document.documentElement.clientHeight / 2) {
        if (Scroll.getRootScrollTop() > v - 60) _this.isChoose = index;
        // }
      });
      return handleScrollFn;
    })();
    window.addEventListener('scroll', function () {
      var scrollTop = Scroll.getScrollTop();
      if (scrollTop > stairNavTop) {
        _this.isFixed = true;
      } else {
        _this.isFixed = false;
      }
      handleScroll();
      // 修改导航中的选中项为点击项
      if (_this.isClicked) {
        _this.isChoose = _this.clickIndex;
        _this.isClicked = false;
      }
    });
    this.scrollEvent = {
      off: function () {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  },
  methods: {
    loadMore: function (index) {
      var _this = this;
      clearTimeout(this.getTopTimer);
      if (_this.$refs.moreText[index].innerHTML == '更多') {
        _this.cardsArr[index].style.maxHeight = this.cardsOpenHeight[index] + 'px';
        _this.iconArr[index].style.transform = 'rotate(90deg)';
        _this.$refs.moreText[index].innerHTML = '收起';
      } else {
        _this.cardsArr[index].style.maxHeight = this.cardsCloseHeight + 'px';
        _this.iconArr[index].style.transform = 'rotate(0deg)';
        _this.$refs.moreText[index].innerHTML = '更多';
      };
      this.getTopTimer = setTimeout(function () {
        _this.getCardTop();
      }, 300);
    },
    getCardTop: function () {
      var _this = this;
      var cards = document.querySelectorAll('.cardArea');
      this.cardsPageRectTop = [];
      for (var i = 0; i < cards.length; i++) _this.cardsPageRectTop.push(Scroll.getBoundingPageRect(cards[i]).top - 20);
    },
    pointerScroll: function (index) {
      var _this = this;
      _this.getCardTop();
      this.isChoose = index;
      this.scrollAnimate(_this.cardsPageRectTop[index]);
      this.clickIndex = this.isChoose;
    },
    scrollAnimate: function (targetVal) {
      var _this = this;
      var scrollTop = Scroll.getScrollTop();
      var direction = targetVal > scrollTop;

      var value;
      if (Math.abs((targetVal - scrollTop) / 7) < 1) {
        value = targetVal;
      } else {
        value = (targetVal - scrollTop) / 7 + scrollTop;
      }

      Scroll.setScrollTop(window, value);
      if (direction) {
        if (value < targetVal && (value < Scroll.getPageSize().height - document.documentElement.clientHeight)) {
          window.requestAnimationFrame(function () {
            _this.scrollAnimate(targetVal);
          });
        }
      } else {
        if (value > targetVal) {
          window.requestAnimationFrame(function () {
            _this.scrollAnimate(targetVal);
          });
        }
      }
      _this.isClicked = true;
    },
    thumbUp: function () {
      if (phpData.username == '') {
         getWechatQR('web_tools_list_wx_scanner', window.location.href);
      } else {
        $.ajax({
          url: '/project/islike/webtools.html',
          type: "post",
          success: function (ret) {
            ret = JSON.parse(ret);
            if (ret.statusCode == 200) {
              toastr.success(ret.message,'',{"positionClass": "toast-top-center"});
            } else {
              toastr.warning(ret.message,'',{"positionClass": "toast-top-center"});
            }
          }
        })
      }
    },
    collection: function () {
      if (phpData.username == '') {
        getWechatQR('web_tools_list_wx_scanner', window.location.href);
      } else {
        this.AddFavorite(window.location.href, this.$refs.doStar.title);
      }
    },
    AddFavorite: function (sURL, sTitle) {
      try{
        window.external.addFavorite(sURL, sTitle);
      }
      catch (e){
        try{
          window.sidebar.addPanel(sTitle, sURL, '');
        }
        catch (e){
          alert('请使用Ctrl+D进行添加');
        }
      }
    }
  }
})