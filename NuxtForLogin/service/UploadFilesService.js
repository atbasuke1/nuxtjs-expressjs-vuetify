import axios from "axios";

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return axios.post("http://localhost:8081/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    });
  }

  getFiles() {
    return axios.get("http://localhost:8081/photos");
  }
}

export default new UploadFilesService();