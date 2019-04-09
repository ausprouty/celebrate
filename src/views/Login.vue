<template>
  <div>
    <NavBar/>
    <h2>Login</h2>
    <form @submit.prevent="saveForm">
      <BaseInput
        v-model="username"
        label="Username"
        type="text"
        placeholder
        class="field"
        :class="{ error: $v.username.$error}"
        @blur="$v.username.$touch()"
      />
      <template v-if="$v.username.$error">
        <p v-if="!$v.username.required" class="errorMessage">Username is required.</p>
      </template>

      <BaseInput
        v-model="password"
        label="Password"
        type="text"
        placeholder
        class="field"
        :class="{ error: $v.password.$error}"
        @blur="$v.password.$touch()"
      />
      <template v-if="$v.password.$error">
        <p v-if="!$v.password.required" class="errorMessage">Password is required.</p>
      </template>
      <br>
      <br>
      <div v-if="!$v.$anyError">
        <button class="button red" @click="saveForm">Login</button>
      </div>
      <div v-if="$v.$anyError">
        <button class="button grey">Disabled</button>
        <p v-if="$v.$anyError" class="errorMessage">Please fill out the required field(s).</p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AuthorService from '@/services/AuthorService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { required } from 'vuelidate/lib/validators'

export default {
  components: {
    NavBar
  },
  data() {
    return {
      username: '',
      password: '',
      submitted: false
    }
  },
  computed: mapState(['user']),
  validations: {
    username: { required },
    password: { required }
  },
  created() {},
  methods: {
    async saveForm() {
      try {
        var params = {}
        var response = {}
        params.username = this.username
        params.password = this.password
        console.log('params')
        console.log(params)
        let res = await AuthorService.getUser(params)
        console.log('res')
        console.log(res)

        response.firstname = res.data.content.firstname
        response.lastname = res.data.content.lastname
        response.scope = res.data.content.countries
        response.uid = res.data.content.uid

        this.$store.dispatch('loginUser', [response])
        this.$router.push({
          name: 'previewCountries'
        })
      } catch (error) {
        console.log('Login There was an error ', error) //
      }
    }
  }
}
</script>
