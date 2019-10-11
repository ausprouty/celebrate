<template>
  <div>

    <div v-if="!this.authorized">
      <p>
        You have stumbled into a restricted page. Sorry I can not show it to you
        now
      </p>
    </div>
    <div v-if="this.authorized">
      <UserList v-for="user in users" :key="user.uid" :user="user" />
    </div>
  </div>
</template>

<script>
import AuthorService from '@/services/AuthorService.js'
import UserList from '@/components/UserList.vue'
import { authorMixin } from '@/mixins/AuthorMixin.js'

export default {
  components: {
    UserList
  },
  
  mixins: [authorMixin],
  data() {
    return {
      authorized: false,
      users: [
        {
          firstname: null,
          lastname: null,
          countries: null,
          uid: null
        }
      ]
    }
  },
  async created() {
    this.authorized = this.authorize('register', 'global')
    if (this.authorized) {
      try {
        var params = {}
        params.scope = '*'
        this.users = await AuthorService.getUsers(params)
        console.log(this.users)
      } catch (error) {
        console.log('There was an error in Countries.vue:', error) // Logs out the error
      }
    }
  }
}
</script>
