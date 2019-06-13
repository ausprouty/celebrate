import ContentService from '@/services/ContentService.js'
export const seriesMixin = {
  data() {
    return {
      seriesDetails: {
        series: '',
        language: '',
        description: ''
      },
      chapter: {},
      chapters: [
        {
          id: '',
          title: '',
          desciption: '',
          count: '',
          filename: ''
        }
      ],
      dir: 'ltr',
      image_dir: 'ZZ/images/europe',
      loading: false,
      loaded: null,
      error: null,
      error_message: null,
      publish: false,
      publish_date: null,
      recnum: null,
      content: {
        recnum: '',
        version: '',
        edit_date: '',
        edit_uid: '',
        publish_uid: '',
        publish_date: '',
        language_iso: '',
        country_code: '',
        folder: '',
        filetype: '',
        title: '',
        filename: '',
        text: ''
      }
    }
  },
  methods: {
    async getSeries(params) {
      try {
        console.log('params in SeriesMixin ')
        console.log(params)
        this.error = this.loaded = null
        this.loading = true
        var ok = await this.CheckBookmarks(params)
        var response = await ContentService.getSeries(params)
        console.log('Series Data obtained')
        console.log(response)
        if (response.data.content.text) {
          // latest data
          if (response.data.content.recnum) {
            this.recnum = response.data.content.recnum
            this.publish_date = response.data.content.publish_date
          }
          this.seriesDetails = JSON.parse(response.data.content.text)
          console.log('Series Details')
          console.log(this.seriesDetails)
          this.chapters = this.seriesDetails.chapters
          this.description = this.seriesDetails.description
        } else {
          this.description = response.data.content.description
          this.chapters = response.data.content.chapters
        }
        this.new = false
        if (!this.chapters) {
          this.new = true
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
        console.log('finished with get Series')
      } catch (error) {
        console.log('There was an error in SeriesMixin:', error) // Logs out the error
      }
    },

    newSeries() {
      return
    }
  }
}
