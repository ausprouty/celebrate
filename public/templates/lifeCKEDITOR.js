CKEDITOR.addTemplates('default', {
  imagesPath: CKEDITOR.getUrl('/templates/images/life/'),
  templates: [
    {
      title: 'Share',
      image: 'share.png',
      description: 'Image and Title',
      html:
        '\x3cdiv class\x3d"lesson"\x3e\x3cimg class\x3d"lesson-icon" src\x3d"/images/sharing-life.png" /\x3e\x3cdiv class\x3d"lesson-subtitle"\x3eSHARE\x3c/div\x3e\x3c/div\x3e'
    },
    {
      title: 'Review',
      image: 'review.png',
      description: 'Image and Title',
      html:
        '\x3cdiv class\x3d"lesson"\x3e\x3cimg class\x3d"lesson-icon" src\x3d"/images/review.png" /\x3e\x3cdiv class\x3d"lesson-subtitle"\x3eREVIEW\x3c/div\x3e\x3c/div\x3e'
    },
    {
      title: 'Read',
      image: 'read.png',
      description: 'Image and Title',
      html:
        '\x3cdiv class\x3d"lesson"\x3e\x3cimg class\x3d"lesson-icon" src\x3d"/images/bible-study.png" /\x3e\x3cdiv class\x3d"lesson-subtitle"\x3eREAD\x3c/div\x3e\x3c/div\x3e'
    },
    {
      title: 'Discover',
      image: 'discover.png',
      description: 'Image and Title',
      html:
        '\x3cdiv class\x3d"lesson"\x3e\x3cimg class\x3d"lesson-icon" src\x3d"/images/discover.png" /\x3e\x3cdiv class\x3d"lesson-subtitle"\x3eDISCOVER\x3c/div\x3e\x3c/div\x3e'
    },
    {
      title: 'Apply',
      image: 'apply.png',
      description: 'Image and Title',
      html:
        '\x3cdiv class\x3d"lesson"\x3e\x3cimg class\x3d"lesson-icon" src\x3d"/images/challenges.png" /\x3e\x3cdiv class\x3d"lesson-subtitle"\x3eAPPLY\x3c/div\x3e\x3c/div\x3e'
    },
    {
      title: 'BiblePassage',
      image: '',
      description: 'Bible Passage and Link',
      html:'\x3cdiv id\x3d"bible"\x3e\x3cdiv class\x3d"bible"\x3e|PassageName|\x3cbr\x3e|Bible Text|\x3cbr /\x3e\x3ca class\x3d"readmore" href\x3d"|Reference|"\x3eRead More \x3c/a\x3e\x3c/div\x3e\x3c/div\x3e'
    }
  ]
})
