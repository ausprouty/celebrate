 return apiClient.get(
      '/content/' +
        country +
        '/' +
        language +
        '/' +
        folder +
        '/' +
        page +
        '.html'

        DataService.getPage(
      this.countryCODE,
      this.languageISO,
      this.bookmark.book.folder,
      this.pageFILENAME
    )