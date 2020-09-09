
/**
 * @author kami
 * 这个API 用于整理配置文件数组
 *
 * */
export class CWXHJSSdkConf {



    config = {
        debug : false,  //: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId : null,  //: '', // 必填，公众号的唯一标识
        timestamp : null, //: , // 必填，生成签名的时间戳
        nonceStr : null,  // 必填，生成签名的随机串
        signature : null,
        jsApiList : [],
    }

    /**
     * 构造方法
     * @param {Object} config
     * */
    constructor (config) {
        // 基本配置属性检查
        //         // if(this.isUndefined(config) || this.isUndefined(config.api_request_url)) {
        //         //     throw new Error("ERROR CODE::200208241649 CONTENT::CKLFEApi 需要传入配置参数，该配置参数中至少包含 api_request_url 属性，用于传入PHP接口地址。")
        //         // }
        //         // this.api_default_request_url = config.api_request_url

        // 最新的微信接口所需要的配置信息
        // wx.config({
        //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        //     appId: '', // 必填，公众号的唯一标识
        //     timestamp: , // 必填，生成签名的时间戳
        //     nonceStr: '', // 必填，生成签名的随机串
        //     signature: '',// 必填，签名
        //     jsApiList: [] // 必填，需要使用的JS接口列表
        // });

        //   * "is_debug": false,
        //   *  "appId": "wx15b708c13831ea72",
        //   *  "nonceStr": "JK-WeiX-619639jsapi",
        //   *  "timestamp": 1598925760,
        //     "url": "http:\/\/www.baidu.com",
        //     "jsapi_ticket": "sM4AOVdWfPE4DxkXGEs8VB08MtykEq_uyla4DAg0aD7gvzXQZMAbe8zQ-_qPd_3OpQAvBFeKw5FzNiry4xkDIA",
        //     "gettickect_obj": [],
        //     "actionObj": [],
        //    * "jsApiList_json": "[\"onMenuShareTimeline\",\"onMenuShareAppMessage\",\"onMenuShareQQ\",\"onMenuShareWeibo\",\"startRecord\",\"stopRecord\",\"onVoiceRecordEnd\",\"playVoice\",\"pauseVoice\",\"stopVoice\",\"onVoicePlayEnd\",\"uploadVoice\",\"downloadVoice\",\"chooseImage\",\"previewImage\",\"uploadImage\",\"downloadImage\",\"translateVoice\",\"getNetworkType\",\"openLocation\",\"getLocation\",\"hideOptionMenu\",\"showOptionMenu\",\"hideMenuItems\",\"showMenuItems\",\"hideAllNonBaseMenuItem\",\"showAllNonBaseMenuItem\",\"closeWindow\",\"scanQRCode\",\"chooseWXPay\",\"openProductSpecificView\",\"addCard\",\"chooseCard\",\"openCard\"]",
        //    * "signature": "6bc03e64c5d93a3e535d2792cc4c1d82ce8ca3f0",
        //     "debug_makestr":

        // console.log('$$$$$$$', config.appId )

        this.config.debug = config.is_debug || config.debug || false //: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        this.config.appId = config.appId || undefined //: '', // 必填，公众号的唯一标识
        this.config.timestamp = config.timestamp || undefined //: , // 必填，生成签名的时间戳
        this.config.nonceStr = config.nonceStr || undefined //: '', // 必填，生成签名的随机串
        this.config.signature = config.signature || undefined //: '',// 必填，签名
        if(undefined != config.jsApiList_json ) {
            this.config.jsApiList = JSON.parse(config.jsApiList_json)  //: [] // 必填，需要使用的JS接口列表
        }else{
            this.config.jsApiList = config.jsApiList || []
        }
    }

    /**
     * 获取微信配置JSON 数据的方法
     * @return {Object}
     * */
    getConf(){
        return this.config
    }

    /**
     * 设置测试状态函数，该函数会改变debug 配置变量的值
     * @param {Boolean} status
     * @return {CWXHJSSdkConf}
     * */
    setDebug(status) {
        this.config.debug = status
        return this
    }

    /**
     * 添加API的列表
     * @param {String} apiname 要新增的API名称
     * @return {CWXHJSSdkConf}
     * */
    addApiList(apiname) {
        this.config.jsApiList.push(apiname)
        return this
    }
}
