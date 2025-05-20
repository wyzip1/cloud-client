<template>
  <view>
    {{ watchShow || "" }}
    <t-popup :show="show" position="bottom" @close="handleClose" :round="true">
      <view class="title">
        <text>{{ title }}</text>
        <view class="cancel">
          <t-icon name="cross" @click="handleClose" />
        </view>
      </view>
      <view class="content">
        <view
          @click="toggleSelect(item)"
          v-for="item in options"
          :key="item.value"
          :class="{
            'select-item': true,
            disabled: item.disabled,
            active: checkedMap[item.value],
          }"
        >
          <view class="text">{{ item.label }}</view>
          <view class="disabled-text" v-if="item.disabled">
            {{ item.disabledText }}
          </view>
          <t-icon
            v-if="checkedMap[item.value]"
            name="checked"
            class="checked"
          />
          <view class="desc">{{ item.desc }}</view>
        </view>
      </view>
      <view class="footer-control" v-if="mode === 'checkbox'">
        <t-checkbox
          checked-color="#E64C3D"
          :value="checkedAll"
          @change="onChangeCheckedAll"
        >
          全选
        </t-checkbox>
        <t-button
          color="#E64C3D"
          custom-style="width: 184px"
          :round="true"
          @click="confirm"
          :disabled="!selectList.length"
          >确认
        </t-button>
      </view>
    </t-popup>
  </view>
</template>

<script>
import { Icon, Button, Checkbox, Popup } from "@youzan-cloud/tee-ui";

export default {
  components: {
    "t-icon": Icon,
    "t-button": Button,
    "t-checkbox": Checkbox,
    "t-popup": Popup,
  },
  props: {
    show: Boolean,
    title: String,
    value: Array,
    options: Array,
    mode: { type: String, default: "checkbox" },
  },
  data() {
    return {
      selectList: [],
    };
  },
  computed: {
    watchShow() {
      if (this.show) {
        this.initData();
      }

      return null;
    },
    checkedMap() {
      const map = {};
      this.selectList.forEach((item) => {
        map[item.value] = true;
      });
      return map;
    },
    checkedAll() {
      return (
        this.selectList?.length >=
        this.options.filter((v) => !v.disabled)?.length
      );
    },
  },
  methods: {
    initData() {
      this.selectList = [...(this.value || [])];
    },
    toggleSelect(item) {
      if (item.disabled) return;
      const value = this.mode === "checkbox" ? [...this.selectList] : [item];
      if (this.mode === "checkbox") {
        const itemIdx = value.findIndex((data) => data.value === item.value);
        itemIdx > -1 ? value.splice(itemIdx, 1) : value.push(item);
      }
      this.$emit("change", value);
      this.selectList = value;
      if (this.mode === "radio") this.confirm();
    },
    onChangeCheckedAll() {
      const value = !this.checkedAll
        ? this.options.filter((item) => !item.disabled)
        : [];
      this.selectList = value;
    },
    handleClose() {
      this.$emit("close");
    },

    confirm() {
      this.$emit("confirm", this.selectList);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  height: 50px;
  line-height: 50px;
  position: relative;
  font-size: 16px;
  font-weight: bold;
}

.title .cancel {
  position: absolute !important;
  top: 0;
  right: 10px;
  font-size: 12px !important;
  color: #969799;
  padding: 0 5px;
  font-weight: normal;
}

.content {
  max-height: 50vh;
  overflow: auto;
}

.select-item {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  font-size: 14px;
  flex-wrap: wrap;
}

.select-item.active {
  color: #e64c3d;
}

.select-item.disabled {
  filter: grayscale(1);
  color: #999;
}

.select-item .desc {
  width: 100%;
  font-size: 12px;
  color: #999;
}

.checked {
  display: none;
}

.select-item.active .checked {
  display: block;
}

.hover {
  filter: brightness(90%);
}

.footer-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 50px;
}

.disabled-text {
  font-size: 12px;
}
</style>
