// a virtual dom is a virtual representation of the old DOM you're familiar with
// the first step is to convert the the dom we want to be displayed in a form that we could operate on
// we're going to use plain old JavaScript objects to represent the DOM virtually.

// That will be our virtual DOM.

// But, this DOM will also have to change the real DOM that we update and the browser renders.

var vdom = {
  type: 'div',
  children: [
    {
      type: 'p',
      children: [ 'Hi!' ]
    },
    {
      type: 'p',
      children: [ 'Hello' ]
    }
  ]
};

console.log(vdom);

// Now we have our virtual dom, next step is to convert it into an actual DOM that the browser could render
// For this we will be using the javascript createElement and createTextNode functions

function createDOM(vdom) {
  var newEl = document.createElement(vdom.type);
  if (vdom.children.length > 0) {
    vdom.children.forEach(function(element) {
      if (element.type) {
        var innerElement = createDOM(element);
      } else {
        var innerElement = document.createTextNode(element);
      }
      newEl.appendChild(innerElement);
    }, this);
  }
  return newEl;
}

function render(id, vdom) {
  document.getElementById(id).appendChild(createDOM(vdom));
}


function handleReload() {
  render('app', vdom);
}