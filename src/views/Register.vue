<template>
  <div>
    <NavBar />
    <div v-if="!this.authorized">
      <p>
        You have stumbled into a restricted page. Sorry I can not show it to you
        now
      </p>
    </div>
    <div v-if="this.authorized">
      <h2>Existing Editors</h2>
      <Users />
      <h2>Register New Editor</h2>
      <form @submit.prevent="saveForm">
        <BaseInput
          v-model="firstname"
          label="First Name"
          type="text"
          placeholder
          class="field"
          :class="{ error: $v.firstname.$error }"
          @blur="$v.firstname.$touch()"
        />
        <template v-if="$v.firstname.$error">
          <p v-if="!$v.firstname.required" class="errorMessage">
            First name is required.
          </p>
        </template>

        <BaseInput
          v-model="lastname"
          label="Last Name"
          type="text"
          placeholder
          class="field"
          :class="{ error: $v.lastname.$error }"
          @blur="$v.firstname.$touch()"
        />
        <template v-if="$v.lastname.$error">
          <p v-if="!$v.lastname.required" class="errorMessage">
            Last name is required.
          </p>
        </template>
        Scope:
        <v-select
          multiple
          :reduce="display => display.code"
          :options="this.scope_options"
          label="display"
          v-model="scope"
        ></v-select>

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
        <div v-if="!this.registered">
          <p class="errorMessage">{{ this.error_message }}</p>
        </div>

        <br />
        <br />
        <button class="button red" @click="saveUserForm">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AuthorService from '@/services/AuthorService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import vSelect from 'vue-select'
import Users from '@/views/Users.vue'
import { required } from 'vuelidate/lib/validators'
import { authorMixin } from '@/mixins/AuthorMixin.js'
import { countriesMixin } from '@/mixins/CountriesMixin.js'

export default {
  components: {
    NavBar,
    Users,
    'v-select': vSelect
  },
  mixins: [authorMixin, countriesMixin],
  data() {
    return {
      firstname: null,
      lastname: null,
      scope: null,
      username: null,
      password: null,
      submitted: false,
      wrong: null,
      registered: true,
      scope_options: []
    }
  },
  computed: mapState(['user']),
  validations: {
    firstname: { required },
    lastname: { required },
    scope: { required },
    username: { required },
    password: { required }
  },

  methods: {
    async saveUserForm() {
      try {
        var params = {}
        params.authorizer = this.user.uid
        params.firstname = this.firstname
        params.lastname = this.lastname
        var length = this.scope.length
        var scope_formatted = ''
        var temp = ''
        for (var i = 0; i < length; i++) {
          temp = scope_formatted + this.scope[i].code
          scope_formatted = temp
        }
        temp = scope_formatted.replace(/\|\|/g, '|')
        params.scope = temp
        params.username = this.username
        params.password = this.password
        console.log('params from SaveForm')
        console.log(params)
        var res = null
        res = await AuthorService.registerUser(params)
        console.log('res from Author Service')
        console.log(res)
        if (res.data.error) {
          this.registered = false
          this.error_message = res.data.message
        } else {
          location.reload(true)
        }
      } catch (error) {
        console.log('Register There was an error ', error) //
      }
    },
    async scopeOptions() {
      await this.getCountries()
      var options = []
      var option = {}
      console.log(this.countries)
      var length = this.countries.length
      for (var i = 0; i < length; i++) {
        option = {}
        if (this.countries[i].english) {
          option.display = this.countries[i].english
        } else {
          option.display = this.countries[i].name
        }
        option.code = '|' + this.countries[i].code + '|'
        options.push(option)
      }
      option = {}
      option.display = 'Global'
      option.code = '*'
      options.push(option)
      console.log(options)
      this.scope_options = options
      return
    }
  },
  async created() {
    this.authorized = this.authorize('register', 'global')
    await this.scopeOptions()
  }
}
</script>
