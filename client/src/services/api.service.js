import axios from "axios";
import { getWidgetImageUrl } from "../utils";

const instance = axios.create();
instance.token = window.localStorage.getItem("token") || null;

instance.new = function (url = `/`) {
  this.defaults.baseURL = url;

  if (this.token) {
    this.tokenInterceptor = this.interceptors.request.use(config => {
      config.headers["Authorization"] = "Bearer " + this.token;
      return config;
    });
  }
};

instance.loadWidgets = async function () {
  try {
    const jsonData = await axios.get(
      `http://${process.env.VUE_APP_API_HOST}:5000/get_key_mapping`
    );
    const bindings = jsonData.data.keyMappings;

    const promises = Promise.all(
      bindings.map(async binding => {
        if (binding.image) {
          binding.imageUrl = await getWidgetImageUrl(binding.image);
        }
        return binding;
      })
    );
    return promises;
  } catch (err) {
    return { status: 500, msg: err };
  }
};

instance.getClientIP = async function () {
  try {
    const clientIP = await axios.get(
      `http://${process.env.VUE_APP_API_HOST}:5000/get_ip`
    );
    return Promise.resolve(clientIP);
  } catch (err) {
    return { status: 500, msg: err };
  }
};

export default instance;
