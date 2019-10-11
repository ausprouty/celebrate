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
      <h2>Update User {{ member.uid }}</h2>
      <form @submit.prevent="saveForm">
        <BaseInput
          v-model="$v.member.firstname.$model"
          label="First Name"
          type="text"
          placeholder
          class="field"
          :class="{ error: $v.member.firstname.$error }"
          @mousedown="$v.member.firstname.$touch()"
        />
        <template v-if="$v.member.firstname.$error">
          <p v-if="!$v.member.firstname.required" class="errorMessage">
            First Name is required
          </p>
        </template>

        <BaseInput
          v-model="$v.member.lastname.$model"
          label="Last Name"
          type="text"
          placeholder
          class="field"
          :class="{ error: $v.member.lastname.$error }"
          @mousedown="$v.member.lastname.$touch()"
        />
        <template v-if="$v.member.lastname.$error">
          <p v-if="!$v.member.lastname.required" class="errorMessage">
            Last Name is required
          </p>
        </template>
        Scope:
        <v-select
          multiple
          :reduce="display => display.code"
          :options="this.scope_options"
          label="display"
          v-model="$v.member.scope.$model"
        ></v-select>

        <BaseInput
          v-model="$v.member.username.$model"
          label="Username"
          type="text"
          placeholder
          class="field"
          :class="{ error: $v.member.username.$error }"
          @mousedown="$v.member.username.$touch()"
        />
        <template v-if="$v.member.username.$error">
          <p v-if="!$v.member.username.required" class="errorMessage">
            Username is required
          </p>
        </template>

        <BaseInput
          v-model="$v.member.password.$model"
          label="Password"
          type="password"
          placeholder
          class="field"
          :class="{ error: $v.member.password.$error }"
          @mousedown="$v.member.password.$touch()"
        />
        <template v-if="$v.member.password.$error">
          <p v-if="!$v.member.password.required" class="errorMessage">
            Password is required
          </p>
        </template>

        <br />
        <br />
        <button class="button green" @click="saveForm">Update</button>
        <button class="button red" @click="deleteForm">Delete</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AuthorService from '@/services/AuthorService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import vSelect from 'vue-select'
import { authorMixin } from '@/mixins/AuthorMixin.js'
import { countriesMixin } from '@/mixins/CountriesMixin.js'
import { required } from 'vuelidate/lib/validators'

export default {
  components: {
    NavBar,
    'v-select': vSelect
  },
  props: ['uid'],
  mixins: [authorMixin, countriesMixin],
  data() {
    return {
      member: {
        firstname: null,
        lastname: null,
        scope: null,
        username: null,
        password: null
      },
      scope_options: [],
      scope_present: [],
      submitted: false,
      wrong: null,
      registered: true
    }
  },
  computed: mapState(['user']),
  validations: {
    member: {
      firstname: { required },
      lastname: { required },
      scope: { required },
      username: { required },
      password: {}
    }
  },
  methods: {
    async saveForm() {
      try {
        var params = this.member
        console.log('Save Form')
        console.log(this.member)
        console.log(this.$v.member.scope.$model)
        // for some strange reason it shows up as an array sometimes and other times as a string
        if (Array.isArray(this.$v.member.scope.$model)) {
          var length = this.$v.member.scope.$model.length
          var scope_formatted = ''
          var temp = ''
          for (var i = 0; i < length; i++) {
            temp = scope_formatted + this.$v.member.scope.$model[i].code
            scope_formatted = temp
          }
          temp = scope_formatted.replace(/\|\|/g, '|')
          params.scope = temp
        } else {
          params.scope = this.$v.member.scope.$model
        }
        params.member_uid = this.member.uid
        params.authorizer = this.user.uid
        console.log('params for SaveForm')
        console.log(params)
        let res = null
         res = await AuthorService.updateUser(params)
        console.log('res from Author Service')
        console.log(res)
        if (res.data.error) {
          this.registered = false
          this.error_message = res.data.message
        } else {
          this.registered = true
          this.$router.push({
            name: 'farm'
          })
        }
      } catch (error) {
        console.log('Update There was an error ', error) //
      }
    },

    async scopeOptions() {
      await this.getCountries()
      // get scope of Current User
      var present = this.member.countries.split('|')
      if (present.length > 0) {
        present.shift()
        present.pop()
      }
      var option_count = present.length
      var j = 0
      // find all countries
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
        // now see if the user has this option
        for (j = 0; j < option_count; j++) {
          if (present[j] == this.countries[i].code) {
            this.scope_present.push(option)
          }
        }
      }
      option = {}
      option.display = 'Global'
      option.code = '*'
      options.push(option)
      for (j = 0; j < option_count; j++) {
        if (present[j] == option.code) {
          this.scope_present.push(option)
        }
      }
      console.log('options')
      console.log(options)
      this.scope_options = options
      console.log(this.scope_present)
      this.$v.member.scope.$model = this.scope_present

      return
    },
    async deleteForm() {
      try {
        var params = {}
        params.authorizer = this.user.uid
        params.member_uid = this.member.uid
        params.member_username = this.member.username
        console.log('params from DeleteForm')
        console.log(params)
        let res = await AuthorService.deleteUser(params)
        console.log('res from Author Service')
        console.log(res)
        if (res.data.error) {
          this.registered = false
          this.error_message = res.data.message
        } else {
          this.registered = true
          this.$router.push({
            name: 'farm'
          })
        }
      } catch (error) {
        console.log('Delete There was an error ', error) //
      }
    }
  },
  async created() {
    this.authorized = this.authorize('register', 'global')
    if (this.authorized) {
      try {
        var params = {}
        params.uid = this.$route.params.uid

        this.member = await AuthorService.getUser(params)
        this.scopeOptions()
        this.member.password = null

        console.log(this.member)
      } catch (error) {
        console.log('There was an error in User.vue:', error) // Logs out the error
      }
    }
  }
}
</script>
