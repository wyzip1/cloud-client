/**
 *
 * @param {import("../../config/vue").CustomRequest} request
 * @param {yz} yz
 * @param {() => boolean} isDev
 * @returns
 */
export default function registerRequestApi(request, yz, isDev) {
  // 上传图片
  const uploadImg = (filePath, formData = {}) => {
    return yz
      .uploadFile({
        path: "/api/v1/client/material/image/upload",
        filePath,
        formData,
        fileType: "image",
        dev: isDev(),
      })
      .then((res) => {
        try {
          res.data = JSON.parse(res.data || null);
          if (res.code !== 200 || (res.data || {}).code !== 200)
            return Promise.reject(res);
          return res.data;
        } catch (error) {
          return res;
        }
      });
  };

  return {
    uploadImg,
  };
}
