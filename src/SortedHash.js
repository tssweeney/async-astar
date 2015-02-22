/**
 * Creates an indexed binary heap
 * @param {String} attr The objectet's attribute to compare
 */
var SortedHash = module.exports = function SortedHash(attr) {
  this.heap = {};
  this.attr = attr;
  this.head = {
    __next: null
  };
};

SortedHash.prototype.push = function push(object) {
  var currentNode = this.head;
  var placed = false;
  object.__next = null;

  while (!placed) {
    if (currentNode.__next && currentNode.__next[this.attr] < object[this.attr]) {
      currentNode = currentNode.__next;
    } else {
      object.__next = currentNode.__next;
      currentNode.__next = object;
      placed = true;
    }
  }

  this.heap[object.id] = object;
};

SortedHash.prototype.pop = function pop() {
  var ret = this.head.__next;
  this.head.__next = ret && ret.__next;
  if (ret)
    delete this.heap[ret.id];
  return ret;
};
