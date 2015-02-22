var SortedHash = require("./SortedHash.js");
var assert = require("assert");

var AsyncAstar = module.exports = function(options) {
  assert(options);
  assert(options.initial);
  assert(options.neighbors);
  assert(options.onComplete);

  var self = this;
  this.initial = options.initial;
  this.neighbors = options.neighbors;
  this.heuristic = options.heuristic || function() {
    return 0;
  };
  this.onComplete = options.onComplete;

  this.unresolved = new SortedHash("__score");
  this.resolved = {};

  this.initial.__h = this.heuristic(this.initial);
  this.initial.__depth = 0;
  this.initial.__score = this.initial.__depth + this.initial.__h;
  this.initial.__parent = null;

  this.unresolved.push(this.initial);
  this.timedOut = false;
  this.solved = false;

  if (options.timeout && options.timeout > 0) {
    setTimeout(function() {
      self.timedOut = true;
      if (options.onTimeout) {
        options.onTimeout();
      }
    }, options.timeout);
  }

  setTimeout(function() {
    self.solve();
  }, 0);

};

AsyncAstar.prototype.solve = function() {
  var neighborState;
  // Get the unresolved head
  var currentState = this.unresolved.pop();

  if (currentState) {
    // Find unresolved head's neighbors
    var neighbors = this.neighbors(currentState);
    // add current state to resolved list
    this.resolved[currentState.id] = currentState;
    // Foreach neighbor
    for (var n = 0; !this.timedOut && !this.solved && n < neighbors.length; n++) {
      neighborState = neighbors[n];
      neighborState.__parent = currentState;
      neighborState.__h = this.heuristic(neighborState);
      neighborState.__depth = currentState.__depth + 1;
      neighborState.__score = neighborState.__depth + neighborState.__h;

      //  If win, return path
      if (neighborState.state == 1) {
        var path = [];
        var pointer = neighborState;
        while (pointer) {
          path.push(pointer.action);
          pointer = pointer.__parent;
        }
        this.solved = true;
        this.onComplete({
          success: true,
          actions: path.reverse(),
          cost: path.length - 1
        });
      } else {
        // If already resolved, update with better depth
        if (this.resolved[neighborState.id]) {
          if (neighborState.__depth < this.resolved[neighborState.id].__depth) {
            this.resolved[neighborState.id].__parent = neighborState.__parent;
            this.resolved[neighborState.id].__h = neighborState.__h;
            this.resolved[neighborState.id].__depth = neighborState.__depth;
            this.resolved[neighborState.id].__score = neighborState.__score;
          }

          // else, if the state is imposible to win from, add it to the this.resolved list
        } else if (neighborState.state == -1) {
          this.resolved[neighborState.id] = neighborState;
          // Else
        } else {
          // If already in unresolved heap, update with better depth
          if (this.unresolved.heap[neighborState.id] && neighborState.__depth < this.unresolved.heap[neighborState.id].__depth) {
            this.unresolved.heap[neighborState.id].__parent = neighborState.__parent;
            this.unresolved.heap[neighborState.id].__h = neighborState.__h;
            this.unresolved.heap[neighborState.id].__depth = neighborState.__depth;
            this.unresolved.heap[neighborState.id].__score = neighborState.__score;
            // Else push into this.unresolved list
          } else {
            this.unresolved.push(neighborState);

          }
        }
      }
    }
    // recurse to solve function
    this.solve();
  } else if (!this.timedOut && !this.solved) {
    this.onComplete({
      success: false,
      actions: [],
      cost: 0
    });
  }

};
