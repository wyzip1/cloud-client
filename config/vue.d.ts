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
      getApi: () => ReturnType<typeof registerRequestApi>
      customRequest: CustomRequest
    }
  
    $getPageQuery: () => Record<string, any>
  }
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