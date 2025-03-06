<template>
  <el-dialog v-model="globalVars.dialogCoffee" :width="globalVars.dialogWidth">
    <div class="dialogCoffee_content">
      <el-image
        class="dialogCoffee_logo"
        :src="require('../../assets/coffee.png')"
        fit="cover"
      />
      <div class="dialogCoffee_main">
        <div class="dialogCoffee_title">打赏一杯咖啡</div>
        <div class="dialogCoffee_text">
          非常感谢大家使用
          MyIcon，目前项目已经开源，为了保证网站能够持续地提供给大家高质量的服务，我们需要您的帮助！
        </div>
        <div class="dialogCoffee_text">
          您的捐款将有助于我们支付网站的运营成本，改进网站的功能和设计，并提高每位用户的使用体验。
        </div>
        <div class="dialogCoffee_text">
          您的支持，也将成为我们不断前行、持续创新的动力！
        </div>
        <div class="dialogCoffee_amount">
          <el-button
            @click="handleClick(5)"
            :color="data.index == 5 ? '#e6a23c' : ''"
            :style="{ color: data.index == 5 ? '#fff' : '' }"
            >5</el-button
          >
          <el-button
            @click="handleClick(10)"
            :color="data.index == 10 ? '#e6a23c' : ''"
            :style="{ color: data.index == 10 ? '#fff' : '' }"
            >10</el-button
          >
          <el-button
            @click="handleClick(20)"
            :color="data.index == 20 ? '#e6a23c' : ''"
            :style="{ color: data.index == 20 ? '#fff' : '' }"
            >20</el-button
          >
          <el-button
            @click="handleClick(50)"
            :color="data.index == 50 ? '#e6a23c' : ''"
            :style="{ color: data.index == 50 ? '#fff' : '' }"
            >50</el-button
          >
          <el-button
            @click="handleClick(0)"
            :color="data.index == 0 ? '#e6a23c' : ''"
            :style="{ color: data.index == 0 ? '#fff' : '' }"
            >自定义</el-button
          >
        </div>
        <div class="dialogCoffee_qrcode">
          <el-image :src="require('../../assets/pay' + data.index + '.jpg')" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from "vue";

export default defineComponent({
  setup() {
    const globalVars = inject("globalVars") as any;
    const data = reactive({
      index: 5,
    });

    function handleClick(index) {
      data.index = index;
    }

    return {
      globalVars,
      data,
      handleClick,
    };
  },
});
</script>

<style lang="scss">
.dialogCoffee_content {
  display: flex;
  margin-top: -16px;
  padding-bottom: 10px;
}
.dialogCoffee_logo {
  width: 50px;
  height: 50px;
  margin-right: 20px;
}
.dialogCoffee_main {
  width: calc(100% - 70px);
}
.dialogCoffee_title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 20px;
}
.dialogCoffee_text {
  margin-bottom: 10px;
}
.dialogCoffee_amount {
  margin-top: 30px;
}
.dialogCoffee_amount .el-button {
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}
.dialogCoffee_amount .el-button:hover {
  background-color: #e6a23ca6;
  border-color: #e6a23ca6;
  color: #fff;
}
.dialogCoffee_qrcode {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-left: -70px;
}
.dialogCoffee_qrcode .el-image {
  width: 120px;
  height: 120px;
  margin: 0 20px;
}
</style>
