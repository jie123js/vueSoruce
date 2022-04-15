<template>
  <div id="app">
    <!-- <ClickOutside></ClickOutside> -->
    <!-- <Lazy></Lazy> -->

    <lazy></lazy>
  </div>
</template>
<script>
import ClickOutside from "@/components/click-outside.vue";
import Form from "@/components/form.vue";
import Lazy from "./components/lazy.vue";
// import Lazy from '@/components/lazy.vue'
export default {
  components: {
    Form,
    Lazy,

    // ClickOutside
    // Lazy
  },
};
</script>
