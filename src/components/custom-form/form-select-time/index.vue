<template>
  <view>
    <select-time
      type="date"
      :value="value"
      :defaultValue="defaultValue"
      :minDate="minDate"
      :maxDate="maxDate"
      placeholder="请选择日期"
      @change="onChange"
    />
  </view>
</template>

<script>
import { setFormState, useFormWatch } from "../utils";
import selectTime from "./select-time.vue";
export default {
  name: "form-select-time",
  components: { selectTime },
  props: {
    pid: {
      type: String,
      default: "base",
    },
    minDate: {
      type: Number,
      default: () => new Date("1980/01/01 00:00:00").getTime(),
    },
    maxDate: {
      type: Number,
      default: () => new Date("2050/01/01 00:00:00").getTime(),
    },
    defaultValue: null,
    name: String,
  },
  data() {
    return {
      value: null,
    };
  },
  created() {
    useFormWatch(this.name, this, (value) => {
      this.value = value;
    });
  },
  methods: {
    onChange(e) {
      setFormState(this, { [this.name]: e.detail || e });
    },
  },
};
</script>

<style lang="scss" scoped></style>
