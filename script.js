


// ================================================

// The Virtual DOM

// ================================================


// a virtual dom is a virtual representation of the old browser DOM you're familiar with
// the first step is to convert the the dom we want to be displayed in a form that we could operate on
// we're going to use plain old JavaScript objects to represent the DOM virtually.

// That will be our virtual DOM.

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

// But, this DOM will also have to change the real DOM that we update and the browser renders.

// Now we have our virtual dom, next step is to convert it into an actual DOM that the browser could render
// For this we will be using the javascript createElement and createTextNode functions




// ================================================

// Actual HTML Elements from Virtual DOM

// ================================================

// Create DOM node goes recursively through all children nodes, creates element and then appends
// that to its immediate parent.

function createDOMNode(dom) {
  // First we check if the node is a string.
  // That means, it is a text node and does not have any children.
  // So let's just create the text node
  if (typeof dom === 'string') {
    return document.createTextNode(dom);
  }
  // If the node isn't a string then we create the element node.
  var newEl = document.createElement(dom.type);

  // Great. Now it's time for the child nodes.
  if (dom.children.length > 0) { // This just checks if the node has children
    // Now, let's loop through all the children of the node and call the same createDOMNode function
    // on each one of them
    // Then, append the returned function to immediate parent element we just created.
    dom.children.forEach(function(element) {
      var innerElement = createDOMNode(element);
      newEl.appendChild(innerElement);
    }, this);
  }
  // When all is done, return the element
  return newEl;
}

// By now we are able to convert our virtual dom representation in an actual dom
// So if you called the createDOMNode function on the vdom object, it will
// create the actual browser DOM.





// ================================================

// Diffing two virtual DOM nodes

// ================================================

// Now, what we have to focus on is diffing the objects to if the dom should be updated.

// How do you diff it?
// Our element object in the virtual dom has two keys, type and children
// Our text object is just a string.

// This function has a few if conditions that check if the two nodes passed are different
// This just diffs one node. There is no recursion involved here.
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
    else if ((typeof oldnode === 'string' && typeof newnode === 'string') && newnode != oldnode) {
      // If both nodes are string and are not equal
      return true;
    }
    return false;
  } else {
    throw new Error('Nodes are undefined');
  }
}





// ================================================

// Updating the actual DOM based

// ================================================

// There are a few ways these nodes could have changed.
// 1. The node might have been deleted
// 2. A new node might have been added
// 3. the node tag could have been changed
// 4. The node text could have been changed

// In the below function,
// parent = the immediate parent element
// oldnode = the old node in our virtual dom
// newnode = the new node in our virtual dom
// index = index of the child of the parent node. It is zero by default to target the first
// and immediate child of a node
function updateNode(parent, oldnode, newnode, index=0) {
  // Let's start simple. If the old node does not exist.
  if (!oldnode) {
    // Then, just simple append the new node
    parent.appendChild(createDOMNode(newnode));
  } else if (!newnode) {
    // If the new node doesn't exist, remove that node
    parent.removeChild(parent.childNodes[index]);
  } else if (diffNodes(oldnode, newnode)) {
    // Now, what is both the nodes exist. Check if the node has changed
    // If it has, then replace the old node with the new node
    parent.replaceChild(createDOMNode(newnode), parent.childNodes[index]);
  } else if (newnode.type) {
    // If the old and new nodes haven't changed, check if their children have changed
    // Recursion to the rescue. Loop through all children and call this function on each one of them.
    for (var i = 0; i < newnode.children.length || i < oldnode.children.length; i++) {
      updateNode(parent.childNodes[index], oldnode.children[i], newnode.children[i], i);
    }
  }
}



// ========================================

// Oh, this function, it doesn't do much.
// This is the function that's called when you click on "Start"
// It just renders the dom representation above
function initialRender() {
  var root = document.getElementById('app');
  updateNode(root,null, vdom);
}

// This function is called when you click on reload
// It makes some changes to the old dom to get the new dom representation
// Then, just calls the updateNode function with both the doms
function handleReload() {
  var newdom = JSON.parse(JSON.stringify(vdom));
  // newdom.children.push({
  //   type: 'p',
  //   children: [ 'How are you?' ]
  // });
  // newdom.children.splice(0, 1);
  newdom.children[1].children[0] = 'Nishant!';
  var root = document.getElementById('app');
  updateNode(root, vdom, newdom);
}