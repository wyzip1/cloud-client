```js
// index.js
import createStore from "../../utils/store/index";

createPage({
  // 页面配置项
  config: {
    navigationBarTitleText: "测试页面",
    enablePullDownRefresh: false,
  },
  // 生命周期回调 —— 在页面初始化时执行，建议进行事件/勾子注册
  created() {
    createStore(this, { name: "123" });
  },
})
```


```html
<!-- page.vue -->
<template>
  <view>
    <input :value="name" @input="onChange" />
  </view>
</template>

<script>
import { setState, useState } from "../../utils/store/index";

export default {
  name: "user-child",
  data() {
    return {
      name: "",
    };
  },
  created() {
    useState(this, ["name"]);
  },
  methods: {
    onChange({ value }) {
      setState(this, { name: value })
    }
  }
}
</script>
```