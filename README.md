[![NPM](https://nodei.co/npm/async-astar.png?downloads=true)](https://nodei.co/npm/async-astar/)

Async-Astar [![Build Status](https://travis-ci.org/tssweeney/async-astar.svg)](https://travis-ci.org/tssweeney/async-astar)
====

**[View Documentation](http://timssweeney.com/async-astar/src/AsyncAstar.js.html)**


Usage:

  var solver = new AsyncAstar({
    initial: {Object}
    neighbors: {Function},
    heuristic: {Function},
    onComplete: {Function},
    onTimeout: {Function},
    timeout: {Integer}
  });

Intial should be an object with at least the following variables:
- id {String} Uniquely identifies puzzle/game state
- state {Integer} -1|0|1 Impossible|Playing|Win respectively. This a-star solver can handle imposible cases (perhaps a wall, or a pit of doom)

Neighbors should return the neighboring states of a given state
- returns an array of neighboring states formatted with the minimum requirements above in addition to "action". "action" is a varaible that represents what it takes to get from the given state to the neighbor (directional, keypress, etc..)
- states will retain their values so you can put additional information in them (x,y perhaps)

Heuristic should take a state description and return a value (lower the better)
- The heuristic is the estimated "distance" from the win-state. If this does not apply to your puzzle, just return 0.

onComplete will be passed a an object formatted in this way:
- success: boolean if the puzzle was solved
- path: array of actions to get to solution
- cost: count of actions needed

onTimeout: function will be called if the solver times out

timeout:
- maximum allowed execution time. Defaults to 0 (never).