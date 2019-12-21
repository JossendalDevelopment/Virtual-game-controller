export const Binding = function(data) {
  Object.assign(this, Binding.template, data);
};

Object.defineProperty(Binding, "template", {
  get() {
    return {
      type: "custom",
      buttonName: "W",
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      key: "w",
      keyCode: 87,
      image: null,
      imageUrl: null,
      position: {
        width: 150,
        height: 100,
        top: 100,
        left: 100
      },
      style: {
        textColor: "#000000",
        backgroundColor: "#f2f2f2",
        borderColor: "#000000",
        opacity: 1,
        fontSize: 32,
        borderRadius: 1
      }
    };
  }
});
