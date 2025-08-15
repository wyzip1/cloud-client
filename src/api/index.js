import request from "./request"

export const test = () => {
  return request({
    url: '/test',
    method: "GET",
    data: { name: '123' }
  })
}
