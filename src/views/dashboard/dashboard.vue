<template>
  <div class="app-container">
   <h1>欢迎来到基于物联网的化工区数据监控管理系统</h1>
  </div>
</template>

<script>

import nxDataDisplay from '@/components/nx-data-display/nx-data-display'
import nxDataCard from '@/components/nx-data-card/nx-data-card'
import nxDataTabs from '@/components/nx-data-tabs/nx-data-tabs'
import nxDataIcons from '@/components/nx-data-icons/nx-data-icons'
import nxGithubCorner from '@/components/nx-github-corner'
export default {
  name: 'report',
  components: {
    nxDataDisplay,
    nxDataCard,
    nxDataTabs,
    nxDataIcons,
    nxGithubCorner

  },
  data() {
    return {




    }
  },
  created() {},
  watch: {},
  mounted() {},
  computed: {}
}
</script>

<style scoped>
.item {
  margin-bottom: 16px;
}
</style>
<style lang ="scss">
    @import '../../styles/data-card.scss';
    @import '../../styles/data-display.scss';
    @import '../../styles/data-icons.scss';
    @import '../../styles/data-tabs.scss';
</style>
