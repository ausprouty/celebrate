methods: {
    updateBookmark: function() {
      this.$store
        .dispatch('updateBookmark', ['book', this.bookmark.book])
        .then(() => {
          console.log('results saved with bookmark value')
          console.log(this.bookmark)
          console.log('that was value')
          this.$router.push({
            name: 'series',
            params: {
              countryCODE: this.bookmark.country.code,
              languageISO: this.bookmark.language.iso,
              bookNAME: this.bookmark.book.book
            }
          })
        })
        .catch(() => {
          console.log('There was a problem storing language')
        })
    }
  },