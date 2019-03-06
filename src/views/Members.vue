<template>
  <div class="container">
    <h1
      class="page-header text-center"
    >https://www.sourcecodester.com/tutorials/php/11853/vuejs-fetch-data-mysql-database-using-php.html</h1>
    <div id="ourmembers">
      <div class="col-md-8 col-md-offset-2">
        <div class="row">
          <div class="col-md-12">
            <h2>
              Member List
              <button class="btn btn-primary pull-right">
                <span class="glyphicon glyphicon-plus"></span> Member
              </button>
            </h2>
          </div>
        </div>
        <table class="table table-bordered table-striped">
          <thead>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Action</th>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.memid" :member="member">
              <td>{{ member.firstname }}</td>
              <td>{{ member.lastname }}</td>
              <td>
                <button class="btn btn-success">
                  <span class="glyphicon glyphicon-edit"></span> Edit
                </button>
                <button class="btn btn-danger">
                  <span class="glyphicon glyphicon-trash"></span> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import ContentService from '@/services/ContentService.js'
import NavBar from '@/components/NavBarAdmin.vue'
export default {
  data() {
    return {
      members: [],
      member: [],
      Xmembers: [
        {
          0: '1',
          1: 'neovic',
          2: 'devierte',
          memid: '1',
          firstname: 'DataNeovic',
          lastname: 'Datea Devierte'
        },
        {
          0: '2',
          1: 'gemalyn',
          2: 'cepe',
          memid: '2',
          firstname: 'DataGemalyn',
          lastname: 'DataCepe'
        }
      ]
    }
  },
  created() {
    ContentService.getMembers()
      .then(response => {
        this.members = response.data.members
      })
      .catch(() => {
        console.log('There was a problem finding members')
      })
  }
}
</script>

<style scoped>
.myModal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.modalContainer {
  width: 555px;
  background: #ffffff;
  margin: auto;
  margin-top: 50px;
}

.modalHeader {
  padding: 10px;
  background: #008cba;
  color: #ffffff;
  height: 50px;
  font-size: 20px;
  padding-left: 15px;
}

.modalBody {
  padding: 40px;
}

.modalFooter {
  height: 36px;
}

.footerBtn {
  margin-right: 10px;
  margin-top: -9px;
}

.closeBtn {
  background: #008cba;
  color: #ffffff;
  border: none;
}
</style>
