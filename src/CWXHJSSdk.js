import {CWXHJSSdkConf} from "./CWXHJSSdkConf";
import wx from 'weixin-js-sdk'

/**
 * @author kami
 * 这个API 用于连接微信分享功能
 *
 * */
export class CWXHJSSdk {

    // 配置文件对象
    wxconfig = null
    wx = null

    /**
     * 构造方法
     * @param {Object} config
     * */
    constructor(wxhconfig) {
        // 初始化全局配置变量
        if (wxhconfig instanceof CWXHJSSdkConf) {
            this.wxconfig = wxhconfig
        } else if (undefined != wxhconfig) {
            this.wxconfig = new CWXHJSSdkConf(wxhconfig)
        }
    }


    /**
     * 创建一个微信配置对象
     * @param {Mixed}  config 配置文件信息，不填写则使用配置方法最终传入的数据
     * @return
     * */
    wxConfig(config = undefined) {

        // 准备配置文件
        let confgjson = {}
        if (undefined == config) {
            if (this.wxconfig instanceof CWXHJSSdkConf) {
                confgjson = this.wxconfig.getConf()
            }
        } else if (config instanceof CWXHJSSdkConf) {
            confgjson = config.getConf()
        } else {
            confgjson = new CWXHJSSdkConf(config).getConf()
        }

        let _that = this

        return new Promise((resolve, reject) => {
            _that.wx = wx
            _that.wx.config(confgjson);
            _that.wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                resolve(_that)
            });
            _that.wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                reject(res)
            });

        })
    }

    /**
     * 设置默认的分享信息参数
     * @return {CWXHJSSdk}
     *
     * */
    setDefaultShareInfo(config = undefined) {
        this._shareinfo_config = config
        return this
    }

    /**
     * 获取默认的分享信息参数
     * @return {JSON}
     * */
    getDefaultShareInfo() {
        return this._shareinfo_config
    }

    /**
     * 生成微信分享信息，该方法可以重构微信分享信息
     * 配置文件段落名称：wxshare
     *
     * @param {CWXHJSSdk} wxsdk
     * @param {JSON} config
     * */
    makeWxShare(config = {}) {

        // 获取默认的朋友圈分享配置
        let sharedata = this.getDefaultShareInfo()

        // 如果是空为了后面顺利不报错给一个默认空对象
        if(undefined == sharedata ) sharedata = {}
        if(undefined == config ) config = {}


        // let {title, desc, link, imgUrl, success} = config.appmsg
        // console.log(title, desc, link, imgUrl, success)

        // 获取好友分享消息
        let appmsg = undefined
        if ((undefined != config && undefined != config.appmsg) || (undefined != sharedata && undefined != sharedata.appmsg)) {

            if (undefined == config.appmsg) config.appmsg = {}
            if (undefined == sharedata.appmsg) sharedata.appmsg = {}

            appmsg = {}
            appmsg.title = config.appmsg.title || sharedata.appmsg.title
            appmsg.desc = config.appmsg.desc || sharedata.appmsg.desc
            appmsg.link = config.appmsg.link || sharedata.appmsg.link
            appmsg.imgUrl = config.appmsg.imgUrl || sharedata.appmsg.imgUrl
            appmsg.success = config.appmsg.success || sharedata.appmsg.success
        }

        // 获取朋友圈设置信息
        let timeline = undefined
        if ((undefined != config && undefined != config.timeline) || (undefined != sharedata && undefined != sharedata.timeline)) {

            if (undefined == config.timeline) config.timeline = {}
            if (undefined == sharedata.timeline) sharedata.timeline = {}

            timeline = {}
            timeline.title = config.timeline.title || sharedata.timeline.title
            // 朋友圈没有desc
            // timeline.desc = config.timeline.desc || sharedata.timeline.desc
            timeline.link = config.timeline.link || sharedata.timeline.link
            timeline.imgUrl = config.timeline.imgUrl || sharedata.timeline.imgUrl
            timeline.success = config.timeline.success || sharedata.timeline.success
        }

        // console.log("### appmsg : ", appmsg)
        // console.log("### timeline : ", timeline)

        // 配置对象返回后，可以进行简单的配置信息修改操作
        // wxsdk.wxconfig.setDebug(config.is_debug)

        // 必须添加 否则朋友圈功能不会生效
        if(undefined != appmsg) this.wxconfig.addApiList("updateAppMessageShareData")
        if(undefined != timeline) this.wxconfig.addApiList("updateTimelineShareData")

        // 对JSSDK 进行配置
        this.wxConfig().then((wxsdk) => {

            if (undefined != appmsg) {
                // 当配置文件存在时进入这里
                this.wx.updateAppMessageShareData(appmsg)
            }

            if (undefined != timeline) {
                // 当配置文件存在时进入这里。
                this.wx.updateTimelineShareData(timeline)
            }

        }).catch((err) => {
            throw err
        })

    }
}
