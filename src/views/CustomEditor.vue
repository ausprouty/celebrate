<template>
  <div>
    <NavBar/>

    <p><vue-ckeditor v-model="content" name:= "thisEditor" :config="config"/></p>
    <p>
      Please compare to
      <a
        target="a_blank"
        href="/page/AU/eng/basics/basics101"
      >/page/AU/eng/basics/basics101</a>
    </p>
  </div>
</template>


<script>
import NavBar from '@/components/NavBarAdmin.vue'
// import './ckeditor/index.js'
import VueCkeditor from 'vue-ckeditor2'

export default {
  components: {
    NavBar,
    VueCkeditor
  },
  props: ['css'],
  data() {
    return {
      config: {
        extraPlugins: 'bidi,uploadimage,ckfinder',
        extraAllowedContent: 'ol(*)',
        stylesSet: this.$route.params.css,
        contentsCss: '/css/AU-' + this.$route.params.css + '.css',
        height: 300,
        // Upload images to a CKFinder connector (note that the response type is set to JSON).
        uploadUrl:
          '/apps/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
        // Configure your file manager integration. This example uses CKFinder 3 for PHP.
        filebrowserBrowseUrl: '/apps/ckfinder/ckfinder.html',
        filebrowserImageBrowseUrl: '/apps/ckfinder/ckfinder.html?type=Images',
        filebrowserUploadUrl:
          '/apps/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
        filebrowserImageUploadUrl:
          '/apps/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images'
      },
      content: `
  <div class="lesson">
    <img class="lesson-icon" src="/images/firststeps/look-back.png" />
    <div class="lesson-lookback">Look Back</div>
  </div>
  <ol class="ol-back">
    <li>What are you thankful for this week?</li>
    <li>What are you struggling with and how can we help?</li>
    <li>What needs have you noticed in our community/campus/school?</li>
  </ol>
  <br />
  <p class="prayer">
    <img class="lesson-point" src="/images/firststeps/pray.png" />It
    would be good to pray for each other around these needs.
  </p>

  <div class="lesson">
    <img class="lesson-icon" src="/images/firststeps/look-up.png" />
    <div class="lesson-lookup">Look Up</div>
  </div>
  <p>
    <span class="color-yellow">POINT 1:</span>&nbsp;God loves you and
    created you to know him personally.
  </p>
  <p>
    <span class="color-yellow">POINT 2:</span>&nbsp;We are separated from
    God by our sin, so we cannot know him or experience his love.
  </p>
  <p>
    <span class="color-yellow">POINT 3:</span>&nbsp;Jesus is God's only
    solution for our sin. Only through him can we know God and receive his love
    and forgiveness.
  </p>
  <p>
    <span class="color-yellow">POINT 4:</span>&nbsp;We must each respond
    to Jesus by placing our trust in him as our Saviour and Lord. Only then can
    we know God personally.
  </p>
  <div class="dotted">
    <p class="conclusion">My Testimony</p>
    <ul class="ol-up">
      <li>My life before I met Jesus</li>
      <li>How I met Jesus</li>
      <li>How my life has changed since meeting Jesus</li>
    </ul>
  </div>

  <div class="lesson">
    <img class="lesson-icon" src="/images/firststeps/look-forward.png" />
    <div class="lesson-lookforward">Look Forward</div>
  </div>

  <p>
    The most important thing will be how we apply what we learn, and so we want
    to help each other find ways to do that. Some questions to help us do that:
  </p>
  <div class="forward-action">
    <ol start="4" class="ol-forward">
      <li>
        How could this or does this change how you will live? With God, self and
        others?
      </li>
      <li>
        What is one thing you would like to apply to your life from this week's
        discussion? What will you do to make that change?
      </li>
      <li>
        With whom will you share what you learned this week? What will you
        share?
      </li>
    </ol>
  </div>
  <br />
  <p>
    <a href="https://firststepswithgod.com/eng/print/1"
      >Download outline to print</a
    ><br />
    firststepswithgod.com/eng/print/1
  </p>
`
    }
  }
}
</script>
<style>
@import '../../src/assets/css/AU-myfriends.css';
</style>
