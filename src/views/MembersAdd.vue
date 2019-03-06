<template>
  <div class="container">
    <h1 class="page-header text-center">Vue.js CRUD Operation with PHP/MySQLi</h1>
    <p>https://www.sourcecodester.com/tutorials/php/11855/vuejs-insert-data-mysql-database-using-php.html</p>
    <div id="members">
      <div class="col-md-8 col-md-offset-2">
        <div class="row">
          <div class="col-md-12">
            <h2>
              Member List
              <button class="btn btn-primary pull-right" @click="showAddModal = true">
                <span class="glyphicon glyphicon-plus"></span> Add Member
              </button>
            </h2>
          </div>
        </div>

        <div class="alert alert-danger text-center" v-if="errorMessage">
          <button type="button" class="close" @click="clearMessage();">
            <span aria-hidden="true">&times;</span>
          </button>
          <span class="glyphicon glyphicon-alert"></span>
          {{ errorMessage }}
        </div>

        <div class="alert alert-success text-center" v-if="successMessage">
          <button type="button" class="close" @click="clearMessage();">
            <span aria-hidden="true">&times;</span>
          </button>
          <span class="glyphicon glyphicon-ok"></span>
          {{ successMessage }}
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

      <div class="myModal" v-if="showAddModal">
        <div class="modalContainer">
          <div class="modalHeader">
            <span class="headerTitle">Add New Member</span>
            <button class="closeBtn pull-right" @click="showAddModal = false">&times;</button>
          </div>
          <div class="modalBody">
            <div class="form-group">
              <label>Firstname:</label>
              <input type="text" class="form-control" v-model="newMember.firstname">
            </div>
            <div class="form-group">
              <label>Lastname:</label>
              <input type="text" class="form-control" v-model="newMember.lastname">
            </div>
          </div>
          <hr>
          <div class="modalFooter">
            <div class="footerBtn pull-right">
              <button class="btn btn-default" @click="showAddModal = false">
                <span class="glyphicon glyphicon-remove"></span> Cancel
              </button>
              <button class="btn btn-primary" @click="showAddModal = false; saveMember();">
                <span class="glyphicon glyphicon-floppy-disk"></span> Save
              </button>
            </div>
          </div>
        </div>
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
      showAddModal: false,
      errorMessage: false,
      successMessage: false,
      newMember: {},

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
        console.log('response.data.members')
        console.log(response.data.members)
        this.members = response.data.members
      })
      .catch(() => {
        console.log('There was a problem finding members')
      })
  },
  methods: {
    getAllMembers() {
      ContentService.getMembers()
        .then(response => {
          console.log('response.data.members')
          console.log(response.data.members)
          this.members = response.data.members
        })
        .catch(() => {
          console.log('There was a problem finding members')
        })
    },
    toFormData(obj) {
      var form_data = new FormData()
      for (var key in obj) {
        form_data.append(key, obj[key])
      }
      console.log('form_data')
      // Display the key/value pairs
      for (var pair of form_data.entries()) {
        console.log(pair[0] + ', ' + pair[1])
      }
      return form_data
    },
    saveMember() {
     
      var memForm = this.toFormData(this.newMember)
      console.log('memForm')
      console.log(memForm)
      var ref = this
      ContentService.saveMember(memForm).then(function(response) {
        console.log(response)
        ref.newMember = { firstname: '', lastname: '' }
        if (response.data.error) {
          ref.errorMessage = response.data.message
        } else {
          // this.successMessage = response.data.message
          ref.getAllMembers()
        }
      })
    },
    clearMessage() {
      this.errorMessage = ''
      this.successMessage = ''
    }
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
