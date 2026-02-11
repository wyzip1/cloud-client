import registerRequestApi from "./api/index";
import registerSdkGenApi from "./api/sdk.gen";
import getRequest from "./api/request";

extendApp({
  onLaunch() {
    yz.console.log("App  onLaunch");
    this._customRequest = getRequest(yz, () => this.isDev());
    this.api = {
      ...registerRequestApi(this._customRequest, yz, () => this.isDev()),
      ...registerSdkGenApi(this._customRequest, yz, () => this.isDev()),
    };
  },
  methods: {
    getApi() {
      return this.api;
    },
    customRequest(config) {
      return this._customRequest(config);
    },
    getCustomUrl(key, options) {
      return yz.getCustomPageUrl(key, { dev: this.isDev(), ...options });
    },
    isDev() {
      const { shop = {} } = this.yz.data || {};
      const devKdtIds = [];
      return devKdtIds.includes(shop.kdtId);
    },
  },
});
