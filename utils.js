function pillarCreate (eleType, classList, styleObj) {
    var ele = document.createElement(eleType);
    for (var i = 0; i < classList.length; i ++) {
        ele.classList.add(classList[i]);
    };
    for (var key in styleObj) {
        ele.style[key] = styleObj[key];
    };
    return ele;
}
function setLocal (key, value) {
    if(typeof value === 'object' && value !== null) {
      value = JSON.stringify(value);
    }
  
    localStorage.setItem(key, value);
}
function getLocal (key) {
    var value = localStorage.getItem(key);
    if(value === null) { return value};
    if(value[0] === '[' || value[0] === '{') {
        return JSON.parse(value);
      }
      return value;
}
function formatNum (num) {
    if(num < 10) {
      return '0' + num;
    }
  
    return num;
  }