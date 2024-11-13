phpData.project.forEach(function (item) {
    item.project.forEach(function (project) {
        project.number = 0;
    })
});

var loginModal = new LoginModal();
new Vue({
    el: '#full-height-container',
    data: {
        imageUrlHead: 'https://atts.w3cschool.cn/attachments/cover/',
        // 数据
        courseList: phpData.project,
        // app-download
        appDownload: {
            headLine: '随时随地编程实战',
            subHead: 'W3Cschool 编程狮 编程实战手机版APP',
            exhibitionImg: '//7n.w3cschool.cn/statics/images/w3c/codecamp-demo.png?t=1115',
            intro: '编程实战训练，是一个以操作实验为基础的编程训练营，让你在实践中提升自己的编程能力，VIP编程实战训练500+关。',
            qrcode: '//7nsts.w3cschool.cn/images/w3c/app-qrcode.png',
            qrcodeExplain: '扫描二维码直接安装APP',
            androidDownload: 'Android 下载',
            androidHref: 'https://7npmedia.w3cschool.cn/w3cschool_update.apk',
            iosDownload: 'iOS 下载',
            iosHref: '//itunes.apple.com/cn/app/w3cschool/id1215644262?mt=8'
        },
        isLogin: phpData.uid * 1,
        isSelected: '',
        beginBreakThrough: '',
        isOverstep: false,
        tabbarTop: 0
    },
    mounted: function () {
        // 没有学习记录 PLAY按钮
        try {
            this.courseList.forEach(function (modular) {
                modular.project.forEach(function (item, index) {
                    if (index == 0) {
                        this.beginBreakThrough = 'minicourse/play/' + item.ename + '/' + item.firstid;
                    }
                })
            })
        } catch (e) {
            if (e.message != 'Loop Done') throw e;
        }


        // 判断登录
        if (phpData.uid != '0') {
            // 获取已完成的进度
            var progressData = this.countPercentage();

            this.courseList.forEach(function (item) {
                item.project.forEach(function (project) {
                    progressData.forEach(function (data) {
                        if (data.pid === project.pid) {
                            project.number = data.number;
                        }
                    })
                })
            })
        } else {
            this.courseList.forEach(function (item) {
                item.project.forEach(function (project) {
                    project.number = 0;
                })
            })
        }

        // var _this = this;
        // var tabbar = this.$refs.tabbar;
        // var scrollTop = Scroll.getScrollTop();
        // var winHeight = (window.innerHeight - this.$refs.tabbar.offsetHeight - 80) / 2;
        // var tabbarTop = Scroll.getBoundingPageRect(this.$refs.tabbar).top - 80;
        // var responsiveTop = Scroll.getBoundingPageRect(this.$refs.responsive[0]).top - tabbar.offsetHeight - winHeight - 80;
        // var responsiveBottom = Scroll.getBoundingPageRect(this.$refs.responsive[0]).bottom - tabbar.offsetHeight - winHeight - 80;
        // var countAndStructureTop = Scroll.getBoundingPageRect(this.$refs.countAndStructure[0]).top - tabbar.offsetHeight - winHeight - 80;
        // var countAndStructureBottom = Scroll.getBoundingPageRect(this.$refs.countAndStructure[0]).bottom - tabbar.offsetHeight - winHeight - 80;
        // var frontEndFrameTop = Scroll.getBoundingPageRect(this.$refs.frontEndFrame[0]).top - tabbar.offsetHeight - winHeight - 80;
        // var frontEndFrameBottom = Scroll.getBoundingPageRect(this.$refs.frontEndFrame[0]).bottom - tabbar.offsetHeight - winHeight - 80;
        //
        // if(scrollTop >= tabbarTop) {
        //     _this.isOverstep = true;
        // } else {
        //     _this.isOverstep = false;
        // }
        //
        // window.addEventListener('scroll', function () {
        //     scrollTop = Scroll.getScrollTop();
        //     if(scrollTop >= tabbarTop) {
        //         _this.isOverstep = true;
        //     } else {
        //         _this.isOverstep = false;
        //     }
        //
        //     if (responsiveTop < scrollTop && scrollTop < responsiveBottom) {
        //         _this.isSelected = 'responsive';
        //     } else if (countAndStructureTop < scrollTop && scrollTop < countAndStructureBottom) {
        //         _this.isSelected = 'countAndStructure';
        //     } else if (frontEndFrameTop < scrollTop && scrollTop < frontEndFrameBottom) {
        //         _this.isSelected = 'frontEndFrame';
        //     } else {
        //         _this.isSelected = '';
        //     }
        // })

    },
    methods: {
        tabbarSelected: function (refName) {
            this.isSelected = refName;
            if (!this.$refs[refName]) return;
            Scroll.setScrollTop(window, Scroll.getBoundingPageRect(this.$refs[refName][0]).top - this.$refs.tabbar.offsetHeight - 80);
        },
        countPercentage: function () {
            var progressData = [];
            $.ajax({
                url: '/codecamp/getChallengeInfo',
                type: 'post',
                datatype: 'json',
                async : false,
                data: {},
                success:function(data){
                    progressData = JSON.parse(data).data;
                }
            });
            return progressData;
        },
        playStart: function () {
            if (phpData.uid == 0) {
                loginModal.open();
            } else {
                window.location.href = "/minicourse/play/basehtml?cp=15798";
            }
        },
        openCourse: function(ptype,ename){
            if(ptype == 6){
                window.open('/codecamp/list?pename=' + ename);
            }else{
                window.open('/codecamp/newList/' + ename);
            }
        }
    }
})