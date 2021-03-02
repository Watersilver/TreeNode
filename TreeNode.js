class TreeNode {
  constructor() {
    this._children = new Set(); // Array of TreeNodes
    this._parent = null; // TreeNode
  }
  get parent() {return this._parent;}
  set parent(_) {throw Error("parent is read-only");}
  get children() {return Array(...this._children);}
  set children(_) {throw Error("children is read-only");}

  addChild(node) {
    // Make sure "this" is not descendant of new child
    if (this.forEachAncestor(anc => anc === node)) {
      throw Error("new child can't be TreeNode's ancestor")
    }

    // Add
    node.remove();
    this._children.add(node);
    node._parent = this;
  }

  remove() {
    if (!this._parent) return;
    this._parent._children.delete(this);
    this._parent = null;
    return true;
  }

  descendUntil(callback) {
    for (const child of this._children) {
      let stop;
      stop = callback(child);
      if (stop) return stop;
      stop = child.forEachDescendant(callback);
      if (stop) return stop;
    }
  }

  ascendUntil(callback) {
    if (this._parent) {
      const stop = callback(this._parent);
      if (!stop) return this._parent.forEachAncestor(callback);
      return stop;
    }
  }

  fromRootToParentUntil(callback) {
    const ancestors = [];
    let dlt = this._parent;
    while (dlt) {
      ancestors.push(dlt);
      dlt = dlt._parent;
    }
    for (let ancestor of ancestors.reverse()) {
      const stop = callback(ancestor);
      if (stop) return stop;
    }
  }
}

export default TreeNode;
