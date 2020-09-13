### WXHandler 微信辅助支持组件

* 该类库用来完成常规复用的微信JSSDK相关操作。

#### 制定功能组

* 全局配置分享信息。
* 差异化配置分享信息。

### 版本信息

#### v1.1.2
* 修正index.js 没有引入测试逻辑的BUG。

#### v1.1.1
* 修正CWXHandler 没有正确引入 {CKLFEApi} 的问题。
* 修正 setDebug(status) 没有return 函数的问题。

#### v1.1.0
* 新增单元测试，使用Jest 作为测试工具包。
* 新增 wxhare.pages.页面名.break 配置段落，如果该配置段落等于true 表示跳过该路由的默认微信JSSDK分享设置。
* 新增 CWXHandler 类，重构原来install 的对象结构，对于原来配置方式无影响。
* 重构 CWXHJSSdk 类，更符合逻辑结构。
* 其他相关性能改善。
* package.json 中新增 weixin-js-sdk 依赖配置。
* 更新 babel 编译工具为 7.x

#### v1.0.2
* 完善README文档

#### v1.0.1

* 支持全局设置微信朋友圈、好友分享配置。
* 支持页面获取微信jssdk访问接口


### 安装

* `npm install jk-wxhandler --save-dev`

### 使用方式
* 请确保wxhandler 正确安装。

#### 配置到Vue 项目中
* 需要修改Vue 项目的main.js 文件

```
// 微信JSSDK 助手
import wxhandler from './wxhandler'

// 在new Vue 之前进行插入wxhandler插件
Vue.use(wxhandler, {
    // 这里面的配置信息可能是
    sdkconfig: {
        // 表示使用FEAPI 进行JSSDK 初始化，需要 npm install jk-felib --save-dev 进行安装
        usefeapi: {
            // FEAPI 接口配置
            feapiconf: feapiconfig,
            // FEAPI 接口请求信息
            port: {
                ic: "h200729",
                im: "get_jsconf",
            }
        },
        // 通过其他方式进行JSSDK 初始化，这个与 usefeapi 只能一个生效，写两个时候默认 feapi 生效
        // 通过这种方式可以使用Axios 进行配置请求，而不一定非要依赖felib
        usepromise : undefined,
    },
    // 用来配置全局分享相关的信息，undefined 表示不使用全局分享配置
    wxshare:undefined,
})

```
* 如上配置后，在Vue 实例中就可以通过 this.$wxhandler 访问微信助手

### 通过 catch_wxsdk() 捕获微信jssdk 对象
* catch_wxsdk() 返回一个Promise 对象，通过then() 方法可以解惑CWXHJSSdk 封装对象，从而完成对jssdk 二次配置和应用。
* 为了更好理解运作方式接下来通过常用的微信页面分享功能进行举例：
* 如下代码片段通常运行在 `mounted` 或者 `created` 声明生命周期中
```
// 通过 catch_wxsdk 进行封装对象拨号
this.$wxhandler.catch_wxsdk().then((wxsdk) => {

    // 配置对象返回后，可以进行简单的配置信息修改操作
    wxsdk.wxconfig.setDebug(true)
    // 添加分享朋友圈和好友分享的相关权限。
    wxsdk.wxconfig.addApiList("updateAppMessageShareData")
    wxsdk.wxconfig.addApiList("updateTimelineShareData")

    // 配置并返回新的 Promise ，接下来就可以通过wxsdk.wx 访问微信JSSDK对象了。
    return wxsdk.wxConfig()
}).then((wxsdk) => {
    // 配置信息如果没有问题就会进入这里，举例中配置的是微信好友分享的相关信息。
    wxsdk.wx.updateAppMessageShareData({
    title: '单独配置标题', // 分享标题
    desc: '单独配置分享内容', // 分享描述
    link: 'https://devhtml.f.hztc.dev.hztcapp.com/h/retobridge.html?to=www.baidu.com', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: 'https://avatar-static.segmentfault.com/254/565/2545659039-5f30eed7cf269_huge256', // 分享图标
        success: function () {
            // 设置成功
            alert("配置成功");
        }
    })
}).catch((err) => {
    throw err
})

```

### 通过统一配置，快速配置全局分享文案

