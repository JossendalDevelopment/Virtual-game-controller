import firebase from "firebase/app";
import "firebase/storage";

export const getWidgetImageUrl = async filename => {
  const storageRef = firebase.storage().ref();
  return storageRef.child(`widgets/${filename}`).getDownloadURL();
};
