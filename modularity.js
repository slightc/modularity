/**
 * @callback EmptyCallback
 * @returns {void}
 */

/**
 * @callback WaitCallback
 * @param {any[]} mods
 * @returns {void}
 */

/**
 * @callback AddDoneCallback
 * @param {any} mod
 * @returns {void}
 */

/**
 * @callback AddCallback
 * @param {AddDoneCallback} done
 * @returns {void}
 */

/**
 * @callback AddScriptCallback
 * @param {AddDoneCallback} done
 * @param {HTMLScriptElement} script
 * @returns {void}
 */

/**
 * @typedef {object} SourceObject
 * @property {string} src
 * @property {boolean} [async]
 * @property {boolean} [defer]
 */


function Modularity() {
  /** @type {Record<string, any | undefined>} */
  var modules = {};

  /** @type {Record<string, EmptyCallback[] | undefined>} */
  var waiter = {};

  /**
   * @param {string[]} names
   * @param {WaitCallback} cb
   * @returns {void}
   */
  function wait(names, cb) {
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (modules[name] == undefined) {
        waiter[name] = waiter[name] || [];
        waiter[name].push(function () {
          wait(names, cb)
        })
        return;
      }
    }
    cb(names.map(function (name) {
      return modules[name];
    }));
  }

  /**
   * @param {string} name
   * @param {AddCallback} cb
   */
  function add(name, cb) {
    function done(mod) {
      modules[name] = mod;
      var waitList = waiter[name];
      waiter[name] = undefined;
      if (waitList) { waitList.forEach((item) => { item() }); }
    }
    cb(done);
  }

  /**
   *
   * @param {string} name
   * @param {string | SourceObject} source
   * @param {AddScriptCallback} [cb]
   */
  function addSrc(name, source, cb) {
    var src = '', isAsync = true, isDefer = false;
    if (typeof source == 'string') {
      src = source;
    } else if (typeof source == 'object') {
      src = source.src;
      if (source.async != undefined) {
        isAsync = source.async;
      }
      if (source.defer != undefined) {
        isDefer = source.defer;
      }
    }
    var script = document.createElement('script');
    script.src = src;
    script.async = isAsync;
    script.defer = isDefer;
    script.onload = function () {
      add(name, function (done) {
        if (cb) {
          cb(done, script);
        } else {
          done(window[name]);
        }
      })
    }
    document.head.append(script);
  }

  return {
    wait,
    add,
    addSrc,
  }
}
