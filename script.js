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

// Now we have our virtual dom, next step is to convert it into an actual DOM that the browser could render
// For this we will be using the javascript createElement and createTextNode functions

function createDOM(dom) {
  if (typeof dom === 'string') {
    return document.createTextNode(dom);
  }
  var newEl = document.createElement(dom.type);
  if (dom.children.length > 0) {
    dom.children.forEach(function(element) {
      var innerElement = createDOM(element);
      newEl.appendChild(innerElement);
    }, this);
  }
  return newEl;
}

// By now we are able to convert our virtual dom representation in an actual dom
// now, what we have to focus on is diffing the objects to see what has changed.
// But, before that, let's write a small function that changes one key and updates our representation.

function initialRender() {
  var root = document.getElementById('app');
  updateNode(root,null, vdom);
}

function handleReload() {
  var newdom = JSON.parse(JSON.stringify(vdom));
  newdom.type = 'span';
  newdom.children[1].children[0] = 'Nishant!';
  var root = document.getElementById('app');
  updateNode(root, vdom, newdom);
}

function updateNode(parent, oldnode, newnode, index=0) {
  if (!oldnode) {
    parent.appendChild(createDOM(newnode));
  } else if (!newnode) {
    parent.removeChild(parent.childNodes[index]);
  } else if (diffNodes(oldnode, newnode)) {
    parent.replaceChild(createDOM(newnode), parent.childNodes[index]);
  } else {
    for (var i = 0; i < newnode.children.length || i < oldnode.children.length; i++) {
      updateNode(parent.childNodes[index], oldnode.children[i], newnode.children[i], i);
    }
  }
}

function diffNodes(oldnode, newnode) {
  if (oldnode && newnode) {
    if (typeof oldnode != typeof newnode) {
      // If the type of both nodes is different
      // One is a text node and the other is an element
      return true;
    }
    else if ((oldnode.type && newnode.type) && (oldnode.type != newnode.type)) {
      // If both nodes are elements, but are different.
      return true;
    }
    else if (oldnode != newnode) {
      // If both nodes are string and are not equal
      return true;
    }
    return false;
  } else {
    throw new Error('Nodes are undefined');
  }
}