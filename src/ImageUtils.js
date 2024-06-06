import Resizer from "react-image-file-resizer";

const ImageUtils = {
  getBase64: function (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  convertImage: function (file) {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        600,
        700,
        "JPEG || PDF",
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });
  }

}
export default ImageUtils;