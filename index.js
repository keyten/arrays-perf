(function() {
  let turnOn = true;
  const counts = new Map();
  const incrCount = (key) => {
    const val = counts.get(key) || 0;
    counts.set(key, val + 1);
  };

  const monkeyPatchArrayFunction = (funcName) => {
    const oldFunc = Array.prototype[funcName];
    if (!oldFunc) {
      // in case of non-standard functions
      return;
    }

    Array.prototype[funcName] = function() {
      if (turnOn) {
        incrCount(this);
      }
      return oldFunc.apply(this, arguments);
    };
  };

  monkeyPatchArrayFunction('forEach');
  monkeyPatchArrayFunction('reduce');
  monkeyPatchArrayFunction('map');
  monkeyPatchArrayFunction('flatMap');
  monkeyPatchArrayFunction('filter');
  monkeyPatchArrayFunction('find');
  monkeyPatchArrayFunction('findIndex');
  monkeyPatchArrayFunction('findLast');
  monkeyPatchArrayFunction('findLastIndex');
  monkeyPatchArrayFunction('flat');
  monkeyPatchArrayFunction('includes');
  monkeyPatchArrayFunction('indexOf');
  monkeyPatchArrayFunction('reduceRight');
  monkeyPatchArrayFunction('reverse');
  monkeyPatchArrayFunction('sort');
  monkeyPatchArrayFunction('toReversed');
  monkeyPatchArrayFunction('toSorted');

  window.getCounts = function () {
    turnOn = false;
    const val = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    turnOn = true;
    return val;
  };
})();
