<template>
  <div id="app">
    <v-container>
      <div class="file">
        <form enctype="multipart/form-data">
          <div>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            />
            <div class="form-group">
              <input
                type="file"
                class="file"
                ref="inputUpload"
                multiple
                @change="selectFile"
              />
              <button
                class="btn btn-success"
                :disabled="!selectedFiles"
                @click="uploadFiles"
              >
                <i class="fa fa-upload"></i>
                Upload
              </button>
            </div>
            <div v-if="message" class="alert alert-light" role="alert">
              <ul>
                <li v-for="(ms, i) in message.split('\n')" :key="i">
                  {{ ms }}
                </li>
              </ul>
            </div>
          </div>
        </form>
      </div>
      <v-text-field></v-text-field>
      <v-row>
        <v-col></v-col>
        <v-col>
          <h4>Name</h4>
        </v-col>
        <v-col>
          <h4>Image</h4>
        </v-col>
        <v-col>
          <h4>Type</h4>
        </v-col>
        <v-col>
          <h4>Action</h4>
        </v-col>
      </v-row>
      <v-row v-for="item in getItems" :key="item.id">
        <v-col> </v-col>
        <v-checkbox v-model="selected" :value="item.id" :key="item.id"></v-checkbox>
        <v-col>{{ item.name }}</v-col>
        <v-col><img v-bind:src="item.url" height="60px" /></v-col>
        <v-col>{{ item.contentType }}</v-col>
        <v-col>
          <a v-bind:src="item.id"
            ><v-btn
              @click="deletePT(item.id)"
              id="del-btn"
              class="btn btn-danger"
              >Delete</v-btn
            ></a
          >
        </v-col>
      </v-row>
      <a
        ><v-btn id="del-btn" class="btn btn-danger" @click="deleteSelect()"
          >Delete Seclect</v-btn
        ></a
      >
      <v-text-field></v-text-field>
      <div class="paginate">
        <vuejs-paginate
          :page-count="getPaginateCount"
          :prev-text="'<'"
          :next-text="'>'"
          :click-handler="paginateClickCallback"
          :container-class="'pagination justify-content-center'"
          :first-last-button="true"
          :first-button-text="'<<'"
          :last-button-text="'>>'"
        ></vuejs-paginate>
      </div>
      <div>{{ selected }}</div>
    </v-container>
  </div>
</template>
<script src="https://unpkg.com/vuejs-paginate@latest"></script>
<script>
import axios from "axios";
import UploadService from "../service/UploadFilesService";
import Vue from "vue";
import VueJsPaginate from "vuejs-paginate";
Vue.component("vuejs-paginate", VueJsPaginate);
export default {
  name: "Characters",
  data() {
    return {
      photo: [],
      search: "",
      selected: [],
      file: "",
      currFiles: [],
      message: "",
      currentPage: 1,
      perPage: 4,
      selectedFiles: undefined,
      progressInfos: [],
      fileInfos: [],
    };
  },
  methods: {

    paginateClickCallback: function (pageNum) {
      this.currentPage = Number(pageNum);
    },

     deleteSelect() {
      console.log("deleteselect", this.selected);
      axios
        .delete("http://localhost:8081/many/" + this.selected)
        .then((response) => {
          this.refreshData();
          console.log("delete",response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    refreshData() {
      axios
        .get("http://localhost:8081/photos")
        .then((response) => {
          this.photo = response.data.reverse();
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

     deletePT(id) {
      axios
        .delete("http://localhost:8081/photos/" + id)
        .then((response) => {
          this.refreshData();
          console.log("delete", response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    selectFile(event) {
      this.progressInfos = [];
      this.selectedFiles = event.target.files;
    },

    upload(idx, file) {
      this.progressInfos[idx] = { percentage: 0, fileName: file.name };
      UploadService.upload(file, (event) => {
        this.progressInfos[idx].percentage = Math.round(
          (100 * event.loaded) / event.total
        );
      })
        .then((response) => {
          let prevMessage = this.message ? this.message + "\n" : "";
          this.message = prevMessage + response.data.message;
           this.refreshData();
        })
        .then((files) => {
          this.fileInfos = files.data;
        })
        .catch(() => {
          this.progressInfos[idx].percentage = 0;
          this.message = "Could not upload the file:" + file.name;
        });
    },

    uploadFiles() {
      this.message = "";
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    },
  },
  computed: {
    getItems: function () {
      let start = (this.currentPage - 1) * this.perPage;
      let end = this.currentPage * this.perPage;
      console.log("test", this.photo);
      return this.photo.slice(start, end);
    },
    getPaginateCount: function () {
      return Math.ceil(this.photo.length / this.perPage);
    },
  },
  mounted: function () {
    this.refreshData();
  },
};
</script>

<style lang="scss" scoped>
input[type="file"] {
  border: 1px dotted #b3adad;
  height: 32px
}

.btn-danger {
  color: rgb(252, 252, 252);
  background-color: rgb(240, 107, 107) !important;
}

.btnsm {
  margin-left: 15px;
  border: black;
  background: #cddded;
  height: 35px;
  width: 80px;
}

.file {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

form {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  width: 580px !important;
  height: 233px;
  justify-content: center;
  align-items: center;
  display: flex;
}

ul {
  box-shadow: 0px 1px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  display: flex;
  list-style-type: none;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  border: 2px solid #b3adad;
  width: 270px;
  height: 40px;
}

button.btn.btn-success {
    background-color: DodgerBlue;
    border: none;
    color: white;
    margin-left: 15px;
    font-size: 16px;
    cursor: pointer;
        padding-left: 10px;
    padding-right: 10px;

}
.paginate {
  display: flex;
  justify-content: space-around;
}
.form-group {
    display: flex;
}
</style>