<template>
  <div class="container">
    <h1 class="page-header text-center">https://www.sourcecodester.com/tutorials/php/11853/vuejs-fetch-data-mysql-database-using-php.html</h1>
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
import DataService from '@/services/DataService.js'
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
    DataService.getMembers()
      .then(response => {
        this.members = response.data.members
      })
      .catch(() => {
        console.log('There was a problem finding members')
      })
  }
}
</script>
