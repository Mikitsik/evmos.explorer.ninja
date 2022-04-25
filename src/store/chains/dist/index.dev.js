"use strict";

var _interopRequireDefault = require("/home/self/ping/evmos.explorer.ninja/node_modules/@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime.js");

var _asyncToGenerator2 = _interopRequireDefault(require("/home/self/ping/evmos.explorer.ninja/node_modules/@babel/runtime/helpers/esm/asyncToGenerator"));

var _objectSpread2 = _interopRequireDefault(require("/home/self/ping/evmos.explorer.ninja/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

var _crypto = require("@cosmjs/crypto");

var _encoding = require("@cosmjs/encoding");

var chains = {};

var configs = require.context('../../chains/mainnet', false, /\.json$/);

console.log(configs);
var update = {};
configs.keys().forEach(function (k) {
  var c = configs(k);
  update[c.chain_name] = c;
});
chains = update;
localStorage.setItem('chains', JSON.stringify(update));
var selected = chains.cosmos;
var avatarcache = localStorage.getItem('avatars');
var _default = {
  namespaced: true,
  state: {
    config: chains,
    selected: selected,
    avatars: avatarcache ? JSON.parse(avatarcache) : {},
    height: 0,
    ibcChannels: {},
    quotes: {},
    defaultWallet: localStorage.getItem('default-wallet'),
    denoms: {},
    ibcPaths: {}
  },
  getters: {
    getchains: function getchains(state) {
      return state.chains;
    },
    getAvatarById: function getAvatarById(state) {
      return function (id) {
        return state.avatars[id];
      };
    }
  },
  mutations: {
    setup_sdk_version: function setup_sdk_version(state, info) {
      state.chains.config[info.chain_name].sdk_version = info.version;
    },
    select: function select(state, args) {
      state.chains.selected = state.chains.config[args.chain_name];
    },
    cacheAvatar: function cacheAvatar(state, args) {
      state.chains.avatars[args.identity] = args.url;
      localStorage.setItem('avatars', JSON.stringify(state.chains.avatars));
    },
    setHeight: function setHeight(state, height) {
      state.chains.height = height;
    },
    setChannels: function setChannels(state, _ref) {
      var chain = _ref.chain,
          channels = _ref.channels;
      state.chains.ibcChannels[chain] = channels;
    },
    setQuotes: function setQuotes(state, quotes) {
      state.quotes = quotes;
    },
    setDefaultWallet: function setDefaultWallet(state, defaultWallet) {
      if (defaultWallet && defaultWallet.length > 0) {
        localStorage.setItem('default-wallet', defaultWallet);
        state.chains.defaultWallet = defaultWallet;
      }
    },
    setIBCDenoms: function setIBCDenoms(state, denoms) {
      state.denoms = (0, _objectSpread2.default)({}, state.denoms, {}, denoms);
    },
    setIBCPaths: function setIBCPaths(state, paths) {
      state.ibcPaths = paths;
    }
  },
  actions: {
    getQuotes: function () {
      var _getQuotes = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(context) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fetch('https://price.ping.pub/quotes').then(function (data) {
                  return data.json();
                }).then(function (data) {
                  context.commit('setQuotes', data);
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getQuotes(_x) {
        return _getQuotes.apply(this, arguments);
      }

      return getQuotes;
    }(),
    getAllIBCDenoms: function () {
      var _getAllIBCDenoms = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(context, _this) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this.$http.getAllIBCDenoms().then(function (x) {
                  var denomsMap = {};
                  var pathsMap = {};
                  x.denom_traces.forEach(function (trace) {
                    var hash = (0, _encoding.toHex)((0, _crypto.sha256)(new TextEncoder().encode("".concat(trace.path, "/").concat(trace.base_denom))));
                    var ibcDenom = "ibc/".concat(hash.toUpperCase());
                    denomsMap[ibcDenom] = trace.base_denom;
                    var path = trace.path.split('/');

                    if (path.length >= 2) {
                      pathsMap[ibcDenom] = {
                        channel_id: path[path.length - 1],
                        port_id: path[path.length - 2]
                      };
                    }
                  });
                  context.commit('setIBCDenoms', denomsMap);
                  context.commit('setIBCPaths', pathsMap);
                });

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getAllIBCDenoms(_x2, _x3) {
        return _getAllIBCDenoms.apply(this, arguments);
      }

      return getAllIBCDenoms;
    }()
  }
};
exports.default = _default;