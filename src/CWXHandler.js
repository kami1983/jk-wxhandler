import {CWXHJSSdkConf} from "./CWXHJSSdkConf";
import {CWXHJSSdk} from "./CWXHJSSdk";

/**
 * @author kami
 * 这个对象会被引入到全局的vue.$wxhandler 用来全局控制API组件
 *
 * */
export class CWXHandler {

    /**
     * 配置数组
     * */
    options = {}

    /**
     * 程序配置的分享信息，这个数组确保自动配置信息的时候仅配置一次
     * @param {CWXHJSSdk[]} catchSdk
     * */
    catch_wxsdk_list = []

    // 用来标记缓存是否正在生成中
    wxshare_catch_is_makeing = false
    // 用来记录缓存页面的名称
    wxshare_catch_page_name = undefined
    // 全局缓存对象
    __save_catch_wxsdk = undefined

    /**
     * 构造方法
     * */
    constructor(options) {
        this.options = options
    }

    /**
     * 新建立一个CWXHJSSdk 对象。
     * */
    create() {

        let sdkconfig = this.options.sdkconfig
        // 创建有两种方式，一种是使用FEApi 接口，另外一种是任意的接口
        if (undefined != sdkconfig.usefeapi) {
            // 用FEAPI 接口配置JSSDK
            return this.configWithFeapi(sdkconfig.usefeapi)
        } else if (undefined != sdkconfig.usepromise) {
            // console.log("RUN usepromise.", sdkconfig.usepromise)
            // 用Promise 方法带入任意的JSSDK配置信息，所以可以直接基于Axios
            return this.configWithPromise(sdkconfig.usepromise)
        }
    }

    // 当前生成的缓存wxsdk
    catch_wxsdk() {
        let _that = this
        return new Promise((resolve, reject) => {
            if (undefined == _that.__save_catch_wxsdk) {
                _that.create().then((wxsdk) => {
                    // console.log("JSSDK 配置文件创建成功 A2 ", wxsdk)
                    _that.__save_catch_wxsdk = wxsdk
                    // 回调信息
                    resolve(wxsdk)

                }).catch((err) => {
                    // 继续将错误信息向上传递
                    reject(err)
                })
            } else {
                // 执行缓存的时候理论上不会有什么异常
                resolve(_that.__save_catch_wxsdk)
            }
        })
    }


    /**
     * 通过Feapi 配置微信JSSDK
     * @param {JSON} config
     * @return {Promise}
     * */
    configWithFeapi(config) {

        return new Promise((resolve, reject) => {
            // 创建前后端组件，准备向后端发起请求
            let feapi = new CKLFEApi(config.feapiconf)

            // console.log("SDK url :: ", location.href.split('#')[0])

            // 请求JSSDK 的配置信息并且传入当前页面的URL 地址
            feapi.successCallback({
                ic: config.port.ic,
                im: config.port.im,
                fps: {
                    // 默认传入当前地址的URL
                    url: location.href.split('#')[0],
                }
            }).then((res) => {
                // 这里返回的是JSSDK 后端的处理配置信息
                resolve(this.createWXHJSSDK(res))

            }).catch((err) => {
                // 理论上这里不会进入
                reject(err)
            })
        })
    }

    /**
     * 通过Promise 对象提供额外的可扩展的JSSDK 参数带入方式
     * @param {Promise} promiseobj 一个Promise 对象，可以是Axios对象，也可是其他的。
     * @return {Promise}
     *
     * */
    configWithPromise(promiseobj) {

        return new Promise((resolve, reject) => {
            // 传入的是一个Promise 对象，很有可能是一个Axios对象。
            promiseobj.then((res)=>{
                // 返回wxhjssdk 对象，外部可以通过 .wxconfig 获取 CWXHJSSdkConf 进行配置修改
                resolve(this.createWXHJSSDK(res))
            }).catch((err)=>{
                reject(err)
            })
        })
    }

    /**
     * 通过一个配置参数，返回封装后的Jssdk 对象
     * @param {JSON} config
     * @return {CWXHJSSdk}
     * */
    createWXHJSSDK(config) {

        let sdkconfig = this.options.sdkconfig


        // 创建并初始化微信配置未见对象，并绑定到全局
        let wxconfig = new CWXHJSSdkConf(config)
        // 新增权限

        // 创建并初始化wxsdk 并绑定到全局对象
        let wxhjssdk = new CWXHJSSdk(wxconfig)

        wxhjssdk.wxconfig.setDebugStatus(sdkconfig.opendebug)

        // 设置默认的微信分享信息
        if (undefined != this.options.wxshare) {
            // 先检查是否是一个多级配置文件
            let defaultshareinfo = this.options.wxshare
            if("default" in this.options.wxshare) {
                // 判断wxshare 是否有default 配置
                defaultshareinfo = this.options.wxshare.default
            }
            wxhjssdk.setDefaultShareInfo(defaultshareinfo)
        }

        return wxhjssdk
    }
}