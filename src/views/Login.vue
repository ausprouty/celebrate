<template>
  <div>
    <NavBar />
    <h2>Login</h2>
    <form @submit.prevent="saveForm">
      <BaseInput
        v-model="username"
        label="Username"
        type="text"
        placeholder
        class="field"
        :class="{ error: $v.username.$error }"
        @blur="$v.username.$touch()"
      />
      <template v-if="$v.username.$error">
        <p v-if="!$v.username.required" class="errorMessage">
          Username is required.
        </p>
      </template>

      <BaseInput
        v-model="password"
        label="Password"
        type="password"
        placeholder
        class="field"
        :class="{ error: $v.password.$error }"
        @blur="$v.password.$touch()"
      />
      <template v-if="$v.password.$error">
        <p v-if="!$v.password.required" class="errorMessage">
          Password is required.
        </p>
      </template>
      <br />
      <br />
      <button class="button red" @click="saveForm">Login</button>
      <template v-if="wrong">
        <p class="errorMessage">Wrong username or password. Try again</p>
      </template>
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
      username: null,
      password: null,
      submitted: false,
      wrong: null
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
        let res = await AuthorService.login(params)
        console.log('res from Author Service')
        console.log(res)
        if (res.data.content) {
          response.firstname = res.data.content.firstname
          response.lastname = res.data.content.lastname
          response.scope = res.data.content.countries
          response.uid = res.data.content.uid
          response.token = res.data.token

          this.$store.dispatch('loginUser', [response])
          this.$router.push({
            name: 'previewCountries'
          })
        } else {
          this.wrong = true
        }
      } catch (error) {
        console.log('Login There was an error ', error) //
      }
    }
  }
}
</script>
