import registerRequestApi from "./api/index";
import getRequest from "./api/request";

extendApp({
  onLaunch() {
    console.log("App  onLaunch");
    this._customRequest = getRequest(yz, () => this.isDev());
    this.api = registerRequestApi(this._customRequest);
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
      const devKdtIds = []
      return devKdtIds.includes(shop.kdtId);
    },
  },
});
