import ContentService from '@/services/ContentService.js'
export const seriesMixin = {
  methods: {
    async getSeries(params) {
      try {
        params.bookNAME = params.seriesNAME
        console.log('params in SeriesMixin')
        console.log(params)
        this.error = this.loaded = null
        this.loading = true
        await this.CheckBookmarks(params)
        params.folderNAME = this.bookmark.book.folder
        params.fileFILENAME = this.bookmark.book.index
        console.log('params')
        console.log(params)
        var response = await ContentService.getSeries(params)
        console.log('Series Data obtained')
        console.log(response)
        if (response.data.content.text) {
          // is this needed for latest data?
          this.seriesDetails = JSON.parse(response.data.content.text)
          console.log('Series Details')
          console.log(this.seriesDetails)
          this.chapters = this.seriesDetails.chapters
          this.description = this.seriesDetails.description
        } else {
          this.description = response.data.content.description
          this.chapters = response.data.content.chapters
        }
        this.image_dir = this.standard.image_dir
        if (typeof this.bookmark.language.image_dir != 'undefined') {
          console.log('USING BOOKMARK')
          this.image_dir = this.bookmark.language.image_dir
        }
        this.style = this.standard.style
        if (typeof this.bookmark.book.style != 'undefined') {
          console.log('USING BOOKMARK')
          this.style = this.bookmark.book.style
        }
        console.log('this.image_dir')
        console.log(this.image_dir)
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in SeriesMixin:', error) // Logs out the error
      }
    },
    newSeries() {
      return
    }
  }
}
