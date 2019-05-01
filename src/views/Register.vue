<template>
  <div>
    <NavBar/>
    <div v-if="!this.authorized">
      <p>You have stumbled into a restricted page. Sorry I can not show it to you now</p>
    </div>
    <div v-if="this.authorized">
      <h2>Register</h2>
      <form @submit.prevent="saveForm">
        <BaseInput
          v-model="firstname"
          label="First Name"
          type="text"
          placeholder
          class="field"
          :class="{ error: $v.firstname.$error}"
          @blur="$v.firstname.$touch()"
        />
        <template v-if="$v.firstname.$error">
          <p v-if="!$v.firstname.required" class="errorMessage">First name is required.</p>
        </template>

        <BaseInput
          v-model="lastname"
          label="Last Name"
          type="text"
          placeholder
          class="field"
          :class="{ error: $v.lastname.$error}"
          @blur="$v.firstname.$touch()"
        />
        <template v-if="$v.lastname.$error">
          <p v-if="!$v.lastname.required" class="errorMessage">Last name is required.</p>
        </template>

        <BaseInput
          v-model="countries"
          label="Scope"
          type="text"
          placeholder="|AU|FR|"
          class="field"
          :class="{ error: $v.countries.$error}"
          @blur="$v.countries.$touch()"
        />
        <template v-if="$v.countries.$error">
          <p v-if="!$v.countries.required" class="errorMessage">Scope is required.</p>
        </template>

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
          type="password"
          placeholder
          class="field"
          :class="{ error: $v.password.$error}"
          @blur="$v.password.$touch()"
        />
        <template v-if="$v.password.$error">
          <p v-if="!$v.password.required" class="errorMessage">Password is required.</p>
        </template>
        <div v-if="!this.registered">
          <p class="errorMessage">{{this.error_message}}</p>
        </div>

        <br>
        <br>
        <button class="button red" @click="saveForm">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AuthorService from '@/services/AuthorService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import { required } from 'vuelidate/lib/validators'
import { authorMixin } from '@/mixins/AuthorMixin.js'

export default {
  components: {
    NavBar
  },
  mixins: [authorMixin],
  data() {
    return {
      firstname: null,
      lastname: null,
      countries: null,
      username: null,
      password: null,
      submitted: false,
      wrong: null,
      registered: true
    }
  },
  computed: mapState(['user']),
  validations: {
    firstname: { required },
    lastname: { required },
    countries: { required },
    username: { required },
    password: { required }
  },
  created() {
    this.authorized = this.authorize('register', 'global')
  },
  methods: {
    async saveForm() {
      try {
        var params = {}
        params.authorizer = this.user.uid
        params.firstname = this.firstname
        params.lastname = this.lastname
        params.countries = this.countries
        params.username = this.username
        params.password = this.password
        console.log('params from SaveForm')
        console.log(params)
        let res = await AuthorService.registerUser(params)
        console.log('res from Author Service')
        console.log(res)
        if (res.data.error) {
          this.registered = false
          this.error_message = res.data.message
        } else {
          this.registered = true
        }
      } catch (error) {
        console.log('Register There was an error ', error) //
      }
    }
  }
}
</script>
