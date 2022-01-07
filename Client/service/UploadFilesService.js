import Api from "./api";
class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return Api().post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    });
  }

  getFiles() {
    return Api().get("/photos");
  }
}

export default new UploadFilesService();