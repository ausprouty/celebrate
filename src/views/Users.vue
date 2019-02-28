<template>
  <div id="myapp">
    <NavBar/>
    <table border="1" width="80%" style="border-collapse: collapse;">
      <tr>
        <th>Username</th>
        <th>Name</th>
        <th>Email</th>
        <th></th>
      </tr>

      <!-- Add -->
      <tr>
        <td>
          <input type="text" v-model="username">
        </td>
        <td>
          <input type="text" v-model="name">
        </td>
        <td>
          <input type="text" v-model="email">
        </td>
        <td>
          <input type="button" value="Add" @click="addRecord();">
        </td>
      </tr>

      <!-- Update/Delete -->
      <tr v-for="(user,index) in users">
        <td>
          <input type="text" v-model="user.username">
        </td>
        <td>
          <input type="text" v-model="user.name">
        </td>
        <td>
          <input type="text" v-model="user.email">
        </td>
        <td>
          <input type="button" value="Update" @click="updateRecord(index,user.id);">&nbsp;
          <input type="button" value="Delete" @click="deleteRecord(index,user.id)">
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import axios from 'axios'
import NavBar from '@/components/NavBarAdmin.vue'
export default {
  components: {
    NavBar
  },
  data() {
    return {
      users: '',
      userid: 0,
      username: '',
      name: '',
      email: ''
    }
  },
  methods: {
    allRecords: function() {
      axios
        .post('ajaxfile.php', {
          request: 1
        })
        .then(function(response) {
          app.users = response.data
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    addRecord: function() {
      if (this.username != '' && this.name != '' && this.email != '') {
        axios
          .post('src/services/ajaxfile.php', {
            request: 2,
            username: this.username,
            name: this.name,
            email: this.email
          })
          .then(function(response) {
            // Fetch records
            app.allRecords()

            // Empty values
            app.username = ''
            app.name = ''
            app.email = ''

            alert(response.data)
          })
          .catch(function(error) {
            console.log(error)
          })
      } else {
        alert('Fill all fields.')
      }
    },
    updateRecord: function(index, id) {
      // Read value from Textbox
      var name = this.users[index].name
      var email = this.users[index].email

      if (name != '' && email != '') {
        axios
          .post('src/services/ajaxfile.php', {
            request: 3,
            id: id,
            name: name,
            email: email
          })
          .then(function(response) {
            alert(response.data)
          })
          .catch(function(error) {
            console.log(error)
          })
      }
    },
    deleteRecord: function(index, id) {
      axios
        .post('src/services/ajaxfile.php', {
          request: 4,
          id: id
        })
        .then(function(response) {
          // Remove index from users
          app.users.splice(index, 1)
          alert(response.data)
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  },
  created() {
    this.allRecords()
  }
}
</script>
