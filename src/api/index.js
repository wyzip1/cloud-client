/**
 *
 * @param {import("../../config/vue").CustomRequest} request
 * @returns
 */
export default function registerRequestApi(request) {
  /**
   * 
   * @param {object} data
   * @param {number} data.pageNum
   * @param {number} data.pageSize
   * @param {string} data.yzOpenId
   * @returns {Promise<RequestResponse>}
   */
  const testRequest = (data) => {
    return request({
      url: "/test",
      method: "GET",
      data,
    });
  }

  return {
    testRequest
  }
}
