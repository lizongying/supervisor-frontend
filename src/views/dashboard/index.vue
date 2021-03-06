<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <el-select v-model="server" placeholder="server">
          <el-option v-for="item in servers" :key="item" :label="item" :value="item" />
        </el-select>
        <div style="position: relative; display: inline-block; width: 195px">
          <el-select v-model="rule" placeholder="group" style="position: absolute; left: 0">
            <el-option v-for="item in rules" :key="item" :label="item" :value="item" />
          </el-select>
          <el-input v-model="rule" clearable placeholder="group" style="width: 160px" />
        </div>
        <el-button type="primary" @click="onSave">Save filter</el-button>
        <el-button @click="onDelete">Delete filter</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :title="dialogTitle"
      :visible="dialogTableVisible"
      :modal-append-to-body="false"
      :show-close="true"
      :before-close="dialogCancel"
    >
      <pre style="white-space: pre-wrap; word-wrap: break-word; color: rgb(191, 203, 217); background-color: rgb(48, 65, 86);">
        {{ dialogContent }}
      </pre>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">Cancel</el-button>
      </div>
    </el-dialog>
    <el-table
      v-loading="listLoading"
      :data="listFitler"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'group', order: 'ascending'}"
    >
      <el-table-column label="ID" width="50" align="center" fixed="left">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column prop="group" sortable label="Group">
        <template slot-scope="scope">
          {{ scope.row.group }}
        </template>
      </el-table-column>
      <el-table-column prop="start" sortable label="StartTime" width="190" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ formatDate(scope.row.start) }}
        </template>
      </el-table-column>
      <el-table-column prop="stop" sortable label="StopTime" width="190" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ formatDate(scope.row.stop) }}
        </template>
      </el-table-column>
      <el-table-column prop="statename" sortable label="State" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.statename | statusFilter">{{ scope.row.statename }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Operation" width="400" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tag :style="{visibility: scope.row.statename === RUNNING ? 'visible' : 'hidden'}" class="operation" type="blue" @click="restart(scope.row.idx)">RESTART</el-tag>
          <el-tag :style="{visibility: scope.row.statename === STOPPED || scope.row.statename === BACKOFF ? 'visible' : 'hidden'}" class="operation" type="blue" @click="start(scope.row.idx)">START</el-tag>
          <el-tag :style="{visibility: scope.row.statename === RUNNING ? 'visible' : 'hidden'}" class="operation" type="blue" @click="stop(scope.row.idx)">STOP</el-tag>
          <el-tag class="operation" type="blue" @click="fresh(scope.row.idx)">FRESH</el-tag>
          <el-tag class="operation" type="blue" @click="out(scope.row.idx)">OUT</el-tag>
          <el-tag class="operation" type="blue" @click="err(scope.row.idx)">ERR</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getConfig, getList, start, status, stop, restart, stdOut, stdErr } from '@/api/supervisor'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        RUNNING: 'success',
        BACKOFF: 'gray',
        STARTING: 'gray',
        STOPPING: 'gray',
        STOPPED: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      RUNNING: 'RUNNING',
      STOPPED: 'STOPPED',
      BACKOFF: 'BACKOFF',
      list: null,
      listLoading: true,
      rule: '.+',
      rules: new Set(['.+']),
      server: '',
      servers: [],
      dialogTableVisible: false,
      dialogTitle: '',
      dialogContent: ''
    }
  },
  computed: {
    listFitler: function() {
      if (this.list) {
        const re = new RegExp(this.rule)
        const sr = this.server
        return this.list.filter((item) => {
          return item.server === sr && re.test(item.group)
        })
      } else {
        return null
      }
    }

  },
  mounted() {
    if (localStorage.rules && localStorage.rules !== '{}') {
      this.rules = new Set(JSON.parse(localStorage.rules))
    }
    if (localStorage.rule) {
      this.rule = localStorage.rule
    }
    if (localStorage.server) {
      this.server = localStorage.server
    }
  },
  created() {
    this.fetchConfig()
    this.fetchData()
  },
  methods: {
    fetchConfig() {
      this.listLoading = true
      getConfig().then(response => {
        this.servers = response.data.supervisorList.map((item, idx) => {
          item = item.name
          return item
        })
        this.listLoading = false
      })
    },
    fetchData() {
      this.listLoading = true
      const params = {}
      getList(params).then(response => {
        this.list = response.data.map((item, idx) => {
          item.idx = idx
          return item
        })
        this.listLoading = false
      })
    },
    fresh(idx) {
      this.listLoading = true
      const params = {
        server: this.server,
        group: this.list[idx].group,
        name: this.list[idx].name
      }
      status(params).then(response => {
        response.data.idx = idx
        this.$set(this.list, idx, response.data)
        this.listLoading = false
        this.$message(this.list[idx].group + ' fresh!')
      })
    },
    out(idx) {
      this.listLoading = true
      const params = {
        server: this.server,
        group: this.list[idx].group,
        name: this.list[idx].name
      }
      stdOut(params).then(response => {
        this.dialogTitle = this.list[idx].group
        this.dialogTableVisible = true
        this.dialogContent = response.data.log
        this.listLoading = false
        this.$message(this.list[idx].group + ' ok!')
      })
    },
    err(idx) {
      this.listLoading = true
      const params = {
        server: this.server,
        group: this.list[idx].group,
        name: this.list[idx].name
      }
      stdErr(params).then(response => {
        this.dialogTitle = this.list[idx].group
        this.dialogTableVisible = true
        this.dialogContent = response.data.log
        this.listLoading = false
        this.$message(this.list[idx].group + ' ok!')
      })
    },
    stop(idx) {
      this.listLoading = true
      const params = {
        server: this.server,
        group: this.list[idx].group,
        name: this.list[idx].name
      }
      stop(params).then(response => {
        response.data.idx = idx
        this.$set(this.list, idx, response.data)
        this.listLoading = false
        this.$message(this.list[idx].group + ' stopped!')
      })
    },
    start(idx) {
      this.listLoading = true
      const params = {
        server: this.server,
        group: this.list[idx].group,
        name: this.list[idx].name
      }
      start(params).then(response => {
        response.data.idx = idx
        this.$set(this.list, idx, response.data)
        this.listLoading = false
        this.$message(this.list[idx].group + ' started!')
      })
    },
    restart(idx) {
      this.listLoading = true
      const params = {
        server: this.server,
        group: this.list[idx].group,
        name: this.list[idx].name
      }
      restart(params).then(response => {
        response.data.idx = idx
        this.$set(this.list, idx, response.data)
        this.listLoading = false
        this.$message(this.list[idx].group + ' restarted!')
      })
    },
    formatDate: function(v) {
      v = parseInt(v) * 1000
      return (new Date(v)).toISOString().substring(0, 19).replace(/T/, ' ')
    },
    onSave: function() {
      this.rules.add(this.rule)
      this.rules = new Set(Array.from(this.rules))
      localStorage.rules = JSON.stringify(Array.from(this.rules))
      localStorage.rule = this.rule
      localStorage.server = this.server
    },
    onDelete: function() {
      this.rules.delete(this.rule)
      this.rules = new Set(Array.from(this.rules))
      localStorage.rules = JSON.stringify(Array.from(this.rules))
      this.rule = '.+'
      localStorage.rule = this.rule
      this.server = this.servers[0]
      localStorage.server = this.servers[0]
    },
    dialogCancel: function() {
      this.dialogTableVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .operation {
    cursor: pointer;
  }
</style>