* 为了支持常用的一些场景，可以在配置文件中略加配置即可使用全局分享文案到你的H5中。
* 如下进行举例，完成一个全局的配置功能
* 1、设置全局的分享信息，为默认值也就是 `wxshare.default` 配置段。
* 2、通过 `wxshare.pages` 配置段单独给 `List` 路由页面配置单独的分享title。
* 需要修改Vue 项目的main.js 文件
```

// 定义分享数据信息，这里设置的是全局分享信息
let shareinfo = {
    title: "青听学院：大学生的专属课堂", // 分享标题
    desc: "轻松get就业、学习、创业必备技能", // 分享描述
    link: "https://devhtml.f.hztc.dev.hztcapp.com/h/retobridge.html?to=" + encodeURIComponent("http://devhtml.f.hztc.dev.hztcapp.com/h/h200729/dist/") ,
    imgUrl: "https://avatar-static.segmentfault.com/254/565/2545659039-5f30eed7cf269_huge256'", // 分享图标
    success: function () {
        // alert("这里变成设置成功，也就是现在连最基础的分享动作都无法捕获了，没意义了。")
    },
}


// 使用微信助手连接到Wx-JSSDK
Vue.use(wxhandler, {
    // 这里面的配置信息可能是
    sdkconfig: {
        // 表示使用FEAPI 进行JSSDK 初始化
        usefeapi: {
            // FEAPI 接口配置
            feapiconf: feapiconfig,
            // FEAPI 接口请求信息
            port: {
                ic: CONST_APP_API_CLASS,
                im: "get_jsconf",
            }
        },
        // 通过其他方式进行JSSDK 初始化，这个与 usefeapi 只能一个生效，写两个时候默认 feapi 生效。
        usepromise: undefined,
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
            "List": {
                appmsg: {
                    title: '列表的特殊分享标题。',
                },
                timeline: undefined,
            },
            "Video": {
                // 表示Video 路由生效时跳出微信分享配置
                // 如果这个单页上配置了较为特殊的分享文案，这个操作可以跳出默认的分享文案配置。
                break : true
            }
        },
    },
})


```
* 配置好后会在页面的mounted 方法中进行WxJssdk 的加载和分享信息的配置

#### 单独JSSDK 使用
* JSSDK 可以单独使用，这里继续以常用的微信分享功能举例
* 如果采用这种方式，`wxshare` 配置段落完全可以设置为undefined，也可以同时配置 `wxshare.default` 进行复合使用。
* 警告⚠️：如果复合使用会导致JSSDK 初始化两次，目前这是一个潜在的问题。
```
// 举个栗子：在某个页面定mounted 或者 created 方法中。

this.$wxhandler.catch_wxsdk().then((wxsdk) => {
    // 配置对象返回后，可以进行简单的配置信息修改操作
    wxsdk.wxconfig.setDebug(true)
    // 必须添加，无需外部配置
    wxsdk.wxconfig.addApiList("updateAppMessageShareData")
    wxsdk.wxconfig.addApiList("updateTimelineShareData")

    // 配置JSSDK 对象
    return wxsdk.wxConfig()
}).then((wxsdk) => {
    // wxsdk.wx 就是微信的原生wx对象。
    wxsdk.wx.updateAppMessageShareData({
        title: videoobj.title, // 分享标题
        desc: '超多“芝士点”，快来跟我一起学习~', // 分享描述
        link: `${this.$const.cdnurl}/h/retobridge.html?to=${encodeURIComponent(`${this.$const.cdnurl}${this.$const.appdir}/#/video?vid=${videoobj.id}`)}`,
        imgUrl: `${this.$const.cdnurl}${this.$const.appdir}/imgs/share_icon.png`, // 分享图标
        success: function () {
            // 设置成功
            // alert("配置成功Video");
        }
    })
}).catch((err) => {
    throw err
})

```

### 使用新版本babel

yarn add @babel/plugin-transform-runtime --dev
yarn add @babel/plugin-proposal-class-properties --dev


### 初始化测试


// 初始化配置信息
jest --init
// 添加Babel
yarn add babel-jest --dev
yarn add @babel/core --dev
yarn add @babel/preset-env --dev
yarn add @babel/cli --dev
yarn add anymatch --dev

//    "@vue/cli": "^4.5.4",
//    "anymatch": "^3.1.1"





// 添加 babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
