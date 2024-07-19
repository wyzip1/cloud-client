/**
 *
 * @param {yz} yz
 * @param {() => boolean} isDev
 * @returns
 */
function getRequest(yz, isDev) {
  /**
   * 统一请求方法
   * @param {object} config
   * @param {string} config.url 接口路径
   * @param {object} config.data 请求参数
   * @param {'GET' | 'POST' | 'DELETE' | 'PUT'} config.method 请求类型
   * @param {number} config.timeout 超时时间
   * @param {object} config.header 超时时间
   * @returns {Promise<RequestResponse>}
   */
  return (config) => {
    const dev = isDev();
    return yz
      .request({
        path: config.url,
        method: config.method,
        data: config.data,
        header: config.header,
        timeout: config.timeout,
        dev,
      })
      .then((res) => {
        const errorInfo =
          res.code !== 200
            ? res.message
            : res.data.code !== 200
            ? res.data.message
            : "";

        console.log("");
        console.log("-----------------------------------");
        console.log(`request URL - ${config.method || "GET"}:`, config.url);
        console.log("request params:", { ...config.data, dev });
        console.log(`request ${errorInfo ? "error" : "success"}:`, res);
        console.log("-----------------------------------");
        console.log("");

        if (errorInfo) {
          return Promise.reject(res);
        }

        return res;
      })
      .catch((err) => {
        console.log("");
        console.log("-----------------------------------");
        console.log(`request URL - ${config.method || "GET"}:`, config.url);
        console.log("request params:", config.data);
        console.log("request error:", err);
        console.log("-----------------------------------");
        console.log("");

        // yz.logger.error({
        //   tagName: `${config.method || 'GET'} - ${config.url}`,
        //   message: '接口请求错误',
        //   detail: { ...err, params: config.data  }
        // })
        return Promise.reject(err);
      });
  };
}

export default getRequest;
