import type Vue from 'vue'
import registerRequestApi from '../src/api/index';
import getRequest from '../src/api/request';

type CustomRequest = ReturnType<typeof getRequest>;

declare global {
  interface YzPageApi {
    data: {
      user: {
        info: {
          mobile: string
          gender: number
          yzOpenId: string
          avatar?: string;
          nickname?: string;
        },
        state: {
          protocol: boolean
          mobile: boolean
          nicknameAndAvatar: boolean
        }
      },
      shop: {
        kdtId: number	    // 店铺id	-
        shopName: string	  // 店铺名称	-
        logo: string	      // 店铺logo	-
      },
      appStyle: {
        style: string;
        config: {}
      }
    },
    app: {
      getCustomUrl: (path: string) => string
      isDev: () => boolean
    }
  
    getPageQuery: () => Record<string, any>
  }


  function extendPage(config: {
    created(this: { yz: YzPageApi }, options: object): void;
    onShow(this: { yz: YzPageApi }): void;
    onHide(this: { yz: YzPageApi }): void;
    beforeMount(this: { yz: YzPageApi }, options: Record<string, any>): void;
    mounted(this: { yz: YzPageApi }): void;
    dataReady(this: { yz: YzPageApi }): void;
    destroyed(this: { yz: YzPageApi }): void;
    methods: Record<string, (this: { yz: YzPageApi }, ...args: any[]) => any>;
  }): any

  function extendApp(config: {
    // 监听应用初始化生命周期
    onLaunch(this: { yz: YzPageApi }, options: object): void;
    // 监听应用切换至前台生命周期
    onShow(this: { yz: YzPageApi }, options: object): void;
    // 监听应用切换至后台生命周期
    onHide(this: { yz: YzPageApi }): void;
    // 应用级别自定义方法（部分原生应用钩子也需放置到此处，以保证正确的上下文）
    methods: Record<string, (this: { yz: YzPageApi }, ...args: any[]) => any>;
  }): any

  function createPage(config: {
    created(this: { yz: YzPageApi }, options: object): void;
    onShow(this: { yz: YzPageApi }): void;
    onHide(this: { yz: YzPageApi }): void;
    beforeMount(this: { yz: YzPageApi }, options: Record<string, any>): void;
    mounted(this: { yz: YzPageApi }): void;
    destroyed(this: { yz: YzPageApi }): void;
    methods: Record<string, Function>;
    // 小程序分享配置项。H5 不支持
    onShareAppMessage(this: { yz: YzPageApi }, options: { form: 'button' | 'menu', target?: "button", webViewUrl?: string }): {
      title?: string;
      path?: string;
      imageUrl?: string;
      promise: Promise<{
        title?: string;
        path?: string;
        imageUrl?: string
      }>
    }
    // 小程序下拉刷新事件。H5 不支持
    onPullDownRefresh(this: { yz: YzPageApi }): void;
    // 小程序上拉触底事件。H5 不支持
    onReachBottom(this: { yz: YzPageApi }): void
    // 小程序页面滚动事件。H5 不支持
    onPageScroll(this: { yz: YzPageApi }, ...args: any[]): void
    render: (h: any) => any
  })
}

// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    yz: YzPageApi
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    dataReady?: () => any;
  }
}