<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loadinG">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <link rel="stylesheet" v-bind:href="'/css/' + this.bookmark.book.style">
      <div class="app-link">
        <div class="app-card -shadow">
          <img
            v-bind:src="appDir.library + this.bookmark.language.image_dir + '/' + this.bookmark.book.image"
            class="book"
          >

          <div class="book">
            <span class="bold">{{this.bookmark.book.title}}</span>
          </div>
        </div>
      </div>

      <h1 v-if="this.bookmark.page.count">{{this.bookmark.page.count}}. {{this.bookmark.page.title}}</h1>
      <h1 v-else>{{this.bookmark.page.title}}</h1>
      <p>
        <button @click="setEditorContent">Set Editor Contents</button>
        <vue-ckeditor v-model="htmlText" language="en"></vue-ckeditor>
      </p>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
    <button class="button" @click="saveForm">Save</button>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import EditService from '@/services/EditService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import './ckeditor/index.js'
import VueCkeditor from 'vueckeditor'
export default {
  props: ['countryCODE', 'languageISO', 'bookNAME', 'pageFILENAME'],
  components: {
    NavBar,
    VueCkeditor
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      pageText: '',
      loadinG: false,
      loading: false,
      loaded: null,
      error: null,
      htmlText: null,
      content: {
        recnum: '',
        version: '',
        edit_date: '',
        edit_uid: '',
        publish_uid: '',
        publish_date: '',
        language_iso: '',
        country_iso: '',
        folder: '',
        filetype: '',
        title: '',
        filename: '',
        text: ''
      }
    }
  },
  methods: {
    XsetEditorContent: function() {
      console.log('I tried to update text')
      ContentService.getPage(
        this.$route.params.countryCODE,
        this.$route.params.languageISO,
        this.bookmark.book.folder,
        this.$route.params.pageFILENAME
      ).then(response => {
        //  console.log('page in Page.Vue')
        console.log(response.data) // For now, logs out the response
        this.htmlText = response.data
      })
    },
    saveForm() {
      console.log(this.content)
      this.content.text = JSON.stringify(this.countries)
      this.content.filename = 'countries'
      this.content.filetype = 'json'
      var contentForm = this.toFormData(this.content)
      var ref = this
      EditService.createContent(contentForm).then(function(response) {
        if (response.data.error) {
          ref.errorMessage = response.data.message
        } else {
          // this.successMessage = response.data.message
          //ref.getCountries()
          ref.$router.push({
            name: 'previewPage',
            params: {
              countryCODE: this.$route.params.countryCODE,
              languageISO: this.$route.params.languageISO,
              bookNAME: this.$route.params.bookNAME,
              pageFILENAME: this.$route.params.pageFILENAME
            }
          })
        }
      })
    },
    toFormData(obj) {
      this.content.edit_date = ''
      this.content.edit_uid = ''
      var form_data = new FormData()
      for (var key in obj) {
        form_data.append(key, obj[key])
      }
      this.content.text = ''
      console.log('form_data')
      // Display the key/value pairs
      for (var pair of form_data.entries()) {
        console.log(pair[0] + ', ' + pair[1])
      }
      return form_data
    },
    setEditorContent: function() {
      this.htmlText = `<html>
  <div class="lesson-section">
    <img class="lesson-icon" src="/images/compass/sharing-life.png" />
    <div class="lesson-section-words">RÜCKBLICK</div>
  </div>
  <ol class="ltr">
    <li>Was hast du diese Woche mit Gott erlebt?</li>
    <li>
      Konntest du in den letzten Tagen jemandem, der Jesus noch nicht persönlich
      kennt und dir nahe steht, von einem Erlebnis mit Gott er-zählen, praktisch
      helfen oder für jemanden beten?
    </li>
    <li>Brauchst du in einem Bereich deines Lebens die Hilfe von Gott?</li>
  </ol>
  <p class="ltr">
    ▶ Gemeinsam beten: Danken für Erlebnisse, um Gottes Hilfe bitten.
  </p>
  <p class="ltr">
    ▶ Gemeinsam beten, dass ihr heute neue Aspekte von Gott kennen lernen dürft
    und eure Freundschaft zu Gott stärker und tiefer wird.
  </p>
  <div class="lesson-section">
    <img class="lesson-icon" src="/images/compass/bible-study.png" />
    <div class="lesson-section-words">BIBELSTUDIUM</div>
  </div>
  <ol class="ltr" start="4">
    <li>Alle lesen den Text leise für sich.</li>
    <li>Jemand liest den Text laut vor, die anderen schliessen ihre Bibeln.</li>
    <li>
      Jemand erzählt den Text in eigenen Worten nach (bei geschlossenen Bibeln).
    </li>
    <li>Die anderen ergänzen bei Bedarf (bei geschlossenen Bibeln).</li>
  </ol>
  <hr />
  <div class="bible">
    <p class="reference">Lukas 15, 11-32</p>
    <div class="bible">
      <p class="bible">
        <sup>11</sup>Jesus fuhr fort: »Ein Mann hatte zwei
        Söhne.<sup>12</sup>Der jüngere sagte zu ihm: ›Vater,
        gib mir den Anteil am Erbe, der mir zusteht!‹ Da teilte der Vater das
        Vermögen unter die beiden auf.<sup>&nbsp;13</sup>Wenige
        Tage später hatte der jüngere Sohn seinen ganzen Anteil verkauft und zog
        mit dem Erlös in ein fernes Land. Dort lebte er in Saus und Braus und
        brachte sein Vermögen durch.
      </p>
      <p class="bible">
        <sup>14</sup>Als er alles aufgebraucht hatte, wurde
        jenes Land von einer großen Hungersnot heimgesucht. Da geriet auch er in
        Schwierigkeiten.<sup>15</sup>In seiner Not wandte er
        sich an einen Bürger des Landes, und dieser schickte ihn zum
        Schweinehüten auf seine Felder.<sup>16</sup>Er wäre
        froh gewesen, wenn er seinen Hunger mit den Schoten, die die Schweine
        fraßen, hätte stillen dürfen, doch selbst davon wollte ihm keiner etwas
        geben.
      </p>
      <p class="bible">
        <sup>17</sup>Jetzt kam er zur Besinnung. Er sagte sich:
        ›Wie viele Tagelöhner hat mein Vater, und alle haben mehr als genug zu
        essen! Ich dagegen komme hier vor Hunger um.<sup>
          &nbsp;18
        </sup>Ich will mich aufmachen und zu meinem Vater gehen und zu ihm
        sagen: Vater, ich habe mich gegen den Himmel und gegen dich versündigt;<sup>
          &nbsp;19
        </sup>ich bin es nicht mehr wert, dein Sohn genannt zu werden. Mach mich
        zu einem deiner Tagelöhner!‹
      </p>
      <p class="bible">
        <sup>20</sup>So machte er sich auf den Weg zu seinem
        Vater. Dieser sah ihn schon von weitem kommen; voller Mitleid lief er
        ihm entgegen, fiel ihm um den Hals und küsste ihn.<sup>
          &nbsp;21
        </sup>›Vater‹, sagte der Sohn zu ihm, ›ich habe mich gegen den Himmel
        und gegen dich versündigt; ich bin es nicht mehr wert, dein Sohn genannt
        zu werden.‹<sup>22</sup>Doch der Vater befahl seinen
        Dienern: ›Schnell, holt das beste Gewand und zieht es ihm an, steckt ihm
        einen Ring an den Finger und bringt ihm ein Paar Sandalen!<sup>
          &nbsp;23
        </sup>Holt das Mastkalb und schlachtet es; wir wollen ein Fest feiern
        und fröhlich sein.<sup>24</sup>Denn mein Sohn war tot,
        und nun lebt er wieder; er war verloren, und nun ist er wiedergefunden.‹
        Und sie begannen zu feiern.
      </p>
      <p class="bible">
        <sup>25</sup>Der ältere Sohn war auf dem Feld gewesen.
        Als er jetzt zurückkam, hörte er schon von weitem den Lärm von Musik und
        Tanz.<sup>26</sup>Er rief einen Knecht und erkundigte
        sich, was das zu bedeuten habe.<sup>&nbsp;27</sup>›Dein
        Bruder ist zurückgekommen‹, lautete die Antwort, ›und dein Vater hat das
        Mastkalb schlachten lassen, weil er ihn wohlbehalten wiederhat.‹<sup>
          28
        </sup>Der ältere Bruder wurde zornig und wollte nicht ins Haus
        hineingehen. Da kam sein Vater heraus und redete ihm gut zu.<sup>
          29
        </sup>Aber er hielt seinem Vater vor: ›So viele Jahre diene ich dir
        jetzt schon und habe mich nie deinen Anordnungen widersetzt. Und doch
        hast du mir nie auch nur einen Ziegenbock gegeben, sodass ich mit meinen
        Freunden hätte feiern können!<sup>30</sup>Und nun kommt
        dieser Mensch da zurück, dein Sohn, der dein Vermögen mit Huren
        durchgebracht hat, und du lässt das Mastkalb für ihn schlachten!‹ –<sup>
          &nbsp;31
        </sup>›Kind‹, sagte der Vater zu ihm, ›du bist immer bei mir, und alles,
        was mir gehört, gehört auch dir.<sup>32</sup>Aber jetzt
        mussten wir doch feiern und uns freuen; denn dieser hier, dein Bruder,
        war tot, und nun lebt er wieder; er war verloren, und nun ist er
        wiedergefunden.‹«
      </p>
      <p class="bible">
        <a
          class="bible-readmore"
          href="https://biblegateway.com/passage/?search=Luke%2015:11-32&amp;version=NGU-DE"
        >
          Jeder liest den Text für sich
        </a>
        <br />
        <br />
      </p>
    </div>
  </div>
  <br />
  <hr />
  <br />
  <ol class="ltr" start="8">
    <li>Allgemeine Fragen:</li>
    <ul class="arrows">
      <li>Ist dir etwas in diesem Text besonders aufgefallen?</li>
      <li>Was gefällt dir an diesem Abschnitt? Was stört dich?</li>
      <li>
        Was kannst du in diesem Text über Gott und über die Prinzipien des
        Reiches Gottes lernen?
      </li>
      <li>Was kannst du über die Menschheit lernen?</li>
    </ul>
    <li>Text anwenden: Wo spricht Gott durch den Text zu dir persönlich?</li>
  </ol>
  <br />
  <br />
  <div class="lesson-section">
    <img class="lesson-icon" src="/images/compass/challenges.png" />
    <div class="lesson-section-words">SPEZIFISCHE FRAGEN UND PRAXIS</div>
  </div>
  <ol start="10">
    <li>
      Wie sieht sich der jüngere Sohn und wie der ältere? Was erwarten sie für
      sich vom Vater? Und wie durchbricht der Vater ihre Vorstellungen?
    </li>
    <li>
      Das Wort „Diener“ (oder auch „Knecht“) kommt mehrmals vor. Was sagt das
      über die Denkweise der Söhne?
    </li>
    <li>
      Für was steht das Kleid und für was steht der Siegelring? Und was will
      Jesus wohl uns (auch uns Christen!) mit dieser Geschichte über Gottes Herz
      sagen?
    </li>
    <li>
      Fühlst du dich mehr wie ein Diener oder wie ein Sohn bzw. eine Toch-ter
      Gottes? Gibt es Situationen, wo die eine oder andere Überzeugung
      überwiegt?
    </li>
  </ol>
  <p>
    ▶ Glaubst du, dass der himmlische Vater dir gerne gibt, nach was du dich
    (von Herzen) sehnst? (Psalm 37,3-4). Gibt es Bereiche in deinem Leben, wo du
    daran zweifelst? Sage ihm in einem Gebet, was du brauchst (jeder für sich).
  </p>
  <p>
    ▶ Betet gemäss Epheser 3,16-19 in Gruppen von 2-3 Personen, dass der Vater
    im Himmel euch noch mehr mit seiner Liebe und tieferem Verständnis seiner
    Liebe erfüllt.
  </p>
  <p>
    ▶ Nehmt euch eine Zeit der Anbetung in der Gruppe. Singt gemeinsam Lieder,
    die Gottes Liebe zu euch ausdrücken und lasst euch von Got-tes Gnade
    berühren! (Z.B. „Good Good Father”).
  </p>
  <div class="lesson-section">
    <img class="lesson-icon" src="/images/compass/background.png" />
    <div class="lesson-section-words">KOMMENTAR ZUM BIBELTEXT</div>
  </div>
  <p>
    Jesus erzählte diese Geschichte, um uns etwas über das Herz des Va-ters im
    Himmel zu zeigen.
  </p>
  <p>
    Der jüngere Sohn war überzeugt, dass er nicht länger würdig ist, ein Sohn
    des Vaters zu sein. Aus seiner Perspektive hätte der Vater alles Recht
    gehabt, ihm zu sagen: „Ja, du bist wirklich selber an deiner Mi-sere schuld
    und nun lerne erst einmal zu dienen und zu arbeiten.“ Der ältere Sohn hatte
    sich im Gegensatz zu seinem Bruder stets korrekt verhalten. Aber auch er sah
    sich als Diener seines Vaters.
  </p>
  <p>
    Im Stillen wartete er die ganze Zeit darauf, dass der Vater ihm seine
    Anerkennung und sein Wohlwollen zeigt, weil er doch so hart für ihn
    arbeitet.
  </p>
  <p>
    Dies ist auch die „normale“ weltliche Sichtweise. Wir denken schnell: Wenn
    du versagst, dann hast du verloren und musst es selber wieder gut machen.
    Und um Gottes Gunst zu bekommen, angenommen und akzeptiert zu sein, musst du
    etwas dafür tun.
  </p>
  <p>
    Doch der Vater korrigiert die Denkweise seiner beiden Söhne. Damit will uns
    Jesus zeigen, dass die Prinzipien im Reich Gottes so anders sind!
  </p>
  <p>
    Der Vater sagt völlig unerwartet: „Schnell, bringt das beste Kleid und zieht
    es ihm an. Holt den Siegelring und Sandalen für seine Füsse.“ Sein jüngster
    Sohn stank wahrscheinlich und der Vater wollte seine Scham bedecken.
  </p>
  <p>
    Genauso ist das Vaterherz Gottes: Er wird uns nicht blossstellen. Und mehr
    noch: Wir sind bedingungslos geliebt, angenommen, auserwählt und haben als
    Söhne und Töchter Gottes jederzeit Zugang zu seinen himmlischen Schätzen:
    „Was mir gehört, gehört auch dir“ (V.31; Ephe-ser 1,3), sei es Weisheit,
    Liebe, Stärke, Vergebung, Heilung, Freude, Trost, Hoffnung, Glauben oder
    Mut. Ein Prinzip im Reich Gottes ist auch: Wenn wir ihn bitten, dann gibt
    uns Gott gerne! (Matthäus 7,7-11).
  </p>
  <p>
    Gott verleiht uns sogar die geistliche Autorität von Jesus in dem Mo-ment,
    wenn wir Jesus als Herrn und Erlöser in unser Leben aufneh-men. Dafür steht
    der Siegelring.
  </p>
  <p>
    Hier ist ein wichtiges Prinzip des Reiches Gottes: Wenn du in deinem Herzen
    weisst, dass du ein Sohn bzw. eine Tochter von Gott bist, dann kommt Ruhe in
    dich. Daraus fliesst Leben, Gottes Liebe und Kraft. Aber wenn du unsicher
    bist, ob sich Gott über dich freut und dich liebt, kommt Durcheinander in
    dein Leben, Zweifel, Angst, Frustration, Verbissenheit und Sorgen. Siehst du
    dich als Sohn bzw. Tochter Gottes oder als Diener?
  </p>
  <br />
  <br />
</html>`
    },
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)

      var formData = new FormData()
      formData.append('image', file)

      axios({
        url: 'https://fakeapi.yoursite.com/images',
        method: 'POST',
        data: formData
      })
        .then(result => {
          let url = result.data.url // Get url from response
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  created() {
    console.log('I am in Page.Vue')
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    route.country = this.$route.params.countryCODE
    route.language = this.$route.params.languageISO
    route.book = this.$route.params.bookNAME
    route.series = this.$route.params.bookNAME
    route.page = this.$route.params.pageFILENAME
    console.log('This is the route I sending to checkBookmark from Page.vue')
    console.log(route)
    this.$store
      .dispatch('checkBookmark', route)
      .then(response => {
        ContentService.getPage(
          this.$route.params.countryCODE,
          this.$route.params.languageISO,
          this.bookmark.book.folder,
          this.$route.params.pageFILENAME
        ).then(response => {
          //  console.log('page in Page.Vue')
          // console.log(response.data) // For now, logs out the response
          this.pageText = response.data
          this.loading = false
          this.loaded = true
        })
      })

      .catch(error => {
        this.loading = false
        console.log('There was an error:', error.response) // Logs out the error
        this.error = error.toString()
      })
  }
}
</script>
<style >
</style>


<style scoped>
.float-right {
  text-align: right;
}
</style>
