<template>
  <view class="form-textarea-wrap">
    <!-- :autosize="{ maxHeight: 100, minHeight: 100 }" autosize小程序无效暂时用input-class -->
    <t-field
      type="textarea"
      :value="value"
      :placeholder="placeholder"
      :maxlength="500"
      :autosize="{ maxHeight: 100, minHeight: 100 }"
      input-class="form-textarea"
      custom-style="background-color: transparent; padding:0; width:100%; "
      placeholder-style="font-size: 14px; color: #dddddd; line-height: 18px;"
      @change="onChange"
      :disabled="disabled"
    />
  </view>
</template>

<script>
import { Field } from "@youzan-cloud/tee-ui";
export default {
  components: {
    "t-field": Field,
  },
  props: {
    pid: {
      type: String,
      default: "base",
    },
    name: String,
    placeholder: String,
    disabled: Boolean,
  },
  data() {
    return { value: null };
  },
  created() {
    yz.event.trigger(
      "form-item-input" + "-" + this.pid + "-" + this.name,
      (parent) => {
        this._parent = parent;
        return this;
      }
    );
  },
  methods: {
    onChange(e) {
      this._parent.formChange(e.detail?.value || e.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-textarea-wrap {
  padding: 4px 8px;
  border-radius: 4px;

  box-sizing: border-box;
  background-color: #f7f8fa;
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
}
.form-textarea {
  width: 100%;
  font-size: 14px;
  border: none;
  height: 100px;
  &::placeholder {
    font-size: 14px;
    color: #dddddd;
  }
}

.custom-placeholder {
  font-size: 14px;
  color: #dddddd;
  line-height: 18px;
}
</style>
