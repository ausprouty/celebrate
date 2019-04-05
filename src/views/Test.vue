<template>
  <div>
    <div v-for="(v, index) in $v.people.$each.$iter" :key=" index">
      <div class="form-group" :class="{ 'form-group--error': v.$error }">
        <label class="form__label">Age</label>
        <input class="form__input" v-model.trim="v.age.$model">
      </div>
      <div class="error" v-if="!v.age.required">Age is required.</div>

      <div class="form-group" :class="{ 'form-group--error': v.$error }">
        <label class="form__label">City</label>
        <input class="form__input" v-model.trim="v.city.$model">
      </div>
      <div class="error" v-if="!v.city.required">City is required.</div>
      <div
        class="error"
        v-if="!v.city.minLength"
      >City must have at least {{ v.city.$params.minLength.min }} letters.</div>

      <div class="form-group" :class="{ 'form-group--error': v.$error }">
        <label class="form__label">Name</label>
        <input class="form__input" v-model.trim="v.name.$model">
      </div>
      <div class="error" v-if="!v.name.required">Name is required.</div>
      <div
        class="error"
        v-if="!v.name.minLength"
      >Name must have at least {{ v.name.$params.minLength.min }} letters.</div>

      <br>
      <br>
      <br>
    </div>

    <div>
      <button class="button" @click="people.push({name: '', age:'', city:''})">Add</button>
      <button class="button" @click="people.pop()">Remove</button>
    </div>
    <div class="form-group" :class="{ 'form-group--error': $v.people.$error }"></div>
    <div
      class="error"
      v-if="!$v.people.minLength"
    >List must have at least {{ $v.people.$params.minLength.min }} elements.</div>
    <div class="error" v-else-if="!$v.people.required">List must not be empty.</div>
    <div class="error" v-else-if="$v.people.$error">List is invalid.</div>
    <button class="button" @click="$v.people.$touch">$touch</button>
    <button class="button" @click="$v.people.$reset">$reset</button>
    <tree-view :data="$v.people" :options="{rootObjectKey: '$v.people', maxDepth: 2}"></tree-view>
  </div>
</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      people: [
        {
          name: 'John',
          age: 38,
          city: 'Sydney'
        },
        {
          name: 'Bob',
          age: 38,
          city: 'Homebush'
        }
      ]
    }
  },
  validations: {
    people: {
      required,
      minLength: minLength(3),
      $each: {
        city: {
          required,
          minLength: minLength(2)
        },
        name: {
          required,
          minLength: minLength(2)
        },
        age: {
          required
        }
      }
    }
  }
}
</script>
