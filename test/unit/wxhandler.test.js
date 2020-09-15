import wxhandler from "../../src/index"
import Vue from "vue"
import {CWXHandler} from "../../src/CWXHandler";
import {CWXHJSSdk} from "../../src/CWXHJSSdk";
import { CWXHJSSdkConf } from "../../src/CWXHJSSdkConf";


describe('测试wxhandler 对象', () => {

    // 定义全局默认的分享信息
    let shareinfo = {
        title: "全局分享标题", // 分享标题
        desc: "全局的分享描述", // 分享描述
        link: "http://www.cancanyou.com/wxhandler.html", // 分享跳转的链接
        imgUrl: `http://www.cancancayou.com/imgs/share_icon.png`, // 分享图标
        success: function () {
            // console.log("CONFGI HSARE IFNO OK.")
        },
    }

    // 首先定一个配置
    let options = {
        // 这里面的配置信息可能是
        sdkconfig: {
            // 表示使用FEAPI 进行JSSDK 初始化
            opendebug: false,
            // usefeapi: {
            //     // FEAPI 接口配置
            //     feapiconf: {
            //         api_request_url: 'http://www.cancanyou.com/feapi/interface',
            //     },
            //     // FEAPI 接口请求信息
            //     port: {
            //         ic: "testclass",
            //         im: "get_jsconf",
            //     }
            // },
            // 通过其他方式进行JSSDK 初始化，这个与 usefeapi 只能一个生效，写两个时候默认 feapi 生效。
            usepromise: new Promise((resolve, reject) => {

                // 模拟一个假的JSSDK 配置信息，用于测试
                let wxconfig = {
                    appId: "wxabe6e769e5347571",
                    jsApiList: ["addCard", "chooseCard", "openCard"],
                    nonceStr: "JK-WeiX-148121jsapi",
                    signature: "f5467c1fa3bb93528769338711560872713cd002",
                    timestamp: "1599707247"
                }

                resolve(wxconfig)
            }),
        },
        // 用来配置全局分享相关的信息
        wxshare: {
            // 默认的配置值
            default: {
                appmsg: shareinfo,
                timeline: undefined,
            },
            pages: {
                // 配置单独的分享配置信息
                // "List": {
                //     appmsg: {
                //         title: '列表的特殊分享标题。',
                //     },
                //     timeline: undefined,
                // },
                "Video": {
                    // 表示Video 路由生效时跳出微信分享配置
                    // 如果这个单页上配置了较为特殊的分享文案，这个操作可以跳出默认的分享文案配置。
                    break: true
                }
            },
        },
    }


    /**
     * sdkconfig.opendebug 表示是否开启微信JSSDK 的调试模式。
     * */
    it('测试配置信息类 CWXHandler - sdkconfig.opendebug 在配置文件对象中的作用 ', async () => {

        // 断言测试的数量
        expect.assertions(8);

        // 建立一个模拟对象

        // 创建Handler 这个类最终被设置到Vue.$wxhandler 对象中
        expect(options.sdkconfig.opendebug).toBe(false)
        let oper = new CWXHandler(options)

        // 捕获wxsdk 对象
        await oper.catch_wxsdk().then((wxsdk) => {
            expect(wxsdk).toBeInstanceOf(CWXHJSSdk)
            expect(wxsdk.wxconfig).toBeInstanceOf(CWXHJSSdkConf)
            expect(wxsdk.wxconfig.getDebugStatus()).toBe(false)
        }).catch((err)=>{
            throw err
        })

        // 修改debug 信息在测试一次
        options.sdkconfig.opendebug = true
        expect(options.sdkconfig.opendebug).toBe(true)
        let oper2 = new CWXHandler(options)

        // 捕获wxsdk 对象
        await oper2.catch_wxsdk().then((wxsdk) => {
            expect(wxsdk).toBeInstanceOf(CWXHJSSdk)
            expect(wxsdk.wxconfig).toBeInstanceOf(CWXHJSSdkConf)
            expect(wxsdk.wxconfig.getDebugStatus()).toBe(true)
        }).catch((err)=>{
            throw err
        })

    })

    /**
     * 测试 install 方法，生成微信对象
     * */
    it('测试 Vue.use 用到的 install 方法，生成微信对象 ', async () => {

        // 强制开启配置文件的调试模式，否则可能无法正常进行测试。
        options.sdkconfig.opendebug = true
        // 通过use 进行加载组件
        Vue.use(wxhandler, options)
        // 实例VUE 组件，实际使用中那么 this 指向的一般就是Vue实例，也是就是通过 this.$wxhandler 即可使用。
        let vueobj = new Vue(options)

        // 断言对象加载成功，create
        expect(vueobj.$wxhandler).toBeInstanceOf(CWXHandler)

    })

    /**
     * 测试 makeDefaultWxShare 方法
     * */
    it('测试 makeDefaultWxShare 该方法用于快速生成默认的分享页面。 ', async () => {

        expect.assertions(12)

        let oper = new CWXHandler(options)
        expect(oper).toBeInstanceOf(CWXHandler)
        expect(oper.wxshare_catch_is_makeing).toBe(false)

        await oper.makeDefaultWxShare().then((share_conf)=>{
            // share_conf 返回的是分享配置的信息。
            expect(share_conf.appmsg.title).toBe(oper.options.wxshare.default.appmsg.title)
            expect(share_conf.appmsg.desc).toBe(oper.options.wxshare.default.appmsg.desc)
            expect(share_conf.appmsg.link).toBe(oper.options.wxshare.default.appmsg.link)
            expect(share_conf.appmsg.imgUrl).toBe(oper.options.wxshare.default.appmsg.imgUrl)

        })

        await oper.makeDefaultWxShare().catch((err)=>{
            // 无法重复生成同一个页面的微信分享函数。
            expect(err).toBeInstanceOf(Error)
        })

        // 如果换一个页面进行缓存可以继续设置
        await oper.makeDefaultWxShare("List").then((share_conf)=>{
            // share_conf 返回的是分享配置的信息。
            expect(share_conf.appmsg.title).toBe(oper.options.wxshare.default.appmsg.title)
            expect(share_conf.appmsg.desc).toBe(oper.options.wxshare.default.appmsg.desc)
            expect(share_conf.appmsg.link).toBe(oper.options.wxshare.default.appmsg.link)
            expect(share_conf.appmsg.imgUrl).toBe(oper.options.wxshare.default.appmsg.imgUrl)

        })

        await oper.makeDefaultWxShare("List").catch((err)=>{
            // 新生成的页面分享信息也同样，无法通过makeDefaultWxShare重复生成
            expect(err).toBeInstanceOf(Error)
        })

        // 表示正在生成JSSDK 中，这时候重复调用 makeDefaultWxShare 方法是无效的。
        // expect(oper.wxshare_catch_is_makeing).toBe(true)

    })

    /**
     * 测试 makeDefaultWxShare 方法
     * */
    it('测试 wxhare.pages.页面名.break = true 该配置表示跳过这个页面分享函数使用。', async () => {

        expect.assertions(4)
        // 上面测试的配置文件中就已经包括这个配置了，所以测试直接开始
        expect(options.wxshare.pages.Video.break).toBe(true)

        let oper = new CWXHandler(options)
        expect(oper).toBeInstanceOf(CWXHandler)
        expect(oper.wxshare_catch_is_makeing).toBe(false)
        
        await oper.makeDefaultWxShare("Video").catch((err)=>{
            // 新生成的页面分享信息也同样，无法通过makeDefaultWxShare重复生成
            console.log(err)
            expect(err).toBeInstanceOf(Error)
        })
    })

    /**
     * 测试 makeDefaultWxShare 方法
     * */
    it('测试 wxhare.pages 的特殊页面配置方法，这里面的配置如何和default 段落配置的有冲突则使用这里设置的值。', async () => {

        expect.assertions(10)

        let oper = new CWXHandler(options)
        expect(oper).toBeInstanceOf(CWXHandler)
        expect(oper.wxshare_catch_is_makeing).toBe(false)

        // 先假定增加一个page 信息
        oper.options.wxshare.pages = {
            List: {
                appmsg: {
                    title: "List 特殊的配置信息"
                } 
            }
        }

        // 默认值
        await oper.makeDefaultWxShare().then((share_conf)=>{
            // share_conf 返回的是分享配置的信息。
            expect(share_conf.appmsg.title).toBe(oper.options.wxshare.default.appmsg.title)
            expect(share_conf.appmsg.desc).toBe(oper.options.wxshare.default.appmsg.desc)
            expect(share_conf.appmsg.link).toBe(oper.options.wxshare.default.appmsg.link)
            expect(share_conf.appmsg.imgUrl).toBe(oper.options.wxshare.default.appmsg.imgUrl)
        })

        // 如果是List 页面那么appmsg 的title 会被改写，成上面设置的值。
        await oper.makeDefaultWxShare("List").then((share_conf)=>{
            // share_conf 返回的是分享配置的信息。
            // 注意这个断言的值被改写成上面的值。
            expect(share_conf.appmsg.title).toBe(oper.options.wxshare.pages.List.appmsg.title)
            // 如下这些没有影响，因为没有特殊指定，没有指定就使用默认配置段落的值。
            expect(share_conf.appmsg.desc).toBe(oper.options.wxshare.default.appmsg.desc)
            expect(share_conf.appmsg.link).toBe(oper.options.wxshare.default.appmsg.link)
            expect(share_conf.appmsg.imgUrl).toBe(oper.options.wxshare.default.appmsg.imgUrl)
        })

    })

    
})