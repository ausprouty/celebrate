data(){
    return{
      languages:[]
    }
  },
  created() {
    axios
      .get('http://localhost:3001/index-' + country)  // Does a get request
      .then(response => {
        console.log(response.data) // For now, logs out the response
        this.languages = response.data
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }