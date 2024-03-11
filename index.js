(function() {
  const counts = new Map();
  const incrCount = (key) => {
    const val = counts.get(key) || 0;
    counts.set(key, val + 1);
  };

  const references = new Map();
  const addReference = (key, val) => {
    if (references.get(val)) {
      val = references.get(val);
    }

    const list = references.get(key);
    if (list) {
      list.push(val);
    } else {
      references.set(key, [val]);
    }
  };

  let turnOn = true;
  const monkeyPatchArrayFunction = (funcName, { withReference } = {}) => {
    const oldFunc = Array.prototype[funcName];
    if (!oldFunc) {
      // in case of non-standard functions
      return;
    }

    Array.prototype[funcName] = function() {
      if (turnOn) {
        incrCount(this);
      }
      const result = oldFunc.apply(this, arguments);;
      if (withReference) {
        addReference(result, this);
      }
      return result;
    };
  };

  monkeyPatchArrayFunction('forEach');
  monkeyPatchArrayFunction('reduce');
  monkeyPatchArrayFunction('map', { withReference: true });
  monkeyPatchArrayFunction('flatMap', { withReference: true });
  monkeyPatchArrayFunction('filter', { withReference: true });
  monkeyPatchArrayFunction('find');
  monkeyPatchArrayFunction('findIndex');
  monkeyPatchArrayFunction('findLast');
  monkeyPatchArrayFunction('findLastIndex');
  monkeyPatchArrayFunction('flat', { withReference: true });
  monkeyPatchArrayFunction('includes');
  monkeyPatchArrayFunction('indexOf');
  monkeyPatchArrayFunction('reduceRight');
  monkeyPatchArrayFunction('reverse', { withReference: true });
  monkeyPatchArrayFunction('sort', { withReference: true });
  monkeyPatchArrayFunction('toReversed', { withReference: true });
  monkeyPatchArrayFunction('toSorted', { withReference: true });

  window.getCounts = () => {
    turnOn = false;
    const val = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    turnOn = true;
    return val;
  };
  window.getCountsFor = (arr) => return counts.get(arr);

  window.switchOnCounting = () => turnOn = true;
  window.switchOffCounting = () => turnOn = false;
})();
