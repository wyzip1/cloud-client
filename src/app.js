import { registerRequest } from "./api/request";

extendApp({
  onLaunch() {
    console.log("App  onLaunch");

    registerRequest(yz, () => this.isDev());
  },
  methods: {
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
