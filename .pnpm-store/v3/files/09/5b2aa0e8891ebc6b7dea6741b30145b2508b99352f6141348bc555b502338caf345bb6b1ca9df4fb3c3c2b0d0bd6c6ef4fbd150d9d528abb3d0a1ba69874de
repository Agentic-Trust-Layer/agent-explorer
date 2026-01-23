"use strict";Object.defineProperty(exports, "__esModule", {value: true});var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/formatted/Address.ts
var Address_exports = {};
__export(Address_exports, {
  abi: () => abi,
  bytecode: () => bytecode
});
var abi = [
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "AddressInsufficientBalance",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
  }
];
var bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212204a050c4fa34153d3fae9d282b8c08f593842bb7e1d0caa440348574559167b6a64736f6c63430008170033";

// src/formatted/AllowedMethodsEnforcer.ts
var AllowedMethodsEnforcer_exports = {};
__export(AllowedMethodsEnforcer_exports, {
  abi: () => abi2,
  bytecode: () => bytecode2
});
var abi2 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "allowedMethods_",
        "type": "bytes4[]",
        "internalType": "bytes4[]"
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode2 = "0x608060405234801561001057600080fd5b506107fc806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a366004610512565b50505050505050505050565b005b610076610086366004610512565b6100b4565b61009e6100993660046105df565b610197565b6040516100ab9190610621565b60405180910390f35b856100c08160006102e5565b6101115760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101228160006102e5565b61017c5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610108565b506101898c8c89896102fc565b505050505050505050505050565b60606000826101a7600482610685565b1580156101b357508015155b6102135760405162461bcd60e51b815260206004820152602b60248201527f416c6c6f7765644d6574686f6473456e666f726365723a696e76616c69642d7460448201526a0cae4dae65ad8cadccee8d60ab1b6064820152608401610108565b61021e6004826106af565b67ffffffffffffffff811115610236576102366106c3565b60405190808252806020026020018201604052801561025f578160200160208202803683370190505b50925060005b818110156102dc5785818661027b8260046106d9565b92610288939291906106ec565b61029191610716565b8484815181106102a3576102a3610746565b6001600160e01b031990921660209283029190910190910152826102c68161075c565b93506102d590506004826106d9565b9050610265565b50505092915050565b6001600160f81b0319828116908216145b92915050565b366000610309848461045c565b90945092505050600481101561037e5760405162461bcd60e51b815260206004820152603460248201527f416c6c6f7765644d6574686f6473456e666f726365723a696e76616c69642d656044820152730f0cac6eae8d2dedc5ac8c2e8c25ad8cadccee8d60631b6064820152608401610108565b600061038d60048284866106ec565b61039691610716565b905060006103a48888610197565b805190915060005b818110156103fb578281815181106103c6576103c6610746565b60200260200101516001600160e01b031916846001600160e01b031916036103f357505050505050610456565b6001016103ac565b5060405162461bcd60e51b815260206004820152602960248201527f416c6c6f7765644d6574686f6473456e666f726365723a6d6574686f642d6e6f6044820152681d0b585b1b1bddd95960ba1b6064820152608401610108565b50505050565b600080368161046e60148287896106ec565b61047791610775565b60601c935061048a6034601487896106ec565b610493916107a8565b92506104a285603481896106ec565b949793965094505050565b60008083601f8401126104bf57600080fd5b50813567ffffffffffffffff8111156104d757600080fd5b6020830191508360208285010111156104ef57600080fd5b9250929050565b80356001600160a01b038116811461050d57600080fd5b919050565b60008060008060008060008060008060e08b8d03121561053157600080fd5b8a3567ffffffffffffffff8082111561054957600080fd5b6105558e838f016104ad565b909c509a5060208d013591508082111561056e57600080fd5b61057a8e838f016104ad565b909a50985060408d0135975060608d013591508082111561059a57600080fd5b506105a78d828e016104ad565b90965094505060808b013592506105c060a08c016104f6565b91506105ce60c08c016104f6565b90509295989b9194979a5092959850565b600080602083850312156105f257600080fd5b823567ffffffffffffffff81111561060957600080fd5b610615858286016104ad565b90969095509350505050565b6020808252825182820181905260009190848201906040850190845b818110156106635783516001600160e01b0319168352928401929184019160010161063d565b50909695505050505050565b634e487b7160e01b600052601260045260246000fd5b6000826106945761069461066f565b500690565b634e487b7160e01b600052601160045260246000fd5b6000826106be576106be61066f565b500490565b634e487b7160e01b600052604160045260246000fd5b808201808211156102f6576102f6610699565b600080858511156106fc57600080fd5b8386111561070957600080fd5b5050820193919092039150565b6001600160e01b0319813581811691600485101561073e5780818660040360031b1b83161692505b505092915050565b634e487b7160e01b600052603260045260246000fd5b60006001820161076e5761076e610699565b5060010190565b6bffffffffffffffffffffffff19813581811691601485101561073e5760149490940360031b84901b1690921692915050565b803560208310156102f657600019602084900360031b1b169291505056fea26469706673582212200b708c0be5e7b588370a3a50ea4c9e1f7cb79f4e1abc8d9c979a4f6d6867e5ae64736f6c63430008170033";

// src/formatted/AllowedTargetsEnforcer.ts
var AllowedTargetsEnforcer_exports = {};
__export(AllowedTargetsEnforcer_exports, {
  abi: () => abi3,
  bytecode: () => bytecode3
});
var abi3 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "allowedTargets_",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode3 = "0x608060405234801561001057600080fd5b50610736806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a36600461047b565b50505050505050505050565b005b61007661008636600461047b565b6100b4565b61009e610099366004610548565b61025e565b6040516100ab919061058a565b60405180910390f35b856100c08160006103ae565b6101115760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101228160006103ae565b61017c5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610108565b50600061018988886103c5565b5050509050600061019a8e8e61025e565b805190915060005b818110156101ed578281815181106101bc576101bc6105d7565b60200260200101516001600160a01b0316846001600160a01b0316036101e55750505050610250565b6001016101a2565b5060405162461bcd60e51b815260206004820152603160248201527f416c6c6f77656454617267657473456e666f726365723a7461726765742d6164604482015270191c995cdccb5b9bdd0b585b1b1bddd959607a1b6064820152608401610108565b505050505050505050505050565b606060008261026e601482610603565b15801561027a57508015155b6102da5760405162461bcd60e51b815260206004820152602b60248201527f416c6c6f77656454617267657473456e666f726365723a696e76616c69642d7460448201526a0cae4dae65ad8cadccee8d60ab1b6064820152608401610108565b6102e560148261062d565b67ffffffffffffffff8111156102fd576102fd610641565b604051908082528060200260200182016040528015610326578160200160208202803683370190505b50925060005b818110156103a557858186610342826014610657565b9261034f9392919061066a565b61035891610694565b60601c84848151811061036d5761036d6105d7565b6001600160a01b03909216602092830291909101909101528261038f816106c9565b935061039e9050601482610657565b905061032c565b50505092915050565b6001600160f81b0319828116908216145b92915050565b60008036816103d7601482878961066a565b6103e091610694565b60601c93506103f360346014878961066a565b6103fc916106e2565b925061040b856034818961066a565b949793965094505050565b60008083601f84011261042857600080fd5b50813567ffffffffffffffff81111561044057600080fd5b60208301915083602082850101111561045857600080fd5b9250929050565b80356001600160a01b038116811461047657600080fd5b919050565b60008060008060008060008060008060e08b8d03121561049a57600080fd5b8a3567ffffffffffffffff808211156104b257600080fd5b6104be8e838f01610416565b909c509a5060208d01359150808211156104d757600080fd5b6104e38e838f01610416565b909a50985060408d0135975060608d013591508082111561050357600080fd5b506105108d828e01610416565b90965094505060808b0135925061052960a08c0161045f565b915061053760c08c0161045f565b90509295989b9194979a5092959850565b6000806020838503121561055b57600080fd5b823567ffffffffffffffff81111561057257600080fd5b61057e85828601610416565b90969095509350505050565b6020808252825182820181905260009190848201906040850190845b818110156105cb5783516001600160a01b0316835292840192918401916001016105a6565b50909695505050505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601260045260246000fd5b600082610612576106126105ed565b500690565b634e487b7160e01b600052601160045260246000fd5b60008261063c5761063c6105ed565b500490565b634e487b7160e01b600052604160045260246000fd5b808201808211156103bf576103bf610617565b6000808585111561067a57600080fd5b8386111561068757600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156106c15780818660140360031b1b83161692505b505092915050565b6000600182016106db576106db610617565b5060010190565b803560208310156103bf57600019602084900360031b1b169291505056fea2646970667358221220192854344f7cbe5e3a46630068ff1c57d1382d110f4c7dae36ce8f18206bd1c864736f6c63430008170033";

// src/formatted/Base64.ts
var Base64_exports = {};
__export(Base64_exports, {
  abi: () => abi4,
  bytecode: () => bytecode4
});
var abi4 = [];
var bytecode4 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122088f05df9a321ebbfd15b9ae491704455fd55c5a0ef490ba4f3111c5cd7aa944764736f6c63430008170033";

// src/formatted/Base64URL.ts
var Base64URL_exports = {};
__export(Base64URL_exports, {
  abi: () => abi5,
  bytecode: () => bytecode5
});
var abi5 = [];
var bytecode5 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220ba35151db75ea04dd32865d4b2bd18ac453d87dfd60b81ec325260f801c1709564736f6c63430008170033";

// src/formatted/ArgsEqualityCheckEnforcer.ts
var ArgsEqualityCheckEnforcer_exports = {};
__export(ArgsEqualityCheckEnforcer_exports, {
  abi: () => abi6,
  bytecode: () => bytecode6
});
var abi6 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "DifferentArgsAndTerms",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "terms",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      },
      {
        "name": "args",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  }
];
var bytecode6 = "0x608060405234801561001057600080fd5b506103b7806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063414c3e3314610051578063a145832a1461006d578063d3eddcc514610051578063ed46336714610051575b600080fd5b61006b61005f366004610249565b50505050505050505050565b005b61006b61007b366004610249565b85600881901b6001600160f81b03198116156100ec5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5088886040516100fd929190610316565b60405180910390208b8b604051610115929190610316565b6040518091039020146101d75783826001600160a01b0316336001600160a01b03167f07fc5f2898fc1f1cf9d6012177b7abb8d010b9e64055979af3a5bcd274e2a11a8e8e8e8e60405161016c949392919061034f565b60405180910390a460405162461bcd60e51b815260206004820152603260248201527f41726773457175616c697479436865636b456e666f726365723a646966666572604482015271656e742d617267732d616e642d7465726d7360701b60648201526084016100e3565b5050505050505050505050565b60008083601f8401126101f657600080fd5b50813567ffffffffffffffff81111561020e57600080fd5b60208301915083602082850101111561022657600080fd5b9250929050565b80356001600160a01b038116811461024457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561026857600080fd5b8a3567ffffffffffffffff8082111561028057600080fd5b61028c8e838f016101e4565b909c509a5060208d01359150808211156102a557600080fd5b6102b18e838f016101e4565b909a50985060408d0135975060608d01359150808211156102d157600080fd5b506102de8d828e016101e4565b90965094505060808b013592506102f760a08c0161022d565b915061030560c08c0161022d565b90509295989b9194979a5092959850565b8183823760009101908152919050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b604081526000610363604083018688610326565b8281036020840152610376818587610326565b97965050505050505056fea264697066735822122078e67ed2011e86335117ad2962f5a7ffbe2179a19bda7b4e0f3c3beff2ca893c64736f6c63430008170033";

// src/formatted/Context.ts
var Context_exports = {};
__export(Context_exports, {
  abi: () => abi7,
  bytecode: () => bytecode7
});
var abi7 = [];
var bytecode7 = "0x";

// src/formatted/Create2.ts
var Create2_exports = {};
__export(Create2_exports, {
  abi: () => abi8,
  bytecode: () => bytecode8
});
var abi8 = [
  {
    "type": "error",
    "name": "Create2EmptyBytecode",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Create2FailedDeployment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Create2InsufficientBalance",
    "inputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  }
];
var bytecode8 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122010c6b66ba2fc3a92f070bf47f6d02e68772a73d44eed07c73bca1c9f7fab44e964736f6c63430008170033";

// src/formatted/CaveatEnforcer.ts
var CaveatEnforcer_exports = {};
__export(CaveatEnforcer_exports, {
  abi: () => abi9,
  bytecode: () => bytecode9
});
var abi9 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
];
var bytecode9 = "0x";

// src/formatted/DeleGatorCore.ts
var DeleGatorCore_exports = {};
__export(DeleGatorCore_exports, {
  abi: () => abi10,
  bytecode: () => bytecode10
});
var abi10 = [
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "PACKED_USER_OP_TYPEHASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addDeposit",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "delegationManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDelegationManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "disableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "enableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "entryPoint",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IEntryPoint"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_execution",
        "type": "tuple",
        "internalType": "struct Execution",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "executeFromExecutor",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "returnData_",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getDeposit",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDomainHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInitializedVersion",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "_key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationTypedDataHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isDelegationDisabled",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "_hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "magicValue_",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155BatchReceived",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC721Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "redeemDelegations",
    "inputs": [
      {
        "name": "_permissionContexts",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "_modes",
        "type": "bytes32[]",
        "internalType": "ModeCode[]"
      },
      {
        "name": "_executionCallDatas",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "_interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [
      {
        "name": "_newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCallAndRetainStorage",
    "inputs": [
      {
        "name": "_newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "validateUserOp",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_missingAccountFunds",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "validationData_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawDeposit",
    "inputs": [
      {
        "name": "_withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "_withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ClearedStorage",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SentPrefund",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "success",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDelegationManager",
    "inputs": [
      {
        "name": "newDelegationManager",
        "type": "address",
        "indexed": true,
        "internalType": "contract IDelegationManager"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetEntryPoint",
    "inputs": [
      {
        "name": "entryPoint",
        "type": "address",
        "indexed": true,
        "internalType": "contract IEntryPoint"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TryExecuteUnsuccessful",
    "inputs": [
      {
        "name": "batchExecutionindex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "result",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967NonPayable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExecutionFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotDelegationManager",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPoint",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPointOrSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "UUPSUnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnsupportedProxiableUUID",
    "inputs": [
      {
        "name": "slot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedCallType",
    "inputs": [
      {
        "name": "callType",
        "type": "bytes1",
        "internalType": "CallType"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedExecType",
    "inputs": [
      {
        "name": "execType",
        "type": "bytes1",
        "internalType": "ExecType"
      }
    ]
  }
];
var bytecode10 = "0x";

// src/formatted/DelegationMetaSwapAdapter.ts
var DelegationMetaSwapAdapter_exports = {};
__export(DelegationMetaSwapAdapter_exports, {
  abi: () => abi11,
  bytecode: () => bytecode11
});
var abi11 = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_swapApiSigner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "contract IDelegationManager"
      },
      {
        "name": "_metaSwap",
        "type": "address",
        "internalType": "contract IMetaSwap"
      },
      {
        "name": "_argsEqualityCheckEnforcer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "WHITELIST_ENFORCED",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "WHITELIST_NOT_ENFORCED",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "acceptOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "argsEqualityCheckEnforcer",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "delegationManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDelegationManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "executeFromExecutor",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "returnData_",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "isAggregatorAllowed",
    "inputs": [
      {
        "name": "aggregatorIdHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "allowed",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isTokenAllowed",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ],
    "outputs": [
      {
        "name": "allowed",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "metaSwap",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IMetaSwap"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pendingOwner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setSwapApiSigner",
    "inputs": [
      {
        "name": "_newSigner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "swapApiSigner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "swapByDelegation",
    "inputs": [
      {
        "name": "_signatureData",
        "type": "tuple",
        "internalType": "struct DelegationMetaSwapAdapter.SignatureData",
        "components": [
          {
            "name": "apiData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "expiration",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "_delegations",
        "type": "tuple[]",
        "internalType": "struct Delegation[]",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "_useTokenWhitelist",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "swapTokens",
    "inputs": [
      {
        "name": "_aggregatorId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_tokenFrom",
        "type": "address",
        "internalType": "contract IERC20"
      },
      {
        "name": "_tokenTo",
        "type": "address",
        "internalType": "contract IERC20"
      },
      {
        "name": "_recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_amountFrom",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_balanceFromBefore",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_swapData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateAllowedAggregatorIds",
    "inputs": [
      {
        "name": "_aggregatorIds",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "_statuses",
        "type": "bool[]",
        "internalType": "bool[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateAllowedTokens",
    "inputs": [
      {
        "name": "_tokens",
        "type": "address[]",
        "internalType": "contract IERC20[]"
      },
      {
        "name": "_statuses",
        "type": "bool[]",
        "internalType": "bool[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [
      {
        "name": "_token",
        "type": "address",
        "internalType": "contract IERC20"
      },
      {
        "name": "_amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_recipient",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ChangedAggregatorIdStatus",
    "inputs": [
      {
        "name": "aggregatorIdHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "aggregatorId",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "status",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ChangedTokenStatus",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": false,
        "internalType": "contract IERC20"
      },
      {
        "name": "status",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferStarted",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SentTokens",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "contract IERC20"
      },
      {
        "name": "recipient",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetArgsEqualityCheckEnforcer",
    "inputs": [
      {
        "name": "newArgsEqualityCheckEnforcer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDelegationManager",
    "inputs": [
      {
        "name": "newDelegationManager",
        "type": "address",
        "indexed": true,
        "internalType": "contract IDelegationManager"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetMetaSwap",
    "inputs": [
      {
        "name": "newMetaSwap",
        "type": "address",
        "indexed": true,
        "internalType": "contract IMetaSwap"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SwapApiSignerUpdated",
    "inputs": [
      {
        "name": "newSigner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TryExecuteUnsuccessful",
    "inputs": [
      {
        "name": "batchExecutionindex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "result",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "AddressInsufficientBalance",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "AggregatorIdIsNotAllowed",
    "inputs": [
      {
        "name": "aggregatorId",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "AmountFromMismatch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureLength",
    "inputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureS",
    "inputs": [
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "ExecutionFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedNativeTokenTransfer",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InputLengthsMismatch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientTokens",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidApiSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEmptyDelegations",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidIdenticalTokens",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidSwapFunctionSelector",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidZeroAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "MissingArgsEqualityCheckEnforcer",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotDelegationManager",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotLeafDelegator",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "SafeERC20FailedOperation",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "SignatureExpired",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TokenFromIsNotAllowed",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ]
  },
  {
    "type": "error",
    "name": "TokenFromMismatch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TokenToIsNotAllowed",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedCallType",
    "inputs": [
      {
        "name": "callType",
        "type": "bytes1",
        "internalType": "CallType"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedExecType",
    "inputs": [
      {
        "name": "execType",
        "type": "bytes1",
        "internalType": "ExecType"
      }
    ]
  }
];
var bytecode11 = "0x60e06040523480156200001157600080fd5b506040516200306738038062003067833981016040819052620000349162000258565b846001600160a01b0381166200006457604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b6200006f81620001d4565b506001600160a01b03841615806200008e57506001600160a01b038316155b80620000a157506001600160a01b038216155b80620000b457506001600160a01b038116155b15620000d35760405163f6b2911f60e01b815260040160405180910390fd5b600280546001600160a01b0319166001600160a01b0386811691821790925584821660805283821660a05290821660c0526040517fdeeca532e75e413fdd750935f0d28d3686b7e2074831c42f70db2ca0dc7b32d090600090a26040516001600160a01b038416907fb2e8eb88b584ae71ef4e854c10847f4d39bd93e52599f147bfb4dcc8de52014d90600090a26040516001600160a01b038316907f5a3c783d657606d324917524307587fd272edc5e8b257da020bb6072226b6b2c90600090a26040516001600160a01b038216907fb21681281e4a8a2f3a982e391c6e8b4638d9ccd60e9fa9715dc26c7e3cd15bbe90600090a25050505050620002d8565b600180546001600160a01b0319169055620001ef81620001f2565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0381168114620001ef57600080fd5b600080600080600060a086880312156200027157600080fd5b85516200027e8162000242565b6020870151909550620002918162000242565b6040870151909450620002a48162000242565b6060870151909350620002b78162000242565b6080870151909250620002ca8162000242565b809150509295509295909350565b60805160a05160c051612d356200033260003960008181610288015261136801526000818161033201528181610f4601528181610fd601526110010152600081816103a4015281816109120152610cf30152612d356000f3fe6080604052600436106101235760003560e01c8063ab7180f7116100a0578063ea4d3c9b11610064578063ea4d3c9b14610392578063ea9c6555146103c6578063f2fde38b1461040a578063f9eaee0d1461042a578063fcdea7a91461045a57600080fd5b8063ab7180f7146102aa578063b555ddad14610300578063cb2ef5fe14610320578063d691c96414610354578063e30c39781461037457600080fd5b8063715018a6116100e7578063715018a61461020e57806379ba5097146102235780638da5cb5b1461023857806390ef4d1b14610256578063a42ff9311461027657600080fd5b8063059ba4ee1461012f578063178984911461016c5780636451b418146101ac57806367ebd8a2146101ce57806369328dec146101ee57600080fd5b3661012a57005b600080fd5b34801561013b57600080fd5b5060025461014f906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561017857600080fd5b5061019c610187366004611e85565b60046020526000908152604090205460ff1681565b6040519015158152602001610163565b3480156101b857600080fd5b506101cc6101c7366004612108565b61047a565b005b3480156101da57600080fd5b506101cc6101e9366004612281565b61098c565b3480156101fa57600080fd5b506101cc61020936600461229e565b610a05565b34801561021a57600080fd5b506101cc610a1d565b34801561022f57600080fd5b506101cc610a31565b34801561024457600080fd5b506000546001600160a01b031661014f565b34801561026257600080fd5b506101cc61027136600461232b565b610a75565b34801561028257600080fd5b5061014f7f000000000000000000000000000000000000000000000000000000000000000081565b3480156102b657600080fd5b506102f36040518060400160405280601c81526020017f546f6b656e2d57686974656c6973742d4e6f742d456e666f726365640000000081525081565b60405161016391906123e6565b34801561030c57600080fd5b506101cc61031b36600461232b565b610bcb565b34801561032c57600080fd5b5061014f7f000000000000000000000000000000000000000000000000000000000000000081565b61036761036236600461243a565b610ce6565b60405161016391906124df565b34801561038057600080fd5b506001546001600160a01b031661014f565b34801561039e57600080fd5b5061014f7f000000000000000000000000000000000000000000000000000000000000000081565b3480156103d257600080fd5b506102f360405180604001604052806018815260200177151bdad95b8b55da1a5d195b1a5cdd0b515b999bdc98d95960421b81525081565b34801561041657600080fd5b506101cc610425366004612281565b610e1f565b34801561043657600080fd5b5061019c610445366004612281565b60036020526000908152604090205460ff1681565b34801561046657600080fd5b506101cc6104753660046124f2565b610e90565b61048b610486846125b4565b6110ba565b6000808080806104a361049e898061262a565b611194565b94509450945094509450600087519050806000036104d45760405163478bfa6560e01b815260040160405180910390fd5b836001600160a01b0316856001600160a01b03160361050657604051634e570e4560e01b815260040160405180910390fd5b61051285858a8a61132c565b600460008760405160200161052791906123e6565b60408051601f198184030181529181528151602092830120835290820192909252016000205460ff16610578578560405163b55e93d160e01b815260040161056f91906123e6565b60405180910390fd5b336001600160a01b03168860008151811061059557610595612670565b6020026020010151602001516001600160a01b0316146105c85760405163a711bbaf60e01b815260040160405180910390fd5b60003063fcdea7a98888888d6105df60018961269c565b815181106105ef576105ef612670565b602002602001015160200151896106058d6115b4565b8a60405160240161061c97969594939291906126af565b60408051601f19818403018152918152602080830180516001600160e01b031660e09590951b94909417909352805160028082526060820190925291945060009350909182015b60608152602001906001900390816106635790505090508960405160200161068b919061270f565b604051602081830303815290604052816000815181106106ad576106ad612670565b6020908102919091010152600060405190808252806020026020018201604052801561073957816020015b6107266040518060c0016040528060006001600160a01b0316815260200160006001600160a01b03168152602001600080191681526020016060815260200160008152602001606081525090565b8152602001906001900390816106d85790505b5060405160200161074a919061270f565b6040516020818303038152906040528160018151811061076c5761076c612670565b6020908102919091010152604080516002808252606082019092526000918160200160208202803683370190505090506107a4611639565b816000815181106107b7576107b7612670565b6020026020010181815250506107cb611639565b816001815181106107de576107de612670565b602090810291909101015260408051600280825260608201909252600091816020015b60608152602001906001900390816108015790505090506001600160a01b0389166108635761084030886040518060200160405280600081525061164c565b8160008151811061085357610853612670565b60200260200101819052506108d1565b6040513060248201526044810188905260009060640160408051601f198184030181529190526020810180516001600160e01b031663a9059cbb60e01b17905290506108b18a60008361164c565b826000815181106108c4576108c4612670565b6020026020010181905250505b6108dd3060008661164c565b816001815181106108f0576108f0612670565b602090810291909101015260405163cef6d20960e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cef6d2099061094b90869086908690600401612841565b600060405180830381600087803b15801561096557600080fd5b505af1158015610979573d6000803e3d6000fd5b5050505050505050505050505050505050565b61099461167b565b6001600160a01b0381166109bb5760405163f6b2911f60e01b815260040160405180910390fd5b600280546001600160a01b0319166001600160a01b0383169081179091556040517fdeeca532e75e413fdd750935f0d28d3686b7e2074831c42f70db2ca0dc7b32d090600090a250565b610a0d61167b565b610a188383836116a8565b505050565b610a2561167b565b610a2f60006117a1565b565b60015433906001600160a01b03168114610a695760405163118cdaa760e01b81526001600160a01b038216600482015260240161056f565b610a72816117a1565b50565b610a7d61167b565b82818114610a9e57604051637e26301b60e11b815260040160405180910390fd5b60005b81811015610bc3576000868683818110610abd57610abd612670565b9050602002810190610acf919061262a565b604051602001610ae09291906128d4565b6040516020818303038152906040528051906020012090506000858584818110610b0c57610b0c612670565b9050602002016020810190610b2191906128f0565b60008381526004602052604090205490915060ff16151581151514610bb9576000828152600460205260409020805460ff1916821515179055817ffe89a7e0da76ce9087f67dbe71c999de74699125edabbdd3ef09b42dafdf9e55898986818110610b8e57610b8e612670565b9050602002810190610ba0919061262a565b84604051610bb09392919061290d565b60405180910390a25b5050600101610aa1565b505050505050565b610bd361167b565b82818114610bf457604051637e26301b60e11b815260040160405180910390fd5b60005b81811015610bc3576000868683818110610c1357610c13612670565b9050602002016020810190610c289190612281565b90506000858584818110610c3e57610c3e612670565b9050602002016020810190610c5391906128f0565b6001600160a01b03831660009081526003602052604090205490915060ff16151581151514610cdc576001600160a01b038216600081815260036020908152604091829020805460ff19168515159081179091558251938452908301527fd0847c60d8132f1d2a3af347506243fa046f163a2c9c6698c43b31e1d7d95bc4910160405180910390a15b5050600101610bf7565b6060336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610d3157604051630692ce8160e21b815260040160405180910390fd5b83600881901b6001600160f81b0319821615610d6c57604051632e5bf3f960e21b81526001600160f81b03198316600482015260240161056f565b6001600160f81b0319811615610da1576040516308c3ee0360e11b81526001600160f81b03198216600482015260240161056f565b600080366000610db189896117ba565b6040805160018082528183019092529498509296509094509250816020015b6060815260200190600190039081610dd0579050509650610df38484848461180b565b87600081518110610e0657610e06612670565b60200260200101819052505050505050505b9392505050565b610e2761167b565b600180546001600160a01b0383166001600160a01b03199091168117909155610e586000546001600160a01b031690565b6001600160a01b03167f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e2270060405160405180910390a350565b333014610eb0576040516314e1dbf760e11b815260040160405180910390fd5b600083610ebc896115b4565b610ec6919061269c565b905084811015610ee9576040516378dbf0af60e11b815260040160405180910390fd5b84811115610f0557610f0588610eff878461269c565b886116a8565b6000610f10886115b4565b905060006001600160a01b038a16610f29575085610fff565b604051636eb1769f60e11b81523060048201526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166024830152600091908c169063dd62ed3e90604401602060405180830381865afa158015610f99573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fbd9190612933565b905087811015610ffd57610ffd6001600160a01b038c167f0000000000000000000000000000000000000000000000000000000000000000600019611841565b505b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316635f575529828e8e8e8c8b8b6040518863ffffffff1660e01b81526004016110569695949392919061294c565b6000604051808303818588803b15801561106f57600080fd5b505af1158015611083573d6000803e3d6000fd5b50505050506000826110948b6115b4565b61109e919061269c565b90506110ab8a828b6116a8565b50505050505050505050505050565b806020015142106110de57604051630819bdcd60e01b815260040160405180910390fd5b6000816000015182602001516040516020016110fb929190612996565b604051602081830303815290604052805190602001209050600061114c827f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b9050600061115e8285604001516118cb565b6002549091506001600160a01b0380831691161461118e57604051626d46e960e31b815260040160405180910390fd5b50505050565b60606000808083816111a9600482898b6129b8565b6111b2916129e2565b90506001600160e01b03198116635f57552960e01b146111e557604051632033702760e11b815260040160405180910390fd5b60006111f4886004818c6129b8565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505082519293506112419284016020908101925084019050612a62565b60408051600060208201819052959c50939a50919750955082918291829182910160408051601f1981840301815290829052611281918a90602001612af9565b6040516020818303038152906040528060200190518101906112a39190612b28565b98505097505050955095509550508a6001600160a01b0316856001600160a01b0316146112e3576040516356cf902d60e01b815260040160405180910390fd5b801580156112fa5750886112f78484612be6565b14155b1561131857604051632f0e599760e11b815260040160405180910390fd5b839950505050505050509295509295909350565b60006001835161133c919061269c565b905082818151811061135057611350612670565b60200260200101516060015151600014806113d857507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168382815181106113a2576113a2612670565b6020026020010151606001516000815181106113c0576113c0612670565b6020026020010151600001516001600160a01b031614155b156113f65760405163113f78d160e31b815260040160405180910390fd5b8115611518576001600160a01b03851660009081526003602052604090205460ff166114405760405163550a4b9360e01b81526001600160a01b038616600482015260240161056f565b6001600160a01b03841660009081526003602052604090205460ff166114845760405163022330e760e61b81526001600160a01b038516600482015260240161056f565b60405180604001604052806018815260200177151bdad95b8b55da1a5d195b1a5cdd0b515b999bdc98d95960421b8152506040516020016114c591906123e6565b6040516020818303038152906040528382815181106114e6576114e6612670565b60200260200101516060015160008151811061150457611504612670565b6020026020010151604001819052506115ad565b6040518060400160405280601c81526020017f546f6b656e2d57686974656c6973742d4e6f742d456e666f726365640000000081525060405160200161155e91906123e6565b60405160208183030381529060405283828151811061157f5761157f612670565b60200260200101516060015160008151811061159d5761159d612670565b6020026020010151604001819052505b5050505050565b60006001600160a01b0382166115cb575047919050565b6040516370a0823160e01b81523060048201526001600160a01b038316906370a0823190602401602060405180830381865afa15801561160f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116339190612933565b92915050565b6000611647818080806118f5565b905090565b606083838360405160200161166393929190612bf9565b60405160208183030381529060405290509392505050565b6000546001600160a01b03163314610a2f5760405163118cdaa760e01b815233600482015260240161056f565b6001600160a01b03831661173b576000816001600160a01b03168360405160006040518083038185875af1925050503d8060008114611703576040519150601f19603f3d011682016040523d82523d6000602084013e611708565b606091505b5050905080611735576040516312988bef60e21b81526001600160a01b038316600482015260240161056f565b5061174f565b61174f6001600160a01b0384168284611960565b806001600160a01b0316836001600160a01b03167f2c42af0ac449800f98313b961b8c9e7d69c3065be5b86449ed4c358e01d3a7808460405161179491815260200190565b60405180910390a3505050565b600180546001600160a01b0319169055610a72816119bf565b60008036816117cc60148287896129b8565b6117d591612c38565b60601c93506117e86034601487896129b8565b6117f191612c6b565b925061180085603481896129b8565b949793965094505050565b60405181838237600038838387895af1611828573d6000823e3d81fd5b3d8152602081013d6000823e3d01604052949350505050565b604051636eb1769f60e11b81523060048201526001600160a01b0383811660248301526000919085169063dd62ed3e90604401602060405180830381865afa158015611891573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118b59190612933565b905061118e84846118c68585612be6565b611a0f565b6000806000806118db8686611a9f565b9250925092506118eb8282611aec565b5090949350505050565b604080516001600160f81b03198087166020830152851660218201526000602282018190526001600160e01b03198516602683015269ffffffffffffffffffff198416602a830152910160405160208183030381529060405261195790612c89565b95945050505050565b6040516001600160a01b03838116602483015260448201839052610a1891859182169063a9059cbb906064015b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050611ba9565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663095ea7b360e01b179052611a608482611c0c565b61118e576040516001600160a01b03848116602483015260006044830152611a9591869182169063095ea7b39060640161198d565b61118e8482611ba9565b60008060008351604103611ad95760208401516040850151606086015160001a611acb88828585611caf565b955095509550505050611ae5565b50508151600091506002905b9250925092565b6000826003811115611b0057611b00612cb0565b03611b09575050565b6001826003811115611b1d57611b1d612cb0565b03611b3b5760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115611b4f57611b4f612cb0565b03611b705760405163fce698f760e01b81526004810182905260240161056f565b6003826003811115611b8457611b84612cb0565b03611ba5576040516335e2f38360e21b81526004810182905260240161056f565b5050565b6000611bbe6001600160a01b03841683611d7e565b90508051600014158015611be3575080806020019051810190611be19190612cc6565b155b15610a1857604051635274afe760e01b81526001600160a01b038416600482015260240161056f565b6000806000846001600160a01b031684604051611c299190612ce3565b6000604051808303816000865af19150503d8060008114611c66576040519150601f19603f3d011682016040523d82523d6000602084013e611c6b565b606091505b5091509150818015611c95575080511580611c95575080806020019051810190611c959190612cc6565b80156119575750505050506001600160a01b03163b151590565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115611cea5750600091506003905082611d74565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015611d3e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611d6a57506000925060019150829050611d74565b9250600091508190505b9450945094915050565b6060610e188383600084600080856001600160a01b03168486604051611da49190612ce3565b60006040518083038185875af1925050503d8060008114611de1576040519150601f19603f3d011682016040523d82523d6000602084013e611de6565b606091505b5091509150611df6868383611e00565b9695505050505050565b606082611e1557611e1082611e5c565b610e18565b8151158015611e2c57506001600160a01b0384163b155b15611e5557604051639996b31560e01b81526001600160a01b038516600482015260240161056f565b5080610e18565b805115611e6c5780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b600060208284031215611e9757600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b604051606081016001600160401b0381118282101715611ed657611ed6611e9e565b60405290565b60405160c081016001600160401b0381118282101715611ed657611ed6611e9e565b604051601f8201601f191681016001600160401b0381118282101715611f2657611f26611e9e565b604052919050565b60006001600160401b03821115611f4757611f47611e9e565b5060051b60200190565b6001600160a01b0381168114610a7257600080fd5b8035611f7181611f51565b919050565b60006001600160401b03821115611f8f57611f8f611e9e565b50601f01601f191660200190565b600082601f830112611fae57600080fd5b8135611fc1611fbc82611f76565b611efe565b818152846020838601011115611fd657600080fd5b816020850160208301376000918101602001919091529392505050565b600082601f83011261200457600080fd5b81356020612014611fbc83611f2e565b82815260059290921b8401810191818101908684111561203357600080fd5b8286015b848110156120e45780356001600160401b03808211156120575760008081fd5b908801906060828b03601f19018113156120715760008081fd5b612079611eb4565b8784013561208681611f51565b81526040848101358481111561209c5760008081fd5b6120aa8e8b83890101611f9d565b838b0152509184013591838311156120c25760008081fd5b6120d08d8a85880101611f9d565b908201528652505050918301918301612037565b509695505050505050565b8015158114610a7257600080fd5b8035611f71816120ef565b60008060006060848603121561211d57600080fd5b83356001600160401b038082111561213457600080fd5b908501906060828803121561214857600080fd5b909350602090858201358181111561215f57600080fd5b8601601f8101881361217057600080fd5b803561217e611fbc82611f2e565b81815260059190911b8201840190848101908a83111561219d57600080fd5b8584015b83811015612262578035868111156121b857600080fd5b850160c0818e03601f190112156121ce57600080fd5b6121d6611edc565b6121e1898301611f66565b81526121ef60408301611f66565b898201526060820135604082015260808201358881111561220f57600080fd5b61221d8f8b83860101611ff3565b60608301525060a0820135608082015260c0820135888111156122405760008081fd5b61224e8f8b83860101611f9d565b60a0830152508452509186019186016121a1565b50809750505050505050612278604085016120fd565b90509250925092565b60006020828403121561229357600080fd5b8135610e1881611f51565b6000806000606084860312156122b357600080fd5b83356122be81611f51565b92506020840135915060408401356122d581611f51565b809150509250925092565b60008083601f8401126122f257600080fd5b5081356001600160401b0381111561230957600080fd5b6020830191508360208260051b850101111561232457600080fd5b9250929050565b6000806000806040858703121561234157600080fd5b84356001600160401b038082111561235857600080fd5b612364888389016122e0565b9096509450602087013591508082111561237d57600080fd5b5061238a878288016122e0565b95989497509550505050565b60005b838110156123b1578181015183820152602001612399565b50506000910152565b600081518084526123d2816020860160208601612396565b601f01601f19169290920160200192915050565b602081526000610e1860208301846123ba565b60008083601f84011261240b57600080fd5b5081356001600160401b0381111561242257600080fd5b60208301915083602082850101111561232457600080fd5b60008060006040848603121561244f57600080fd5b8335925060208401356001600160401b0381111561246c57600080fd5b612478868287016123f9565b9497909650939450505050565b60008282518085526020808601955060208260051b8401016020860160005b848110156124d257601f198684030189526124c08383516123ba565b988401989250908301906001016124a4565b5090979650505050505050565b602081526000610e186020830184612485565b600080600080600080600080600060e08a8c03121561251057600080fd5b89356001600160401b038082111561252757600080fd5b6125338d838e016123f9565b909b50995060208c0135915061254882611f51565b90975060408b01359061255a82611f51565b90965060608b01359061256c82611f51565b90955060808b0135945060a08b0135935060c08b0135908082111561259057600080fd5b5061259d8c828d016123f9565b915080935050809150509295985092959850929598565b6000606082360312156125c657600080fd5b6125ce611eb4565b82356001600160401b03808211156125e557600080fd5b6125f136838701611f9d565b835260208501356020840152604085013591508082111561261157600080fd5b5061261e36828601611f9d565b60408301525092915050565b6000808335601e1984360301811261264157600080fd5b8301803591506001600160401b0382111561265b57600080fd5b60200191503681900382131561232457600080fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b8181038181111561163357611633612686565b60e0815260006126c260e083018a6123ba565b6001600160a01b0389811660208501528881166040850152871660608401526080830186905260a0830185905282810360c084015261270181856123ba565b9a9950505050505050505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561283457603f19888603018452815160c0860160018060a01b038083511688528089840151168989015260408301516040890152606083015160c060608a015282815180855260e08b01915060e08160051b8c010194508b8301925060005b818110156127f85760df198c870301835283518581511687528d81015160608f8901526127c960608901826123ba565b90506040820151915087810360408901526127e481836123ba565b97505050928c0192918c0191600101612799565b50505050506080820151608088015260a0820151915086810360a088015261282081836123ba565b965050509285019290850190600101612736565b5092979650505050505050565b6060815260006128546060830186612485565b82810360208481019190915285518083528682019282019060005b8181101561288b5784518352938301939183019160010161286f565b5050848103604086015261289f8187612485565b98975050505050505050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6020815260006128e86020830184866128ab565b949350505050565b60006020828403121561290257600080fd5b8135610e18816120ef565b6040815260006129216040830185876128ab565b90508215156020830152949350505050565b60006020828403121561294557600080fd5b5051919050565b60808152600061296060808301888a6128ab565b6001600160a01b03871660208401526040830186905282810360608401526129898185876128ab565b9998505050505050505050565b6040815260006129a960408301856123ba565b90508260208301529392505050565b600080858511156129c857600080fd5b838611156129d557600080fd5b5050820193919092039150565b6001600160e01b03198135818116916004851015612a0a5780818660040360031b1b83161692505b505092915050565b6000612a20611fbc84611f76565b9050828152838383011115612a3457600080fd5b610e18836020830184612396565b600082601f830112612a5357600080fd5b610e1883835160208501612a12565b60008060008060808587031215612a7857600080fd5b84516001600160401b0380821115612a8f57600080fd5b818701915087601f830112612aa357600080fd5b612ab288835160208501612a12565b955060208701519150612ac482611f51565b60408701516060880151929550935080821115612ae057600080fd5b50612aed87828801612a42565b91505092959194509250565b60008351612b0b818460208801612396565b835190830190612b1f818360208801612396565b01949350505050565b60008060008060008060008060006101208a8c031215612b4757600080fd5b8951612b5281611f51565b60208b0151909950612b6381611f51565b60408b0151909850612b7481611f51565b8097505060608a0151955060808a0151945060a08a01516001600160401b03811115612b9f57600080fd5b612bab8c828d01612a42565b94505060c08a0151925060e08a0151612bc381611f51565b6101008b0151909250612bd5816120ef565b809150509295985092959850929598565b8082018082111561163357611633612686565b6bffffffffffffffffffffffff198460601b16815282601482015260008251612c29816034850160208701612396565b91909101603401949350505050565b6bffffffffffffffffffffffff198135818116916014851015612a0a5760149490940360031b84901b1690921692915050565b8035602083101561163357600019602084900360031b1b1692915050565b80516020808301519190811015612caa576000198160200360031b1b821691505b50919050565b634e487b7160e01b600052602160045260246000fd5b600060208284031215612cd857600080fd5b8151610e18816120ef565b60008251612cf5818460208701612396565b919091019291505056fea2646970667358221220e6349ea62bd7b0c0d8eed7da3947908c16ca3383370cc10da3a8b2b40c83b05264736f6c63430008170033";

// src/formatted/BlockNumberEnforcer.ts
var BlockNumberEnforcer_exports = {};
__export(BlockNumberEnforcer_exports, {
  abi: () => abi12,
  bytecode: () => bytecode12
});
var abi12 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "blockAfterThreshold_",
        "type": "uint128",
        "internalType": "uint128"
      },
      {
        "name": "blockBeforeThreshold_",
        "type": "uint128",
        "internalType": "uint128"
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode12 = "0x608060405234801561001057600080fd5b506104ed806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a366004610345565b50505050505050505050565b005b610076610086366004610345565b6100c2565b61009e610099366004610412565b61023e565b604080516001600160801b0393841681529290911660208301520160405180910390f35b85600881901b6001600160f81b03198116156101335760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b506000806101418d8d61023e565b90925090506001600160801b038216156101b957816001600160801b031643116101b95760405162461bcd60e51b8152602060048201526024808201527f426c6f636b4e756d626572456e666f726365723a6561726c792d64656c6567616044820152633a34b7b760e11b606482015260840161012a565b6001600160801b0381161561022f57806001600160801b0316431061022f5760405162461bcd60e51b815260206004820152602660248201527f426c6f636b4e756d626572456e666f726365723a657870697265642d64656c6560448201526533b0ba34b7b760d11b606482015260840161012a565b50505050505050505050505050565b600080602083146102a25760405162461bcd60e51b815260206004820152602860248201527f426c6f636b4e756d626572456e666f726365723a696e76616c69642d7465726d6044820152670e65ad8cadccee8d60c31b606482015260840161012a565b6102b0601060008587610454565b6102b99161047e565b60801c91506102cb8360108187610454565b6102d49161047e565b60801c90509250929050565b60008083601f8401126102f257600080fd5b50813567ffffffffffffffff81111561030a57600080fd5b60208301915083602082850101111561032257600080fd5b9250929050565b80356001600160a01b038116811461034057600080fd5b919050565b60008060008060008060008060008060e08b8d03121561036457600080fd5b8a3567ffffffffffffffff8082111561037c57600080fd5b6103888e838f016102e0565b909c509a5060208d01359150808211156103a157600080fd5b6103ad8e838f016102e0565b909a50985060408d0135975060608d01359150808211156103cd57600080fd5b506103da8d828e016102e0565b90965094505060808b013592506103f360a08c01610329565b915061040160c08c01610329565b90509295989b9194979a5092959850565b6000806020838503121561042557600080fd5b823567ffffffffffffffff81111561043c57600080fd5b610448858286016102e0565b90969095509350505050565b6000808585111561046457600080fd5b8386111561047157600080fd5b5050820193919092039150565b6fffffffffffffffffffffffffffffffff1981358181169160108510156104af5780818660100360031b1b83161692505b50509291505056fea2646970667358221220e786ddc75b5e54c089f23ff0a2c6c7b67417725b5021ebc3aa3b2726c852e6cb64736f6c63430008170033";

// src/formatted/DeployedEnforcer.ts
var DeployedEnforcer_exports = {};
__export(DeployedEnforcer_exports, {
  abi: () => abi13,
  bytecode: () => bytecode13
});
var abi13 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "computeAddress",
    "inputs": [
      {
        "name": "_bytecodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_salt",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "addr_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "expectedAddress_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt_",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "bytecode_",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "event",
    "name": "DeployedContract",
    "inputs": [
      {
        "name": "contractAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SkippedDeployment",
    "inputs": [
      {
        "name": "contractAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "Create2EmptyBytecode",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Create2FailedDeployment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Create2InsufficientBalance",
    "inputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "DeployedEmptyContract",
    "inputs": [
      {
        "name": "contractAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];
var bytecode13 = "0x608060405234801561001057600080fd5b50610748806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e3314610067578063481286e614610083578063a145832a146100b3578063b99deb0e146100c6578063d3eddcc514610067578063ed46336714610067575b600080fd5b6100816100753660046104fe565b50505050505050505050565b005b6100966100913660046105cb565b6100e8565b6040516001600160a01b0390911681526020015b60405180910390f35b6100816100c13660046104fe565b6100fd565b6100d96100d43660046105ed565b61026d565b6040516100aa9392919061062f565b60006100f48284610353565b90505b92915050565b85600881901b6001600160f81b031981161561016e5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b50600080600061017e8e8e61026d565b919450925090506001600160a01b0383163b156101d9576040516001600160a01b03841681527f641dafeb23238fae3ef71c64fced975da90c34dede63890507f3dda6b1e0dfef9060200160405180910390a1505050610260565b60006101e58284610360565b9050836001600160a01b0316816001600160a01b03161461025b5760405162461bcd60e51b815260206004820152602a60248201527f4465706c6f796564456e666f726365723a6465706c6f7965642d6164647265736044820152690e65adad2e6dac2e8c6d60b31b6064820152608401610165565b505050505b5050505050505050505050565b6000806060603484116102d05760405162461bcd60e51b815260206004820152602560248201527f4465706c6f796564456e666f726365723a696e76616c69642d7465726d732d6c6044820152640cadccee8d60db1b6064820152608401610165565b6102de601460008688610695565b6102e7916106bf565b60601c92506102fa603460148688610695565b610303916106f4565b91506103128460348188610695565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509598949750919550929350505050565b60006100f48383306103e8565b600061036e60008385610412565b9050806001600160a01b03163b6000036103a6576040516352c7cd4960e11b81526001600160a01b0382166004820152602401610165565b6040516001600160a01b03821681527faf3c4b03f515b5a38f3c238fdc24abf10854a2f27f2a85743a71de17e9bc7e7f9060200160405180910390a192915050565b6000604051836040820152846020820152828152600b8101905060ff815360559020949350505050565b60008347101561043e5760405163392efb2b60e21b815247600482015260248101859052604401610165565b815160000361046057604051631328927760e21b815260040160405180910390fd5b8282516020840186f590506001600160a01b03811661049257604051633a0ba96160e11b815260040160405180910390fd5b9392505050565b60008083601f8401126104ab57600080fd5b50813567ffffffffffffffff8111156104c357600080fd5b6020830191508360208285010111156104db57600080fd5b9250929050565b80356001600160a01b03811681146104f957600080fd5b919050565b60008060008060008060008060008060e08b8d03121561051d57600080fd5b8a3567ffffffffffffffff8082111561053557600080fd5b6105418e838f01610499565b909c509a5060208d013591508082111561055a57600080fd5b6105668e838f01610499565b909a50985060408d0135975060608d013591508082111561058657600080fd5b506105938d828e01610499565b90965094505060808b013592506105ac60a08c016104e2565b91506105ba60c08c016104e2565b90509295989b9194979a5092959850565b600080604083850312156105de57600080fd5b50508035926020909101359150565b6000806020838503121561060057600080fd5b823567ffffffffffffffff81111561061757600080fd5b61062385828601610499565b90969095509350505050565b60018060a01b03841681526000602084602084015260606040840152835180606085015260005b8181101561067257858101830151858201608001528201610656565b506000608082860101526080601f19601f83011685010192505050949350505050565b600080858511156106a557600080fd5b838611156106b257600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156106ec5780818660140360031b1b83161692505b505092915050565b803560208310156100f757600019602084900360031b1b169291505056fea264697066735822122012632a27b82f8f9b4b083a1f26c705dcd1ceb840e52519ff7902232eb956870464736f6c63430008170033";

// src/formatted/BitMaps.ts
var BitMaps_exports = {};
__export(BitMaps_exports, {
  abi: () => abi14,
  bytecode: () => bytecode14
});
var abi14 = [];
var bytecode14 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212201124664c489cae3f1f240552ace1b72f497b65d8c9bdbce66e0c2b36268dcd2c64736f6c63430008170033";

// src/formatted/EIP7702DeleGatorCore.ts
var EIP7702DeleGatorCore_exports = {};
__export(EIP7702DeleGatorCore_exports, {
  abi: () => abi15,
  bytecode: () => bytecode15
});
var abi15 = [
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "PACKED_USER_OP_TYPEHASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addDeposit",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "delegationManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDelegationManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "disableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "enableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "entryPoint",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IEntryPoint"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_execution",
        "type": "tuple",
        "internalType": "struct Execution",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "executeFromExecutor",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "returnData_",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getDeposit",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDomainHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "_key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationTypedDataHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isDelegationDisabled",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "_hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "magicValue_",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155BatchReceived",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC721Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "redeemDelegations",
    "inputs": [
      {
        "name": "_permissionContexts",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "_modes",
        "type": "bytes32[]",
        "internalType": "ModeCode[]"
      },
      {
        "name": "_executionCallDatas",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsExecutionMode",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "_interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "validateUserOp",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_missingAccountFunds",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "validationData_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawDeposit",
    "inputs": [
      {
        "name": "_withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "_withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SentPrefund",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "success",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDelegationManager",
    "inputs": [
      {
        "name": "newDelegationManager",
        "type": "address",
        "indexed": true,
        "internalType": "contract IDelegationManager"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetEntryPoint",
    "inputs": [
      {
        "name": "entryPoint",
        "type": "address",
        "indexed": true,
        "internalType": "contract IEntryPoint"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TryExecuteUnsuccessful",
    "inputs": [
      {
        "name": "batchExecutionindex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "result",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ExecutionFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEIP712NameLength",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEIP712VersionLength",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotDelegationManager",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPoint",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPointOrSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UnsupportedCallType",
    "inputs": [
      {
        "name": "callType",
        "type": "bytes1",
        "internalType": "CallType"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedExecType",
    "inputs": [
      {
        "name": "execType",
        "type": "bytes1",
        "internalType": "ExecType"
      }
    ]
  }
];
var bytecode15 = "0x";

// src/formatted/ERC1155BalanceChangeEnforcer.ts
var ERC1155BalanceChangeEnforcer_exports = {};
__export(ERC1155BalanceChangeEnforcer_exports, {
  abi: () => abi16,
  bytecode: () => bytecode16
});
var abi16 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceCache",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getHashKey",
    "inputs": [
      {
        "name": "_caller",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "enforceDecrease_",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "token_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "recipient_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amount_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "isLocked",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "lock",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode16 = "0x608060405234801561001057600080fd5b506109cb806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063b99deb0e1161005b578063b99deb0e14610122578063d0a3529f1461016b578063d3eddcc51461017e578063ed463367146100c557600080fd5b806332a16f4e1461008d578063414c3e33146100c5578063a145832a146100e1578063b5e54492146100f4575b600080fd5b6100b061009b3660046106cb565b60016020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100df6100d3366004610749565b50505050505050505050565b005b6100df6100ef366004610749565b610191565b6101146101023660046106cb565b60006020819052908152604090205481565b6040519081526020016100bc565b610135610130366004610816565b610350565b6040805195151586526001600160a01b03948516602087015292909316918401919091526060830152608082015260a0016100bc565b610114610179366004610858565b61045d565b6100df61018c366004610749565b610476565b85600881901b6101a2816000610661565b6102015760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5060008060006102118e8e610350565b50935093509350506000610228338585858c610678565b60008181526001602052604090205490915060ff16156102a25760405162461bcd60e51b815260206004820152602f60248201527f4552433131353542616c616e63654368616e6765456e666f726365723a656e6660448201526e1bdc98d95c8b5a5ccb5b1bd8dad959608a1b60648201526084016101f8565b6000818152600160208190526040808320805460ff191690921790915551627eeac760e11b81526001600160a01b0385811660048301526024820185905286169062fdd58e90604401602060405180830381865afa158015610308573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061032c91906108ad565b60009283526020839052604090922091909155505050505050505050505050505050565b600080808080606986146103c05760405162461bcd60e51b815260206004820152603160248201527f4552433131353542616c616e63654368616e6765456e666f726365723a696e766044820152700c2d8d2c85ae8cae4dae65ad8cadccee8d607b1b60648201526084016101f8565b868660008181106103d3576103d36108c6565b909101356001600160f81b031916151595506103f5905060156001888a6108dc565b6103fe91610906565b60601c935061041160296015888a6108dc565b61041a91610906565b60601c925061042d60496029888a6108dc565b6104369161093b565b9150610445866049818a6108dc565b61044e9161093b565b60001c90509295509295909350565b600061046c8686868686610678565b9695505050505050565b60008060008060006104888f8f610350565b9450945094509450945060006104a1338686868d610678565b600081815260016020526040808220805460ff1916905551627eeac760e11b81526001600160a01b03878116600483015260248201879052929350909187169062fdd58e90604401602060405180830381865afa158015610506573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061052a91906108ad565b905086156105bf5760008281526020819052604090205461054c90849061096f565b8110156105ba5760405162461bcd60e51b815260206004820152603660248201527f4552433131353542616c616e63654368616e6765456e666f726365723a65786360448201527565656465642d62616c616e63652d646563726561736560501b60648201526084016101f8565b61064e565b6000828152602081905260409020546105d9908490610982565b81101561064e5760405162461bcd60e51b815260206004820152603a60248201527f4552433131353542616c616e63654368616e6765456e666f726365723a696e7360448201527f756666696369656e742d62616c616e63652d696e63726561736500000000000060648201526084016101f8565b5050505050505050505050505050505050565b6001600160f81b0319828116908216145b92915050565b604080516001600160a01b0396871660208083019190915295871681830152939095166060840152608083019190915260a0808301919091528351808303909101815260c0909101909252815191012090565b6000602082840312156106dd57600080fd5b5035919050565b60008083601f8401126106f657600080fd5b50813567ffffffffffffffff81111561070e57600080fd5b60208301915083602082850101111561072657600080fd5b9250929050565b80356001600160a01b038116811461074457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561076857600080fd5b8a3567ffffffffffffffff8082111561078057600080fd5b61078c8e838f016106e4565b909c509a5060208d01359150808211156107a557600080fd5b6107b18e838f016106e4565b909a50985060408d0135975060608d01359150808211156107d157600080fd5b506107de8d828e016106e4565b90965094505060808b013592506107f760a08c0161072d565b915061080560c08c0161072d565b90509295989b9194979a5092959850565b6000806020838503121561082957600080fd5b823567ffffffffffffffff81111561084057600080fd5b61084c858286016106e4565b90969095509350505050565b600080600080600060a0868803121561087057600080fd5b6108798661072d565b94506108876020870161072d565b93506108956040870161072d565b94979396509394606081013594506080013592915050565b6000602082840312156108bf57600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b600080858511156108ec57600080fd5b838611156108f957600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156109335780818660140360031b1b83161692505b505092915050565b8035602083101561067257600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561067257610672610959565b808201808211156106725761067261095956fea264697066735822122095ab63871cc701b6845065f3118822a1bb1778b7d93ba045a40145ebc06f19af64736f6c63430008170033";

// src/formatted/DelegationManager.ts
var DelegationManager_exports = {};
__export(DelegationManager_exports, {
  abi: () => abi17,
  bytecode: () => bytecode17
});
var abi17 = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "ANY_DELEGATE",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "DOMAIN_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "NAME",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ROOT_AUTHORITY",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "acceptOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "disableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "disabledDelegations",
    "inputs": [
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "isDisabled",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "enableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getDelegationHash",
    "inputs": [
      {
        "name": "_input",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getDomainHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "paused",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pendingOwner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "redeemDelegations",
    "inputs": [
      {
        "name": "_permissionContexts",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "_modes",
        "type": "bytes32[]",
        "internalType": "ModeCode[]"
      },
      {
        "name": "_executionCallDatas",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unpause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "DisabledDelegation",
    "inputs": [
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "delegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegate",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegation",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EnabledDelegation",
    "inputs": [
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "delegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegate",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegation",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferStarted",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Paused",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RedeemedDelegation",
    "inputs": [
      {
        "name": "rootDelegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegation",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDomain",
    "inputs": [
      {
        "name": "domainHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "domainVersion",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "contractAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Unpaused",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AlreadyDisabled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AlreadyEnabled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "BatchDataLengthMismatch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotUseADisabledDelegation",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureLength",
    "inputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureS",
    "inputs": [
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "EmptySignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EnforcedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExpectedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidAuthority",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidDelegate",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidDelegator",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEOASignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidERC1271Signature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  }
];
var bytecode17 = "0x6101606040523480156200001257600080fd5b506040516200334f3803806200334f833981016040819052620000359162000384565b60408051808201825260118152702232b632b3b0ba34b7b726b0b730b3b2b960791b602080830191909152825180840190935260018352603160f81b9083015290826001600160a01b038116620000a757604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b620000b28162000204565b506001805460ff60a01b19169055620000cd82600262000222565b61012052620000de81600362000222565b61014052815160208084019190912060e052815190820120610100524660a0526200015b60e05161010051604080516000805160206200332f83398151915260208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c0526000620001706200025b565b9050306001600160a01b0316817f04a46d9007577c7ff1e513b900545162ec25d25991ae3dc60cf26ec01a84806d604051806040016040528060118152602001702232b632b3b0ba34b7b726b0b730b3b2b960791b815250604051806040016040528060018152602001603160f81b81525046604051620001f493929190620003fe565b60405180910390a35050620005e5565b600180546001600160a01b03191690556200021f81620002f1565b50565b600060208351101562000242576200023a8362000341565b905062000255565b816200024f8482620004df565b5060ff90505b92915050565b600060c0516001600160a01b0316306001600160a01b031614801562000282575060a05146145b156200028f575060805190565b620002ec60e05161010051604080516000805160206200332f83398151915260208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b905090565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080829050601f815111156200036f578260405163305a27a960e01b81526004016200009e9190620005ab565b80516200037c82620005c0565b179392505050565b6000602082840312156200039757600080fd5b81516001600160a01b0381168114620003af57600080fd5b9392505050565b6000815180845260005b81811015620003de57602081850181015186830182015201620003c0565b506000602082860101526020601f19601f83011685010191505092915050565b606081526000620004136060830186620003b6565b8281036020840152620004278186620003b6565b915050826040830152949350505050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200046357607f821691505b6020821081036200048457634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620004da576000816000526020600020601f850160051c81016020861015620004b55750805b601f850160051c820191505b81811015620004d657828155600101620004c1565b5050505b505050565b81516001600160401b03811115620004fb57620004fb62000438565b62000513816200050c84546200044e565b846200048a565b602080601f8311600181146200054b5760008415620005325750858301515b600019600386901b1c1916600185901b178555620004d6565b600085815260208120601f198616915b828110156200057c578886015182559484019460019091019084016200055b565b50858210156200059b5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b602081526000620003af6020830184620003b6565b80516020808301519190811015620004845760001960209190910360031b1b16919050565b60805160a05160c05160e051610100516101205161014051612cef620006406000396000611bda01526000611bad01526000611b1201526000611aea01526000611a4501526000611a6f01526000611a990152612cef6000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c806383ebb771116100ad578063acb8cc4911610071578063acb8cc491461027f578063cef6d2091461029f578063e30c3978146102b2578063f2fde38b146102c3578063ffa1ad74146102d657600080fd5b806383ebb771146102065780638456cb591461020e57806384b0196e146102165780638da5cb5b14610231578063a3f4df7e1461024257600080fd5b806358909ebc116100f457806358909ebc146101b05780635c975abb146101d157806366134607146101e3578063715018a6146101f657806379ba5097146101fe57600080fd5b80631b13cac2146101315780632d40d0521461014d5780633ed01015146101805780633f4ba83a14610195578063499340471461019d575b600080fd5b61013a60001981565b6040519081526020015b60405180910390f35b61017061015b3660046120e6565b60046020526000908152604090205460ff1681565b6040519015158152602001610144565b61019361018e3660046120ff565b6102fa565b005b6101936103f4565b6101936101ab3660046120ff565b610406565b6101b9610a1181565b6040516001600160a01b039091168152602001610144565b600154600160a01b900460ff16610170565b61013a6101f13660046120ff565b6104f6565b61019361050f565b610193610521565b61013a61056a565b610193610579565b61021e610589565b6040516101449796959493929190612190565b6000546001600160a01b03166101b9565b610272604051806040016040528060118152602001702232b632b3b0ba34b7b726b0b730b3b2b960791b81525081565b6040516101449190612229565b610272604051806040016040528060018152602001603160f81b81525081565b6101936102ad366004612287565b6105cf565b6001546001600160a01b03166101b9565b6101936102d136600461233c565b611891565b610272604051806040016040528060058152602001640312e332e360dc1b81525081565b61030a604082016020830161233c565b6001600160a01b03811633146103335760405163b9f0f17160e01b815260040160405180910390fd5b600061033e836104f6565b60008181526004602052604090205490915060ff1661037057604051637952fbad60e11b815260040160405180910390fd5b6000818152600460209081526040909120805460ff191690556103959084018461233c565b6001600160a01b03166103ae604085016020860161233c565b6001600160a01b0316827f3feadce88fc1b49db633a56fd5307ed6ee18734df83bcc4011daa720c9cd95f1866040516103e79190612484565b60405180910390a4505050565b6103fc611902565b61040461192f565b565b610416604082016020830161233c565b6001600160a01b038116331461043f5760405163b9f0f17160e01b815260040160405180910390fd5b600061044a836104f6565b60008181526004602052604090205490915060ff161561047c57604051625ecddb60e01b815260040160405180910390fd5b6000818152600460209081526040909120805460ff191660011790556104a49084018461233c565b6001600160a01b03166104bd604085016020860161233c565b6001600160a01b0316827fea589ba9473ee1fe77d352c7ed919747715a5d22931b972de9b02a907c66d5dd866040516103e79190612484565b600061050961050483612823565b611984565b92915050565b610517611902565b6104046000611a1f565b60015433906001600160a01b0316811461055e5760405163118cdaa760e01b81526001600160a01b03821660048201526024015b60405180910390fd5b61056781611a1f565b50565b6000610574611a38565b905090565b610581611902565b610404611b63565b60006060806000806000606061059d611ba6565b6105a5611bd3565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b6105d7611c00565b8481811415806105e75750808414155b1561060557604051631bcaf69f60e01b815260040160405180910390fd5b6000816001600160401b0381111561061f5761061f612555565b60405190808252806020026020018201604052801561065257816020015b606081526020019060019003908161063d5790505b5090506000826001600160401b0381111561066f5761066f612555565b6040519080825280602002602001820160405280156106a257816020015b606081526020019060019003908161068d5790505b50905060005b83811015610c815760008a8a838181106106c4576106c461282f565b90506020028101906106d69190612845565b8101906106e3919061288b565b905080516000036107d1576040805160008082526020820190925290610765565b6107526040518060c0016040528060006001600160a01b0316815260200160006001600160a01b03168152602001600080191681526020016060815260200160008152602001606081525090565b8152602001906001900390816107045790505b508483815181106107785761077861282f565b602090810291909101015260006040519080825280602002602001820160405280156107ae578160200160208202803683370190505b508383815181106107c1576107c161282f565b6020026020010181905250610c78565b808483815181106107e4576107e461282f565b6020026020010181905250600081516001600160401b0381111561080a5761080a612555565b604051908082528060200260200182016040528015610833578160200160208202803683370190505b509050808484815181106108495761084961282f565b6020026020010181905250336001600160a01b0316826000815181106108715761087161282f565b6020026020010151600001516001600160a01b0316141580156108c65750610a116001600160a01b0316826000815181106108ae576108ae61282f565b6020026020010151600001516001600160a01b031614155b156108e457604051632d618d8160e21b815260040160405180910390fd5b60005b8251811015610ab55760008382815181106109045761090461282f565b6020026020010151905061091781611984565b8383815181106109295761092961282f565b60200260200101818152505080602001516001600160a01b03163b6000036109dc57600061099e61099461095b61056a565b86868151811061096d5761096d61282f565b602002602001015160405161190160f01b8152600281019290925260228201526042902090565b8360a00151611c2b565b905081602001516001600160a01b0316816001600160a01b0316146109d657604051630f6d9e4760e21b815260040160405180910390fd5b50610aac565b60006109fb6109e961056a565b85858151811061096d5761096d61282f565b9050600082602001516001600160a01b0316631626ba7e838560a001516040518363ffffffff1660e01b8152600401610a3592919061293b565b602060405180830381865afa158015610a52573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a76919061295c565b6001600160e01b0319169050630b135d3f60e11b8114610aa95760405163155ff42760e01b815260040160405180910390fd5b50505b506001016108e7565b5060005b8251811015610c755760046000838381518110610ad857610ad861282f565b60209081029190910181015182528101919091526040016000205460ff1615610b14576040516302dd502960e11b815260040160405180910390fd5b60018351610b22919061299c565b8114610c2b5781610b348260016129af565b81518110610b4457610b4461282f565b6020026020010151838281518110610b5e57610b5e61282f565b60200260200101516040015114610b8857604051636f6a1b8760e11b815260040160405180910390fd5b600083610b968360016129af565b81518110610ba657610ba661282f565b6020026020010151600001519050610a116001600160a01b0316816001600160a01b031614158015610c075750806001600160a01b0316848381518110610bef57610bef61282f565b6020026020010151602001516001600160a01b031614155b15610c2557604051632d618d8160e21b815260040160405180910390fd5b50610c6d565b60001960001b838281518110610c4357610c4361282f565b60200260200101516040015114610c6d57604051636f6a1b8760e11b815260040160405180910390fd5b600101610ab9565b50505b506001016106a8565b5060005b83811015610ea6576000838281518110610ca157610ca161282f565b6020026020010151511115610e9e5760005b838281518110610cc557610cc561282f565b602002602001015151811015610e9c576000848381518110610ce957610ce961282f565b60200260200101518281518110610d0257610d0261282f565b602002602001015160600151905060005b8151811015610e92576000828281518110610d3057610d3061282f565b6020026020010151600001519050806001600160a01b031663414c3e33848481518110610d5f57610d5f61282f565b602002602001015160200151858581518110610d7d57610d7d61282f565b6020026020010151604001518f8f8a818110610d9b57610d9b61282f565b905060200201358e8e8b818110610db457610db461282f565b9050602002810190610dc69190612845565b8c8c81518110610dd857610dd861282f565b60200260200101518b81518110610df157610df161282f565b60200260200101518e8d81518110610e0b57610e0b61282f565b60200260200101518c81518110610e2457610e2461282f565b602002602001015160200151336040518963ffffffff1660e01b8152600401610e549897969594939291906129c2565b600060405180830381600087803b158015610e6e57600080fd5b505af1158015610e82573d6000803e3d6000fd5b5050505050806001019050610d13565b5050600101610cb3565b505b600101610c85565b5060005b838110156114ca57828181518110610ec457610ec461282f565b602002602001015151600003610f82573363d691c964898984818110610eec57610eec61282f565b90506020020135888885818110610f0557610f0561282f565b9050602002810190610f179190612845565b6040518463ffffffff1660e01b8152600401610f3593929190612a2d565b6000604051808303816000875af1158015610f54573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610f7c9190810190612a50565b506114c2565b60005b838281518110610f9757610f9761282f565b60200260200101515181101561116e576000848381518110610fbb57610fbb61282f565b60200260200101518281518110610fd457610fd461282f565b602002602001015160600151905060005b81518110156111645760008282815181106110025761100261282f565b6020026020010151600001519050806001600160a01b031663a145832a8484815181106110315761103161282f565b60200260200101516020015185858151811061104f5761104f61282f565b6020026020010151604001518f8f8a81811061106d5761106d61282f565b905060200201358e8e8b8181106110865761108661282f565b90506020028101906110989190612845565b8c8c815181106110aa576110aa61282f565b60200260200101518b815181106110c3576110c361282f565b60200260200101518e8d815181106110dd576110dd61282f565b60200260200101518c815181106110f6576110f661282f565b602002602001015160200151336040518963ffffffff1660e01b81526004016111269897969594939291906129c2565b600060405180830381600087803b15801561114057600080fd5b505af1158015611154573d6000803e3d6000fd5b5050505050806001019050610fe5565b5050600101610f85565b508281815181106111815761118161282f565b6020026020010151600184838151811061119d5761119d61282f565b6020026020010151516111b0919061299c565b815181106111c0576111c061282f565b6020026020010151602001516001600160a01b031663d691c9648989848181106111ec576111ec61282f565b905060200201358888858181106112055761120561282f565b90506020028101906112179190612845565b6040518463ffffffff1660e01b815260040161123593929190612a2d565b6000604051808303816000875af1158015611254573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261127c9190810190612a50565b5060008382815181106112915761129161282f565b60200260200101515190505b80156114c05760008483815181106112b7576112b761282f565b60200260200101516001836112cc919061299c565b815181106112dc576112dc61282f565b60200260200101516060015190506000815190505b80156114ad5760008261130560018461299c565b815181106113155761131561282f565b6020026020010151600001519050806001600160a01b031663d3eddcc584600185611340919061299c565b815181106113505761135061282f565b6020026020010151602001518560018661136a919061299c565b8151811061137a5761137a61282f565b6020026020010151604001518f8f8a8181106113985761139861282f565b905060200201358e8e8b8181106113b1576113b161282f565b90506020028101906113c39190612845565b8c8c815181106113d5576113d561282f565b602002602001015160018c6113ea919061299c565b815181106113fa576113fa61282f565b60200260200101518e8d815181106114145761141461282f565b602002602001015160018d611429919061299c565b815181106114395761143961282f565b602002602001015160200151336040518963ffffffff1660e01b81526004016114699897969594939291906129c2565b600060405180830381600087803b15801561148357600080fd5b505af1158015611497573d6000803e3d6000fd5b5050505050806114a690612b2f565b90506112f1565b5050806114b990612b2f565b905061129d565b505b600101610eaa565b5060005b838110156117465760008382815181106114ea576114ea61282f565b602002602001015151111561173e57600083828151811061150d5761150d61282f565b60200260200101515190505b801561173c5760008483815181106115335761153361282f565b6020026020010151600183611548919061299c565b815181106115585761155861282f565b60200260200101516060015190506000815190505b80156117295760008261158160018461299c565b815181106115915761159161282f565b6020026020010151600001519050806001600160a01b031663ed463367846001856115bc919061299c565b815181106115cc576115cc61282f565b602002602001015160200151856001866115e6919061299c565b815181106115f6576115f661282f565b6020026020010151604001518f8f8a8181106116145761161461282f565b905060200201358e8e8b81811061162d5761162d61282f565b905060200281019061163f9190612845565b8c8c815181106116515761165161282f565b602002602001015160018c611666919061299c565b815181106116765761167661282f565b60200260200101518e8d815181106116905761169061282f565b602002602001015160018d6116a5919061299c565b815181106116b5576116b561282f565b602002602001015160200151336040518963ffffffff1660e01b81526004016116e59897969594939291906129c2565b600060405180830381600087803b1580156116ff57600080fd5b505af1158015611713573d6000803e3d6000fd5b50505050508061172290612b2f565b905061156d565b50508061173590612b2f565b9050611519565b505b6001016114ce565b5060005b838110156118855760008382815181106117665761176661282f565b602002602001015151111561187d5760005b83828151811061178a5761178a61282f565b60200260200101515181101561187b57336001600160a01b03168483815181106117b6576117b661282f565b602002602001015160018685815181106117d2576117d261282f565b6020026020010151516117e5919061299c565b815181106117f5576117f561282f565b6020026020010151602001516001600160a01b03167f40dadaa36c6c2e3d7317e24757451ffb2d603d875f0ad5e92c5dd156573b187386858151811061183d5761183d61282f565b602002602001015184815181106118565761185661282f565b602002602001015160405161186b9190612b46565b60405180910390a3600101611778565b505b60010161174a565b50505050505050505050565b611899611902565b600180546001600160a01b0383166001600160a01b031990911681179091556118ca6000546001600160a01b031690565b6001600160a01b03167f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e2270060405160405180910390a350565b6000546001600160a01b031633146104045760405163118cdaa760e01b8152336004820152602401610555565b611937611c55565b6001805460ff60a01b191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6000807f88c1d2ecf185adf710588203a5f263f0ff61be0d33da39792cde19ba9aa4331e8360000151846020015185604001516119c48760600151611c7f565b6080808901516040805160208101989098526001600160a01b03968716908801529490931660608601529184015260a083015260c082015260e0015b60408051601f1981840301815291905280516020909101209392505050565b600180546001600160a01b031916905561056781611d4a565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015611a9157507f000000000000000000000000000000000000000000000000000000000000000046145b15611abb57507f000000000000000000000000000000000000000000000000000000000000000090565b610574604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b611b6b611c00565b6001805460ff60a01b1916600160a01b1790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586119673390565b60606105747f00000000000000000000000000000000000000000000000000000000000000006002611d9a565b60606105747f00000000000000000000000000000000000000000000000000000000000000006003611d9a565b600154600160a01b900460ff16156104045760405163d93c066560e01b815260040160405180910390fd5b600080600080611c3b8686611e45565b925092509250611c4b8282611e92565b5090949350505050565b600154600160a01b900460ff1661040457604051638dfc202b60e01b815260040160405180910390fd5b60008082516001600160401b03811115611c9b57611c9b612555565b604051908082528060200260200182016040528015611cc4578160200160208202803683370190505b50905060005b8351811015611d1a57611cf5848281518110611ce857611ce861282f565b6020026020010151611f4f565b828281518110611d0757611d0761282f565b6020908102919091010152600101611cca565b5080604051602001611d2c9190612c33565b60405160208183030381529060405280519060200120915050919050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b606060ff8314611db457611dad83611fb0565b9050610509565b818054611dc090612c69565b80601f0160208091040260200160405190810160405280929190818152602001828054611dec90612c69565b8015611e395780601f10611e0e57610100808354040283529160200191611e39565b820191906000526020600020905b815481529060010190602001808311611e1c57829003601f168201915b50505050509050610509565b60008060008351604103611e7f5760208401516040850151606086015160001a611e7188828585611fef565b955095509550505050611e8b565b50508151600091506002905b9250925092565b6000826003811115611ea657611ea6612ca3565b03611eaf575050565b6001826003811115611ec357611ec3612ca3565b03611ee15760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115611ef557611ef5612ca3565b03611f165760405163fce698f760e01b815260048101829052602401610555565b6003826003811115611f2a57611f2a612ca3565b03611f4b576040516335e2f38360e21b815260048101829052602401610555565b5050565b6000807f80ad7e1b04ee6d994a125f4714ca0720908bd80ed16063ec8aee4b88e9253e2d8360000151846020015180519060200120604051602001611a00939291909283526001600160a01b03919091166020830152604082015260600190565b60606000611fbd836120be565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a084111561202a57506000915060039050826120b4565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa15801561207e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166120aa575060009250600191508290506120b4565b9250600091508190505b9450945094915050565b600060ff8216601f81111561050957604051632cd44ac360e21b815260040160405180910390fd5b6000602082840312156120f857600080fd5b5035919050565b60006020828403121561211157600080fd5b81356001600160401b0381111561212757600080fd5b820160c0818503121561213957600080fd5b9392505050565b60005b8381101561215b578181015183820152602001612143565b50506000910152565b6000815180845261217c816020860160208601612140565b601f01601f19169290920160200192915050565b60ff60f81b881681526000602060e060208401526121b160e084018a612164565b83810360408501526121c3818a612164565b606085018990526001600160a01b038816608086015260a0850187905284810360c08601528551808252602080880193509091019060005b81811015612217578351835292840192918401916001016121fb565b50909c9b505050505050505050505050565b6020815260006121396020830184612164565b60008083601f84011261224e57600080fd5b5081356001600160401b0381111561226557600080fd5b6020830191508360208260051b850101111561228057600080fd5b9250929050565b600080600080600080606087890312156122a057600080fd5b86356001600160401b03808211156122b757600080fd5b6122c38a838b0161223c565b909850965060208901359150808211156122dc57600080fd5b6122e88a838b0161223c565b9096509450604089013591508082111561230157600080fd5b5061230e89828a0161223c565b979a9699509497509295939492505050565b80356001600160a01b038116811461233757600080fd5b919050565b60006020828403121561234e57600080fd5b61213982612320565b6000808335601e1984360301811261236e57600080fd5b83016020810192503590506001600160401b0381111561238d57600080fd5b80360382131561228057600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60008383855260208086019550808560051b830101846000805b8881101561247657858403601f19018a52823536899003605e19018112612404578283fd5b880160606001600160a01b0361241983612320565b16865261242887830183612357565b828989015261243a838901828461239c565b92505050604061244c81840184612357565b93508783038289015261246083858361239c565b9d89019d975050509386019350506001016123df565b509198975050505050505050565b6020815260006001600160a01b038061249c85612320565b166020840152806124af60208601612320565b16604084015250604083013560608301526060830135601e198436030181126124d757600080fd5b83016020810190356001600160401b038111156124f357600080fd5b8060051b360382131561250557600080fd5b60c0608085015261251a60e0850182846123c5565b915050608084013560a084015261253460a0850185612357565b848303601f190160c086015261254b83828461239c565b9695505050505050565b634e487b7160e01b600052604160045260246000fd5b604051606081016001600160401b038111828210171561258d5761258d612555565b60405290565b60405160c081016001600160401b038111828210171561258d5761258d612555565b604051601f8201601f191681016001600160401b03811182821017156125dd576125dd612555565b604052919050565b60006001600160401b038211156125fe576125fe612555565b5060051b60200190565b60006001600160401b0382111561262157612621612555565b50601f01601f191660200190565b600082601f83011261264057600080fd5b813561265361264e82612608565b6125b5565b81815284602083860101111561266857600080fd5b816020850160208301376000918101602001919091529392505050565b600082601f83011261269657600080fd5b813560206126a661264e836125e5565b82815260059290921b840181019181810190868411156126c557600080fd5b8286015b848110156127745780356001600160401b03808211156126e95760008081fd5b908801906060828b03601f19018113156127035760008081fd5b61270b61256b565b612716888501612320565b81526040808501358481111561272c5760008081fd5b61273a8e8b8389010161262f565b838b0152509184013591838311156127525760008081fd5b6127608d8a8588010161262f565b9082015286525050509183019183016126c9565b509695505050505050565b600060c0828403121561279157600080fd5b612799612593565b90506127a482612320565b81526127b260208301612320565b60208201526040820135604082015260608201356001600160401b03808211156127db57600080fd5b6127e785838601612685565b60608401526080840135608084015260a084013591508082111561280a57600080fd5b506128178482850161262f565b60a08301525092915050565b6000610509368361277f565b634e487b7160e01b600052603260045260246000fd5b6000808335601e1984360301811261285c57600080fd5b8301803591506001600160401b0382111561287657600080fd5b60200191503681900382131561228057600080fd5b6000602080838503121561289e57600080fd5b82356001600160401b03808211156128b557600080fd5b818501915085601f8301126128c957600080fd5b81356128d761264e826125e5565b81815260059190911b830184019084810190888311156128f657600080fd5b8585015b8381101561292e578035858111156129125760008081fd5b6129208b89838a010161277f565b8452509186019186016128fa565b5098975050505050505050565b8281526040602082015260006129546040830184612164565b949350505050565b60006020828403121561296e57600080fd5b81516001600160e01b03198116811461213957600080fd5b634e487b7160e01b600052601160045260246000fd5b8181038181111561050957610509612986565b8082018082111561050957610509612986565b60e0815260006129d560e083018b612164565b82810360208401526129e7818b612164565b90508860408401528281036060840152612a0281888a61239c565b608084019690965250506001600160a01b0392831660a0820152911660c09091015295945050505050565b838152604060208201526000612a4760408301848661239c565b95945050505050565b60006020808385031215612a6357600080fd5b82516001600160401b0380821115612a7a57600080fd5b818501915085601f830112612a8e57600080fd5b8151612a9c61264e826125e5565b81815260059190911b83018401908481019088831115612abb57600080fd5b8585015b8381101561292e57805185811115612ad75760008081fd5b8601603f81018b13612ae95760008081fd5b878101516040612afb61264e83612608565b8281528d82848601011115612b105760008081fd5b612b1f838c8301848701612140565b8652505050918601918601612abf565b600081612b3e57612b3e612986565b506000190190565b602080825282516001600160a01b0390811683830152838201518116604080850191909152808501516060808601919091528086015160c06080870152805160e0870181905260009594610100600583901b8901810195919493870193919290890190885b81811015612c055760ff198b8903018352855187815116895289810151858b8b0152612bd9868b0182612164565b918701518a83038b890152919050612bf18183612164565b995050509488019491880191600101612bab565b50505050505050608085015160a085015260a08501519150601f198482030160c0850152612a478183612164565b815160009082906020808601845b83811015612c5d57815185529382019390820190600101612c41565b50929695505050505050565b600181811c90821680612c7d57607f821691505b602082108103612c9d57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052602160045260246000fdfea2646970667358221220ca409e8c9582544b3b8d8c05ed7b77fb8b148a77f098b1aea58f1517227de31d64736f6c634300081700338b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f";

// src/formatted/ECDSA.ts
var ECDSA_exports = {};
__export(ECDSA_exports, {
  abi: () => abi18,
  bytecode: () => bytecode18
});
var abi18 = [
  {
    "type": "error",
    "name": "ECDSAInvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureLength",
    "inputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureS",
    "inputs": [
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  }
];
var bytecode18 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212204f453c45fd8890597438ba3740ed042994be373737c9bd8ac833ff249df3eaab64736f6c63430008170033";

// src/formatted/EIP712.ts
var EIP712_exports = {};
__export(EIP712_exports, {
  abi: () => abi19,
  bytecode: () => bytecode19
});
var abi19 = [
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  }
];
var bytecode19 = "0x";

// src/formatted/ERC1967Proxy.ts
var ERC1967Proxy_exports = {};
__export(ERC1967Proxy_exports, {
  abi: () => abi20,
  bytecode: () => bytecode20
});
var abi20 = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "fallback",
    "stateMutability": "payable"
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967NonPayable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
  }
];
var bytecode20 = "0x60806040526040516103f03803806103f08339810160408190526100229161025e565b61002c8282610033565b5050610341565b61003c82610091565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b905f90a280511561008557610080828261010c565b505050565b61008d61017f565b5050565b806001600160a01b03163b5f036100cb57604051634c9c8ce360e01b81526001600160a01b03821660048201526024015b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b60605f80846001600160a01b0316846040516101289190610326565b5f60405180830381855af49150503d805f8114610160576040519150601f19603f3d011682016040523d82523d5f602084013e610165565b606091505b5090925090506101768583836101a0565b95945050505050565b341561019e5760405163b398979f60e01b815260040160405180910390fd5b565b6060826101b5576101b0826101ff565b6101f8565b81511580156101cc57506001600160a01b0384163b155b156101f557604051639996b31560e01b81526001600160a01b03851660048201526024016100c2565b50805b9392505050565b80511561020f5780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b634e487b7160e01b5f52604160045260245ffd5b5f5b8381101561025657818101518382015260200161023e565b50505f910152565b5f806040838503121561026f575f80fd5b82516001600160a01b0381168114610285575f80fd5b60208401519092506001600160401b03808211156102a1575f80fd5b818501915085601f8301126102b4575f80fd5b8151818111156102c6576102c6610228565b604051601f8201601f19908116603f011681019083821181831017156102ee576102ee610228565b81604052828152886020848701011115610306575f80fd5b61031783602083016020880161023c565b80955050505050509250929050565b5f825161033781846020870161023c565b9190910192915050565b60a38061034d5f395ff3fe6080604052600a600c565b005b60186014601a565b6050565b565b5f604b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b905090565b365f80375f80365f845af43d5f803e8080156069573d5ff35b3d5ffdfea2646970667358221220fd2cc92935c943d341edacaf5318a0b9ab0185ce62ef72e95ab393ef358730c464736f6c63430008170033";

// src/formatted/AllowedCalldataEnforcer.ts
var AllowedCalldataEnforcer_exports = {};
__export(AllowedCalldataEnforcer_exports, {
  abi: () => abi21,
  bytecode: () => bytecode21
});
var abi21 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "dataStart_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "value_",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode21 = "0x608060405234801561001057600080fd5b506106dc806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a3660046104a2565b50505050505050505050565b005b6100766100863660046104a2565b6100b5565b61009e61009936600461056f565b610198565b6040516100ac9291906105b1565b60405180910390f35b856100c1816000610265565b6101125760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b610123816000610265565b61017d5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610109565b5061018a8c8c898961027c565b505050505050505050505050565b6000606060218310156102005760405162461bcd60e51b815260206004820152602a60248201527f416c6c6f77656443616c6c64617461456e666f726365723a696e76616c69642d6044820152697465726d732d73697a6560b01b6064820152608401610109565b61020e602060008587610608565b61021791610632565b91506102268360208187610608565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250949792965091945050505050565b6001600160f81b0319828116908216145b92915050565b6000606036600061028d86866103d6565b93509350505061029d8888610198565b80519195509350816102af8287610650565b11156103155760405162461bcd60e51b815260206004820152602f60248201527f416c6c6f77656443616c6c64617461456e666f726365723a696e76616c69642d60448201526e0c6c2d8d8c8c2e8c25ad8cadccee8d608b1b6064820152608401610109565b61036e8386846103258583610650565b9261033293929190610608565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250889250610427915050565b6103cb5760405162461bcd60e51b815260206004820152602860248201527f416c6c6f77656443616c6c64617461456e666f726365723a696e76616c69642d60448201526763616c6c6461746160c01b6064820152608401610109565b505050505050505050565b60008036816103e86014828789610608565b6103f191610671565b60601c9350610404603460148789610608565b61040d91610632565b925061041c8560348189610608565b949793965094505050565b8051602091820120825192909101919091201490565b60008083601f84011261044f57600080fd5b50813567ffffffffffffffff81111561046757600080fd5b60208301915083602082850101111561047f57600080fd5b9250929050565b80356001600160a01b038116811461049d57600080fd5b919050565b60008060008060008060008060008060e08b8d0312156104c157600080fd5b8a3567ffffffffffffffff808211156104d957600080fd5b6104e58e838f0161043d565b909c509a5060208d01359150808211156104fe57600080fd5b61050a8e838f0161043d565b909a50985060408d0135975060608d013591508082111561052a57600080fd5b506105378d828e0161043d565b90965094505060808b0135925061055060a08c01610486565b915061055e60c08c01610486565b90509295989b9194979a5092959850565b6000806020838503121561058257600080fd5b823567ffffffffffffffff81111561059957600080fd5b6105a58582860161043d565b90969095509350505050565b8281526000602060406020840152835180604085015260005b818110156105e6578581018301518582016060015282016105ca565b506000606082860101526060601f19601f830116850101925050509392505050565b6000808585111561061857600080fd5b8386111561062557600080fd5b5050820193919092039150565b8035602083101561027657600019602084900360031b1b1692915050565b8082018082111561027657634e487b7160e01b600052601160045260246000fd5b6bffffffffffffffffffffffff19813581811691601485101561069e5780818660140360031b1b83161692505b50509291505056fea2646970667358221220040ece6946150f16c5413920be7d1b9c5d49d2aae2b6945d7da6faa6f92f5ef664736f6c63430008170033";

// src/formatted/ERC1271Lib.ts
var ERC1271Lib_exports = {};
__export(ERC1271Lib_exports, {
  abi: () => abi22,
  bytecode: () => bytecode22
});
var abi22 = [];
var bytecode22 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220e387e66c46ba5a334fec27a4edf89a8be9952b587b8297dbf10cb57e8c1726d964736f6c63430008170033";

// src/formatted/ERC20TransferAmountEnforcer.ts
var ERC20TransferAmountEnforcer_exports = {};
__export(ERC20TransferAmountEnforcer_exports, {
  abi: () => abi23,
  bytecode: () => bytecode23
});
var abi23 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "allowedContract_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "maxTokens_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "spentMap",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "IncreasedSpentMap",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "limit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "spent",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode23 = "0x608060405234801561001057600080fd5b5061081e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e33146100675780639dd5d9ab14610083578063a145832a146100be578063b99deb0e146100d1578063d3eddcc514610067578063ed46336714610067575b600080fd5b6100816100753660046105c3565b50505050505050505050565b005b6100ab610091366004610690565b600060208181529281526040808220909352908152205481565b6040519081526020015b60405180910390f35b6100816100cc3660046105c3565b610103565b6100e46100df3660046106ba565b610247565b604080516001600160a01b0390931683526020830191909152016100b5565b8561010f8160006102df565b6101605760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101718160006102df565b6101cb5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610157565b506000806101dc8e8e8b8b8b6102f6565b9150915086856001600160a01b0316336001600160a01b03167fc026e493323d526061a052b5dd562495120e2f648797a48be61966d3a6beec8d858560405161022f929190918252602082015260400190565b60405180910390a45050505050505050505050505050565b600080603483146102a15760405162461bcd60e51b815260206004820152603060248201526000805160206107c983398151915260448201526f0d8d2c85ae8cae4dae65ad8cadccee8d60831b6064820152608401610157565b6102af6014600085876106fc565b6102b891610726565b60601c91506102ca83601481876106fc565b6102d39161075b565b60001c90509250929050565b6001600160f81b0319828116908216145b92915050565b6000806000366000610308888861050d565b9295509350909150506044811461036c5760405162461bcd60e51b815260206004820152603460248201526000805160206107c98339815191526044820152730d8d2c85acaf0cac6eae8d2dedc5ad8cadccee8d60631b6064820152608401610157565b60006103788b8b610247565b965090506001600160a01b03808216908516146103da5760405162461bcd60e51b815260206004820152602c60248201526000805160206107c983398151915260448201526b1b1a590b58dbdb9d1c9858dd60a21b6064820152608401610157565b63a9059cbb60e01b6103f06004600085876106fc565b6103f991610779565b6001600160e01b031916146104515760405162461bcd60e51b815260206004820152602a60248201526000805160206107c98339815191526044820152691b1a590b5b595d1a1bd960b21b6064820152608401610157565b61045f6044602484866106fc565b6104689161075b565b336000908152602081815260408083208b8452909152812080549091906104909084906107a7565b9250508190559450858511156104ff5760405162461bcd60e51b815260206004820152602e60248201527f45524332305472616e73666572416d6f756e74456e666f726365723a616c6c6f60448201526d1dd85b98d94b595e18d95959195960921b6064820152608401610157565b505050509550959350505050565b600080368161051f60148287896106fc565b61052891610726565b60601c935061053b6034601487896106fc565b6105449161075b565b925061055385603481896106fc565b949793965094505050565b60008083601f84011261057057600080fd5b50813567ffffffffffffffff81111561058857600080fd5b6020830191508360208285010111156105a057600080fd5b9250929050565b80356001600160a01b03811681146105be57600080fd5b919050565b60008060008060008060008060008060e08b8d0312156105e257600080fd5b8a3567ffffffffffffffff808211156105fa57600080fd5b6106068e838f0161055e565b909c509a5060208d013591508082111561061f57600080fd5b61062b8e838f0161055e565b909a50985060408d0135975060608d013591508082111561064b57600080fd5b506106588d828e0161055e565b90965094505060808b0135925061067160a08c016105a7565b915061067f60c08c016105a7565b90509295989b9194979a5092959850565b600080604083850312156106a357600080fd5b6106ac836105a7565b946020939093013593505050565b600080602083850312156106cd57600080fd5b823567ffffffffffffffff8111156106e457600080fd5b6106f08582860161055e565b90969095509350505050565b6000808585111561070c57600080fd5b8386111561071957600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156107535780818660140360031b1b83161692505b505092915050565b803560208310156102f057600019602084900360031b1b1692915050565b6001600160e01b031981358181169160048510156107535760049490940360031b84901b1690921692915050565b808201808211156102f057634e487b7160e01b600052601160045260246000fdfe45524332305472616e73666572416d6f756e74456e666f726365723a696e7661a2646970667358221220936350618a5001f34797bf97c50cd107709e028340c60e13df9fe9a2d10d7fb364736f6c63430008170033";

// src/formatted/ERC20PeriodTransferEnforcer.ts
var ERC20PeriodTransferEnforcer_exports = {};
__export(ERC20PeriodTransferEnforcer_exports, {
  abi: () => abi24,
  bytecode: () => bytecode24
});
var abi24 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAvailableAmount",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "availableAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "isNewPeriod_",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "currentPeriod_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "token_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "periodAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "periodDuration_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startDate_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "periodicAllowances",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "periodAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "periodDuration",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startDate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "lastTransferPeriod",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "transferredInCurrentPeriod",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "TransferredInPeriod",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "token",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "periodAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "periodDuration",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "startDate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "transferredInCurrentPeriod",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "transferTimestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode24 = "0x608060405234801561001057600080fd5b50610d12806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063a145832a1161005b578063a145832a1461013e578063b99deb0e14610151578063d3eddcc514610082578063ed4633671461008257600080fd5b8063414c3e33146100825780636a9843f61461009e5780637b91dc78146100d1575b600080fd5b61009c610090366004610a20565b50505050505050505050565b005b6100b16100ac366004610aed565b61018e565b604080519384529115156020840152908201526060015b60405180910390f35b6101166100df366004610b47565b6000602081815292815260408082209093529081522080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016100c8565b61009c61014c366004610a20565b610265565b61016461015f366004610b71565b61034a565b604080516001600160a01b03909516855260208501939093529183015260608201526080016100c8565b6001600160a01b0383166000908152602081815260408083208784528252808320815160a081018352815481526001820154938101939093526002810154918301829052600381015460608401526004015460808301528291829115610203576101f781610416565b9350935093505061025b565b6000806000610212898961034a565b9350935093505060006040518060a00160405280858152602001848152602001838152602001600081526020016000815250905061024f81610416565b97509750975050505050505b9450945094915050565b856102718160006104aa565b6102c25760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6102d38160006104aa565b61032d5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084016102b9565b5061033c8c8c898989886104c1565b505050505050505050505050565b6000808080607485146103a65760405162461bcd60e51b81526020600482015260306024820152600080516020610cbd83398151915260448201526f0d8d2c85ae8cae4dae65ad8cadccee8d60831b60648201526084016102b9565b6103b4601460008789610bb3565b6103bd91610bdd565b60601c93506103d0603460148789610bb3565b6103d991610c12565b92506103e9605460348789610bb3565b6103f291610c12565b9150610402607460548789610bb3565b61040b91610c12565b939692955090935050565b60008060008360400151421015610435575060009150819050806104a3565b602084015160408501516104499042610c46565b6104539190610c59565b61045e906001610c7b565b90508084606001511415915060008261047b57846080015161047e565b60005b90508085600001511161049257600061049f565b845161049f908290610c46565b9350505b9193909250565b6001600160f81b0319828116908216145b92915050565b60003660006104d0878761096a565b929550935090915050604481146105345760405162461bcd60e51b81526020600482015260346024820152600080516020610cbd8339815191526044820152730d8d2c85acaf0cac6eae8d2dedc5ad8cadccee8d60631b60648201526084016102b9565b6000806000806105448d8d61034a565b9350935093509350866001600160a01b0316846001600160a01b0316146105b05760405162461bcd60e51b815260206004820152602c6024820152600080516020610cbd83398151915260448201526b1b1a590b58dbdb9d1c9858dd60a21b60648201526084016102b9565b63a9059cbb60e01b6105c660046000888a610bb3565b6105cf91610c8e565b6001600160e01b031916146106275760405162461bcd60e51b815260206004820152602a6024820152600080516020610cbd8339815191526044820152691b1a590b5b595d1a1bd960b21b60648201526084016102b9565b336000908152602081815260408083208c8452909152812060028101549091036107e157600082116106a55760405162461bcd60e51b81526020600482015260336024820152600080516020610cbd8339815191526044820152726c69642d7a65726f2d73746172742d6461746560681b60648201526084016102b9565b600084116107025760405162461bcd60e51b81526020600482015260366024820152600080516020610cbd8339815191526044820152751b1a590b5e995c9bcb5c195c9a5bd90b585b5bdd5b9d60521b60648201526084016102b9565b600083116107665760405162461bcd60e51b81526020600482015260386024820152600080516020610cbd83398151915260448201527f6c69642d7a65726f2d706572696f642d6475726174696f6e000000000000000060648201526084016102b9565b814210156107cf5760405162461bcd60e51b815260206004820152603060248201527f4552433230506572696f645472616e73666572456e666f726365723a7472616e60448201526f1cd9995c8b5b9bdd0b5cdd185c9d195960821b60648201526084016102b9565b83815560018101839055600281018290555b600080600061082c846040518060a001604052908160008201548152602001600182015481526020016002820154815260200160038201548152602001600482015481525050610416565b919450925090506000610843604460248c8e610bb3565b61084c91610c12565b9050838111156108bb5760405162461bcd60e51b815260206004820152603460248201527f4552433230506572696f645472616e73666572456e666f726365723a7472616e6044820152731cd9995c8b585b5bdd5b9d0b595e18d95959195960621b60648201526084016102b9565b82156108d05760038501829055600060048601555b808560040160008282546108e49190610c7b565b90915550506004850154604080516001600160a01b038c81168252602082018c90529181018a90526060810189905260808101929092524260a08301528f91908f169033907fb2a345c7f80b4be490c405f4a994faf85384dd05da7d70be0801dc31a8c253af9060c00160405180910390a4505050505050505050505050505050505050565b600080368161097c6014828789610bb3565b61098591610bdd565b60601c9350610998603460148789610bb3565b6109a191610c12565b92506109b08560348189610bb3565b949793965094505050565b60008083601f8401126109cd57600080fd5b50813567ffffffffffffffff8111156109e557600080fd5b6020830191508360208285010111156109fd57600080fd5b9250929050565b80356001600160a01b0381168114610a1b57600080fd5b919050565b60008060008060008060008060008060e08b8d031215610a3f57600080fd5b8a3567ffffffffffffffff80821115610a5757600080fd5b610a638e838f016109bb565b909c509a5060208d0135915080821115610a7c57600080fd5b610a888e838f016109bb565b909a50985060408d0135975060608d0135915080821115610aa857600080fd5b50610ab58d828e016109bb565b90965094505060808b01359250610ace60a08c01610a04565b9150610adc60c08c01610a04565b90509295989b9194979a5092959850565b60008060008060608587031215610b0357600080fd5b84359350610b1360208601610a04565b9250604085013567ffffffffffffffff811115610b2f57600080fd5b610b3b878288016109bb565b95989497509550505050565b60008060408385031215610b5a57600080fd5b610b6383610a04565b946020939093013593505050565b60008060208385031215610b8457600080fd5b823567ffffffffffffffff811115610b9b57600080fd5b610ba7858286016109bb565b90969095509350505050565b60008085851115610bc357600080fd5b83861115610bd057600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff198135818116916014851015610c0a5780818660140360031b1b83161692505b505092915050565b803560208310156104bb57600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b818103818111156104bb576104bb610c30565b600082610c7657634e487b7160e01b600052601260045260246000fd5b500490565b808201808211156104bb576104bb610c30565b6001600160e01b03198135818116916004851015610c0a5760049490940360031b84901b169092169291505056fe4552433230506572696f645472616e73666572456e666f726365723a696e7661a264697066735822122078259b929dc2fea71614ebe238bd74e88ff3ea3542e0d11a18122c300122d3f664736f6c63430008170033";

// src/formatted/ERC165.ts
var ERC165_exports = {};
__export(ERC165_exports, {
  abi: () => abi25,
  bytecode: () => bytecode25
});
var abi25 = [
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode25 = "0x";

// src/formatted/EncoderLib.ts
var EncoderLib_exports = {};
__export(EncoderLib_exports, {
  abi: () => abi26,
  bytecode: () => bytecode26
});
var abi26 = [];
var bytecode26 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220ac220b672ee89e055a56513b249d66df06ecb6da367b913fa0b7b7f3f838634764736f6c63430008170033";

// src/formatted/ERC1967Utils.ts
var ERC1967Utils_exports = {};
__export(ERC1967Utils_exports, {
  abi: () => abi27,
  bytecode: () => bytecode27
});
var abi27 = [
  {
    "type": "event",
    "name": "AdminChanged",
    "inputs": [
      {
        "name": "previousAdmin",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "newAdmin",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BeaconUpgraded",
    "inputs": [
      {
        "name": "beacon",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ERC1967InvalidAdmin",
    "inputs": [
      {
        "name": "admin",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967InvalidBeacon",
    "inputs": [
      {
        "name": "beacon",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967NonPayable",
    "inputs": []
  }
];
var bytecode27 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220bf999523a2735d33a4f148563c82738a41cc465257ff9df9a8912b831ab5af9564736f6c63430008170033";

// src/formatted/EIP7702StatelessDeleGator.ts
var EIP7702StatelessDeleGator_exports = {};
__export(EIP7702StatelessDeleGator_exports, {
  abi: () => abi28,
  bytecode: () => bytecode28
});
var abi28 = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "contract IDelegationManager"
      },
      {
        "name": "_entryPoint",
        "type": "address",
        "internalType": "contract IEntryPoint"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "DOMAIN_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "NAME",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "PACKED_USER_OP_TYPEHASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addDeposit",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "delegationManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDelegationManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "disableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "enableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "entryPoint",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IEntryPoint"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_execution",
        "type": "tuple",
        "internalType": "struct Execution",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "executeFromExecutor",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "returnData_",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getDeposit",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDomainHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "_key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationTypedDataHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isDelegationDisabled",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "_hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "magicValue_",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155BatchReceived",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC721Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "redeemDelegations",
    "inputs": [
      {
        "name": "_permissionContexts",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "_modes",
        "type": "bytes32[]",
        "internalType": "ModeCode[]"
      },
      {
        "name": "_executionCallDatas",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsExecutionMode",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "_interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "validateUserOp",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_missingAccountFunds",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "validationData_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawDeposit",
    "inputs": [
      {
        "name": "_withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "_withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SentPrefund",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "success",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDelegationManager",
    "inputs": [
      {
        "name": "newDelegationManager",
        "type": "address",
        "indexed": true,
        "internalType": "contract IDelegationManager"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetEntryPoint",
    "inputs": [
      {
        "name": "entryPoint",
        "type": "address",
        "indexed": true,
        "internalType": "contract IEntryPoint"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TryExecuteUnsuccessful",
    "inputs": [
      {
        "name": "batchExecutionindex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "result",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureLength",
    "inputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureS",
    "inputs": [
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "ExecutionFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEIP712NameLength",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEIP712VersionLength",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotDelegationManager",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPoint",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPointOrSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UnsupportedCallType",
    "inputs": [
      {
        "name": "callType",
        "type": "bytes1",
        "internalType": "CallType"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedExecType",
    "inputs": [
      {
        "name": "execType",
        "type": "bytes1",
        "internalType": "ExecType"
      }
    ]
  }
];
var bytecode28 = "0x6101c060405230610160523480156200001757600080fd5b50604051620031b0380380620031b08339810160408190526200003a91620002b3565b81816040518060400160405280601981526020017f4549503737303253746174656c65737344656c654761746f7200000000000000815250604051806040016040528060018152602001603160f81b8152508181620000a46000836200021560201b90919060201c565b61012052620000b581600162000215565b61014052815160208084019190912060e052815190820120610100524660a0526200014360e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c0528151601f10156200017057604051631ad9af3960e21b815260040160405180910390fd5b601f8151111562000194576040516309203c9d60e41b815260040160405180910390fd5b6001600160a01b038085166101808190529084166101a0526040517fb2e8eb88b584ae71ef4e854c10847f4d39bd93e52599f147bfb4dcc8de52014d90600090a26040516001600160a01b038416907fee8699dc0e27105da2653bdba54be0edcaadc3e33890a3ad705517ffe9bf0a9990600090a2505050505050620004db565b600060208351101562000235576200022d836200024e565b905062000248565b8162000242848262000399565b5060ff90505b92915050565b600080829050601f8151111562000285578260405163305a27a960e01b81526004016200027c919062000465565b60405180910390fd5b80516200029282620004b6565b179392505050565b6001600160a01b0381168114620002b057600080fd5b50565b60008060408385031215620002c757600080fd5b8251620002d4816200029a565b6020840151909250620002e7816200029a565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200031d57607f821691505b6020821081036200033e57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111562000394576000816000526020600020601f850160051c810160208610156200036f5750805b601f850160051c820191505b8181101562000390578281556001016200037b565b5050505b505050565b81516001600160401b03811115620003b557620003b5620002f2565b620003cd81620003c6845462000308565b8462000344565b602080601f831160018114620004055760008415620003ec5750858301515b600019600386901b1c1916600185901b17855562000390565b600085815260208120601f198616915b82811015620004365788860151825594840194600190910190840162000415565b5085821015620004555787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60006020808352835180602085015260005b81811015620004955785810183015185820160400152820162000477565b506000604082860101526040601f19601f8301168501019250505092915050565b805160208083015191908110156200033e5760001960209190910360031b1b16919050565b60805160a05160c05160e05161010051610120516101405161016051610180516101a051612bb1620005ff60003960008181610471015281816107f7015281816108c20152818161094001528181610aa401528181610b9a01528181610bf201528181610c7401528181610ce601528181610e1001528181610e8f01528181611015015281816112cd01526115ce01526000818161057a015281816109a301528181610a2601528181610b0701528181610ef201526110590152600081816106190152818161073a015281816107960152818161083f01528181610b4601528181610da7015261162101526000611960015260006119330152600061174c015260006117240152600061167f015260006116a9015260006116d30152612bb16000f3fe6080604052600436106101c65760003560e01c806384b0196e116100f7578063d03c791411610095578063ea4d3c9b11610064578063ea4d3c9b14610568578063ed8101b51461059c578063f23a6e61146105bc578063ffa1ad74146105dc57600080fd5b8063d03c791414610500578063d087d28814610520578063d691c96414610535578063e9ae5c531461055557600080fd5b8063b0d691fe116100d1578063b0d691fe1461045f578063bc197c81146104ab578063c399ec88146104cb578063cef6d209146104e057600080fd5b806384b0196e146103b4578063a3f4df7e146103dc578063acb8cc491461043257600080fd5b80633ed01015116101645780634a58db191161013e5780634a58db19146103645780635c1c6dcd1461036c5780637f07bfdc1461037f57806383ebb7711461039f57600080fd5b80633ed0101514610302578063445140b814610324578063499340471461034457600080fd5b80631626ba7e116101a05780631626ba7e1461026e57806319822f7c1461028e5780632b3afd99146102ae5780633e1b0812146102e257600080fd5b806301ffc9a7146101d257806306394d6714610207578063150b7a021461023557600080fd5b366101cd57005b600080fd5b3480156101de57600080fd5b506101f26101ed366004611fb2565b61060d565b60405190151581526020015b60405180910390f35b34801561021357600080fd5b50610227610222366004611ff5565b6106f9565b6040519081526020016101fe565b34801561024157600080fd5b506102556102503660046120fb565b61072e565b6040516001600160e01b031990911681526020016101fe565b34801561027a57600080fd5b506102556102893660046121ae565b61078a565b34801561029a57600080fd5b506102276102a93660046121f9565b6107ea565b3480156102ba57600080fd5b506102277fbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc1881565b3480156102ee57600080fd5b506102276102fd366004612246565b61089b565b34801561030e57600080fd5b5061032261031d36600461226f565b610935565b005b34801561033057600080fd5b506101f261033f3660046122a9565b610a0d565b34801561035057600080fd5b5061032261035f36600461226f565b610a99565b610322610b3c565b61032261037a3660046122c2565b610be7565b34801561038b57600080fd5b5061032261039a3660046122fc565b610c69565b3480156103ab57600080fd5b50610227610d46565b3480156103c057600080fd5b506103c9610d55565b6040516101fe979695949392919061236e565b3480156103e857600080fd5b506104256040518060400160405280601981526020017f4549503737303253746174656c65737344656c654761746f720000000000000081525081565b6040516101fe9190612407565b34801561043e57600080fd5b50610425604051806040016040528060018152602001603160f81b81525081565b34801561046b57600080fd5b506104937f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016101fe565b3480156104b757600080fd5b506102556104c6366004612499565b610d9b565b3480156104d757600080fd5b50610227610df8565b3480156104ec57600080fd5b506103226104fb36600461258a565b610e84565b34801561050c57600080fd5b506101f261051b3660046122a9565b610f6b565b34801561052c57600080fd5b50610227610ff6565b6105486105433660046121ae565b61104c565b6040516101fe9190612623565b6103226105633660046121ae565b6112c2565b34801561057457600080fd5b506104937f000000000000000000000000000000000000000000000000000000000000000081565b3480156105a857600080fd5b506102276105b7366004611ff5565b6114d3565b3480156105c857600080fd5b506102556105d7366004612687565b611615565b3480156105e857600080fd5b50610425604051806040016040528060058152602001640312e332e360dc1b81525081565b60006001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016300361065857604051634f81d01360e11b815260040160405180910390fd5b6001600160e01b031982166335a4725960e21b148061068757506001600160e01b03198216630a85bd0160e11b145b806106a257506001600160e01b03198216630271189760e51b145b806106bd57506001600160e01b031982166301ffc9a760e01b145b806106d857506001600160e01b03198216630b135d3f60e11b145b806106f357506001600160e01b03198216633992254760e01b145b92915050565b60006106f3610706611672565b61070f846114d3565b60405161190160f01b8152600281019290925260228201526042902090565b60006001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016300361077957604051634f81d01360e11b815260040160405180910390fd5b50630a85bd0160e11b949350505050565b60006001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036107d557604051634f81d01360e11b815260040160405180910390fd5b6107e084848461179d565b90505b9392505050565b6000336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461083557604051636b31ba1560e11b815260040160405180910390fd5b6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016300361087e57604051634f81d01360e11b815260040160405180910390fd5b6108908461088b866106f9565b611816565b90506107e38261185e565b604051631aab3f0d60e11b81523060048201526001600160c01b03821660248201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906335567e1a90604401602060405180830381865afa158015610911573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106f391906126ef565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480159061096e5750333014155b1561098c57604051630796d94560e01b815260040160405180910390fd5b604051633ed0101560e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690633ed01015906109d8908490600401612837565b600060405180830381600087803b1580156109f257600080fd5b505af1158015610a06573d6000803e3d6000fd5b5050505050565b6040516316a0682960e11b8152600481018290526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632d40d05290602401602060405180830381865afa158015610a75573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106f39190612908565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610ad25750333014155b15610af057604051630796d94560e01b815260040160405180910390fd5b604051634993404760e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906349934047906109d8908490600401612837565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163003610b8557604051634f81d01360e11b815260040160405180910390fd5b60405163b760faf960e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063b760faf99034906024016000604051808303818588803b1580156109f257600080fd5b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610c205750333014155b15610c3e57604051630796d94560e01b815260040160405180910390fd5b610c65610c4e602083018361292a565b6020830135610c606040850185612947565b6118f6565b5050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610ca25750333014155b15610cc057604051630796d94560e01b815260040160405180910390fd5b60405163040b850f60e31b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063205c287890604401600060405180830381600087803b158015610d2a57600080fd5b505af1158015610d3e573d6000803e3d6000fd5b505050505050565b6000610d50611672565b905090565b600060608060008060006060610d6961192c565b610d71611959565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b60006001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163003610de657604051634f81d01360e11b815260040160405180910390fd5b5063bc197c8160e01b95945050505050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a08231906024015b602060405180830381865afa158015610e60573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d5091906126ef565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610ebd5750333014155b15610edb57604051630796d94560e01b815260040160405180910390fd5b60405163cef6d20960e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cef6d20990610f31908990899089908990899089906004016129ee565b600060405180830381600087803b158015610f4b57600080fd5b505af1158015610f5f573d6000803e3d6000fd5b50505050505050505050565b600081600881901b603082901b605083901b610f878486611986565b80610f9b5750610f9b84600160f81b611986565b8015610fc15750610fad836000611986565b80610fc15750610fc183600160f81b611986565b8015610fd557506001600160e01b03198216155b8015610fec575069ffffffffffffffffffff198116155b9695505050505050565b604051631aab3f0d60e11b8152306004820152600060248201819052907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906335567e1a90604401610e43565b6060336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461109757604051630692ce8160e21b815260040160405180910390fd5b83600881901b6110ab82600160f81b611986565b15611131573660006110bd8787611998565b90925090506110cd836000611986565b156110e3576110dc8282611a31565b945061112a565b6110f183600160f81b611986565b15611100576110dc8282611af2565b6040516308c3ee0360e11b81526001600160f81b0319841660048201526024015b60405180910390fd5b50506112b9565b61113c826000611986565b15611294576000803660006111518989611c1f565b6040805160018082528183019092529498509296509094509250816020015b606081526020019060019003908161117057905050965060006111938682611986565b156111c7576111a4858585856118f6565b886000815181106111b7576111b7612a57565b602002602001018190525061128a565b6111d586600160f81b611986565b15611265576111e685858585611c70565b896000815181106111f9576111f9612a57565b6020908102919091010152905080611260577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb760008960008151811061124157611241612a57565b6020026020010151604051611257929190612a6d565b60405180910390a15b61128a565b6040516308c3ee0360e11b81526001600160f81b031987166004820152602401611121565b50505050506112b9565b604051632e5bf3f960e21b81526001600160f81b031983166004820152602401611121565b50509392505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906112fb5750333014155b1561131957604051630796d94560e01b815260040160405180910390fd5b82600881901b61132d82600160f81b611986565b156113885736600061133f8686611998565b909250905061134f836000611986565b156113645761135e8282611a31565b50611381565b61137283600160f81b611986565b156111005761135e8282611af2565b5050610a06565b611393826000611986565b15611294576000803660006113a88888611c1f565b93509350935093506113be85600060f81b611986565b156113d5576113cf848484846118f6565b506114ca565b6113e385600160f81b611986565b156114a557604080516001808252818301909252600091816020015b60608152602001906001900390816113ff579050509050600061142486868686611c70565b8360008151811061143757611437612a57565b602090810291909101015290508061149e577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb760008360008151811061147f5761147f612a57565b6020026020010151604051611495929190612a6d565b60405180910390a15b50506114ca565b6040516308c3ee0360e11b81526001600160f81b031986166004820152602401611121565b50505050610a06565b60007fbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18611503602084018461292a565b60208401356115156040860186612947565b604051611523929190612a86565b6040519081900390206115396060870187612947565b604051611547929190612a86565b604051908190039020608087013560a088013560c089013561156c60e08b018b612947565b60405161157a929190612a86565b60408051918290038220602083019a909a526001600160a01b03988916908201526060810196909652608086019490945260a085019290925260c084015260e08301526101008201526101208101929092527f00000000000000000000000000000000000000000000000000000000000000001661014082015261016001604051602081830303815290604052805190602001209050919050565b60006001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016300361166057604051634f81d01360e11b815260040160405180910390fd5b5063f23a6e6160e01b95945050505050565b6000306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480156116cb57507f000000000000000000000000000000000000000000000000000000000000000046145b156116f557507f000000000000000000000000000000000000000000000000000000000000000090565b610d50604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6000306001600160a01b03166117e98585858080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611ca192505050565b6001600160a01b0316036118055750630b135d3f60e11b6107e3565b506001600160e01b03199392505050565b6000806118308361182b610100870187612947565b61179d565b90506374eca2c160e11b6001600160e01b03198216016118545760009150506106f3565b5060019392505050565b80156118f357604051600090339060001990849084818181858888f193505050503d80600081146118ab576040519150601f19603f3d011682016040523d82523d6000602084013e6118b0565b606091505b505060408051848152821515602082015291925033917fa427c7d47f24d01b170779a7600b1d4c0d7cdbabaa0f19c4f0e6182053ffc931910160405180910390a2505b50565b60405181838237600038838387895af1611913573d6000823e3d81fd5b3d8152602081013d6000823e3d01604052949350505050565b6060610d507f00000000000000000000000000000000000000000000000000000000000000006000611ccb565b6060610d507f00000000000000000000000000000000000000000000000000000000000000006001611ccb565b6001600160f81b031990811691161490565b366000833580850160208587010360208201945081359350808460051b8301118360401c17156119d05763ba597e7e6000526004601cfd5b8315611a27578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715611a1e5763ba597e7e6000526004601cfd5b505050826119da575b5050509250929050565b606081806001600160401b03811115611a4c57611a4c612046565b604051908082528060200260200182016040528015611a7f57816020015b6060815260200190600190039081611a6a5790505b50915060005b81811015611aea5736858583818110611aa057611aa0612a57565b9050602002810190611ab29190612a96565b9050611ac4610c4e602083018361292a565b848381518110611ad657611ad6612a57565b602090810291909101015250600101611a85565b505092915050565b606081806001600160401b03811115611b0d57611b0d612046565b604051908082528060200260200182016040528015611b4057816020015b6060815260200190600190039081611b2b5790505b50915060005b81811015611aea5736858583818110611b6157611b61612a57565b9050602002810190611b739190612a96565b90506000611b9e611b87602084018461292a565b6020840135611b996040860186612947565b611c70565b868581518110611bb057611bb0612a57565b6020908102919091010152905080611c15577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb783868581518110611bf657611bf6612a57565b6020026020010151604051611c0c929190612a6d565b60405180910390a15b5050600101611b46565b6000803681611c316014828789612ab6565b611c3a91612ae0565b60601c9350611c4d603460148789612ab6565b611c5691612b13565b9250611c658560348189612ab6565b949793965094505050565b604051600090828482376000388483888a5af191503d8152602081013d6000823e3d81016040525094509492505050565b600080600080611cb18686611d76565b925092509250611cc18282611dc3565b5090949350505050565b606060ff8314611ce557611cde83611e7c565b90506106f3565b818054611cf190612b31565b80601f0160208091040260200160405190810160405280929190818152602001828054611d1d90612b31565b8015611d6a5780601f10611d3f57610100808354040283529160200191611d6a565b820191906000526020600020905b815481529060010190602001808311611d4d57829003601f168201915b505050505090506106f3565b60008060008351604103611db05760208401516040850151606086015160001a611da288828585611ebb565b955095509550505050611dbc565b50508151600091506002905b9250925092565b6000826003811115611dd757611dd7612b65565b03611de0575050565b6001826003811115611df457611df4612b65565b03611e125760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115611e2657611e26612b65565b03611e475760405163fce698f760e01b815260048101829052602401611121565b6003826003811115611e5b57611e5b612b65565b03610c65576040516335e2f38360e21b815260048101829052602401611121565b60606000611e8983611f8a565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115611ef65750600091506003905082611f80565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015611f4a573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611f7657506000925060019150829050611f80565b9250600091508190505b9450945094915050565b600060ff8216601f8111156106f357604051632cd44ac360e21b815260040160405180910390fd5b600060208284031215611fc457600080fd5b81356001600160e01b0319811681146107e357600080fd5b60006101208284031215611fef57600080fd5b50919050565b60006020828403121561200757600080fd5b81356001600160401b0381111561201d57600080fd5b61202984828501611fdc565b949350505050565b6001600160a01b03811681146118f357600080fd5b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b038111828210171561208457612084612046565b604052919050565b600082601f83011261209d57600080fd5b81356001600160401b038111156120b6576120b6612046565b6120c9601f8201601f191660200161205c565b8181528460208386010111156120de57600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000806080858703121561211157600080fd5b843561211c81612031565b9350602085013561212c81612031565b92506040850135915060608501356001600160401b0381111561214e57600080fd5b61215a8782880161208c565b91505092959194509250565b60008083601f84011261217857600080fd5b5081356001600160401b0381111561218f57600080fd5b6020830191508360208285010111156121a757600080fd5b9250929050565b6000806000604084860312156121c357600080fd5b8335925060208401356001600160401b038111156121e057600080fd5b6121ec86828701612166565b9497909650939450505050565b60008060006060848603121561220e57600080fd5b83356001600160401b0381111561222457600080fd5b61223086828701611fdc565b9660208601359650604090950135949350505050565b60006020828403121561225857600080fd5b81356001600160c01b03811681146107e357600080fd5b60006020828403121561228157600080fd5b81356001600160401b0381111561229757600080fd5b820160c081850312156107e357600080fd5b6000602082840312156122bb57600080fd5b5035919050565b6000602082840312156122d457600080fd5b81356001600160401b038111156122ea57600080fd5b8201606081850312156107e357600080fd5b6000806040838503121561230f57600080fd5b823561231a81612031565b946020939093013593505050565b6000815180845260005b8181101561234e57602081850181015186830182015201612332565b506000602082860101526020601f19601f83011685010191505092915050565b60ff60f81b881681526000602060e0602084015261238f60e084018a612328565b83810360408501526123a1818a612328565b606085018990526001600160a01b038816608086015260a0850187905284810360c08601528551808252602080880193509091019060005b818110156123f5578351835292840192918401916001016123d9565b50909c9b505050505050505050505050565b6020815260006107e36020830184612328565b600082601f83011261242b57600080fd5b813560206001600160401b0382111561244657612446612046565b8160051b61245582820161205c565b928352848101820192828101908785111561246f57600080fd5b83870192505b8483101561248e57823582529183019190830190612475565b979650505050505050565b600080600080600060a086880312156124b157600080fd5b85356124bc81612031565b945060208601356124cc81612031565b935060408601356001600160401b03808211156124e857600080fd5b6124f489838a0161241a565b9450606088013591508082111561250a57600080fd5b61251689838a0161241a565b9350608088013591508082111561252c57600080fd5b506125398882890161208c565b9150509295509295909350565b60008083601f84011261255857600080fd5b5081356001600160401b0381111561256f57600080fd5b6020830191508360208260051b85010111156121a757600080fd5b600080600080600080606087890312156125a357600080fd5b86356001600160401b03808211156125ba57600080fd5b6125c68a838b01612546565b909850965060208901359150808211156125df57600080fd5b6125eb8a838b01612546565b9096509450604089013591508082111561260457600080fd5b5061261189828a01612546565b979a9699509497509295939492505050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b8281101561267a57603f19888603018452612668858351612328565b9450928501929085019060010161264c565b5092979650505050505050565b600080600080600060a0868803121561269f57600080fd5b85356126aa81612031565b945060208601356126ba81612031565b9350604086013592506060860135915060808601356001600160401b038111156126e357600080fd5b6125398882890161208c565b60006020828403121561270157600080fd5b5051919050565b6000808335601e1984360301811261271f57600080fd5b83016020810192503590506001600160401b0381111561273e57600080fd5b8036038213156121a757600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60008383855260208086019550808560051b830101846000805b8881101561282957858403601f19018a52823536899003605e190181126127b5578283fd5b8801606081356127c481612031565b6001600160a01b031686526127db82880183612708565b82898901526127ed838901828461274d565b9250505060406127ff81840184612708565b93508783038289015261281383858361274d565b9d89019d97505050938601935050600101612790565b509198975050505050505050565b602081526000823561284881612031565b6001600160a01b039081166020848101919091528401359061286982612031565b80821660408501525050604083013560608301526060830135601e1984360301811261289457600080fd5b83016020810190356001600160401b038111156128b057600080fd5b8060051b36038213156128c257600080fd5b60c060808501526128d760e085018284612776565b915050608084013560a08401526128f160a0850185612708565b848303601f190160c0860152610fec83828461274d565b60006020828403121561291a57600080fd5b815180151581146107e357600080fd5b60006020828403121561293c57600080fd5b81356107e381612031565b6000808335601e1984360301811261295e57600080fd5b8301803591506001600160401b0382111561297857600080fd5b6020019150368190038213156121a757600080fd5b6000838385526020808601955060208560051b8301018460005b878110156129e157848303601f190189526129c28288612708565b6129cd85828461274d565b9a86019a94505050908301906001016129a7565b5090979650505050505050565b606081526000612a0260608301888a61298d565b8281036020848101919091528682528791810160005b88811015612a3457833582529282019290820190600101612a18565b508481036040860152612a4881878961298d565b9b9a5050505050505050505050565b634e487b7160e01b600052603260045260246000fd5b8281526040602082015260006107e06040830184612328565b8183823760009101908152919050565b60008235605e19833603018112612aac57600080fd5b9190910192915050565b60008085851115612ac657600080fd5b83861115612ad357600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff198135818116916014851015611aea5760149490940360031b84901b1690921692915050565b803560208310156106f357600019602084900360031b1b1692915050565b600181811c90821680612b4557607f821691505b602082108103611fef57634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052602160045260246000fdfea26469706673582212202a8fc88ef923739742bc7ec1685cd9198a7251cfb58c7e873c821a7e716b2ca664736f6c63430008170033";

// src/formatted/ERC20BalanceChangeEnforcer.ts
var ERC20BalanceChangeEnforcer_exports = {};
__export(ERC20BalanceChangeEnforcer_exports, {
  abi: () => abi29,
  bytecode: () => bytecode29
});
var abi29 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceCache",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getHashKey",
    "inputs": [
      {
        "name": "_caller",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "enforceDecrease_",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "token_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "recipient_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "isLocked",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "lock",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode29 = "0x608060405234801561001057600080fd5b5061095e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063b5e544921161005b578063b5e5449214610115578063b99deb0e14610135578063d3eddcc51461017a578063ed463367146100c557600080fd5b806332a16f4e1461008d578063414c3e33146100c55780638678d6ef146100e1578063a145832a14610102575b600080fd5b6100b061009b366004610677565b60016020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100df6100d33660046106f5565b50505050505050505050565b005b6100f46100ef3660046107c2565b61018d565b6040519081526020016100bc565b6100df6101103660046106f5565b6101a2565b6100f4610123366004610677565b60006020819052908152604090205481565b6101486101433660046107fe565b610353565b6040516100bc949392919093151584526001600160a01b03928316602085015291166040830152606082015260800190565b6100df6101883660046106f5565b610440565b600061019a84848461061d565b949350505050565b85600881901b6101b3816000610660565b6102125760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b506000806102208d8d610353565b509250925050600061023333848961061d565b60008181526001602052604090205490915060ff16156102ab5760405162461bcd60e51b815260206004820152602d60248201527f455243323042616c616e63654368616e6765456e666f726365723a656e666f7260448201526c18d95c8b5a5ccb5b1bd8dad959609a1b6064820152608401610209565b6000818152600160208190526040808320805460ff1916909217909155516370a0823160e01b81526001600160a01b0384811660048301528516906370a0823190602401602060405180830381865afa15801561030c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103309190610840565b600092835260208390526040909220919091555050505050505050505050505050565b6000808080604985146103c05760405162461bcd60e51b815260206004820152602f60248201527f455243323042616c616e63654368616e6765456e666f726365723a696e76616c60448201526e0d2c85ae8cae4dae65ad8cadccee8d608b1b6064820152608401610209565b858560008181106103d3576103d3610859565b909101356001600160f81b031916151594506103f5905060156001878961086f565b6103fe91610899565b60601c925061041160296015878961086f565b61041a91610899565b60601c915061042c856029818961086f565b610435916108ce565b939692955090935050565b6000806000806104508e8e610353565b9350935093509350600061046533858a61061d565b600081815260016020526040808220805460ff19169055516370a0823160e01b81526001600160a01b03868116600483015292935090918616906370a0823190602401602060405180830381865afa1580156104c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104e99190610840565b9050851561057c5760008281526020819052604090205461050b908490610902565b8110156105775760405162461bcd60e51b815260206004820152603460248201527f455243323042616c616e63654368616e6765456e666f726365723a65786365656044820152736465642d62616c616e63652d646563726561736560601b6064820152608401610209565b61060b565b600082815260208190526040902054610596908490610915565b81101561060b5760405162461bcd60e51b815260206004820152603860248201527f455243323042616c616e63654368616e6765456e666f726365723a696e73756660448201527f66696369656e742d62616c616e63652d696e63726561736500000000000000006064820152608401610209565b50505050505050505050505050505050565b604080516001600160a01b039485166020808301919091529390941684820152606080850192909252805180850390920182526080909301909252815191012090565b6001600160f81b0319828116908216145b92915050565b60006020828403121561068957600080fd5b5035919050565b60008083601f8401126106a257600080fd5b50813567ffffffffffffffff8111156106ba57600080fd5b6020830191508360208285010111156106d257600080fd5b9250929050565b80356001600160a01b03811681146106f057600080fd5b919050565b60008060008060008060008060008060e08b8d03121561071457600080fd5b8a3567ffffffffffffffff8082111561072c57600080fd5b6107388e838f01610690565b909c509a5060208d013591508082111561075157600080fd5b61075d8e838f01610690565b909a50985060408d0135975060608d013591508082111561077d57600080fd5b5061078a8d828e01610690565b90965094505060808b013592506107a360a08c016106d9565b91506107b160c08c016106d9565b90509295989b9194979a5092959850565b6000806000606084860312156107d757600080fd5b6107e0846106d9565b92506107ee602085016106d9565b9150604084013590509250925092565b6000806020838503121561081157600080fd5b823567ffffffffffffffff81111561082857600080fd5b61083485828601610690565b90969095509350505050565b60006020828403121561085257600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b6000808585111561087f57600080fd5b8386111561088c57600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156108c65780818660140360031b1b83161692505b505092915050565b8035602083101561067157600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b81810381811115610671576106716108ec565b80820180821115610671576106716108ec56fea26469706673582212202ee065285e6d78b8f4f72189bef225cff106ed6fed2f250af767e847d4faa24364736f6c63430008170033";

// src/formatted/Exec.ts
var Exec_exports = {};
__export(Exec_exports, {
  abi: () => abi30,
  bytecode: () => bytecode30
});
var abi30 = [];
var bytecode30 = "0x60556032600b8282823980515f1a607314602657634e487b7160e01b5f525f60045260245ffd5b305f52607381538281f3fe730000000000000000000000000000000000000000301460806040525f80fdfea26469706673582212201dfea0fb90d440a56b093020135bfa0529382b21cf5681ce6bf65b9ef384b15664736f6c63430008170033";

// src/formatted/ERC721BalanceChangeEnforcer.ts
var ERC721BalanceChangeEnforcer_exports = {};
__export(ERC721BalanceChangeEnforcer_exports, {
  abi: () => abi31,
  bytecode: () => bytecode31
});
var abi31 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceCache",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getHashKey",
    "inputs": [
      {
        "name": "_caller",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "enforceDecrease_",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "token_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "recipient_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "isLocked",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "lock",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode31 = "0x608060405234801561001057600080fd5b5061097c806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063b5e544921161005b578063b5e5449214610115578063b99deb0e14610135578063d3eddcc51461017a578063ed463367146100c557600080fd5b806332a16f4e1461008d578063414c3e33146100c55780635f6f02e0146100e1578063a145832a14610102575b600080fd5b6100b061009b366004610686565b60016020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100df6100d3366004610704565b50505050505050505050565b005b6100f46100ef3660046107d1565b61018d565b6040519081526020016100bc565b6100df610110366004610704565b6101a4565b6100f4610123366004610686565b60006020819052908152604090205481565b61014861014336600461081c565b610357565b6040516100bc949392919093151584526001600160a01b03928316602085015291166040830152606082015260800190565b6100df610188366004610704565b610445565b600061019b85858585610624565b95945050505050565b85600881901b6101b581600061066f565b6102145760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b506000806102228d8d610357565b50925092505060006102363384848a610624565b60008181526001602052604090205490915060ff16156102af5760405162461bcd60e51b815260206004820152602e60248201527f45524337323142616c616e63654368616e6765456e666f726365723a656e666f60448201526d1c98d95c8b5a5ccb5b1bd8dad95960921b606482015260840161020b565b6000818152600160208190526040808320805460ff1916909217909155516370a0823160e01b81526001600160a01b0384811660048301528516906370a0823190602401602060405180830381865afa158015610310573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610334919061085e565b600092835260208390526040909220919091555050505050505050505050505050565b6000808080604985146103c55760405162461bcd60e51b815260206004820152603060248201527f45524337323142616c616e63654368616e6765456e666f726365723a696e766160448201526f0d8d2c85ae8cae4dae65ad8cadccee8d60831b606482015260840161020b565b858560008181106103d8576103d8610877565b909101356001600160f81b031916151594506103fa905060156001878961088d565b610403916108b7565b60601c925061041660296015878961088d565b61041f916108b7565b60601c9150610431856029818961088d565b61043a916108ec565b939692955090935050565b6000806000806104558e8e610357565b9350935093509350600061046b3385858b610624565b600081815260016020526040808220805460ff19169055516370a0823160e01b81526001600160a01b03868116600483015292935090918616906370a0823190602401602060405180830381865afa1580156104cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104ef919061085e565b9050851561058357600082815260208190526040902054610511908490610920565b81101561057e5760405162461bcd60e51b815260206004820152603560248201527f45524337323142616c616e63654368616e6765456e666f726365723a65786365604482015274656465642d62616c616e63652d646563726561736560581b606482015260840161020b565b610612565b60008281526020819052604090205461059d908490610933565b8110156106125760405162461bcd60e51b815260206004820152603960248201527f45524337323142616c616e63654368616e6765456e666f726365723a696e737560448201527f6666696369656e742d62616c616e63652d696e63726561736500000000000000606482015260840161020b565b50505050505050505050505050505050565b604080516001600160a01b03958616602080830191909152948616818301529290941660608301526080808301919091528351808303909101815260a0909101909252815191012090565b6001600160f81b0319828116908216145b92915050565b60006020828403121561069857600080fd5b5035919050565b60008083601f8401126106b157600080fd5b50813567ffffffffffffffff8111156106c957600080fd5b6020830191508360208285010111156106e157600080fd5b9250929050565b80356001600160a01b03811681146106ff57600080fd5b919050565b60008060008060008060008060008060e08b8d03121561072357600080fd5b8a3567ffffffffffffffff8082111561073b57600080fd5b6107478e838f0161069f565b909c509a5060208d013591508082111561076057600080fd5b61076c8e838f0161069f565b909a50985060408d0135975060608d013591508082111561078c57600080fd5b506107998d828e0161069f565b90965094505060808b013592506107b260a08c016106e8565b91506107c060c08c016106e8565b90509295989b9194979a5092959850565b600080600080608085870312156107e757600080fd5b6107f0856106e8565b93506107fe602086016106e8565b925061080c604086016106e8565b9396929550929360600135925050565b6000806020838503121561082f57600080fd5b823567ffffffffffffffff81111561084657600080fd5b6108528582860161069f565b90969095509350505050565b60006020828403121561087057600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b6000808585111561089d57600080fd5b838611156108aa57600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156108e45780818660140360031b1b83161692505b505092915050565b8035602083101561068057600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b818103818111156106805761068061090a565b808201808211156106805761068061090a56fea26469706673582212201a908643c89c30b103124ac1346de2de7964be6fc4c537dea357364db407b9ad64736f6c63430008170033";

// src/formatted/ExecutionLib.ts
var ExecutionLib_exports = {};
__export(ExecutionLib_exports, {
  abi: () => abi32,
  bytecode: () => bytecode32
});
var abi32 = [
  {
    "type": "error",
    "name": "ERC7579DecodingError",
    "inputs": []
  }
];
var bytecode32 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220e31e42482ef7832f3e446f04f27415313e49db77c6e6717169033c8535b19d3764736f6c63430008170033";

// src/formatted/ERC721TransferEnforcer.ts
var ERC721TransferEnforcer_exports = {};
__export(ERC721TransferEnforcer_exports, {
  abi: () => abi33,
  bytecode: () => bytecode33
});
var abi33 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "permittedContract_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "permittedTokenId_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode33 = "0x608060405234801561001057600080fd5b50610821806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a3660046105ea565b50505050505050505050565b005b6100766100863660046105ea565b6100c1565b61009e6100993660046106bd565b61047c565b604080516001600160a01b03909316835260208301919091520160405180910390f35b856100cd816000610521565b61011e5760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b61012f816000610521565b6101895760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610115565b506000806101978e8e61047c565b9150915060003660006101aa8c8c610538565b929550935090915050606481101561021b5760405162461bcd60e51b815260206004820152602e60248201527f4552433732315472616e73666572456e666f726365723a696e76616c69642d6360448201526d0c2d8d8c8c2e8c25ad8cadccee8d60931b6064820152608401610115565b6000808061022c84600481886106ff565b8101906102399190610729565b919450925090506001600160a01b038316158061025d57506001600160a01b038216155b156102b95760405162461bcd60e51b815260206004820152602660248201527f4552433732315472616e73666572456e666f726365723a696e76616c69642d6160448201526564647265737360d01b6064820152608401610115565b60006102c860048287896106ff565b6102d19161076a565b9050886001600160a01b0316876001600160a01b0316146103505760405162461bcd60e51b815260206004820152603360248201527f4552433732315472616e73666572456e666f726365723a756e617574686f72696044820152721e99590b58dbdb9d1c9858dd0b5d185c99d95d606a1b6064820152608401610115565b6001600160e01b031981166323b872dd60e01b1480159061038257506001600160e01b03198116632142170760e11b14155b801561039f57506001600160e01b03198116635c46a7ef60e11b14155b156104015760405162461bcd60e51b815260206004820152602c60248201527f4552433732315472616e73666572456e666f726365723a756e617574686f726960448201526b3d32b216b9b2b632b1ba37b960a11b6064820152608401610115565b8782146104655760405162461bcd60e51b815260206004820152602c60248201527f4552433732315472616e73666572456e666f726365723a756e617574686f726960448201526b1e99590b5d1bdad95b8b5a5960a21b6064820152608401610115565b505050505050505050505050505050505050505050565b600080603483146104e35760405162461bcd60e51b815260206004820152602b60248201527f4552433732315472616e73666572456e666f726365723a696e76616c69642d7460448201526a0cae4dae65ad8cadccee8d60ab1b6064820152608401610115565b6104f16014600085876106ff565b6104fa9161079a565b60601c915061050c83601481876106ff565b610515916107cd565b60001c90509250929050565b6001600160f81b0319828116908216145b92915050565b600080368161054a60148287896106ff565b6105539161079a565b60601c93506105666034601487896106ff565b61056f916107cd565b925061057e85603481896106ff565b949793965094505050565b60008083601f84011261059b57600080fd5b50813567ffffffffffffffff8111156105b357600080fd5b6020830191508360208285010111156105cb57600080fd5b9250929050565b6001600160a01b03811681146105e757600080fd5b50565b60008060008060008060008060008060e08b8d03121561060957600080fd5b8a3567ffffffffffffffff8082111561062157600080fd5b61062d8e838f01610589565b909c509a5060208d013591508082111561064657600080fd5b6106528e838f01610589565b909a50985060408d0135975060608d013591508082111561067257600080fd5b5061067f8d828e01610589565b90965094505060808b0135925060a08b013561069a816105d2565b915060c08b01356106aa816105d2565b809150509295989b9194979a5092959850565b600080602083850312156106d057600080fd5b823567ffffffffffffffff8111156106e757600080fd5b6106f385828601610589565b90969095509350505050565b6000808585111561070f57600080fd5b8386111561071c57600080fd5b5050820193919092039150565b60008060006060848603121561073e57600080fd5b8335610749816105d2565b92506020840135610759816105d2565b929592945050506040919091013590565b6001600160e01b031981358181169160048510156107925780818660040360031b1b83161692505b505092915050565b6bffffffffffffffffffffffff1981358181169160148510156107925760149490940360031b84901b1690921692915050565b8035602083101561053257600019602084900360031b1b169291505056fea264697066735822122059baae7c286b09a388772bb8a0feea8851f9a4fec98691fdc00e38b6eb1a59b964736f6c63430008170033";

// src/formatted/ERC20StreamingEnforcer.ts
var ERC20StreamingEnforcer_exports = {};
__export(ERC20StreamingEnforcer_exports, {
  abi: () => abi34,
  bytecode: () => bytecode34
});
var abi34 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAvailableAmount",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "availableAmount_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "token_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "initialAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amountPerSecond_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startTime_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "streamingAllowances",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "initialAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amountPerSecond",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "spent",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "IncreasedSpentMap",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "token",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "initialAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "maxAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amountPerSecond",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "startTime",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "spent",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "lastUpdateTimestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode34 = "0x608060405234801561001057600080fd5b50610b7d806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063d3eddcc51161005b578063d3eddcc514610082578063ed46336714610082578063ee73d772146100fb578063fb7d2c5b1461011c57600080fd5b8063414c3e3314610082578063a145832a1461009e578063b99deb0e146100b1575b600080fd5b61009c610090366004610910565b50505050505050505050565b005b61009c6100ac366004610910565b610189565b6100c46100bf3660046109dd565b61026e565b604080516001600160a01b0390961686526020860194909452928401919091526060830152608082015260a0015b60405180910390f35b61010e610109366004610a1f565b610365565b6040519081526020016100f2565b61016161012a366004610a1f565b6000602081815292815260408082209093529081522080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016100f2565b856101958160006103d0565b6101e65760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101f78160006103d0565b6102515760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084016101dd565b506102608c8c898989886103e7565b505050505050505050505050565b600080808080609486146102d85760405162461bcd60e51b815260206004820152602b60248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d7460448201526a0cae4dae65ad8cadccee8d60ab1b60648201526084016101dd565b6102e660146000888a610a49565b6102ef91610a73565b60601c945061030260346014888a610a49565b61030b91610aa8565b935061031b60546034888a610a49565b61032491610aa8565b925061033460746054888a610a49565b61033d91610aa8565b915061034d60946074888a610a49565b61035691610aa8565b60001c90509295509295909350565b6001600160a01b0382166000908152602081815260408083208484528252808320815160a081018352815481526001820154938101939093526002810154918301919091526003810154606083015260048101546080830152906103c8906107d9565b949350505050565b6001600160f81b0319828116908216145b92915050565b60003660006103f6878761085a565b929550935090915050604481146104675760405162461bcd60e51b815260206004820152602f60248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d6560448201526e0f0cac6eae8d2dedc5ad8cadccee8d608b1b60648201526084016101dd565b60008060008060006104798e8e61026e565b94509450945094509450838310156104e55760405162461bcd60e51b815260206004820152602960248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d6d604482015268185e0b585b5bdd5b9d60ba1b60648201526084016101dd565b6000811161054c5760405162461bcd60e51b815260206004820152602e60248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d7a60448201526d65726f2d73746172742d74696d6560901b60648201526084016101dd565b876001600160a01b0316856001600160a01b0316146105bd5760405162461bcd60e51b815260206004820152602760248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d636044820152661bdb9d1c9858dd60ca1b60648201526084016101dd565b63a9059cbb60e01b6105d360046000898b610a49565b6105dc91610ac6565b6001600160e01b031916146106415760405162461bcd60e51b815260206004820152602560248201527f455243323053747265616d696e67456e666f726365723a696e76616c69642d6d604482015264195d1a1bd960da1b60648201526084016101dd565b336000908152602081815260408083208d84529091528120600481015490910361067e578481556001810184905560028101839055600381018290555b600061068e604460248a8c610a49565b61069791610aa8565b6040805160a081018252845481526001850154602082015260028501549181019190915260038401546060820152600484015460808201529091506106db906107d9565b81111561073c5760405162461bcd60e51b815260206004820152602960248201527f455243323053747265616d696e67456e666f726365723a616c6c6f77616e63656044820152680b595e18d95959195960ba1b60648201526084016101dd565b808260040160008282546107509190610b0a565b90915550506004820154604080516001600160a01b038a81168252602082018a9052818301899052606082018890526080820187905260a08201939093524260c082015290518e928e169133917f30ceca901166c86cac9d1024230d7f5740b26cce6bdd9bad7b1d6e616904ea639181900360e00190a450505050505050505050505050505050565b600081606001514210156107ef57506000919050565b60008260600151426108019190610b1d565b905060008184604001516108159190610b30565b84516108219190610b0a565b90508360200151811115610836575060208301515b8084608001511061084b575060009392505050565b60808401516103c89082610b1d565b600080368161086c6014828789610a49565b61087591610a73565b60601c9350610888603460148789610a49565b61089191610aa8565b92506108a08560348189610a49565b949793965094505050565b60008083601f8401126108bd57600080fd5b50813567ffffffffffffffff8111156108d557600080fd5b6020830191508360208285010111156108ed57600080fd5b9250929050565b80356001600160a01b038116811461090b57600080fd5b919050565b60008060008060008060008060008060e08b8d03121561092f57600080fd5b8a3567ffffffffffffffff8082111561094757600080fd5b6109538e838f016108ab565b909c509a5060208d013591508082111561096c57600080fd5b6109788e838f016108ab565b909a50985060408d0135975060608d013591508082111561099857600080fd5b506109a58d828e016108ab565b90965094505060808b013592506109be60a08c016108f4565b91506109cc60c08c016108f4565b90509295989b9194979a5092959850565b600080602083850312156109f057600080fd5b823567ffffffffffffffff811115610a0757600080fd5b610a13858286016108ab565b90969095509350505050565b60008060408385031215610a3257600080fd5b610a3b836108f4565b946020939093013593505050565b60008085851115610a5957600080fd5b83861115610a6657600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff198135818116916014851015610aa05780818660140360031b1b83161692505b505092915050565b803560208310156103e157600019602084900360031b1b1692915050565b6001600160e01b03198135818116916004851015610aa05760049490940360031b84901b1690921692915050565b634e487b7160e01b600052601160045260246000fd5b808201808211156103e1576103e1610af4565b818103818111156103e1576103e1610af4565b80820281158282048414176103e1576103e1610af456fea2646970667358221220d9282c553e448eac7b4631259f5a457c28077fd4d88ef08db72ec3df532e99ed64736f6c63430008170033";

// src/formatted/IAccount.ts
var IAccount_exports = {};
__export(IAccount_exports, {
  abi: () => abi35,
  bytecode: () => bytecode35
});
var abi35 = [
  {
    "type": "function",
    "name": "validateUserOp",
    "inputs": [
      {
        "name": "userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "userOpHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "missingAccountFunds",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "validationData",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  }
];
var bytecode35 = "0x";

// src/formatted/ExactCalldataEnforcer.ts
var ExactCalldataEnforcer_exports = {};
__export(ExactCalldataEnforcer_exports, {
  abi: () => abi36,
  bytecode: () => bytecode36
});
var abi36 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "callData_",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode36 = "0x608060405234801561001057600080fd5b50610559806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a366004610338565b50505050505050505050565b005b610076610086366004610338565b6100b4565b61009e610099366004610405565b61022b565b6040516100ab9190610447565b60405180910390f35b856100c081600061026b565b6101115760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b61012281600061026b565b61017c5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610108565b5036600061018a8989610282565b935093505050600061019c8f8f61022b565b905082826040516101ae929190610496565b604051809103902081805190602001201461021a5760405162461bcd60e51b815260206004820152602660248201527f457861637443616c6c64617461456e666f726365723a696e76616c69642d63616044820152656c6c6461746160d01b6064820152608401610108565b505050505050505050505050505050565b606082828080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929695505050505050565b6001600160f81b0319828116908216145b92915050565b600080368161029460148287896104a6565b61029d916104d0565b60601c93506102b06034601487896104a6565b6102b991610505565b92506102c885603481896104a6565b949793965094505050565b60008083601f8401126102e557600080fd5b50813567ffffffffffffffff8111156102fd57600080fd5b60208301915083602082850101111561031557600080fd5b9250929050565b80356001600160a01b038116811461033357600080fd5b919050565b60008060008060008060008060008060e08b8d03121561035757600080fd5b8a3567ffffffffffffffff8082111561036f57600080fd5b61037b8e838f016102d3565b909c509a5060208d013591508082111561039457600080fd5b6103a08e838f016102d3565b909a50985060408d0135975060608d01359150808211156103c057600080fd5b506103cd8d828e016102d3565b90965094505060808b013592506103e660a08c0161031c565b91506103f460c08c0161031c565b90509295989b9194979a5092959850565b6000806020838503121561041857600080fd5b823567ffffffffffffffff81111561042f57600080fd5b61043b858286016102d3565b90969095509350505050565b60006020808352835180602085015260005b8181101561047557858101830151858201604001528201610459565b506000604082860101526040601f19601f8301168501019250505092915050565b8183823760009101908152919050565b600080858511156104b657600080fd5b838611156104c357600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156104fd5780818660140360031b1b83161692505b505092915050565b8035602083101561027c57600019602084900360031b1b169291505056fea26469706673582212207ea2be587c5142bd07609ab1e9e3d82af76502619dbab0e88f14c164094d01e564736f6c63430008170033";

// src/formatted/IAggregator.ts
var IAggregator_exports = {};
__export(IAggregator_exports, {
  abi: () => abi37,
  bytecode: () => bytecode37
});
var abi37 = [
  {
    "type": "function",
    "name": "aggregateSignatures",
    "inputs": [
      {
        "name": "userOps",
        "type": "tuple[]",
        "internalType": "struct PackedUserOperation[]",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "aggregatedSignature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "validateSignatures",
    "inputs": [
      {
        "name": "userOps",
        "type": "tuple[]",
        "internalType": "struct PackedUserOperation[]",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "validateUserOpSignature",
    "inputs": [
      {
        "name": "userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "sigForUserOp",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode37 = "0x";

// src/formatted/ExactExecutionEnforcer.ts
var ExactExecutionEnforcer_exports = {};
__export(ExactExecutionEnforcer_exports, {
  abi: () => abi38,
  bytecode: () => bytecode38
});
var abi38 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "execution_",
        "type": "tuple",
        "internalType": "struct Execution",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode38 = "0x608060405234801561001057600080fd5b5061062f806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a3660046103e9565b50505050505050505050565b005b6100766100863660046103e9565b6100b4565b61009e6100993660046104b6565b610197565b6040516100ab91906104f8565b60405180910390f35b856100c0816000610210565b6101115760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b610122816000610210565b61017c5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610108565b506101898c8c8989610227565b505050505050505050505050565b604080516060808201835260008083526020830152918101919091526101bd8383610333565b81818080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050506040860152505060208301526001600160a01b0316815292915050565b6001600160f81b0319828116908216145b92915050565b6000803660006102378686610333565b929650909450925090506001600160a01b038416610259601460008a8c61056c565b61026291610596565b60601c14801561028757508261027c603460148a8c61056c565b610285916105cb565b145b80156102cc5750818160405161029e9291906105e9565b6040519081900390206102b4886034818c61056c565b6040516102c29291906105e9565b6040518091039020145b6103295760405162461bcd60e51b815260206004820152602860248201527f4578616374457865637574696f6e456e666f726365723a696e76616c69642d656044820152673c32b1baba34b7b760c11b6064820152608401610108565b5050505050505050565b6000803681610345601482878961056c565b61034e91610596565b60601c935061036160346014878961056c565b61036a916105cb565b9250610379856034818961056c565b949793965094505050565b60008083601f84011261039657600080fd5b50813567ffffffffffffffff8111156103ae57600080fd5b6020830191508360208285010111156103c657600080fd5b9250929050565b80356001600160a01b03811681146103e457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561040857600080fd5b8a3567ffffffffffffffff8082111561042057600080fd5b61042c8e838f01610384565b909c509a5060208d013591508082111561044557600080fd5b6104518e838f01610384565b909a50985060408d0135975060608d013591508082111561047157600080fd5b5061047e8d828e01610384565b90965094505060808b0135925061049760a08c016103cd565b91506104a560c08c016103cd565b90509295989b9194979a5092959850565b600080602083850312156104c957600080fd5b823567ffffffffffffffff8111156104e057600080fd5b6104ec85828601610384565b90969095509350505050565b6000602080835260018060a01b038451166020840152602084015160408401526040840151606080850152805180608086015260005b8181101561054a5782810184015186820160a00152830161052e565b50600060a0828701015260a0601f19601f830116860101935050505092915050565b6000808585111561057c57600080fd5b8386111561058957600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156105c35780818660140360031b1b83161692505b505092915050565b8035602083101561022157600019602084900360031b1b1692915050565b818382376000910190815291905056fea2646970667358221220e961f8992a129634c5841f6f8ff7eac208b6822d2646363c613c0f46bcd65a0b64736f6c63430008170033";

// src/formatted/IBeacon.ts
var IBeacon_exports = {};
__export(IBeacon_exports, {
  abi: () => abi39,
  bytecode: () => bytecode39
});
var abi39 = [
  {
    "type": "function",
    "name": "implementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode39 = "0x";

// src/formatted/IDelegationManager.ts
var IDelegationManager_exports = {};
__export(IDelegationManager_exports, {
  abi: () => abi40,
  bytecode: () => bytecode40
});
var abi40 = [
  {
    "type": "function",
    "name": "disableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "disabledDelegations",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "enableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getDelegationHash",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getDomainHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "redeemDelegations",
    "inputs": [
      {
        "name": "_permissionContexts",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "_modes",
        "type": "bytes32[]",
        "internalType": "ModeCode[]"
      },
      {
        "name": "_executionCallDatas",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unpause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "DisabledDelegation",
    "inputs": [
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "delegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegate",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegation",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EnabledDelegation",
    "inputs": [
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "delegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegate",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegation",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RedeemedDelegation",
    "inputs": [
      {
        "name": "rootDelegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegation",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDomain",
    "inputs": [
      {
        "name": "domainHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "domainVersion",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "contractAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AlreadyDisabled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AlreadyEnabled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "BatchDataLengthMismatch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotUseADisabledDelegation",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EmptySignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidAuthority",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidDelegate",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidDelegator",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEOASignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidERC1271Signature",
    "inputs": []
  }
];
var bytecode40 = "0x";

// src/formatted/EntryPoint.ts
var EntryPoint_exports = {};
__export(EntryPoint_exports, {
  abi: () => abi41,
  bytecode: () => bytecode41
});
var abi41 = [
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "addStake",
    "inputs": [
      {
        "name": "unstakeDelaySec",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "delegateAndRevert",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositTo",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "deposits",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "deposit",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "staked",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "stake",
        "type": "uint112",
        "internalType": "uint112"
      },
      {
        "name": "unstakeDelaySec",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "withdrawTime",
        "type": "uint48",
        "internalType": "uint48"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDepositInfo",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "info",
        "type": "tuple",
        "internalType": "struct IStakeManager.DepositInfo",
        "components": [
          {
            "name": "deposit",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "staked",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "stake",
            "type": "uint112",
            "internalType": "uint112"
          },
          {
            "name": "unstakeDelaySec",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "withdrawTime",
            "type": "uint48",
            "internalType": "uint48"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSenderAddress",
    "inputs": [
      {
        "name": "initCode",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getUserOpHash",
    "inputs": [
      {
        "name": "userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "handleAggregatedOps",
    "inputs": [
      {
        "name": "opsPerAggregator",
        "type": "tuple[]",
        "internalType": "struct IEntryPoint.UserOpsPerAggregator[]",
        "components": [
          {
            "name": "userOps",
            "type": "tuple[]",
            "internalType": "struct PackedUserOperation[]",
            "components": [
              {
                "name": "sender",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "nonce",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "initCode",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "callData",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "accountGasLimits",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "preVerificationGas",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "gasFees",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "paymasterAndData",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "signature",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "aggregator",
            "type": "address",
            "internalType": "contract IAggregator"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "beneficiary",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "handleOps",
    "inputs": [
      {
        "name": "ops",
        "type": "tuple[]",
        "internalType": "struct PackedUserOperation[]",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "beneficiary",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "incrementNonce",
    "inputs": [
      {
        "name": "key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "innerHandleOp",
    "inputs": [
      {
        "name": "callData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "opInfo",
        "type": "tuple",
        "internalType": "struct EntryPoint.UserOpInfo",
        "components": [
          {
            "name": "mUserOp",
            "type": "tuple",
            "internalType": "struct EntryPoint.MemoryUserOp",
            "components": [
              {
                "name": "sender",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "nonce",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "verificationGasLimit",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "callGasLimit",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "paymasterVerificationGasLimit",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "paymasterPostOpGasLimit",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "preVerificationGas",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "paymaster",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "maxFeePerGas",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxPriorityFeePerGas",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "userOpHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "prefund",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "contextOffset",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "preOpGas",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "context",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "actualGasCost",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "nonceSequenceNumber",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "unlockStake",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawStake",
    "inputs": [
      {
        "name": "withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawTo",
    "inputs": [
      {
        "name": "withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AccountDeployed",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "factory",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "paymaster",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BeforeExecution",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Deposited",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalDeposit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PostOpRevertReason",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "revertReason",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SignatureAggregatorChanged",
    "inputs": [
      {
        "name": "aggregator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeLocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalStaked",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "unstakeDelaySec",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeUnlocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawTime",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeWithdrawn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserOperationEvent",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "paymaster",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "success",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "actualGasCost",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "actualGasUsed",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserOperationPrefundTooLow",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserOperationRevertReason",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "revertReason",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Withdrawn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "DelegateAndRevert",
    "inputs": [
      {
        "name": "success",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "ret",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "FailedOp",
    "inputs": [
      {
        "name": "opIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "FailedOpWithRevert",
    "inputs": [
      {
        "name": "opIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "inner",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "PostOpReverted",
    "inputs": [
      {
        "name": "returnData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SenderAddressResult",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "SignatureValidationFailed",
    "inputs": [
      {
        "name": "aggregator",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];
var bytecode41 = "0x60a0604052604051620000129062000051565b604051809103905ff0801580156200002c573d5f803e3d5ffd5b506001600160a01b031660805234801562000045575f80fd5b5060016002556200005f565b6101ff806200374883390190565b6080516136c96200007f5f395f8181610de0015261271501526136c95ff3fe608060405260043610610107575f3560e01c806370a0823111610092578063b760faf911610062578063b760faf914610425578063bb9fe6bf14610438578063c23a5cea1461044c578063dbed18e01461046b578063fc7e286d1461048a575f80fd5b806370a0823114610394578063765e827f146103c8578063850aaf62146103e75780639b249f6914610406575f80fd5b80631b2e01b8116100d85780631b2e01b8146101ae578063205c2878146101e457806322cdde4c1461020357806335567e1a146102225780635287ce1214610280575f80fd5b806242dc531461011b57806301ffc9a71461014d5780630396cb601461017c5780630bd28e3b1461018f575f80fd5b366101175761011533610530565b005b5f80fd5b348015610126575f80fd5b5061013a610135366004612c4f565b610584565b6040519081526020015b60405180910390f35b348015610158575f80fd5b5061016c610167366004612d06565b610702565b6040519015158152602001610144565b61011561018a366004612d2d565b610789565b34801561019a575f80fd5b506101156101a9366004612d66565b610a14565b3480156101b9575f80fd5b5061013a6101c8366004612d7f565b600160209081525f928352604080842090915290825290205481565b3480156101ef575f80fd5b506101156101fe366004612db2565b610a4a565b34801561020e575f80fd5b5061013a61021d366004612ddc565b610b96565b34801561022d575f80fd5b5061013a61023c366004612d7f565b6001600160a01b0382165f9081526001602090815260408083206001600160c01b038516845290915290819020549082901b67ffffffffffffffff19161792915050565b34801561028b575f80fd5b5061033a61029a366004612e13565b6040805160a0810182525f80825260208201819052918101829052606081018290526080810191909152506001600160a01b03165f9081526020818152604091829020825160a0810184528154815260019091015460ff811615159282019290925261010082046001600160701b031692810192909252600160781b810463ffffffff166060830152600160981b900465ffffffffffff16608082015290565b60405161014491905f60a082019050825182526020830151151560208301526001600160701b03604084015116604083015263ffffffff606084015116606083015265ffffffffffff608084015116608083015292915050565b34801561039f575f80fd5b5061013a6103ae366004612e13565b6001600160a01b03165f9081526020819052604090205490565b3480156103d3575f80fd5b506101156103e2366004612e6e565b610bd7565b3480156103f2575f80fd5b50610115610401366004612ec0565b610d4c565b348015610411575f80fd5b50610115610420366004612f10565b610dc7565b610115610433366004612e13565b610530565b348015610443575f80fd5b50610115610e7e565b348015610457575f80fd5b50610115610466366004612e13565b610fa8565b348015610476575f80fd5b50610115610485366004612e6e565b6111c7565b348015610495575f80fd5b506104ed6104a4366004612e13565b5f602081905290815260409020805460019091015460ff81169061010081046001600160701b031690600160781b810463ffffffff1690600160981b900465ffffffffffff1685565b6040805195865293151560208601526001600160701b039092169284019290925263ffffffff909116606083015265ffffffffffff16608082015260a001610144565b5f61053b82346115ce565b9050816001600160a01b03167f2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c48260405161057891815260200190565b60405180910390a25050565b5f805a90503330146105dd5760405162461bcd60e51b815260206004820152601760248201527f4141393220696e7465726e616c2063616c6c206f6e6c7900000000000000000060448201526064015b60405180910390fd5b8451606081015160a082015181016127100160405a603f028161060257610602612f4e565b0410156106185763deaddead60e01b5f5260205ffd5b87515f90156106a6575f610631845f01515f8c86611600565b9050806106a4575f610644610800611616565b80519091501561069e57845f01516001600160a01b03168a602001517f1c4fada7374c0a9ee8841fc38afe82932dc0f8e69012e927f061a8bae611a201876020015184604051610695929190612faf565b60405180910390a35b60019250505b505b5f88608001515a86030190506106f4828a8a8a8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250879250611641915050565b9a9950505050505050505050565b5f6001600160e01b0319821663307e35b760e11b148061073257506001600160e01b0319821663122a0e9b60e31b145b8061074d57506001600160e01b0319821663cf28ef9760e01b145b8061076857506001600160e01b03198216633e84f02160e01b145b8061078357506301ffc9a760e01b6001600160e01b03198316145b92915050565b335f90815260208190526040902063ffffffff82166107ea5760405162461bcd60e51b815260206004820152601a60248201527f6d757374207370656369667920756e7374616b652064656c617900000000000060448201526064016105d4565b600181015463ffffffff600160781b9091048116908316101561084f5760405162461bcd60e51b815260206004820152601c60248201527f63616e6e6f7420646563726561736520756e7374616b652074696d650000000060448201526064016105d4565b60018101545f9061086f90349061010090046001600160701b0316612fdb565b90505f81116108b55760405162461bcd60e51b81526020600482015260126024820152711b9bc81cdd185ad9481cdc1958da599a595960721b60448201526064016105d4565b6001600160701b038111156108fd5760405162461bcd60e51b815260206004820152600e60248201526d7374616b65206f766572666c6f7760901b60448201526064016105d4565b6040805160a08101825283548152600160208083018281526001600160701b0386811685870190815263ffffffff8a8116606088018181525f60808a0181815233808352828a52918c90209a518b55965199909801805494519151965165ffffffffffff16600160981b0265ffffffffffff60981b1997909416600160781b029690961669ffffffffffffffffffff60781b1991909516610100026effffffffffffffffffffffffffff0019991515999099166effffffffffffffffffffffffffffff1990941693909317979097179190911691909117179055835185815290810192909252917fa5ae833d0bb1dcd632d98a8b70973e8516812898e19bf27b70071ebc8dc52c01910160405180910390a2505050565b335f9081526001602090815260408083206001600160c01b03851684529091528120805491610a4283612fee565b919050555050565b335f9081526020819052604090208054821115610aa95760405162461bcd60e51b815260206004820152601960248201527f576974686472617720616d6f756e7420746f6f206c617267650000000000000060448201526064016105d4565b8054610ab6908390613006565b8155604080516001600160a01b03851681526020810184905233917fd1c19fbcd4551a5edfb66d43d2e337c04837afda3482b42bdf569a8fccdae5fb910160405180910390a25f836001600160a01b0316836040515f6040518083038185875af1925050503d805f8114610b45576040519150601f19603f3d011682016040523d82523d5f602084013e610b4a565b606091505b5050905080610b905760405162461bcd60e51b81526020600482015260126024820152716661696c656420746f20776974686472617760701b60448201526064016105d4565b50505050565b5f610ba0826117f9565b6040805160208101929092523090820152466060820152608001604051602081830303815290604052805190602001209050919050565b610bdf611811565b815f816001600160401b03811115610bf957610bf9612a5a565b604051908082528060200260200182016040528015610c3257816020015b610c1f6129d0565b815260200190600190039081610c175790505b5090505f5b82811015610ca7575f828281518110610c5257610c52613019565b602002602001015190505f80610c8c848a8a87818110610c7457610c74613019565b9050602002810190610c86919061302d565b85611839565b91509150610c9c8483835f611a3b565b505050600101610c37565b506040515f907fbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972908290a15f5b83811015610d2f57610d2381888884818110610cf257610cf2613019565b9050602002810190610d04919061302d565b858481518110610d1657610d16613019565b6020026020010151611bd5565b90910190600101610cd4565b50610d3a8482611e83565b505050610d476001600255565b505050565b5f80846001600160a01b03168484604051610d6892919061304c565b5f60405180830381855af49150503d805f8114610da0576040519150601f19603f3d011682016040523d82523d5f602084013e610da5565b606091505b50915091508181604051632650415560e21b81526004016105d492919061305b565b604051632b870d1b60e11b81525f906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063570e1a3690610e17908690869060040161309d565b6020604051808303815f875af1158015610e33573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610e5791906130b0565b604051633653dc0360e11b81526001600160a01b03821660048201529091506024016105d4565b335f90815260208190526040812060018101549091600160781b90910463ffffffff169003610edc5760405162461bcd60e51b815260206004820152600a6024820152691b9bdd081cdd185ad95960b21b60448201526064016105d4565b600181015460ff16610f245760405162461bcd60e51b8152602060048201526011602482015270616c726561647920756e7374616b696e6760781b60448201526064016105d4565b60018101545f90610f4290600160781b900463ffffffff16426130cb565b60018301805460ff65ffffffffffff60981b011916600160981b65ffffffffffff841690810260ff19169190911790915560405190815290915033907ffa9b3c14cc825c412c9ed81b3ba365a5b459439403f18829e572ed53a4180f0a90602001610578565b335f908152602081905260409020600181015461010090046001600160701b03168061100d5760405162461bcd60e51b81526020600482015260146024820152734e6f207374616b6520746f20776974686472617760601b60448201526064016105d4565b6001820154600160981b900465ffffffffffff1661106d5760405162461bcd60e51b815260206004820152601d60248201527f6d7573742063616c6c20756e6c6f636b5374616b65282920666972737400000060448201526064016105d4565b600182015442600160981b90910465ffffffffffff1611156110d15760405162461bcd60e51b815260206004820152601b60248201527f5374616b65207769746864726177616c206973206e6f7420647565000000000060448201526064016105d4565b600182018054610100600160c81b0319169055604080516001600160a01b03851681526020810183905233917fb7c918e0e249f999e965cafeb6c664271b3f4317d296461500e71da39f0cbda3910160405180910390a25f836001600160a01b0316826040515f6040518083038185875af1925050503d805f8114611171576040519150601f19603f3d011682016040523d82523d5f602084013e611176565b606091505b5050905080610b905760405162461bcd60e51b815260206004820152601860248201527f6661696c656420746f207769746864726177207374616b65000000000000000060448201526064016105d4565b6111cf611811565b815f805b8281101561133657368686838181106111ee576111ee613019565b905060200281019061120091906130f1565b9050365f61120e8380613105565b90925090505f6112246040850160208601612e13565b90505f196001600160a01b0382160161127f5760405162461bcd60e51b815260206004820152601760248201527f4141393620696e76616c69642061676772656761746f7200000000000000000060448201526064016105d4565b6001600160a01b0381161561131a576001600160a01b038116632dd8113384846112ac604089018961314a565b6040518563ffffffff1660e01b81526004016112cb94939291906132ab565b5f6040518083038186803b1580156112e1575f80fd5b505afa9250505080156112f2575060015b61131a5760405163086a9f7560e41b81526001600160a01b03821660048201526024016105d4565b6113248287612fdb565b955050600190930192506111d3915050565b505f816001600160401b0381111561135057611350612a5a565b60405190808252806020026020018201604052801561138957816020015b6113766129d0565b81526020019060019003908161136e5790505b5090505f805b8481101561146057368888838181106113aa576113aa613019565b90506020028101906113bc91906130f1565b9050365f6113ca8380613105565b90925090505f6113e06040850160208601612e13565b9050815f5b8181101561144e575f89898151811061140057611400613019565b602002602001015190505f806114228b898987818110610c7457610c74613019565b9150915061143284838389611a3b565b8a61143c81612fee565b9b5050600190930192506113e5915050565b50506001909401935061138f92505050565b506040517fbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972905f90a1505f80805b8581101561158a57368989838181106114a9576114a9613019565b90506020028101906114bb91906130f1565b90506114cd6040820160208301612e13565b6001600160a01b03167f575ff3acadd5ab348fe1855e217e0f3678f8d767d7494c9f9fefbee2e17cca4d60405160405180910390a2365f61150e8380613105565b9092509050805f5b81811015611579576115588885858481811061153457611534613019565b9050602002810190611546919061302d565b8b8b81518110610d1657610d16613019565b6115629088612fdb565b96508761156e81612fee565b985050600101611516565b50506001909301925061148e915050565b506040515f907f575ff3acadd5ab348fe1855e217e0f3678f8d767d7494c9f9fefbee2e17cca4d908290a26115bf8682611e83565b5050505050610d476001600255565b6001600160a01b0382165f908152602081905260408120805482906115f4908590612fdb565b91829055509392505050565b5f805f845160208601878987f195945050505050565b60603d828111156116245750815b604051602082018101604052818152815f602083013e9392505050565b5f805a85519091505f908161165582611f78565b60e08301519091506001600160a01b038116611674578251935061172b565b8093505f8851111561172b57868202955060028a600281111561169957611699613325565b1461172b5760a0830151604051637c627b2160e01b81526001600160a01b03831691637c627b21916116d5908e908d908c908990600401613339565b5f604051808303815f88803b1580156116ec575f80fd5b5087f1935050505080156116fe575060015b61172b575f61170e610800611616565b905080604051632b5e552f60e21b81526004016105d49190613380565b5a60a0840151606085015160808c01519288039990990198019088038082111561175e576064600a828403020498909801975b505060408901518783029650868110156117b75760028b600281111561178657611786613325565b036117a8578096506117978a611fa9565b6117a38a5f898b611ff8565b6117eb565b63deadaa5160e01b5f5260205ffd5b8681036117c486826115ce565b505f808d60028111156117d9576117d9613325565b1490506117e88c828b8d611ff8565b50505b505050505050949350505050565b5f61180382612073565b805190602001209050919050565b600280540361183357604051633ee5aeb560e01b815260040160405180910390fd5b60028055565b5f805f5a845190915061184c8682612128565b61185586610b96565b6020860152604081015161012082015161010083015160a08401516080850151606086015160c0870151861717171717176effffffffffffffffffffffffffffff8111156118e55760405162461bcd60e51b815260206004820152601860248201527f41413934206761732076616c756573206f766572666c6f77000000000000000060448201526064016105d4565b5f6119138460c081015160a08201516080830151606084015160408501516101009095015194010101010290565b90506119228a8a8a8487612234565b9650611935845f015185602001516123c5565b61198b5789604051631101335b60e11b81526004016105d4918152604060208201819052601a908201527f4141323520696e76616c6964206163636f756e74206e6f6e6365000000000000606082015260800190565b825a860311156119e75789604051631101335b60e11b81526004016105d4918152604060208201819052601e908201527f41413236206f76657220766572696669636174696f6e4761734c696d69740000606082015260800190565b60e08401516060906001600160a01b031615611a0e57611a098b8b8b85612411565b975090505b604089018290528060608a015260a08a01355a870301896080018181525050505050505050935093915050565b5f80611a46856125c8565b91509150816001600160a01b0316836001600160a01b031614611aac5785604051631101335b60e11b81526004016105d49181526040602082018190526014908201527320a0991a1039b4b3b730ba3ab9329032b93937b960611b606082015260800190565b8015611b045785604051631101335b60e11b81526004016105d49181526040602082018190526017908201527f414132322065787069726564206f72206e6f7420647565000000000000000000606082015260800190565b5f611b0e856125c8565b925090506001600160a01b03811615611b6a5786604051631101335b60e11b81526004016105d49181526040602082018190526014908201527320a0999a1039b4b3b730ba3ab9329032b93937b960611b606082015260800190565b8115611bcc5786604051631101335b60e11b81526004016105d49181526040602082018190526021908201527f41413332207061796d61737465722065787069726564206f72206e6f742064756060820152606560f81b608082015260a00190565b50505050505050565b5f805a90505f611be6846060015190565b6040519091505f903682611bfd60608a018a61314a565b9150915060605f826003811115611c1357843591505b506372288ed160e01b6001600160e01b0319821601611cc0575f8b8b60200151604051602401611c44929190613392565b60408051601f198184030181529181526020820180516001600160e01b0316638dd7712f60e01b1790525190915030906242dc5390611c8b9084908f908d9060240161345d565b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050925050611d15565b306001600160a01b03166242dc5385858d8b604051602401611ce5949392919061349c565b604051602081830303815290604052915060e01b6020820180516001600160e01b03838183161783525050505091505b60205f8351602085015f305af195505f51985084604052505050505080611e79575f3d80602003611d4a5760205f803e5f5191505b5063deaddead60e01b8103611d9d5787604051631101335b60e11b81526004016105d4918152604060208201819052600f908201526e41413935206f7574206f662067617360881b606082015260800190565b63deadaa5160e01b8103611dec575f86608001515a611dbc9087613006565b611dc69190612fdb565b6040880151909150611dd788611fa9565b611de3885f8385611ff8565b9550611e779050565b855180516020808901519201516001600160a01b0390911691907ff62676f440ff169a3a9afdbf812e89e7f95975ee8e5c31214ffdef631c5f479290611e33610800611616565b604051611e41929190612faf565b60405180910390a35f86608001515a611e5a9087613006565b611e649190612fdb565b9050611e736002888684611641565b9550505b505b5050509392505050565b6001600160a01b038216611ed95760405162461bcd60e51b815260206004820152601860248201527f4141393020696e76616c69642062656e6566696369617279000000000000000060448201526064016105d4565b5f826001600160a01b0316826040515f6040518083038185875af1925050503d805f8114611f22576040519150601f19603f3d011682016040523d82523d5f602084013e611f27565b606091505b5050905080610d475760405162461bcd60e51b815260206004820152601f60248201527f41413931206661696c65642073656e6420746f2062656e65666963696172790060448201526064016105d4565b6101008101516101208201515f9190808203611f95575092915050565b611fa182488301612617565b949350505050565b80518051602080840151928101516040519081526001600160a01b0390921692917f67b4fa9642f42120bf031f3051d1824b0fe25627945b27b8a6a65d5761d5482e910160405180910390a350565b835160e081015181516020808801519301516040516001600160a01b039384169492909316927f49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f916120659189908990899093845291151560208401526040830152606082015260800190565b60405180910390a450505050565b6060813560208301355f61209261208d604087018761314a565b61262e565b90505f6120a561208d606088018861314a565b9050608086013560a087013560c08801355f6120c761208d60e08c018c61314a565b604080516001600160a01b039a909a1660208b015289810198909852606089019690965250608087019390935260a086019190915260c085015260e08401526101008084019190915281518084039091018152610120909201905292915050565b6121356020830183612e13565b6001600160a01b03168152602082810135908201526001600160801b036080808401358281166060850152811c604084015260a084013560c0808501919091528401359182166101008401521c610120820152365f61219760e085018561314a565b9092509050801561221a5760348110156121f35760405162461bcd60e51b815260206004820152601d60248201527f4141393320696e76616c6964207061796d6173746572416e644461746100000060448201526064016105d4565b6121fd8282612640565b60a086015260808501526001600160a01b031660e0840152610b90565b5f60e084018190526080840181905260a084015250505050565b825180515f9190612252888761224d60408b018b61314a565b6126a7565b60e08201515f6001600160a01b038216612293576001600160a01b0383165f9081526020819052604090205487811161228d5780880361228f565b5f5b9150505b60208801516040516306608bdf60e21b81526001600160a01b038516916319822f7c9189916122c9918e919087906004016134d2565b6020604051808303815f8887f193505050508015612304575060408051601f3d908101601f19168201909252612301918101906134f6565b60015b61232f5789612314610800611616565b6040516365c8fd4d60e01b81526004016105d492919061350d565b94506001600160a01b0382166123b8576001600160a01b0383165f9081526020819052604090208054808911156123b2578b604051631101335b60e11b81526004016105d49181526040602082018190526017908201527f41413231206469646e2774207061792070726566756e64000000000000000000606082015260800190565b88900390555b5050505095945050505050565b6001600160a01b0382165f90815260016020908152604080832084821c80855292528220805484916001600160401b03831691908561240383612fee565b909155501495945050505050565b60605f805a855160e08101516001600160a01b0381165f9081526020819052604090208054939450919290919087811015612498578a604051631101335b60e11b81526004016105d4918152604060208201819052601e908201527f41413331207061796d6173746572206465706f73697420746f6f206c6f770000606082015260800190565b878103825f01819055505f84608001519050836001600160a01b03166352b7512c828d8d602001518d6040518563ffffffff1660e01b81526004016124df939291906134d2565b5f604051808303815f8887f19350505050801561251d57506040513d5f823e601f3d908101601f1916820160405261251a9190810190613549565b60015b612548578b61252d610800611616565b6040516365c8fd4d60e01b81526004016105d49291906135c4565b9098509650805a870311156125b9578b604051631101335b60e11b81526004016105d49181526040602082018190526027908201527f41413336206f766572207061796d6173746572566572696669636174696f6e47606082015266185cd31a5b5a5d60ca1b608082015260a00190565b50505050505094509492505050565b5f80825f036125db57505f928392509050565b5f6125e584612961565b9050806040015165ffffffffffff1642118061260c5750806020015165ffffffffffff1642105b905194909350915050565b5f8183106126255781612627565b825b9392505050565b5f604051828085833790209392505050565b5f80806126506014828688613600565b61265991613627565b60601c61266a602460148789613600565b6126739161365c565b60801c61268460346024888a613600565b61268d9161365c565b9194506001600160801b0316925060801c90509250925092565b8015610b90578251516001600160a01b0381163b156127125784604051631101335b60e11b81526004016105d4918152604060208201819052601f908201527f414131302073656e64657220616c726561647920636f6e737472756374656400606082015260800190565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663570e1a36865f01516040015186866040518463ffffffff1660e01b815260040161276992919061309d565b6020604051808303815f8887f1158015612785573d5f803e3d5ffd5b50505050506040513d601f19601f820116820180604052508101906127aa91906130b0565b90506001600160a01b03811661280c5785604051631101335b60e11b81526004016105d4918152604060208201819052601b908201527f4141313320696e6974436f6465206661696c6564206f72204f4f470000000000606082015260800190565b816001600160a01b0316816001600160a01b0316146128765785604051631101335b60e11b81526004016105d491815260406020808301829052908201527f4141313420696e6974436f6465206d7573742072657475726e2073656e646572606082015260800190565b806001600160a01b03163b5f036128d85785604051631101335b60e11b81526004016105d491815260406020808301829052908201527f4141313520696e6974436f6465206d757374206372656174652073656e646572606082015260800190565b5f6128e66014828688613600565b6128ef91613627565b60601c9050826001600160a01b031686602001517fd51a9c61267aa6196961883ecf5ff2da6619c37dac0fa92122513fb32c032d2d83895f015160e001516040516129509291906001600160a01b0392831681529116602082015260400190565b60405180910390a350505050505050565b604080516060810182525f80825260208201819052918101919091528160a081901c65ffffffffffff81165f0361299b575065ffffffffffff5b604080516060810182526001600160a01b03909316835260d09490941c602083015265ffffffffffff16928101929092525090565b6040518060a00160405280612a396040518061014001604052805f6001600160a01b031681526020015f81526020015f81526020015f81526020015f81526020015f81526020015f81526020015f6001600160a01b031681526020015f81526020015f81525090565b81526020015f80191681526020015f81526020015f81526020015f81525090565b634e487b7160e01b5f52604160045260245ffd5b60405160a081016001600160401b0381118282101715612a9057612a90612a5a565b60405290565b60405161014081016001600160401b0381118282101715612a9057612a90612a5a565b604051601f8201601f191681016001600160401b0381118282101715612ae157612ae1612a5a565b604052919050565b5f6001600160401b03821115612b0157612b01612a5a565b50601f01601f191660200190565b6001600160a01b0381168114612b23575f80fd5b50565b8035612b3181612b0f565b919050565b5f8183036101c0811215612b48575f80fd5b612b50612a6e565b915061014080821215612b61575f80fd5b612b69612a96565b9150612b7484612b26565b82526020840135602083015260408401356040830152606084013560608301526080840135608083015260a084013560a083015260c084013560c0830152612bbe60e08501612b26565b60e0830152610100848101359083015261012080850135908301529082528201356020820152610160820135604082015261018082013560608201526101a0909101356080820152919050565b5f8083601f840112612c1b575f80fd5b5081356001600160401b03811115612c31575f80fd5b602083019150836020828501011115612c48575f80fd5b9250929050565b5f805f806102008587031215612c63575f80fd5b84356001600160401b0380821115612c79575f80fd5b818701915087601f830112612c8c575f80fd5b8135612c9f612c9a82612ae9565b612ab9565b818152896020838601011115612cb3575f80fd5b816020850160208301375f602083830101528097505050612cd78860208901612b36565b94506101e0870135915080821115612ced575f80fd5b50612cfa87828801612c0b565b95989497509550505050565b5f60208284031215612d16575f80fd5b81356001600160e01b031981168114612627575f80fd5b5f60208284031215612d3d575f80fd5b813563ffffffff81168114612627575f80fd5b80356001600160c01b0381168114612b31575f80fd5b5f60208284031215612d76575f80fd5b61262782612d50565b5f8060408385031215612d90575f80fd5b8235612d9b81612b0f565b9150612da960208401612d50565b90509250929050565b5f8060408385031215612dc3575f80fd5b8235612dce81612b0f565b946020939093013593505050565b5f60208284031215612dec575f80fd5b81356001600160401b03811115612e01575f80fd5b82016101208185031215612627575f80fd5b5f60208284031215612e23575f80fd5b813561262781612b0f565b5f8083601f840112612e3e575f80fd5b5081356001600160401b03811115612e54575f80fd5b6020830191508360208260051b8501011115612c48575f80fd5b5f805f60408486031215612e80575f80fd5b83356001600160401b03811115612e95575f80fd5b612ea186828701612e2e565b9094509250506020840135612eb581612b0f565b809150509250925092565b5f805f60408486031215612ed2575f80fd5b8335612edd81612b0f565b925060208401356001600160401b03811115612ef7575f80fd5b612f0386828701612c0b565b9497909650939450505050565b5f8060208385031215612f21575f80fd5b82356001600160401b03811115612f36575f80fd5b612f4285828601612c0b565b90969095509350505050565b634e487b7160e01b5f52601260045260245ffd5b5f5b83811015612f7c578181015183820152602001612f64565b50505f910152565b5f8151808452612f9b816020860160208601612f62565b601f01601f19169290920160200192915050565b828152604060208201525f611fa16040830184612f84565b634e487b7160e01b5f52601160045260245ffd5b8082018082111561078357610783612fc7565b5f60018201612fff57612fff612fc7565b5060010190565b8181038181111561078357610783612fc7565b634e487b7160e01b5f52603260045260245ffd5b5f823561011e19833603018112613042575f80fd5b9190910192915050565b818382375f9101908152919050565b8215158152604060208201525f611fa16040830184612f84565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f611fa1602083018486613075565b5f602082840312156130c0575f80fd5b815161262781612b0f565b65ffffffffffff8181168382160190808211156130ea576130ea612fc7565b5092915050565b5f8235605e19833603018112613042575f80fd5b5f808335601e1984360301811261311a575f80fd5b8301803591506001600160401b03821115613133575f80fd5b6020019150600581901b3603821315612c48575f80fd5b5f808335601e1984360301811261315f575f80fd5b8301803591506001600160401b03821115613178575f80fd5b602001915036819003821315612c48575f80fd5b5f808335601e198436030181126131a1575f80fd5b83016020810192503590506001600160401b038111156131bf575f80fd5b803603821315612c48575f80fd5b5f6101206131eb846131de85612b26565b6001600160a01b03169052565b60208301356020850152613202604084018461318c565b8260408701526132158387018284613075565b92505050613226606084018461318c565b8583036060870152613239838284613075565b925050506080830135608085015260a083013560a085015260c083013560c085015261326860e084018461318c565b85830360e087015261327b838284613075565b9250505061010061328e8185018561318c565b868403838801526132a0848284613075565b979650505050505050565b604080825281018490525f6060600586901b8301810190830187835b8881101561330f57858403605f190183528135368b900361011e190181126132ed575f80fd5b6132f9858c83016131cd565b94505060209283019291909101906001016132c7565b50505082810360208401526132a0818587613075565b634e487b7160e01b5f52602160045260245ffd5b5f6003861061335657634e487b7160e01b5f52602160045260245ffd5b8582526080602083015261336d6080830186612f84565b6040830194909452506060015292915050565b602081525f6126276020830184612f84565b604081525f6133a460408301856131cd565b90508260208301529392505050565b805180516001600160a01b031683526020810151602084015260408101516040840152606081015160608401526080810151608084015260a081015160a084015260c081015160c084015260e081015161341860e08501826001600160a01b03169052565b5061010081810151908401526101209081015190830152602081015161014083015260408101516101608301526060810151610180830152608001516101a090910152565b5f61020080835261347081840187612f84565b905061347f60208401866133b3565b8281036101e08401526134928185612f84565b9695505050505050565b5f6102008083526134b08184018789613075565b90506134bf60208401866133b3565b8281036101e08401526132a08185612f84565b606081525f6134e460608301866131cd565b60208301949094525060400152919050565b5f60208284031215613506575f80fd5b5051919050565b82815260606020820152600d60608201526c10504c8cc81c995d995c9d1959609a1b608082015260a060408201525f611fa160a0830184612f84565b5f806040838503121561355a575f80fd5b82516001600160401b0381111561356f575f80fd5b8301601f8101851361357f575f80fd5b805161358d612c9a82612ae9565b8181528660208385010111156135a1575f80fd5b6135b2826020830160208601612f62565b60209590950151949694955050505050565b82815260606020820152600d60608201526c10504cccc81c995d995c9d1959609a1b608082015260a060408201525f611fa160a0830184612f84565b5f808585111561360e575f80fd5b8386111561361a575f80fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156136545780818660140360031b1b83161692505b505092915050565b6fffffffffffffffffffffffffffffffff1981358181169160108510156136545760109490940360031b84901b169092169291505056fea2646970667358221220397996f36f516bad9951ba1f23ade372bdd0ef7639623362f57652a7762031c164736f6c63430008170033608060405234801561000f575f80fd5b506101e28061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063570e1a361461002d575b5f80fd5b61004061003b3660046100e4565b61005c565b6040516001600160a01b03909116815260200160405180910390f35b5f8061006b6014828587610150565b61007491610177565b60601c90505f6100878460148188610150565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92018290525084519495509360209350849250905082850182875af190505f519350806100db575f93505b50505092915050565b5f80602083850312156100f5575f80fd5b823567ffffffffffffffff8082111561010c575f80fd5b818501915085601f83011261011f575f80fd5b81358181111561012d575f80fd5b86602082850101111561013e575f80fd5b60209290920196919550909350505050565b5f808585111561015e575f80fd5b8386111561016a575f80fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156101a45780818660140360031b1b83161692505b50509291505056fea264697066735822122078c1aaa9f040f8c523cf2b642dd06415593eec30d2e75021458af7e0c704e6fb64736f6c63430008170033";

// src/formatted/IAccountExecute.ts
var IAccountExecute_exports = {};
__export(IAccountExecute_exports, {
  abi: () => abi42,
  bytecode: () => bytecode42
});
var abi42 = [
  {
    "type": "function",
    "name": "executeUserOp",
    "inputs": [
      {
        "name": "userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "userOpHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
];
var bytecode42 = "0x";

// src/formatted/IERC1155Receiver.ts
var IERC1155Receiver_exports = {};
__export(IERC1155Receiver_exports, {
  abi: () => abi43,
  bytecode: () => bytecode43
});
var abi43 = [
  {
    "type": "function",
    "name": "onERC1155BatchReceived",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "values",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "onERC1155Received",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode43 = "0x";

// src/formatted/IERC1155.ts
var IERC1155_exports = {};
__export(IERC1155_exports, {
  abi: () => abi44,
  bytecode: () => bytecode44
});
var abi44 = [
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOfBatch",
    "inputs": [
      {
        "name": "accounts",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "safeBatchTransferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "values",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ApprovalForAll",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TransferBatch",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "ids",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "values",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TransferSingle",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "URI",
    "inputs": [
      {
        "name": "value",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode44 = "0x";

// src/formatted/ICaveatEnforcer.ts
var ICaveatEnforcer_exports = {};
__export(ICaveatEnforcer_exports, {
  abi: () => abi45,
  bytecode: () => bytecode45
});
var abi45 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
];
var bytecode45 = "0x";

// src/formatted/IERC1363.ts
var IERC1363_exports = {};
__export(IERC1363_exports, {
  abi: () => abi46,
  bytecode: () => bytecode46
});
var abi46 = [
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveAndCall",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveAndCall",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferAndCall",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferAndCall",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFromAndCall",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFromAndCall",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode46 = "0x";

// src/formatted/IERC173.ts
var IERC173_exports = {};
__export(IERC173_exports, {
  abi: () => abi47,
  bytecode: () => bytecode47
});
var abi47 = [
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "_newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  }
];
var bytecode47 = "0x";

// src/formatted/IERC165.ts
var IERC165_exports = {};
__export(IERC165_exports, {
  abi: () => abi48,
  bytecode: () => bytecode48
});
var abi48 = [
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode48 = "0x";

// src/formatted/ExactCalldataBatchEnforcer.ts
var ExactCalldataBatchEnforcer_exports = {};
__export(ExactCalldataBatchEnforcer_exports, {
  abi: () => abi49,
  bytecode: () => bytecode49
});
var abi49 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "executions_",
        "type": "tuple[]",
        "internalType": "struct Execution[]",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode49 = "0x608060405234801561001057600080fd5b5061083a806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a366004610417565b50505050505050505050565b005b610076610086366004610417565b6100b4565b61009e6100993660046104e4565b6102fd565b6040516100ab9190610526565b60405180910390f35b85600160f81b6001600160f81b03198216146101175760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6001600160f81b03198116156101835760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b606482015260840161010e565b503660006101918989610319565b9150915060006101a18f8f6102fd565b8051909150821461020a5760405162461bcd60e51b815260206004820152602d60248201527f457861637443616c6c646174614261746368456e666f726365723a696e76616c60448201526c69642d62617463682d73697a6560981b606482015260840161010e565b60005b828110156102eb57838382818110610227576102276105e8565b905060200281019061023991906105fe565b61024790604081019061061e565b604051610255929190610665565b604051809103902082828151811061026f5761026f6105e8565b60200260200101516040015180519060200120146102e35760405162461bcd60e51b815260206004820152602b60248201527f457861637443616c6c646174614261746368456e666f726365723a696e76616c60448201526a69642d63616c6c6461746160a81b606482015260840161010e565b60010161020d565b50505050505050505050505050505050565b60606103098383610319565b610312916106e5565b9392505050565b366000833580850160208587010360208201945081359350808460051b8301118360401c17156103515763ba597e7e6000526004601cfd5b83156103a8578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c171561039f5763ba597e7e6000526004601cfd5b5050508261035b575b5050509250929050565b60008083601f8401126103c457600080fd5b50813567ffffffffffffffff8111156103dc57600080fd5b6020830191508360208285010111156103f457600080fd5b9250929050565b80356001600160a01b038116811461041257600080fd5b919050565b60008060008060008060008060008060e08b8d03121561043657600080fd5b8a3567ffffffffffffffff8082111561044e57600080fd5b61045a8e838f016103b2565b909c509a5060208d013591508082111561047357600080fd5b61047f8e838f016103b2565b909a50985060408d0135975060608d013591508082111561049f57600080fd5b506104ac8d828e016103b2565b90965094505060808b013592506104c560a08c016103fb565b91506104d360c08c016103fb565b90509295989b9194979a5092959850565b600080602083850312156104f757600080fd5b823567ffffffffffffffff81111561050e57600080fd5b61051a858286016103b2565b90969095509350505050565b600060208083018184528085518083526040925060408601915060408160051b8701018488016000805b848110156105d957898403603f19018652825180516001600160a01b0316855288810151898601528701516060888601819052815190860181905283905b808210156105ac578282018b015187830160800152908a019061058e565b8681016080908101869052988b0198601f909101601f191690960190950194505091870191600101610550565b50919998505050505050505050565b634e487b7160e01b600052603260045260246000fd5b60008235605e1983360301811261061457600080fd5b9190910192915050565b6000808335601e1984360301811261063557600080fd5b83018035915067ffffffffffffffff82111561065057600080fd5b6020019150368190038213156103f457600080fd5b8183823760009101908152919050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff811182821017156106ae576106ae610675565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156106dd576106dd610675565b604052919050565b600067ffffffffffffffff8084111561070057610700610675565b8360051b60206107118183016106b4565b86815291850191818101903684111561072957600080fd5b865b848110156107f8578035868111156107435760008081fd5b880160603682900312156107575760008081fd5b61075f61068b565b610768826103fb565b81528582013586820152604080830135898111156107865760008081fd5b9290920191601f368185011261079c5760008081fd5b83358a8111156107ae576107ae610675565b6107bf818301601f19168a016106b4565b915080825236898287010111156107d65760008081fd5b808986018a84013760009082018901529082015284525091830191830161072b565b5097965050505050505056fea26469706673582212208d28ccd8e989ae016d34ead1b420bc19b8be9eaa747049c2602c587d0a44891264736f6c63430008170033";

// src/formatted/IERC1271.ts
var IERC1271_exports = {};
__export(IERC1271_exports, {
  abi: () => abi50,
  bytecode: () => bytecode50
});
var abi50 = [
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "magicValue",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode50 = "0x";

// src/formatted/IDeleGatorCore.ts
var IDeleGatorCore_exports = {};
__export(IDeleGatorCore_exports, {
  abi: () => abi51,
  bytecode: () => bytecode51
});
var abi51 = [
  {
    "type": "function",
    "name": "executeFromExecutor",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "returnData",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "magicValue",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode51 = "0x";

// src/formatted/ExactExecutionBatchEnforcer.ts
var ExactExecutionBatchEnforcer_exports = {};
__export(ExactExecutionBatchEnforcer_exports, {
  abi: () => abi52,
  bytecode: () => bytecode52
});
var abi52 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "executions_",
        "type": "tuple[]",
        "internalType": "struct Execution[]",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode52 = "0x608060405234801561001057600080fd5b50610870806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a3660046103e9565b50505050505050505050565b005b6100766100863660046103e9565b6100b4565b61009e6100993660046104b6565b6102cf565b6040516100ab91906104f8565b60405180910390f35b85600160f81b6001600160f81b03198216146101175760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6001600160f81b03198116156101835760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b606482015260840161010e565b5036600061019189896102eb565b9150915060006101a18f8f6102cf565b8051909150821461020b5760405162461bcd60e51b815260206004820152602e60248201527f4578616374457865637574696f6e4261746368456e666f726365723a696e766160448201526d6c69642d62617463682d73697a6560901b606482015260840161010e565b8060405160200161021c91906104f8565b6040516020818303038152906040528051906020012083836040516020016102459291906105ba565b60405160208183030381529060405280519060200120146102be5760405162461bcd60e51b815260206004820152602d60248201527f4578616374457865637574696f6e4261746368456e666f726365723a696e766160448201526c3634b216b2bc32b1baba34b7b760991b606482015260840161010e565b505050505050505050505050505050565b60606102db83836102eb565b6102e49161071b565b9392505050565b366000833580850160208587010360208201945081359350808460051b8301118360401c17156103235763ba597e7e6000526004601cfd5b831561037a578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c17156103715763ba597e7e6000526004601cfd5b5050508261032d575b5050509250929050565b60008083601f84011261039657600080fd5b50813567ffffffffffffffff8111156103ae57600080fd5b6020830191508360208285010111156103c657600080fd5b9250929050565b80356001600160a01b03811681146103e457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561040857600080fd5b8a3567ffffffffffffffff8082111561042057600080fd5b61042c8e838f01610384565b909c509a5060208d013591508082111561044557600080fd5b6104518e838f01610384565b909a50985060408d0135975060608d013591508082111561047157600080fd5b5061047e8d828e01610384565b90965094505060808b0135925061049760a08c016103cd565b91506104a560c08c016103cd565b90509295989b9194979a5092959850565b600080602083850312156104c957600080fd5b823567ffffffffffffffff8111156104e057600080fd5b6104ec85828601610384565b90969095509350505050565b600060208083018184528085518083526040925060408601915060408160051b8701018488016000805b848110156105ab57898403603f19018652825180516001600160a01b0316855288810151898601528701516060888601819052815190860181905283905b8082101561057e578282018b015187830160800152908a0190610560565b8681016080908101869052988b0198601f909101601f191690960190950194505091870191600101610522565b50919998505050505050505050565b60208082528181018390526000906040808401600586901b8501820187855b8881101561069d57878303603f190184528135368b9003605e190181126105ff57600080fd5b8a0160606001600160a01b03610614836103cd565b168552878201358886015286820135601e1983360301811261063557600080fd5b90910187810191903567ffffffffffffffff81111561065357600080fd5b80360383131561066257600080fd5b8188870152808287015260809150808383880137600086820183015295880195601f01601f19169094019093019250908501906001016105d9565b509098975050505050505050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff811182821017156106e4576106e46106ab565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610713576107136106ab565b604052919050565b600067ffffffffffffffff80841115610736576107366106ab565b8360051b60206107478183016106ea565b86815291850191818101903684111561075f57600080fd5b865b8481101561082e578035868111156107795760008081fd5b8801606036829003121561078d5760008081fd5b6107956106c1565b61079e826103cd565b81528582013586820152604080830135898111156107bc5760008081fd5b9290920191601f36818501126107d25760008081fd5b83358a8111156107e4576107e46106ab565b6107f5818301601f19168a016106ea565b9150808252368982870101111561080c5760008081fd5b808986018a840137600090820189015290820152845250918301918301610761565b5097965050505050505056fea26469706673582212205e0b91ba43666d3d9ebd5eb11438023697fc7df67dea03687ac126f13d8d464564736f6c63430008170033";

// src/formatted/ExecutionHelper.ts
var ExecutionHelper_exports = {};
__export(ExecutionHelper_exports, {
  abi: () => abi53,
  bytecode: () => bytecode53
});
var abi53 = [
  {
    "type": "event",
    "name": "TryExecuteUnsuccessful",
    "inputs": [
      {
        "name": "batchExecutionindex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "result",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ExecutionFailed",
    "inputs": []
  }
];
var bytecode53 = "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea264697066735822122070e8319b78da08f58cb6bf69f50e33c8c919ae6c2113f3ef3b34f1da6bf44c5f64736f6c63430008170033";

// src/formatted/IERC5267.ts
var IERC5267_exports = {};
__export(IERC5267_exports, {
  abi: () => abi54,
  bytecode: () => bytecode54
});
var abi54 = [
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  }
];
var bytecode54 = "0x";

// src/formatted/IERC20.ts
var IERC20_exports = {};
__export(IERC20_exports, {
  abi: () => abi55,
  bytecode: () => bytecode55
});
var abi55 = [
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode55 = "0x";

// src/formatted/IERC721.ts
var IERC721_exports = {};
__export(IERC721_exports, {
  abi: () => abi56,
  bytecode: () => bytecode56
});
var abi56 = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getApproved",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ApprovalForAll",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode56 = "0x";

// src/formatted/IERC7579Account.ts
var IERC7579Account_exports = {};
__export(IERC7579Account_exports, {
  abi: () => abi57,
  bytecode: () => bytecode57
});
var abi57 = [
  {
    "type": "function",
    "name": "accountId",
    "inputs": [],
    "outputs": [
      {
        "name": "accountImplementationId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "executeFromExecutor",
    "inputs": [
      {
        "name": "mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "returnData",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "installModule",
    "inputs": [
      {
        "name": "moduleTypeId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "module",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "initData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "isModuleInstalled",
    "inputs": [
      {
        "name": "moduleTypeId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "module",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "additionalContext",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "supportsExecutionMode",
    "inputs": [
      {
        "name": "encodedMode",
        "type": "bytes32",
        "internalType": "ModeCode"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "supportsModule",
    "inputs": [
      {
        "name": "moduleTypeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "uninstallModule",
    "inputs": [
      {
        "name": "moduleTypeId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "module",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "deInitData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "event",
    "name": "ModuleInstalled",
    "inputs": [
      {
        "name": "moduleTypeId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "module",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ModuleUninstalled",
    "inputs": [
      {
        "name": "moduleTypeId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "module",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  }
];
var bytecode57 = "0x";

// src/formatted/IPaymaster.ts
var IPaymaster_exports = {};
__export(IPaymaster_exports, {
  abi: () => abi58,
  bytecode: () => bytecode58
});
var abi58 = [
  {
    "type": "function",
    "name": "postOp",
    "inputs": [
      {
        "name": "mode",
        "type": "uint8",
        "internalType": "enum IPaymaster.PostOpMode"
      },
      {
        "name": "context",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "actualGasCost",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "actualUserOpFeePerGas",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "validatePaymasterUserOp",
    "inputs": [
      {
        "name": "userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "userOpHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "maxCost",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "context",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "validationData",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  }
];
var bytecode58 = "0x";

// src/formatted/IStakeManager.ts
var IStakeManager_exports = {};
__export(IStakeManager_exports, {
  abi: () => abi59,
  bytecode: () => bytecode59
});
var abi59 = [
  {
    "type": "function",
    "name": "addStake",
    "inputs": [
      {
        "name": "_unstakeDelaySec",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "depositTo",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getDepositInfo",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "info",
        "type": "tuple",
        "internalType": "struct IStakeManager.DepositInfo",
        "components": [
          {
            "name": "deposit",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "staked",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "stake",
            "type": "uint112",
            "internalType": "uint112"
          },
          {
            "name": "unstakeDelaySec",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "withdrawTime",
            "type": "uint48",
            "internalType": "uint48"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "unlockStake",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawStake",
    "inputs": [
      {
        "name": "withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawTo",
    "inputs": [
      {
        "name": "withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Deposited",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalDeposit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeLocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalStaked",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "unstakeDelaySec",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeUnlocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawTime",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeWithdrawn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Withdrawn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode59 = "0x";

// src/formatted/IEntryPoint.ts
var IEntryPoint_exports = {};
__export(IEntryPoint_exports, {
  abi: () => abi60,
  bytecode: () => bytecode60
});
var abi60 = [
  {
    "type": "function",
    "name": "addStake",
    "inputs": [
      {
        "name": "_unstakeDelaySec",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "delegateAndRevert",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositTo",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getDepositInfo",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "info",
        "type": "tuple",
        "internalType": "struct IStakeManager.DepositInfo",
        "components": [
          {
            "name": "deposit",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "staked",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "stake",
            "type": "uint112",
            "internalType": "uint112"
          },
          {
            "name": "unstakeDelaySec",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "withdrawTime",
            "type": "uint48",
            "internalType": "uint48"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSenderAddress",
    "inputs": [
      {
        "name": "initCode",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getUserOpHash",
    "inputs": [
      {
        "name": "userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "handleAggregatedOps",
    "inputs": [
      {
        "name": "opsPerAggregator",
        "type": "tuple[]",
        "internalType": "struct IEntryPoint.UserOpsPerAggregator[]",
        "components": [
          {
            "name": "userOps",
            "type": "tuple[]",
            "internalType": "struct PackedUserOperation[]",
            "components": [
              {
                "name": "sender",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "nonce",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "initCode",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "callData",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "accountGasLimits",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "preVerificationGas",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "gasFees",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "paymasterAndData",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "signature",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "aggregator",
            "type": "address",
            "internalType": "contract IAggregator"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "beneficiary",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "handleOps",
    "inputs": [
      {
        "name": "ops",
        "type": "tuple[]",
        "internalType": "struct PackedUserOperation[]",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "beneficiary",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "incrementNonce",
    "inputs": [
      {
        "name": "key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unlockStake",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawStake",
    "inputs": [
      {
        "name": "withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawTo",
    "inputs": [
      {
        "name": "withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AccountDeployed",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "factory",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "paymaster",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BeforeExecution",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Deposited",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalDeposit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PostOpRevertReason",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "revertReason",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SignatureAggregatorChanged",
    "inputs": [
      {
        "name": "aggregator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeLocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalStaked",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "unstakeDelaySec",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeUnlocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawTime",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeWithdrawn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserOperationEvent",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "paymaster",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "success",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "actualGasCost",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "actualGasUsed",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserOperationPrefundTooLow",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserOperationRevertReason",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "revertReason",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Withdrawn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "DelegateAndRevert",
    "inputs": [
      {
        "name": "success",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "ret",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "FailedOp",
    "inputs": [
      {
        "name": "opIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "FailedOpWithRevert",
    "inputs": [
      {
        "name": "opIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "inner",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "PostOpReverted",
    "inputs": [
      {
        "name": "returnData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "SenderAddressResult",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "SignatureValidationFailed",
    "inputs": [
      {
        "name": "aggregator",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];
var bytecode60 = "0x";

// src/formatted/IMetaSwap.ts
var IMetaSwap_exports = {};
__export(IMetaSwap_exports, {
  abi: () => abi61,
  bytecode: () => bytecode61
});
var abi61 = [
  {
    "type": "function",
    "name": "adapters",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct IMetaSwap.Adapter",
        "components": [
          {
            "name": "addr",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "selector",
            "type": "bytes4",
            "internalType": "bytes4"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "removeAdapter",
    "inputs": [
      {
        "name": "aggregatorId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setAdapter",
    "inputs": [
      {
        "name": "aggregatorId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "addr",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "selector",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "swap",
    "inputs": [
      {
        "name": "aggregatorId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "tokenFrom",
        "type": "address",
        "internalType": "contract IERC20"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  }
];
var bytecode61 = "0x";

// src/formatted/HybridDeleGator.ts
var HybridDeleGator_exports = {};
__export(HybridDeleGator_exports, {
  abi: () => abi62,
  bytecode: () => bytecode62
});
var abi62 = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "contract IDelegationManager"
      },
      {
        "name": "_entryPoint",
        "type": "address",
        "internalType": "contract IEntryPoint"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "DOMAIN_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "NAME",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "PACKED_USER_OP_TYPEHASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addDeposit",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "addKey",
    "inputs": [
      {
        "name": "_keyId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_x",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_y",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "delegationManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDelegationManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "disableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "enableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "entryPoint",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IEntryPoint"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_execution",
        "type": "tuple",
        "internalType": "struct Execution",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "executeFromExecutor",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "returnData_",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getDeposit",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDomainHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInitializedVersion",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getKey",
    "inputs": [
      {
        "name": "_keyId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "x_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "y_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getKeyIdHashes",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getKeyIdHashesCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "_key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationTypedDataHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_keyIds",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "_xValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "_yValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isDelegationDisabled",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "_hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "magicValue_",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155BatchReceived",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC721Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "redeemDelegations",
    "inputs": [
      {
        "name": "_permissionContexts",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "_modes",
        "type": "bytes32[]",
        "internalType": "ModeCode[]"
      },
      {
        "name": "_executionCallDatas",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "reinitialize",
    "inputs": [
      {
        "name": "_version",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_keyIds",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "_xValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "_yValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "_deleteP256Keys",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeKey",
    "inputs": [
      {
        "name": "_keyId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "_interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "_newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateSigners",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_keyIds",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "_xValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "_yValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [
      {
        "name": "_newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCallAndRetainStorage",
    "inputs": [
      {
        "name": "_newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "validateUserOp",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_missingAccountFunds",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "validationData_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawDeposit",
    "inputs": [
      {
        "name": "_withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "_withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AddedP256Key",
    "inputs": [
      {
        "name": "keyIdHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "keyId",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "x",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "y",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ClearedStorage",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RemovedP256Key",
    "inputs": [
      {
        "name": "keyIdHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "x",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "y",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SentPrefund",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "success",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDelegationManager",
    "inputs": [
      {
        "name": "newDelegationManager",
        "type": "address",
        "indexed": true,
        "internalType": "contract IDelegationManager"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetEntryPoint",
    "inputs": [
      {
        "name": "entryPoint",
        "type": "address",
        "indexed": true,
        "internalType": "contract IEntryPoint"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TryExecuteUnsuccessful",
    "inputs": [
      {
        "name": "batchExecutionindex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "result",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CannotRemoveLastSigner",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureLength",
    "inputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureS",
    "inputs": [
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967NonPayable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExecutionFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InputLengthsMismatch",
    "inputs": [
      {
        "name": "keyIdsLength",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "xValuesLength",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "yValuesLength",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidEmptyKey",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "KeyAlreadyExists",
    "inputs": [
      {
        "name": "keyIdHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "KeyDoesNotExist",
    "inputs": [
      {
        "name": "keyIdHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "KeyNotOnCurve",
    "inputs": [
      {
        "name": "x",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "y",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "NotDelegationManager",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPoint",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPointOrSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SignersCannotBeEmpty",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "UUPSUnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnsupportedProxiableUUID",
    "inputs": [
      {
        "name": "slot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedCallType",
    "inputs": [
      {
        "name": "callType",
        "type": "bytes1",
        "internalType": "CallType"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedExecType",
    "inputs": [
      {
        "name": "execType",
        "type": "bytes1",
        "internalType": "ExecType"
      }
    ]
  }
];
var bytecode62 = "0x6101c0604052306080523480156200001657600080fd5b506040516200556538038062005565833981016040819052620000399162000319565b81816040518060400160405280600f81526020016e243cb13934b22232b632a3b0ba37b960891b815250604051806040016040528060018152602001603160f81b815250818162000095600083620001ca60201b90919060201c565b61014052620000a6816001620001ca565b61016052815160208084019190912061010052815190820120610120524660c052620001366101005161012051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60a05250503060e0526200014962000203565b6001600160a01b038085166101808190529084166101a0526040517fb2e8eb88b584ae71ef4e854c10847f4d39bd93e52599f147bfb4dcc8de52014d90600090a26040516001600160a01b038416907fee8699dc0e27105da2653bdba54be0edcaadc3e33890a3ad705517ffe9bf0a9990600090a250505050505062000541565b6000602083511015620001ea57620001e283620002b7565b9050620001fd565b81620001f78482620003ff565b5060ff90505b92915050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000900460ff1615620002545760405163f92ee8a960e01b815260040160405180910390fd5b80546001600160401b0390811614620002b45780546001600160401b0319166001600160401b0390811782556040519081527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50565b600080829050601f81511115620002ee578260405163305a27a960e01b8152600401620002e59190620004cb565b60405180910390fd5b8051620002fb826200051c565b179392505050565b6001600160a01b0381168114620002b457600080fd5b600080604083850312156200032d57600080fd5b82516200033a8162000303565b60208401519092506200034d8162000303565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200038357607f821691505b602082108103620003a457634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620003fa576000816000526020600020601f850160051c81016020861015620003d55750805b601f850160051c820191505b81811015620003f657828155600101620003e1565b5050505b505050565b81516001600160401b038111156200041b576200041b62000358565b62000433816200042c84546200036e565b84620003aa565b602080601f8311600181146200046b5760008415620004525750858301515b600019600386901b1c1916600185901b178555620003f6565b600085815260208120601f198616915b828110156200049c578886015182559484019460019091019084016200047b565b5085821015620004bb5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60006020808352835180602085015260005b81811015620004fb57858101830151858201604001528201620004dd565b506000604082860101526040601f19601f8301168501019250505092915050565b80516020808301519190811015620003a45760001960209190910360031b1b16919050565b60805160a05160c05160e05161010051610120516101405161016051610180516101a051614eeb6200067a6000396000818161068c0152818161091e015281816109cb01528181610abe01528181610b3c01528181610ca001528181610d5501528181610de001528181610e5001528181610f3c01528181610ff701528181611069015281816112c301528181611342015281816113ab015281816114a60152818161156501528181611a1b01528181611d0e01528181611d7c0152612d4e0152600081816107ff01528181610b9f01528181610c2201528181610d030152818161140e01526117ac0152600061275a0152600061272d01526000611f3e01526000611f1601526000611e7101526000611e9b01526000611ec5015260008181612190015281816121b901526126100152614eeb6000f3fe6080604052600436106102765760003560e01c80638da5cb5b1161014f578063c8561e73116100c1578063e9ae5c531161007a578063e9ae5c53146107da578063ea4d3c9b146107ed578063ed8101b514610821578063f23a6e6114610841578063f2fde38b14610861578063ffa1ad741461088157600080fd5b8063c8561e7314610710578063cef6d20914610730578063d087d28814610750578063d37aec9214610765578063d5d33b551461079a578063d691c964146107ba57600080fd5b8063acb8cc4911610113578063acb8cc491461061c578063ad3cb1cc14610649578063b0d691fe1461067a578063b3c65015146106ae578063bc197c81146106db578063c399ec88146106fb57600080fd5b80638da5cb5b1461054d5780638ebf95331461058c578063a24c8f32146105ac578063a3f4df7e146105bf578063aaf10f421461060757600080fd5b8063445140b8116101e85780635c1c6dcd116101ac5780635c1c6dcd146104a8578063715018a6146104bb57806378a68ecf146104d05780637f07bfdc146104f057806383ebb7711461051057806384b0196e1461052557600080fd5b8063445140b81461043857806349934047146104585780634a58db19146104785780634f1ef2861461048057806352d1902d1461049357600080fd5b806319822f7c1161023a57806319822f7c146103605780631c03010a146103805780632b3afd99146103a25780632ffeaad6146103d65780633e1b0812146103f85780633ed010151461041857600080fd5b806301ffc9a71461028257806306394d67146102b7578063074feff3146102e5578063150b7a02146103075780631626ba7e1461034057600080fd5b3661027d57005b600080fd5b34801561028e57600080fd5b506102a261029d366004613d03565b6108b2565b60405190151581526020015b60405180910390f35b3480156102c357600080fd5b506102d76102d2366004613d46565b6108de565b6040519081526020016102ae565b3480156102f157600080fd5b50610305610300366004613ded565b610913565b005b34801561031357600080fd5b50610327610322366004613f5c565b610984565b6040516001600160e01b031990911681526020016102ae565b34801561034c57600080fd5b5061032761035b366004614008565b61099f565b34801561036c57600080fd5b506102d761037b366004614053565b6109be565b34801561038c57600080fd5b50600080516020614e36833981519152546102d7565b3480156103ae57600080fd5b506102d77fbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc1881565b3480156103e257600080fd5b506103eb610a2e565b6040516102ae91906140a0565b34801561040457600080fd5b506102d76104133660046140d8565b610a97565b34801561042457600080fd5b50610305610433366004614101565b610b31565b34801561044457600080fd5b506102a261045336600461413b565b610c09565b34801561046457600080fd5b50610305610473366004614101565b610c95565b610305610d38565b61030561048e366004614154565b610da2565b34801561049f57600080fd5b506102d7610db8565b6103056104b63660046141a3565b610dd5565b3480156104c757600080fd5b50610305610e45565b3480156104dc57600080fd5b506103056104eb3660046141f6565b610ea8565b3480156104fc57600080fd5b5061030561050b3660046142c8565b610fec565b34801561051c57600080fd5b506102d76110c9565b34801561053157600080fd5b5061053a6110d8565b6040516102ae9796959493929190614344565b34801561055957600080fd5b50600080516020614e16833981519152546001600160a01b03165b6040516001600160a01b0390911681526020016102ae565b34801561059857600080fd5b506103056105a7366004613ded565b61111e565b6103056105ba366004614154565b610daa565b3480156105cb57600080fd5b506105fa6040518060400160405280600f81526020016e243cb13934b22232b632a3b0ba37b960891b81525081565b6040516102ae91906143dd565b34801561061357600080fd5b5061057461123a565b34801561062857600080fd5b506105fa604051806040016040528060018152602001603160f81b81525081565b34801561065557600080fd5b506105fa604051806040016040528060058152602001640352e302e360dc1b81525081565b34801561068657600080fd5b506105747f000000000000000000000000000000000000000000000000000000000000000081565b3480156106ba57600080fd5b506106c361125b565b6040516001600160401b0390911681526020016102ae565b3480156106e757600080fd5b506103276106f636600461446f565b61128e565b34801561070757600080fd5b506102d76112ab565b34801561071c57600080fd5b5061030561072b36600461451c565b611337565b34801561073c57600080fd5b5061030561074b36600461456c565b6113a0565b34801561075c57600080fd5b506102d7611487565b34801561077157600080fd5b50610785610780366004614605565b6114dd565b604080519283526020830191909152016102ae565b3480156107a657600080fd5b506103056107b5366004614605565b61155a565b6107cd6107c8366004614008565b61179f565b6040516102ae9190614646565b6103056107e8366004614008565b611a10565b3480156107f957600080fd5b506105747f000000000000000000000000000000000000000000000000000000000000000081565b34801561082d57600080fd5b506102d761083c366004613d46565b611c13565b34801561084d57600080fd5b5061032761085c3660046146aa565b611d55565b34801561086d57600080fd5b5061030561087c366004614712565b611d71565b34801561088d57600080fd5b506105fa604051806040016040528060058152602001640312e332e360dc1b81525081565b60006108bd82611dd4565b806108d857506001600160e01b031982166307f5828d60e41b145b92915050565b60006108d86108eb611e64565b6108f484611c13565b60405161190160f01b8152600281019290925260228201526042902090565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480159061094c5750333014155b1561096a57604051630796d94560e01b815260040160405180910390fd5b61097b878787878787876001611f8f565b50505050505050565b600061098e612185565b50630a85bd0160e11b949350505050565b60006109a9612185565b6109b484848461222a565b90505b9392505050565b6000336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610a0957604051636b31ba1560e11b815260040160405180910390fd5b610a11612185565b610a2384610a1e866108de565b61244e565b90506109b782612496565b60606000600080516020614e1683398151915260028101805460408051602080840282018101909252828152939450830182828015610a8c57602002820191906000526020600020905b815481526020019060010190808311610a78575b505050505091505090565b604051631aab3f0d60e11b81523060048201526001600160c01b03821660248201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906335567e1a90604401602060405180830381865afa158015610b0d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108d8919061472f565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610b6a5750333014155b15610b8857604051630796d94560e01b815260040160405180910390fd5b604051633ed0101560e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690633ed0101590610bd4908490600401614877565b600060405180830381600087803b158015610bee57600080fd5b505af1158015610c02573d6000803e3d6000fd5b5050505050565b6040516316a0682960e11b8152600481018290526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632d40d05290602401602060405180830381865afa158015610c71573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108d89190614953565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610cce5750333014155b15610cec57604051630796d94560e01b815260040160405180910390fd5b604051634993404760e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690634993404790610bd4908490600401614877565b610d40612185565b60405163b760faf960e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063b760faf99034906024016000604051808303818588803b158015610bee57600080fd5b610daa61252d565b610db482826125ea565b5050565b6000610dc2612605565b50600080516020614e5683398151915290565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610e1e57604051636b31ba1560e11b815260040160405180910390fd5b610db4610e2e6020830183614712565b6020830135610e406040850185614970565b61264e565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610e7e5750333014155b15610e9c57604051630796d94560e01b815260040160405180910390fd5b610ea66000612684565b565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805460ff8b81169291600160401b90041680610ef2575080546001600160401b03808416911610155b15610f105760405163f92ee8a960e01b815260040160405180910390fd5b805468ffffffffffffffffff19166001600160401b03831617600160401b178155336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610f6a5750333014155b15610f8857604051630796d94560e01b815260040160405180910390fd5b610f988a8a8a8a8a8a8a8a611f8f565b805460ff60401b191681556040516001600160401b03831681527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15050505050505050505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906110255750333014155b1561104357604051630796d94560e01b815260040160405180910390fd5b60405163040b850f60e31b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063205c287890604401600060405180830381600087803b1580156110ad57600080fd5b505af11580156110c1573d6000803e3d6000fd5b505050505050565b60006110d3611e64565b905090565b6000606080600080600060606110ec612726565b6110f4612753565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff1615906001600160401b03166000811580156111635750825b90506000826001600160401b0316600114801561117f5750303b155b90508115801561118d575080155b156111ab5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156111d557845460ff60401b1916600160401b1785555b6111e68c8c8c8c8c8c8c6000611f8f565b831561122c57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050505050565b60006110d3600080516020614e56833981519152546001600160a01b031690565b60006110d37ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00546001600160401b031690565b6000611298612185565b5063bc197c8160e01b5b95945050505050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a08231906024015b602060405180830381865afa158015611313573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110d3919061472f565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906113705750333014155b1561138e57604051630796d94560e01b815260040160405180910390fd5b61139a84848484612780565b50505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906113d95750333014155b156113f757604051630796d94560e01b815260040160405180910390fd5b60405163cef6d20960e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cef6d2099061144d90899089908990899089908990600401614a17565b600060405180830381600087803b15801561146757600080fd5b505af115801561147b573d6000803e3d6000fd5b50505050505050505050565b604051631aab3f0d60e11b8152306004820152600060248201819052907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906335567e1a906044016112f6565b60008080600080516020614e1683398151915290506000816001016000878760405160200161150d929190614a80565b60408051601f198184030181529181528151602092830120835282820193909352908201600020825180840190935280548084526001909101549290910182905297909650945050505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906115935750333014155b156115b157604051630796d94560e01b815260040160405180910390fd5b604051600080516020614e16833981519152906000906115d79085908590602001614a80565b60408051601f198184030181528282528051602091820120600081815260018088018452908490208585019094528354808652930154918401829052935081158015611621575080155b1561164757604051631a36430d60e31b8152600481018590526024015b60405180910390fd5b6002850154600181148015611664575085546001600160a01b0316155b156116825760405163c4c8547360e01b815260040160405180910390fd5b60005b611690600183614aa6565b81101561171557858760020182815481106116ad576116ad614ab9565b90600052602060002001540361170d57600287016116cc600184614aa6565b815481106116dc576116dc614ab9565b90600052602060002001548760020182815481106116fc576116fc614ab9565b600091825260209091200155611715565b600101611685565b508560020180548061172957611729614acf565b60008281526020808220830160001990810183905590920190925586825260018881018252604080842084815590910192909255815185815290810184905286917facf0e8088062f44f734bbcb5223794fd8bb6f6db1c199cb6a72df119d002a71b910160405180910390a25050505050505050565b6060336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146117ea57604051630692ce8160e21b815260040160405180910390fd5b83600881901b6117fe82600160f81b6128fd565b1561187f57366000611810878761290f565b90925090506118208360006128fd565b156118365761182f82826129a8565b9450611878565b61184483600160f81b6128fd565b156118535761182f8282612a69565b6040516308c3ee0360e11b81526001600160f81b03198416600482015260240161163e565b5050611a07565b61188a8260006128fd565b156119e25760008036600061189f8989612b96565b6040805160018082528183019092529498509296509094509250816020015b60608152602001906001900390816118be57905050965060006118e186826128fd565b15611915576118f28585858561264e565b8860008151811061190557611905614ab9565b60200260200101819052506119d8565b61192386600160f81b6128fd565b156119b35761193485858585612be7565b8960008151811061194757611947614ab9565b60209081029190910101529050806119ae577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb760008960008151811061198f5761198f614ab9565b60200260200101516040516119a5929190614ae5565b60405180910390a15b6119d8565b6040516308c3ee0360e11b81526001600160f81b03198716600482015260240161163e565b5050505050611a07565b604051632e5bf3f960e21b81526001600160f81b03198316600482015260240161163e565b50509392505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611a5957604051636b31ba1560e11b815260040160405180910390fd5b82600881901b611a6d82600160f81b6128fd565b15611ac857366000611a7f868661290f565b9092509050611a8f8360006128fd565b15611aa457611a9e82826129a8565b50611ac1565b611ab283600160f81b6128fd565b1561185357611a9e8282612a69565b5050610c02565b611ad38260006128fd565b156119e257600080366000611ae88888612b96565b9350935093509350611afe85600060f81b6128fd565b15611b1557611b0f8484848461264e565b50611c0a565b611b2385600160f81b6128fd565b15611be557604080516001808252818301909252600091816020015b6060815260200190600190039081611b3f5790505090506000611b6486868686612be7565b83600081518110611b7757611b77614ab9565b6020908102919091010152905080611bde577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb7600083600081518110611bbf57611bbf614ab9565b6020026020010151604051611bd5929190614ae5565b60405180910390a15b5050611c0a565b6040516308c3ee0360e11b81526001600160f81b03198616600482015260240161163e565b50505050610c02565b60007fbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18611c436020840184614712565b6020840135611c556040860186614970565b604051611c63929190614a80565b604051908190039020611c796060870187614970565b604051611c87929190614a80565b604051908190039020608087013560a088013560c0890135611cac60e08b018b614970565b604051611cba929190614a80565b60408051918290038220602083019a909a526001600160a01b03988916908201526060810196909652608086019490945260a085019290925260c084015260e08301526101008201526101208101929092527f00000000000000000000000000000000000000000000000000000000000000001661014082015261016001604051602081830303815290604052805190602001209050919050565b6000611d5f612185565b5063f23a6e6160e01b95945050505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590611daa5750333014155b15611dc857604051630796d94560e01b815260040160405180910390fd5b611dd181612684565b50565b6000611dde612185565b6001600160e01b031982166335a4725960e21b1480611e0d57506001600160e01b03198216630a85bd0160e11b145b80611e2857506001600160e01b03198216630271189760e51b145b80611e4357506001600160e01b031982166301ffc9a760e01b145b806108d8575050630b135d3f60e11b6001600160e01b03198216145b919050565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015611ebd57507f000000000000000000000000000000000000000000000000000000000000000046145b15611ee757507f000000000000000000000000000000000000000000000000000000000000000090565b6110d3604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b856001600160a01b038916158015611fa5575080155b8015611fae5750815b15611fcc576040516312da594d60e11b815260040160405180910390fd5b8085141580611fdb5750808314155b1561200a5760405163a297991b60e01b815260048101829052602481018690526044810184905260640161163e565b81156120ff57600080516020614e3683398151915254600080516020614e168339815191529080156120fc5760005b818110156120ed57600083600201828154811061205857612058614ab9565b6000918252602080832090910154808352600180880180845260408086208151808301835281548152938101805485880190815286895293909652869055949093558051925193519194509284927facf0e8088062f44f734bbcb5223794fd8bb6f6db1c199cb6a72df119d002a71b926120db9290918252602082015260400190565b60405180910390a25050600101612039565b506120fc600283016000613cd1565b50505b60005b818110156121705761216889898381811061211f5761211f614ab9565b90506020028101906121319190614970565b89898581811061214357612143614ab9565b9050602002013588888681811061215c5761215c614ab9565b90506020020135612780565b600101612102565b5061217a89612684565b505050505050505050565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148061220c57507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316612200600080516020614e56833981519152546001600160a01b031690565b6001600160a01b031614155b15610ea65760405163703e46dd60e11b815260040160405180910390fd5b60008160418190036122c757600080516020614e16833981519152546001600160a01b03166001600160a01b03166122988686868080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612c1892505050565b6001600160a01b0316036122b65750630b135d3f60e11b90506109b7565b506001600160e01b031990506109b7565b60608110156122e157506001600160e01b031990506109b7565b600080516020614e1683398151915260006122ff6020828789614afe565b61230891614b28565b60008181526001808501602090815260409283902083518085019094528054808552920154908301529192509015801561234457506020810151155b1561235e57506001600160e01b031993506109b792505050565b8360601480156123b257506123b28888888080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050855160208701519092509050612c42565b156123cb5750630b135d3f60e11b93506109b792505050565b8360601415801561242057506124208888888080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050855160208701519092509050612ce0565b156124395750630b135d3f60e11b93506109b792505050565b506001600160e01b031993506109b792505050565b60008061246883612463610100870187614970565b61222a565b90506374eca2c160e11b6001600160e01b031982160161248c5760009150506108d8565b5060019392505050565b8015611dd157604051600090339060001990849084818181858888f193505050503d80600081146124e3576040519150601f19603f3d011682016040523d82523d6000602084013e6124e8565b606091505b505060408051848152821515602082015291925033917fa427c7d47f24d01b170779a7600b1d4c0d7cdbabaa0f19c4f0e6182053ffc931910160405180910390a25050565b600080516020614e3683398151915254600080516020614e168339815191529060005b818110156125a05782600101600084600201838154811061257357612573614ab9565b60009182526020808320909101548352820192909252604001812081815560019081019190915501612550565b506125af600283016000613cd1565b81546001600160a01b03191682556040517feb09d532980c3cc73dcad99b80e264204a667a54cbb7b63ec8d68dcb1c7096be90600090a15050565b6125f2612185565b6125fb82612d43565b610db48282612d9a565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610ea65760405163703e46dd60e11b815260040160405180910390fd5b60405181838237600038838387895af161266b573d6000823e3d81fd5b3d8152602081013d6000823e3d01604052949350505050565b600080516020614e3683398151915254600080516020614e16833981519152901580156126b857506001600160a01b038216155b156126d65760405163c4c8547360e01b815260040160405180910390fd5b80546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b60606110d37f00000000000000000000000000000000000000000000000000000000000000006000612e5c565b60606110d37f00000000000000000000000000000000000000000000000000000000000000006001612e5c565b61278a8282612f07565b6127b1576040516313c3d61f60e01b8152600481018390526024810182905260440161163e565b600084846040516020016127c6929190614a80565b6040516020818303038152906040528051906020012090508484905060000361280257604051637e25658160e11b815260040160405180910390fd5b60008181527fa2b1bcb5e16cee2a8898b49cb0c3605e70c16f429f6002ed8b1bc5612a694901602052604090208054600080516020614e1683398151915291901515806128525750600181015415155b15612873576040516361db108160e01b81526004810184905260240161163e565b604080518082018252868152602080820187815260008781526001808801845285822094518555915193820193909355600286018054918201815583529120018490555183907fd00539cb08a7c24166308150d64d603150c01baf89d3d3e4c6063d6db7c6983d906128ec908a908a908a908a90614b46565b60405180910390a250505050505050565b6001600160f81b031990811691161490565b366000833580850160208587010360208201945081359350808460051b8301118360401c17156129475763ba597e7e6000526004601cfd5b831561299e578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c17156129955763ba597e7e6000526004601cfd5b50505082612951575b5050509250929050565b606081806001600160401b038111156129c3576129c3613e99565b6040519080825280602002602001820160405280156129f657816020015b60608152602001906001900390816129e15790505b50915060005b81811015612a615736858583818110612a1757612a17614ab9565b9050602002810190612a299190614b6d565b9050612a3b610e2e6020830183614712565b848381518110612a4d57612a4d614ab9565b6020908102919091010152506001016129fc565b505092915050565b606081806001600160401b03811115612a8457612a84613e99565b604051908082528060200260200182016040528015612ab757816020015b6060815260200190600190039081612aa25790505b50915060005b81811015612a615736858583818110612ad857612ad8614ab9565b9050602002810190612aea9190614b6d565b90506000612b15612afe6020840184614712565b6020840135612b106040860186614970565b612be7565b868581518110612b2757612b27614ab9565b6020908102919091010152905080612b8c577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb783868581518110612b6d57612b6d614ab9565b6020026020010151604051612b83929190614ae5565b60405180910390a15b5050600101612abd565b6000803681612ba86014828789614afe565b612bb191614b8d565b60601c9350612bc4603460148789614afe565b612bcd91614b28565b9250612bdc8560348189614afe565b949793965094505050565b604051600090828482376000388483888a5af191503d8152602081013d6000823e3d81016040525094509492505050565b600080600080612c288686612f6a565b925092509250612c388282612fb7565b5090949350505050565b6000806000612c5086613070565b915091506000600288604051602001612c6b91815260200190565b60408051601f1981840301815290829052612c8591614bc0565b602060405180830381855afa158015612ca2573d6000803e3d6000fd5b5050506040513d601f19601f82011682018060405250810190612cc5919061472f565b9050612cd48184848989613092565b98975050505050505050565b600080612cec85613241565b9050612d3986604051602001612d0491815260200190565b60408051601f198184030181529181528301516060840151608085015160a086015160c0870151875160208901518c8c6132bf565b9695505050505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590612d7c5750333014155b15611dd157604051630796d94560e01b815260040160405180910390fd5b816001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015612df4575060408051601f3d908101601f19168201909252612df19181019061472f565b60015b612e1c57604051634c9c8ce360e01b81526001600160a01b038316600482015260240161163e565b600080516020614e568339815191528114612e4d57604051632a87526960e21b81526004810182905260240161163e565b612e57838361345d565b505050565b606060ff8314612e7657612e6f836134b3565b90506108d8565b818054612e8290614bd2565b80601f0160208091040260200160405190810160405280929190818152602001828054612eae90614bd2565b8015612efb5780601f10612ed057610100808354040283529160200191612efb565b820191906000526020600020905b815481529060010190602001808311612ede57829003601f168201915b505050505090506108d8565b60006109b76ffffffffeffffffffffffffffffffffff60601b197fffffffff00000001000000000000000000000000fffffffffffffffffffffffc7f5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b86866134f2565b60008060008351604103612fa45760208401516040850151606086015160001a612f968882858561359d565b955095509550505050612fb0565b50508151600091506002905b9250925092565b6000826003811115612fcb57612fcb614c06565b03612fd4575050565b6001826003811115612fe857612fe8614c06565b036130065760405163f645eedf60e01b815260040160405180910390fd5b600282600381111561301a5761301a614c06565b0361303b5760405163fce698f760e01b81526004810182905260240161163e565b600382600381111561304f5761304f614c06565b03610db4576040516335e2f38360e21b81526004810182905260240161163e565b600080828060200190518101906130879190614c1c565b909590945092505050565b60006130bf60027fffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551614c60565b8411156130ce575060006112a2565b6040805160208101889052908101869052606081018590526080810184905260a0810183905260009060c00160405160208183030381529060405290506000806101006001600160a01b0316836040516131289190614bc0565b600060405180830381855afa9150503d8060008114613163576040519150601f19603f3d011682016040523d82523d6000602084013e613168565b606091505b5080519193509150151582801561317c5750805b156131a35781806020019051810190613195919061472f565b6001149450505050506112a2565b60405163a1f3128160e01b8152600481018b9052602481018a905260448101899052606481018890526084810187905273__$b8f96b288d4d0429e38b8ed50fd423070f$__9063a1f312819060a401602060405180830381865af415801561320f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906132339190614953565b9a9950505050505050505050565b6132836040518060e001604052806000815260200160008152602001606081526020016000151581526020016060815260200160608152602001600081525090565b818060200190518101906132979190614cc7565b60c089015260a088015260808701521515606086015260408501526020840152825250919050565b600060258a5110806132f957506132f78a6020815181106132e2576132e2614ab9565b01602001516001600160f81b0319168a61366c565b155b1561330657506000613233565b6000886133128d6136d2565b8960405160200161332593929190614d86565b60408051601f198184030181528282019091526015825274113a3cb832911d113bb2b130baba34371733b2ba1160591b6020830152915061336781838a6138df565b61337657600092505050613233565b60006002836040516133889190614bc0565b602060405180830381855afa1580156133a5573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052508101906133c8919061472f565b9050600060028e836040516020016133e1929190614dc9565b60408051601f19818403018152908290526133fb91614bc0565b602060405180830381855afa158015613418573d6000803e3d6000fd5b5050506040513d601f19601f8201168201806040525081019061343b919061472f565b905061344a818a8a8a8a613092565b9f9e505050505050505050505050505050565b6134668261398e565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a28051156134ab57612e5782826139f3565b610db4613a60565b606060006134c083613a7f565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600082158015613500575081155b8061350b5750858310155b806135165750858210155b15613523575060006112a2565b6000868061353357613533614c4a565b83840990506000878061354857613548614c4a565b888061355657613556614c4a565b888709898061356757613567614c4a565b878b8061357657613576614c4a565b898a0909089050878061358b5761358b614c4a565b86820891909114979650505050505050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156135d85750600091506003905082613662565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa15801561362c573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661365857506000925060019150829050613662565b9250600091508190505b9450945094915050565b6000600160f81b83811614613683575060006108d8565b8180156136965750600160fa1b83811614155b156136a3575060006108d8565b600160fb1b838116146136c957600f60fc1b600160fc1b8416016136c9575060006108d8565b50600192915050565b606060006136df83613aa7565b9050600081905060006002825111801561372a575081600283516137039190614aa6565b8151811061371357613713614ab9565b6020910101516001600160f81b031916603d60f81b145b1561373757506002613782565b60018251118015613779575081600183516137529190614aa6565b8151811061376257613762614ab9565b6020910101516001600160f81b031916603d60f81b145b15613782575060015b60008183516137919190614aa6565b90506000816001600160401b038111156137ad576137ad613e99565b6040519080825280601f01601f1916602001820160405280156137d7576020820181803683370190505b50905060005b828110156138d4578481815181106137f7576137f7614ab9565b01602001516001600160f81b031916602b60f81b0361384357602d60f81b82828151811061382757613827614ab9565b60200101906001600160f81b031916908160001a9053506138cc565b84818151811061385557613855614ab9565b01602001516001600160f81b031916602f60f81b0361388557605f60f81b82828151811061382757613827614ab9565b84818151811061389757613897614ab9565b602001015160f81c60f81b8282815181106138b4576138b4614ab9565b60200101906001600160f81b031916908160001a9053505b6001016137dd565b509695505050505050565b825182516000918591859190845b8281101561397f57816139008289614deb565b10613913576000955050505050506109b7565b8361391e8289614deb565b8151811061392e5761392e614ab9565b602001015160f81c60f81b6001600160f81b03191685828151811061395557613955614ab9565b01602001516001600160f81b03191614613977576000955050505050506109b7565b6001016138ed565b50600198975050505050505050565b806001600160a01b03163b6000036139c457604051634c9c8ce360e01b81526001600160a01b038216600482015260240161163e565b600080516020614e5683398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6060600080846001600160a01b031684604051613a109190614bc0565b600060405180830381855af49150503d8060008114613a4b576040519150601f19603f3d011682016040523d82523d6000602084013e613a50565b606091505b50915091506112a2858383613acd565b3415610ea65760405163b398979f60e01b815260040160405180910390fd5b600060ff8216601f8111156108d857604051632cd44ac360e21b815260040160405180910390fd5b60606108d882604051806060016040528060408152602001614e76604091396001613b29565b606082613ae257613add82613ca8565b6109b7565b8151158015613af957506001600160a01b0384163b155b15613b2257604051639996b31560e01b81526001600160a01b038516600482015260240161163e565b50806109b7565b60608351600003613b4957506040805160208101909152600081526109b7565b600082613b7a57600385516004613b609190614dfe565b613b6b906002614deb565b613b759190614c60565b613b9f565b600385516002613b8a9190614deb565b613b949190614c60565b613b9f906004614dfe565b90506000816001600160401b03811115613bbb57613bbb613e99565b6040519080825280601f01601f191660200182016040528015613be5576020820181803683370190505b50905060018501602082018788518901602081018051600082525b82841015613c5b576003840193508351603f8160121c168701518653600186019550603f81600c1c168701518653600186019550603f8160061c168701518653600186019550603f8116870151865350600185019450613c00565b905250508515613c9c57600388510660018114613c7f5760028114613c9257613c9a565b603d6001830353603d6002830353613c9a565b603d60018303535b505b50909695505050505050565b805115613cb85780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b5080546000825590600052602060002090810190611dd191905b80821115613cff5760008155600101613ceb565b5090565b600060208284031215613d1557600080fd5b81356001600160e01b0319811681146109b757600080fd5b60006101208284031215613d4057600080fd5b50919050565b600060208284031215613d5857600080fd5b81356001600160401b03811115613d6e57600080fd5b613d7a84828501613d2d565b949350505050565b6001600160a01b0381168114611dd157600080fd5b8035611e5f81613d82565b60008083601f840112613db457600080fd5b5081356001600160401b03811115613dcb57600080fd5b6020830191508360208260051b8501011115613de657600080fd5b9250929050565b60008060008060008060006080888a031215613e0857600080fd5b8735613e1381613d82565b965060208801356001600160401b0380821115613e2f57600080fd5b613e3b8b838c01613da2565b909850965060408a0135915080821115613e5457600080fd5b613e608b838c01613da2565b909650945060608a0135915080821115613e7957600080fd5b50613e868a828b01613da2565b989b979a50959850939692959293505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715613ed757613ed7613e99565b604052919050565b60006001600160401b03821115613ef857613ef8613e99565b50601f01601f191660200190565b600082601f830112613f1757600080fd5b8135613f2a613f2582613edf565b613eaf565b818152846020838601011115613f3f57600080fd5b816020850160208301376000918101602001919091529392505050565b60008060008060808587031215613f7257600080fd5b8435613f7d81613d82565b93506020850135613f8d81613d82565b92506040850135915060608501356001600160401b03811115613faf57600080fd5b613fbb87828801613f06565b91505092959194509250565b60008083601f840112613fd957600080fd5b5081356001600160401b03811115613ff057600080fd5b602083019150836020828501011115613de657600080fd5b60008060006040848603121561401d57600080fd5b8335925060208401356001600160401b0381111561403a57600080fd5b61404686828701613fc7565b9497909650939450505050565b60008060006060848603121561406857600080fd5b83356001600160401b0381111561407e57600080fd5b61408a86828701613d2d565b9660208601359650604090950135949350505050565b6020808252825182820181905260009190848201906040850190845b81811015613c9c578351835292840192918401916001016140bc565b6000602082840312156140ea57600080fd5b81356001600160c01b03811681146109b757600080fd5b60006020828403121561411357600080fd5b81356001600160401b0381111561412957600080fd5b820160c081850312156109b757600080fd5b60006020828403121561414d57600080fd5b5035919050565b6000806040838503121561416757600080fd5b823561417281613d82565b915060208301356001600160401b0381111561418d57600080fd5b61419985828601613f06565b9150509250929050565b6000602082840312156141b557600080fd5b81356001600160401b038111156141cb57600080fd5b8201606081850312156109b757600080fd5b8015158114611dd157600080fd5b8035611e5f816141dd565b600080600080600080600080600060c08a8c03121561421457600080fd5b893560ff8116811461422557600080fd5b985061423360208b01613d97565b975060408a01356001600160401b038082111561424f57600080fd5b61425b8d838e01613da2565b909950975060608c013591508082111561427457600080fd5b6142808d838e01613da2565b909750955060808c013591508082111561429957600080fd5b506142a68c828d01613da2565b90945092506142b9905060a08b016141eb565b90509295985092959850929598565b600080604083850312156142db57600080fd5b82356142e681613d82565b946020939093013593505050565b60005b8381101561430f5781810151838201526020016142f7565b50506000910152565b600081518084526143308160208601602086016142f4565b601f01601f19169290920160200192915050565b60ff60f81b881681526000602060e0602084015261436560e084018a614318565b8381036040850152614377818a614318565b606085018990526001600160a01b038816608086015260a0850187905284810360c08601528551808252602080880193509091019060005b818110156143cb578351835292840192918401916001016143af565b50909c9b505050505050505050505050565b6020815260006109b76020830184614318565b600082601f83011261440157600080fd5b813560206001600160401b0382111561441c5761441c613e99565b8160051b61442b828201613eaf565b928352848101820192828101908785111561444557600080fd5b83870192505b848310156144645782358252918301919083019061444b565b979650505050505050565b600080600080600060a0868803121561448757600080fd5b853561449281613d82565b945060208601356144a281613d82565b935060408601356001600160401b03808211156144be57600080fd5b6144ca89838a016143f0565b945060608801359150808211156144e057600080fd5b6144ec89838a016143f0565b9350608088013591508082111561450257600080fd5b5061450f88828901613f06565b9150509295509295909350565b6000806000806060858703121561453257600080fd5b84356001600160401b0381111561454857600080fd5b61455487828801613fc7565b90989097506020870135966040013595509350505050565b6000806000806000806060878903121561458557600080fd5b86356001600160401b038082111561459c57600080fd5b6145a88a838b01613da2565b909850965060208901359150808211156145c157600080fd5b6145cd8a838b01613da2565b909650945060408901359150808211156145e657600080fd5b506145f389828a01613da2565b979a9699509497509295939492505050565b6000806020838503121561461857600080fd5b82356001600160401b0381111561462e57600080fd5b61463a85828601613fc7565b90969095509350505050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b8281101561469d57603f1988860301845261468b858351614318565b9450928501929085019060010161466f565b5092979650505050505050565b600080600080600060a086880312156146c257600080fd5b85356146cd81613d82565b945060208601356146dd81613d82565b9350604086013592506060860135915060808601356001600160401b0381111561470657600080fd5b61450f88828901613f06565b60006020828403121561472457600080fd5b81356109b781613d82565b60006020828403121561474157600080fd5b5051919050565b6000808335601e1984360301811261475f57600080fd5b83016020810192503590506001600160401b0381111561477e57600080fd5b803603821315613de657600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60008383855260208086019550808560051b830101846000805b8881101561486957858403601f19018a52823536899003605e190181126147f5578283fd5b88016060813561480481613d82565b6001600160a01b0316865261481b82880183614748565b828989015261482d838901828461478d565b92505050604061483f81840184614748565b93508783038289015261485383858361478d565b9d89019d975050509386019350506001016147d0565b509198975050505050505050565b602081526000823561488881613d82565b6001600160a01b03908116602084810191909152840135906148a982613d82565b80821660408501525050604083013560608301526060830135601e198436030181126148d457600080fd5b83016020810190356001600160401b038111156148f057600080fd5b8060051b360382131561490257600080fd5b60c0608085015261491760e0850182846147b6565b915050608084013560a084015261493160a0850185614748565b848303601f190160c0860152612d3983828461478d565b8051611e5f816141dd565b60006020828403121561496557600080fd5b81516109b7816141dd565b6000808335601e1984360301811261498757600080fd5b8301803591506001600160401b038211156149a157600080fd5b602001915036819003821315613de657600080fd5b6000838385526020808601955060208560051b8301018460005b87811015614a0a57848303601f190189526149eb8288614748565b6149f685828461478d565b9a86019a94505050908301906001016149d0565b5090979650505050505050565b606081526000614a2b60608301888a6149b6565b8281036020848101919091528682528791810160005b88811015614a5d57833582529282019290820190600101614a41565b508481036040860152614a718187896149b6565b9b9a5050505050505050505050565b8183823760009101908152919050565b634e487b7160e01b600052601160045260246000fd5b818103818111156108d8576108d8614a90565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b8281526040602082015260006109b46040830184614318565b60008085851115614b0e57600080fd5b83861115614b1b57600080fd5b5050820193919092039150565b803560208310156108d857600019602084900360031b1b1692915050565b606081526000614b5a60608301868861478d565b6020830194909452506040015292915050565b60008235605e19833603018112614b8357600080fd5b9190910192915050565b6bffffffffffffffffffffffff198135818116916014851015612a615760149490940360031b84901b1690921692915050565b60008251614b838184602087016142f4565b600181811c90821680614be657607f821691505b602082108103613d4057634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052602160045260246000fd5b600080600060608486031215614c3157600080fd5b8351925060208401519150604084015190509250925092565b634e487b7160e01b600052601260045260246000fd5b600082614c7d57634e487b7160e01b600052601260045260246000fd5b500490565b600082601f830112614c9357600080fd5b8151614ca1613f2582613edf565b818152846020838601011115614cb657600080fd5b613d7a8260208301602087016142f4565b600080600080600080600080610100898b031215614ce457600080fd5b88519750602089015196506040890151955060608901516001600160401b0380821115614d1057600080fd5b614d1c8c838d01614c82565b9650614d2a60808c01614948565b955060a08b0151915080821115614d4057600080fd5b614d4c8c838d01614c82565b945060c08b0151915080821115614d6257600080fd5b50614d6f8b828c01614c82565b92505060e089015190509295985092959890939650565b60008451614d988184602089016142f4565b845190830190614dac8183602089016142f4565b8451910190614dbf8183602088016142f4565b0195945050505050565b60008351614ddb8184602088016142f4565b9190910191825250602001919050565b808201808211156108d8576108d8614a90565b80820281158282048414176108d8576108d8614a9056fea2b1bcb5e16cee2a8898b49cb0c3605e70c16f429f6002ed8b1bc5612a694900a2b1bcb5e16cee2a8898b49cb0c3605e70c16f429f6002ed8b1bc5612a694902360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc4142434445464748494a4b4c4d4e4f505152535455565758595a6162636465666768696a6b6c6d6e6f707172737475767778797a303132333435363738392b2fa2646970667358221220d641f685fbc825f5c1c752f10b46c0f81d9143a8b41e10871b92196f03c53fe864736f6c63430008170033";

// src/formatted/MessageHashUtils.ts
var MessageHashUtils_exports = {};
__export(MessageHashUtils_exports, {
  abi: () => abi63,
  bytecode: () => bytecode63
});
var abi63 = [];
var bytecode63 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212203d81846f7dee1e1b6ac5ec7facf37349f677e4fb70664eb5852e6414aa31b93064736f6c63430008170033";

// src/formatted/IdEnforcer.ts
var IdEnforcer_exports = {};
__export(IdEnforcer_exports, {
  abi: () => abi64,
  bytecode: () => bytecode64
});
var abi64 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getIsUsed",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "id_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "event",
    "name": "UsedId",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode64 = "0x608060405234801561001057600080fd5b50610518806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e3314610067578063595dce4814610083578063a145832a146100ab578063b99deb0e146100be578063d3eddcc514610067578063ed46336714610067575b600080fd5b610081610075366004610379565b50505050505050505050565b005b610096610091366004610446565b6100df565b60405190151581526020015b60405180910390f35b6100816100b9366004610379565b610116565b6100d16100cc366004610482565b61028c565b6040519081526020016100a2565b6001600160a01b03808416600090815260208181526040808320938616835292905290812061010e90836102ef565b949350505050565b85600881901b6001600160f81b03198116156101875760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5060006101948c8c61028c565b90506101a13385836100df565b156101ee5760405162461bcd60e51b815260206004820152601a60248201527f4964456e666f726365723a69642d616c72656164792d75736564000000000000604482015260640161017e565b336000908152602081815260408083206001600160a01b03881684528252808320600885901c845290915290208054600160ff84161b179055826001600160a01b0316846001600160a01b0316336001600160a01b03167f6286af1aaf28b34723a53056e5608eabb40c823d1ce093ff371cf08c502431d68460405161027691815260200190565b60405180910390a4505050505050505050505050565b6000602082146102de5760405162461bcd60e51b815260206004820152601f60248201527f4964456e666f726365723a696e76616c69642d7465726d732d6c656e67746800604482015260640161017e565b6102e882846104c4565b9392505050565b600881901c600090815260208390526040902054600160ff83161b1615155b92915050565b60008083601f84011261032657600080fd5b50813567ffffffffffffffff81111561033e57600080fd5b60208301915083602082850101111561035657600080fd5b9250929050565b80356001600160a01b038116811461037457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561039857600080fd5b8a3567ffffffffffffffff808211156103b057600080fd5b6103bc8e838f01610314565b909c509a5060208d01359150808211156103d557600080fd5b6103e18e838f01610314565b909a50985060408d0135975060608d013591508082111561040157600080fd5b5061040e8d828e01610314565b90965094505060808b0135925061042760a08c0161035d565b915061043560c08c0161035d565b90509295989b9194979a5092959850565b60008060006060848603121561045b57600080fd5b6104648461035d565b92506104726020850161035d565b9150604084013590509250925092565b6000806020838503121561049557600080fd5b823567ffffffffffffffff8111156104ac57600080fd5b6104b885828601610314565b90969095509350505050565b8035602083101561030e57600019602084900360031b1b169291505056fea26469706673582212204a96dd3b9054d6055c3a36da342d1ecb848915fb596c41cf0571e73299243bf864736f6c63430008170033";

// src/formatted/LimitedCallsEnforcer.ts
var LimitedCallsEnforcer_exports = {};
__export(LimitedCallsEnforcer_exports, {
  abi: () => abi65,
  bytecode: () => bytecode65
});
var abi65 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "callCounts",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "count",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "limit_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "event",
    "name": "IncreasedCount",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "limit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "callCount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode65 = "0x608060405234801561001057600080fd5b506104e9806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806319054d8914610067578063414c3e33146100a1578063a145832a146100bd578063b99deb0e146100d0578063d3eddcc5146100a1578063ed463367146100a1575b600080fd5b61008f6100753660046102ec565b600060208181529281526040808220909352908152205481565b60405190815260200160405180910390f35b6100bb6100af36600461035f565b50505050505050505050565b005b6100bb6100cb36600461035f565b6100e3565b61008f6100de36600461042c565b610244565b85600881901b6100f48160006102b9565b6101535760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5060006101608c8c610244565b33600090815260208181526040808320898452909152812080549293509091829061018a9061046e565b91829055509050818111156101ed5760405162461bcd60e51b815260206004820152602360248201527f4c696d6974656443616c6c73456e666f726365723a6c696d69742d657863656560448201526219195960ea1b606482015260840161014a565b604080518381526020810183905287916001600160a01b0387169133917f449da07f2c06c9d1a6b19d2454ffe749e8cf991d22f686e076a1a4844c5ff370910160405180910390a450505050505050505050505050565b6000602082146102a85760405162461bcd60e51b815260206004820152602960248201527f4c696d6974656443616c6c73456e666f726365723a696e76616c69642d7465726044820152680dae65ad8cadccee8d60bb1b606482015260840161014a565b6102b28284610495565b9392505050565b6001600160f81b0319828116908216145b92915050565b80356001600160a01b03811681146102e757600080fd5b919050565b600080604083850312156102ff57600080fd5b610308836102d0565b946020939093013593505050565b60008083601f84011261032857600080fd5b50813567ffffffffffffffff81111561034057600080fd5b60208301915083602082850101111561035857600080fd5b9250929050565b60008060008060008060008060008060e08b8d03121561037e57600080fd5b8a3567ffffffffffffffff8082111561039657600080fd5b6103a28e838f01610316565b909c509a5060208d01359150808211156103bb57600080fd5b6103c78e838f01610316565b909a50985060408d0135975060608d01359150808211156103e757600080fd5b506103f48d828e01610316565b90965094505060808b0135925061040d60a08c016102d0565b915061041b60c08c016102d0565b90509295989b9194979a5092959850565b6000806020838503121561043f57600080fd5b823567ffffffffffffffff81111561045657600080fd5b61046285828601610316565b90969095509350505050565b60006001820161048e57634e487b7160e01b600052601160045260246000fd5b5060010190565b803560208310156102ca57600019602084900360031b1b169291505056fea264697066735822122058fb87f0b8e8aa4745b9ef395d8bd725c313f876828d7be4c479f4049d6644ac64736f6c63430008170033";

// src/formatted/INonceManager.ts
var INonceManager_exports = {};
__export(INonceManager_exports, {
  abi: () => abi66,
  bytecode: () => bytecode66
});
var abi66 = [
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "incrementNonce",
    "inputs": [
      {
        "name": "key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
];
var bytecode66 = "0x";

// src/formatted/ModeLib.ts
var ModeLib_exports = {};
__export(ModeLib_exports, {
  abi: () => abi67,
  bytecode: () => bytecode67
});
var abi67 = [];
var bytecode67 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220f3b6a0af2d4dff4702805c39f40ed768201654e38f4d05a5ef7ae0498666b77964736f6c63430008170033";

// src/formatted/NativeTokenStreamingEnforcer.ts
var NativeTokenStreamingEnforcer_exports = {};
__export(NativeTokenStreamingEnforcer_exports, {
  abi: () => abi68,
  bytecode: () => bytecode68
});
var abi68 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAvailableAmount",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "availableAmount_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "initialAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amountPerSecond_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startTime_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "streamingAllowances",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "initialAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amountPerSecond",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "spent",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "IncreasedSpentMap",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "initialAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "maxAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amountPerSecond",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "startTime",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "spent",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "lastUpdateTimestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode68 = "0x608060405234801561001057600080fd5b506109a4806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063d3eddcc51161005b578063d3eddcc514610082578063ed46336714610082578063ee73d772146100e9578063fb7d2c5b1461010a57600080fd5b8063414c3e3314610082578063a145832a1461009e578063b99deb0e146100b1575b600080fd5b61009c610090366004610765565b50505050505050505050565b005b61009c6100ac366004610765565b610177565b6100c46100bf366004610832565b61025c565b6040805194855260208501939093529183015260608201526080015b60405180910390f35b6100fc6100f7366004610874565b610338565b6040519081526020016100e0565b61014f610118366004610874565b6000602081815292815260408082209093529081522080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016100e0565b856101838160006103a3565b6101d45760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101e58160006103a3565b61023f5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084016101cb565b5061024e8c8c898989886103ba565b505050505050505050505050565b6000808080608085146102cb5760405162461bcd60e51b815260206004820152603160248201527f4e6174697665546f6b656e53747265616d696e67456e666f726365723a696e766044820152700c2d8d2c85ae8cae4dae65ad8cadccee8d607b1b60648201526084016101cb565b6102d960206000878961089e565b6102e2916108c8565b93506102f260406020878961089e565b6102fb916108c8565b925061030b60606040878961089e565b610314916108c8565b915061032460806060878961089e565b61032d916108c8565b939692955090935050565b6001600160a01b0382166000908152602081815260408083208484528252808320815160a0810183528154815260018201549381019390935260028101549183019190915260038101546060830152600481015460808301529061039b9061062e565b949350505050565b6001600160f81b0319828116908216145b92915050565b60006103c685856106af565b50509150506000806000806103db8b8b61025c565b93509350935093508383101561044b5760405162461bcd60e51b815260206004820152602f60248201527f4e6174697665546f6b656e53747265616d696e67456e666f726365723a696e7660448201526e185b1a590b5b585e0b585b5bdd5b9d608a1b60648201526084016101cb565b600081116104b85760405162461bcd60e51b815260206004820152603460248201527f4e6174697665546f6b656e53747265616d696e67456e666f726365723a696e76604482015273616c69642d7a65726f2d73746172742d74696d6560601b60648201526084016101cb565b336000908152602081815260408083208a8452909152812060048101549091036104f5578481556001810184905560028101839055600381018290555b6040805160a081018252825481526001830154602082015260028301549181019190915260038201546060820152600482015460808201526105369061062e565b86111561059d5760405162461bcd60e51b815260206004820152602f60248201527f4e6174697665546f6b656e53747265616d696e67456e666f726365723a616c6c60448201526e1bddd85b98d94b595e18d959591959608a1b60648201526084016101cb565b858160040160008282546105b191906108fc565b9091555050600481015460408051878152602081018790529081018590526060810184905260808101919091524260a082015288906001600160a01b0389169033907fa4d5df1d290378aabb8f054b2f3100faf35e2266bb7fbe661f947dfc686704ae9060c00160405180910390a4505050505050505050505050565b6000816060015142101561064457506000919050565b6000826060015142610656919061090f565b9050600081846040015161066a9190610922565b845161067691906108fc565b9050836020015181111561068b575060208301515b808460800151106106a0575060009392505050565b608084015161039b908261090f565b60008036816106c1601482878961089e565b6106ca91610939565b60601c93506106dd60346014878961089e565b6106e6916108c8565b92506106f5856034818961089e565b949793965094505050565b60008083601f84011261071257600080fd5b50813567ffffffffffffffff81111561072a57600080fd5b60208301915083602082850101111561074257600080fd5b9250929050565b80356001600160a01b038116811461076057600080fd5b919050565b60008060008060008060008060008060e08b8d03121561078457600080fd5b8a3567ffffffffffffffff8082111561079c57600080fd5b6107a88e838f01610700565b909c509a5060208d01359150808211156107c157600080fd5b6107cd8e838f01610700565b909a50985060408d0135975060608d01359150808211156107ed57600080fd5b506107fa8d828e01610700565b90965094505060808b0135925061081360a08c01610749565b915061082160c08c01610749565b90509295989b9194979a5092959850565b6000806020838503121561084557600080fd5b823567ffffffffffffffff81111561085c57600080fd5b61086885828601610700565b90969095509350505050565b6000806040838503121561088757600080fd5b61089083610749565b946020939093013593505050565b600080858511156108ae57600080fd5b838611156108bb57600080fd5b5050820193919092039150565b803560208310156103b457600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b808201808211156103b4576103b46108e6565b818103818111156103b4576103b46108e6565b80820281158282048414176103b4576103b46108e6565b6bffffffffffffffffffffffff1981358181169160148510156109665780818660140360031b1b83161692505b50509291505056fea264697066735822122052704058a3717c34d4c81be20ba9801f9b76f6f0c65ef9abba014d246806f21f64736f6c63430008170033";

// src/formatted/MockFailureCaveatEnforcer.ts
var MockFailureCaveatEnforcer_exports = {};
__export(MockFailureCaveatEnforcer_exports, {
  abi: () => abi69,
  bytecode: () => bytecode69
});
var abi69 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHookCallCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode69 = "0x608060405234801561001057600080fd5b50610263806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063d3eddcc51461008b578063e38ad59014610099578063ed4633671461005c575b600080fd5b61007661006a366004610139565b50505050505050505050565b005b610076610086366004610139565b6100b4565b610076610057366004610139565b6100a260005481565b60405190815260200160405180910390f35b6000805490806100c383610206565b919050555050505050505050505050565b60008083601f8401126100e657600080fd5b50813567ffffffffffffffff8111156100fe57600080fd5b60208301915083602082850101111561011657600080fd5b9250929050565b80356001600160a01b038116811461013457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561015857600080fd5b8a3567ffffffffffffffff8082111561017057600080fd5b61017c8e838f016100d4565b909c509a5060208d013591508082111561019557600080fd5b6101a18e838f016100d4565b909a50985060408d0135975060608d01359150808211156101c157600080fd5b506101ce8d828e016100d4565b90965094505060808b013592506101e760a08c0161011d565b91506101f560c08c0161011d565b90509295989b9194979a5092959850565b60006001820161022657634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220bcf0049f14343021d3eb32b64d949a39aec074b673cc386de61163856ad518a964736f6c63430008170033";

// src/formatted/Math.ts
var Math_exports = {};
__export(Math_exports, {
  abi: () => abi70,
  bytecode: () => bytecode70
});
var abi70 = [];
var bytecode70 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122074ec8ae00f245173ca026cab4a450417e87849694c5e94ec4fdf9b92eee9682e64736f6c63430008170033";

// src/formatted/LogicalOrWrapperEnforcer.ts
var LogicalOrWrapperEnforcer_exports = {};
__export(LogicalOrWrapperEnforcer_exports, {
  abi: () => abi71,
  bytecode: () => bytecode71
});
var abi71 = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "contract IDelegationManager"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "delegationManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDelegationManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "AddressInsufficientBalance",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
  }
];
var bytecode71 = "0x60a060405234801561001057600080fd5b50604051610fa1380380610fa183398101604081905261002f91610040565b6001600160a01b0316608052610070565b60006020828403121561005257600080fd5b81516001600160a01b038116811461006957600080fd5b9392505050565b608051610efc6100a560003960008181609c0152818160f8015281816102010152818161030201526103f60152610efc6000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610071578063d3eddcc514610084578063ea4d3c9b14610097578063ed463367146100da575b600080fd5b61006f61006a36600461084c565b6100ed565b005b61006f61007f36600461084c565b6101c7565b61006f61009236600461084c565b6102c8565b6100be7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200160405180910390f35b61006f6100e836600461084c565b6103bc565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461013e5760405162461bcd60e51b815260040161013590610918565b60405180910390fd5b6101bb8a8a8a8a6040518060a001604052808c81526020018b8b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250505090825250602081018a90526001600160a01b03808a166040830152881660609091015263414c3e3360e01b6104ac565b50505050505050505050565b85600881901b6001600160f81b03198116156101f55760405162461bcd60e51b815260040161013590610968565b50336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461023e5760405162461bcd60e51b815260040161013590610918565b6102bb8b8b8b8b6040518060a001604052808d81526020018c8c8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250505090825250602081018b90526001600160a01b03808b16604083015289166060909101526350a2c19560e11b6104ac565b5050505050505050505050565b85600881901b6001600160f81b03198116156102f65760405162461bcd60e51b815260040161013590610968565b50336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461033f5760405162461bcd60e51b815260040161013590610918565b6102bb8b8b8b8b6040518060a001604052808d81526020018c8c8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250505090825250602081018b90526001600160a01b03808b166040830152891660609091015263d3eddcc560e01b6104ac565b85600881901b6001600160f81b03198116156103ea5760405162461bcd60e51b815260040161013590610968565b50336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104335760405162461bcd60e51b815260040161013590610918565b6102bb8b8b8b8b6040518060a001604052808d81526020018c8c8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250505090825250602081018b90526001600160a01b03808b166040830152891660609091015263ed46336760e01b5b60006104ba86880188610af1565b905060006104ca85870187610cf3565b905081518160000151106105355760405162461bcd60e51b815260206004820152602c60248201527f4c6f676963616c4f7257726170706572456e666f726365723a696e76616c696460448201526b05acee4deeae05ad2dcc8caf60a31b6064820152608401610135565b60008282600001518151811061054d5761054d610ddb565b602002602001015190506000816000015151905080836020015151146105d15760405162461bcd60e51b815260206004820152603360248201527f4c6f676963616c4f7257726170706572456e666f726365723a696e76616c696460448201527205ac6c2eccac2e85ac2e4cee65ad8cadccee8d606b1b6064820152608401610135565b60005b818110156102bb576106a8836000015182815181106105f5576105f5610ddb565b602002602001015160000151878560000151848151811061061857610618610ddb565b6020026020010151602001518760200151858151811061063a5761063a610ddb565b60200260200101518b600001518c602001518d604001518e606001518f608001516040516024016106719796959493929190610e41565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526106b1565b506001016105d4565b60606106bf838360006106c6565b9392505050565b6060814710156106eb5760405163cd78605960e01b8152306004820152602401610135565b600080856001600160a01b031684866040516107079190610eaa565b60006040518083038185875af1925050503d8060008114610744576040519150601f19603f3d011682016040523d82523d6000602084013e610749565b606091505b5091509150610759868383610763565b9695505050505050565b60608261077857610773826107bf565b6106bf565b815115801561078f57506001600160a01b0384163b155b156107b857604051639996b31560e01b81526001600160a01b0385166004820152602401610135565b50806106bf565b8051156107cf5780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b60008083601f8401126107fa57600080fd5b5081356001600160401b0381111561081157600080fd5b60208301915083602082850101111561082957600080fd5b9250929050565b80356001600160a01b038116811461084757600080fd5b919050565b60008060008060008060008060008060e08b8d03121561086b57600080fd5b8a356001600160401b038082111561088257600080fd5b61088e8e838f016107e8565b909c509a5060208d01359150808211156108a757600080fd5b6108b38e838f016107e8565b909a50985060408d0135975060608d01359150808211156108d357600080fd5b506108e08d828e016107e8565b90965094505060808b013592506108f960a08c01610830565b915061090760c08c01610830565b90509295989b9194979a5092959850565b60208082526030908201527f4c6f676963616c4f7257726170706572456e666f726365723a6f6e6c792d646560408201526f3632b3b0ba34b7b716b6b0b730b3b2b960811b606082015260800190565b60208082526025908201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6040820152642d7479706560d81b606082015260800190565b634e487b7160e01b600052604160045260246000fd5b604051602081016001600160401b03811182821017156109e5576109e56109ad565b60405290565b604051606081016001600160401b03811182821017156109e5576109e56109ad565b604080519081016001600160401b03811182821017156109e5576109e56109ad565b604051601f8201601f191681016001600160401b0381118282101715610a5757610a576109ad565b604052919050565b60006001600160401b03821115610a7857610a786109ad565b5060051b60200190565b600082601f830112610a9357600080fd5b81356001600160401b03811115610aac57610aac6109ad565b610abf601f8201601f1916602001610a2f565b818152846020838601011115610ad457600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215610b0357600080fd5b6001600160401b0382351115610b1857600080fd5b8135820183601f820112610b2b57600080fd5b610b3d610b388235610a5f565b610a2f565b81358082526020808301929160051b840101861015610b5b57600080fd5b602083015b6020843560051b850101811015610ce9576001600160401b0381351115610b8657600080fd5b6020813585018803601f19011215610b9d57600080fd5b610ba56109c3565b6001600160401b0360208335870101351115610bc057600080fd5b81358501602081013501603f81018913610bd957600080fd5b610be9610b386020830135610a5f565b602082810135808352908201919060051b83016040018b1015610c0b57600080fd5b604083015b6040602085013560051b850101811015610cd6576001600160401b0381351115610c3957600080fd5b803584016060818e03603f19011215610c5157600080fd5b610c596109eb565b610c6560408301610830565b81526001600160401b0360608301351115610c7f57600080fd5b610c928e60406060850135850101610a82565b60208201526001600160401b0360808301351115610caf57600080fd5b610cc28e60406080850135850101610a82565b604082015284525060209283019201610c10565b5083525050835260209283019201610b60565b5095945050505050565b60006020808385031215610d0657600080fd5b82356001600160401b0380821115610d1d57600080fd5b9084019060408287031215610d3157600080fd5b610d39610a0d565b823581528383013582811115610d4e57600080fd5b80840193505086601f840112610d6357600080fd5b8235610d71610b3882610a5f565b81815260059190911b84018501908581019089831115610d9057600080fd5b8686015b83811015610dc857803586811115610dac5760008081fd5b610dba8c8a838b0101610a82565b845250918701918701610d94565b5095830195909552509695505050505050565b634e487b7160e01b600052603260045260246000fd5b60005b83811015610e0c578181015183820152602001610df4565b50506000910152565b60008151808452610e2d816020860160208601610df1565b601f01601f19169290920160200192915050565b60e081526000610e5460e083018a610e15565b8281036020840152610e66818a610e15565b90508760408401528281036060840152610e808188610e15565b608084019690965250506001600160a01b0392831660a0820152911660c090910152949350505050565b60008251610ebc818460208701610df1565b919091019291505056fea2646970667358221220849f3e028a14dd0caba34e88e124f67834a95e85298a8ec49d35e542d61e676b64736f6c63430008170033";

// src/formatted/MockCaveatEnforcer.ts
var MockCaveatEnforcer_exports = {};
__export(MockCaveatEnforcer_exports, {
  abi: () => abi72,
  bytecode: () => bytecode72
});
var abi72 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHookCallCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHookCallCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode72 = "0x608060405234801561001057600080fd5b5061028c806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e33146100675780637c46d3c814610083578063a145832a1461009e578063d3eddcc5146100b1578063e38ad590146100c4578063ed46336714610067575b600080fd5b610081610075366004610162565b50505050505050505050565b005b61008c60015481565b60405190815260200160405180910390f35b6100816100ac366004610162565b6100cd565b6100816100bf366004610162565b6100ed565b61008c60005481565b6000805490806100dc8361022f565b919050555050505050505050505050565b600180549060006100dc8361022f565b60008083601f84011261010f57600080fd5b50813567ffffffffffffffff81111561012757600080fd5b60208301915083602082850101111561013f57600080fd5b9250929050565b80356001600160a01b038116811461015d57600080fd5b919050565b60008060008060008060008060008060e08b8d03121561018157600080fd5b8a3567ffffffffffffffff8082111561019957600080fd5b6101a58e838f016100fd565b909c509a5060208d01359150808211156101be57600080fd5b6101ca8e838f016100fd565b909a50985060408d0135975060608d01359150808211156101ea57600080fd5b506101f78d828e016100fd565b90965094505060808b0135925061021060a08c01610146565b915061021e60c08c01610146565b90509295989b9194979a5092959850565b60006001820161024f57634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220fbb59fec9ec7bf6cdda251d9d498ff456d0623f22ca1f4ef5f02ab03744fc44c64736f6c63430008170033";

// src/formatted/NativeTokenPaymentEnforcer.ts
var NativeTokenPaymentEnforcer_exports = {};
__export(NativeTokenPaymentEnforcer_exports, {
  abi: () => abi73,
  bytecode: () => bytecode73
});
var abi73 = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "contract IDelegationManager"
      },
      {
        "name": "_argsEqualityCheckEnforcer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "argsEqualityCheckEnforcer",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "delegationManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDelegationManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "recipient_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "event",
    "name": "ValidatedPayment",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "recipient",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegator",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode73 = "0x60c060405234801561001057600080fd5b506040516111b73803806111b783398101604081905261002f9161005e565b6001600160a01b039182166080521660a052610098565b6001600160a01b038116811461005b57600080fd5b50565b6000806040838503121561007157600080fd5b825161007c81610046565b602084015190925061008d81610046565b809150509250929050565b60805160a0516110e66100d16000396000818160a301526103c001526000818161011901528181610273015261065a01526110e66000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063b99deb0e1161005b578063b99deb0e146100e2578063d3eddcc514610082578063ea4d3c9b14610114578063ed4633671461013b57600080fd5b8063414c3e3314610082578063a145832a14610082578063a42ff9311461009e575b600080fd5b61009c6100903660046108d5565b50505050505050505050565b005b6100c57f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b6100f56100f03660046109a2565b61014e565b604080516001600160a01b0390931683526020830191909152016100d9565b6100c57f000000000000000000000000000000000000000000000000000000000000000081565b61009c6101493660046108d5565b6101fc565b600080603483146101be5760405162461bcd60e51b815260206004820152602f60248201527f4e6174697665546f6b656e5061796d656e74456e666f726365723a696e76616c60448201526e0d2c85ae8cae4dae65ad8cadccee8d608b1b60648201526084015b60405180910390fd5b6101cc6014600085876109e4565b6101d591610a0e565b60601c91506101e783601481876109e4565b6101f091610a43565b60001c90509250929050565b85600881901b61020d8160006107ac565b6102675760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084016101b5565b50336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146102fb5760405162461bcd60e51b815260206004820152603260248201527f4e6174697665546f6b656e5061796d656e74456e666f726365723a6f6e6c792d6044820152713232b632b3b0ba34b7b716b6b0b730b3b2b960711b60648201526084016101b5565b6000806103088d8d61014e565b9092509050600061031b8b8d018d610c88565b905060008151116103945760405162461bcd60e51b815260206004820152603f60248201527f4e6174697665546f6b656e5061796d656e74456e666f726365723a696e76616c60448201527f69642d616c6c6f77616e63652d64656c65676174696f6e732d6c656e6774680060648201526084016101b5565b6000816000815181106103a9576103a9610dcd565b6020026020010151606001515111801561043057507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316816000815181106103fb576103fb610dcd565b60200260200101516060015160008151811061041957610419610dcd565b6020026020010151600001516001600160a01b0316145b6104a25760405162461bcd60e51b815260206004820152603c60248201527f4e6174697665546f6b656e5061796d656e74456e666f726365723a6d6973736960448201527f6e672d61726773457175616c697479436865636b456e666f726365720000000060648201526084016101b5565b86856040516020016104d092919091825260601b6bffffffffffffffffffffffff1916602082015260340190565b604051602081830303815290604052816000815181106104f2576104f2610dcd565b60200260200101516060015160008151811061051057610510610dcd565b602090810291909101015160409081019190915280516001808252818301909252600091816020015b6060815260200190600190039081610539579050509050816040516020016105619190610e33565b6040516020818303038152906040528160008151811061058357610583610dcd565b6020908102919091010152604080516001808252818301909252600091816020015b60608152602001906001900390816105a55790505090506105d68585604051806020016040528060008152506107c3565b816000815181106105e9576105e9610dcd565b60209081029190910101526040805160018082528183019092526000918160200160208202803683370190505090506106206107f2565b8160008151811061063357610633610dcd565b602090810291909101015260405163cef6d20960e01b81526001600160a01b0380881631917f00000000000000000000000000000000000000000000000000000000000000009091169063cef6d2099061069590879086908890600401610fbf565b600060405180830381600087803b1580156106af57600080fd5b505af11580156106c3573d6000803e3d6000fd5b505050506001600160a01b038716316106dc8783611029565b8110156107435760405162461bcd60e51b815260206004820152602f60248201527f4e6174697665546f6b656e5061796d656e74456e666f726365723a7061796d6560448201526e1b9d0b5b9bdd0b5c9958d95a5d9959608a1b60648201526084016101b5565b604080516001600160a01b038d811682528c81166020830152918101899052908916908d9033907fac266e0d9b66169d0dc4479d531985bcec62dfd9d7992d0f6865afdbb7baa5e29060600160405180910390a450505050505050505050505050505050505050565b6001600160f81b0319828116908216145b92915050565b60608383836040516020016107da9392919061104a565b60405160208183030381529060405290509392505050565b600061080081808080610805565b905090565b604080516001600160f81b03198087166020830152851660218201526000602282018190526001600160e01b03198516602683015269ffffffffffffffffffff198416602a830152910160405160208183030381529060405261086790611089565b95945050505050565b60008083601f84011261088257600080fd5b50813567ffffffffffffffff81111561089a57600080fd5b6020830191508360208285010111156108b257600080fd5b9250929050565b80356001600160a01b03811681146108d057600080fd5b919050565b60008060008060008060008060008060e08b8d0312156108f457600080fd5b8a3567ffffffffffffffff8082111561090c57600080fd5b6109188e838f01610870565b909c509a5060208d013591508082111561093157600080fd5b61093d8e838f01610870565b909a50985060408d0135975060608d013591508082111561095d57600080fd5b5061096a8d828e01610870565b90965094505060808b0135925061098360a08c016108b9565b915061099160c08c016108b9565b90509295989b9194979a5092959850565b600080602083850312156109b557600080fd5b823567ffffffffffffffff8111156109cc57600080fd5b6109d885828601610870565b90969095509350505050565b600080858511156109f457600080fd5b83861115610a0157600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff198135818116916014851015610a3b5780818660140360031b1b83161692505b505092915050565b803560208310156107bd57600019602084900360031b1b1692915050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715610a9a57610a9a610a61565b60405290565b60405160c0810167ffffffffffffffff81118282101715610a9a57610a9a610a61565b604051601f8201601f1916810167ffffffffffffffff81118282101715610aec57610aec610a61565b604052919050565b600067ffffffffffffffff821115610b0e57610b0e610a61565b5060051b60200190565b600082601f830112610b2957600080fd5b813567ffffffffffffffff811115610b4357610b43610a61565b610b56601f8201601f1916602001610ac3565b818152846020838601011115610b6b57600080fd5b816020850160208301376000918101602001919091529392505050565b600082601f830112610b9957600080fd5b81356020610bae610ba983610af4565b610ac3565b82815260059290921b84018101918181019086841115610bcd57600080fd5b8286015b84811015610c7d57803567ffffffffffffffff80821115610bf25760008081fd5b908801906060828b03601f1901811315610c0c5760008081fd5b610c14610a77565b610c1f8885016108b9565b815260408085013584811115610c355760008081fd5b610c438e8b83890101610b18565b838b015250918401359183831115610c5b5760008081fd5b610c698d8a85880101610b18565b908201528652505050918301918301610bd1565b509695505050505050565b60006020808385031215610c9b57600080fd5b823567ffffffffffffffff80821115610cb357600080fd5b818501915085601f830112610cc757600080fd5b8135610cd5610ba982610af4565b81815260059190911b83018401908481019088831115610cf457600080fd5b8585015b83811015610dc057803585811115610d0f57600080fd5b860160c0818c03601f19011215610d265760008081fd5b610d2e610aa0565b610d398983016108b9565b81526040610d488184016108b9565b8a83015260608084013582840152608091508184013589811115610d6c5760008081fd5b610d7a8f8d83880101610b88565b82850152505060a0808401358284015260c0840135915088821115610d9f5760008081fd5b610dad8e8c84870101610b18565b9083015250845250918601918601610cf8565b5098975050505050505050565b634e487b7160e01b600052603260045260246000fd5b60005b83811015610dfe578181015183820152602001610de6565b50506000910152565b60008151808452610e1f816020860160208601610de3565b601f01601f19169290920160200192915050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b82811015610f5857603f19888603018452815160c0860160018060a01b038083511688528089840151168989015260408301516040890152606083015160c060608a015282815180855260e08b01915060e08160051b8c010194508b8301925060005b81811015610f1c5760df198c870301835283518581511687528d81015160608f890152610eed6060890182610e07565b9050604082015191508781036040890152610f088183610e07565b97505050928c0192918c0191600101610ebd565b50505050506080820151608088015260a0820151915086810360a0880152610f448183610e07565b965050509285019290850190600101610e5a565b5092979650505050505050565b60008282518085526020808601955060208260051b8401016020860160005b84811015610fb257601f19868403018952610fa0838351610e07565b98840198925090830190600101610f84565b5090979650505050505050565b606081526000610fd26060830186610f65565b82810360208481019190915285518083528682019282019060005b8181101561100957845183529383019391830191600101610fed565b5050848103604086015261101d8187610f65565b98975050505050505050565b808201808211156107bd57634e487b7160e01b600052601160045260246000fd5b6bffffffffffffffffffffffff198460601b1681528260148201526000825161107a816034850160208701610de3565b91909101603401949350505050565b805160208083015191908110156110aa576000198160200360031b1b821691505b5091905056fea264697066735822122085080b51672c95cef1f0b772853b91117f909ad9d873a40d2cad7c2b29f5117c64736f6c63430008170033";

// src/formatted/NativeTokenPeriodTransferEnforcer.ts
var NativeTokenPeriodTransferEnforcer_exports = {};
__export(NativeTokenPeriodTransferEnforcer_exports, {
  abi: () => abi74,
  bytecode: () => bytecode74
});
var abi74 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAvailableAmount",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "availableAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "isNewPeriod_",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "currentPeriod_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "periodAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "periodDuration_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startDate_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "periodicAllowances",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "periodAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "periodDuration",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startDate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "lastTransferPeriod",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "transferredInCurrentPeriod",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "TransferredInPeriod",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "periodAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "periodDuration",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "startDate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "transferredInCurrentPeriod",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "transferTimestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode74 = "0x608060405234801561001057600080fd5b50610b57806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063a145832a1161005b578063a145832a1461013e578063b99deb0e14610151578063d3eddcc514610082578063ed4633671461008257600080fd5b8063414c3e33146100825780636a9843f61461009e5780637b91dc78146100d1575b600080fd5b61009c610090366004610893565b50505050505050505050565b005b6100b16100ac366004610960565b61017f565b604080519384529115156020840152908201526060015b60405180910390f35b6101166100df3660046109ba565b6000602081815292815260408082209093529081522080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016100c8565b61009c61014c366004610893565b610255565b61016461015f3660046109e4565b61033a565b604080519384526020840192909252908201526060016100c8565b6001600160a01b0383166000908152602081815260408083208784528252808320815160a0810183528154815260018201549381019390935260028101549183018290526003810154606084015260040154608083015282918291156101f4576101e8816103f0565b9350935093505061024b565b6000806000610203898961033a565b92509250925060006040518060a00160405280858152602001848152602001838152602001600081526020016000815250905061023f816103f0565b97509750975050505050505b9450945094915050565b85610261816000610484565b6102b25760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6102c3816000610484565b61031d5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084016102a9565b5061032c8c8c8989898861049b565b505050505050505050505050565b600080806060841461039b5760405162461bcd60e51b81526020600482015260366024820152600080516020610b028339815191526044820152750e474d2dcecc2d8d2c85ae8cae4dae65ad8cadccee8d60531b60648201526084016102a9565b6103a9602060008688610a26565b6103b291610a50565b92506103c2604060208688610a26565b6103cb91610a50565b91506103db606060408688610a26565b6103e491610a50565b60001c90509250925092565b6000806000836040015142101561040f5750600091508190508061047d565b602084015160408501516104239042610a84565b61042d9190610a97565b610438906001610ab9565b905080846060015114159150600082610455578460800151610458565b60005b90508085600001511161046c576000610479565b8451610479908290610a84565b9350505b9193909250565b6001600160f81b0319828116908216145b92915050565b60006104a785856107dd565b505091505060008060006104bb8a8a61033a565b336000908152602081815260408083208c84529091528120600281015494975092955090935090919003610684576000821161054d5760405162461bcd60e51b81526020600482015260396024820152600080516020610b0283398151915260448201527f723a696e76616c69642d7a65726f2d73746172742d646174650000000000000060648201526084016102a9565b600084116105b15760405162461bcd60e51b815260206004820152603c6024820152600080516020610b0283398151915260448201527f723a696e76616c69642d7a65726f2d706572696f642d616d6f756e740000000060648201526084016102a9565b600083116106155760405162461bcd60e51b815260206004820152603e6024820152600080516020610b0283398151915260448201527f723a696e76616c69642d7a65726f2d706572696f642d6475726174696f6e000060648201526084016102a9565b814210156106725760405162461bcd60e51b81526020600482015260366024820152600080516020610b028339815191526044820152751c8e9d1c985b9cd9995c8b5b9bdd0b5cdd185c9d195960521b60648201526084016102a9565b83815560018101839055600281018290555b60008060006106cf846040518060a0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820154815250506103f0565b925092509250828811156107395760405162461bcd60e51b815260206004820152603a6024820152600080516020610b0283398151915260448201527f723a7472616e736665722d616d6f756e742d657863656564656400000000000060648201526084016102a9565b811561074e5760038401819055600060048501555b878460040160008282546107629190610ab9565b909155505060028401546004850154604080518a8152602081018a90529081019290925260608201524260808201528a906001600160a01b038b169033907f22e1bbd8bc0380d336958afc37cd8cb128d6c43891ed276162c30e8df467734d9060a00160405180910390a45050505050505050505050505050565b60008036816107ef6014828789610a26565b6107f891610acc565b60601c935061080b603460148789610a26565b61081491610a50565b92506108238560348189610a26565b949793965094505050565b60008083601f84011261084057600080fd5b50813567ffffffffffffffff81111561085857600080fd5b60208301915083602082850101111561087057600080fd5b9250929050565b80356001600160a01b038116811461088e57600080fd5b919050565b60008060008060008060008060008060e08b8d0312156108b257600080fd5b8a3567ffffffffffffffff808211156108ca57600080fd5b6108d68e838f0161082e565b909c509a5060208d01359150808211156108ef57600080fd5b6108fb8e838f0161082e565b909a50985060408d0135975060608d013591508082111561091b57600080fd5b506109288d828e0161082e565b90965094505060808b0135925061094160a08c01610877565b915061094f60c08c01610877565b90509295989b9194979a5092959850565b6000806000806060858703121561097657600080fd5b8435935061098660208601610877565b9250604085013567ffffffffffffffff8111156109a257600080fd5b6109ae8782880161082e565b95989497509550505050565b600080604083850312156109cd57600080fd5b6109d683610877565b946020939093013593505050565b600080602083850312156109f757600080fd5b823567ffffffffffffffff811115610a0e57600080fd5b610a1a8582860161082e565b90969095509350505050565b60008085851115610a3657600080fd5b83861115610a4357600080fd5b5050820193919092039150565b8035602083101561049557600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561049557610495610a6e565b600082610ab457634e487b7160e01b600052601260045260246000fd5b500490565b8082018082111561049557610495610a6e565b6bffffffffffffffffffffffff198135818116916014851015610af95780818660140360031b1b83161692505b50509291505056fe4e6174697665546f6b656e506572696f645472616e73666572456e666f726365a2646970667358221220ddbfb33bfc3119eae666e9c14c2e492d38eed690114f0ed176d6eb49d0bc21a364736f6c63430008170033";

// src/formatted/NonceManager.ts
var NonceManager_exports = {};
__export(NonceManager_exports, {
  abi: () => abi75,
  bytecode: () => bytecode75
});
var abi75 = [
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "incrementNonce",
    "inputs": [
      {
        "name": "key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "nonceSequenceNumber",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode75 = "0x";

// src/formatted/NonceEnforcer.ts
var NonceEnforcer_exports = {};
__export(NonceEnforcer_exports, {
  abi: () => abi76,
  bytecode: () => bytecode76
});
var abi76 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "currentNonce",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "nonce_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "incrementNonce",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "UsedNonce",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode76 = "0x608060405234801561001057600080fd5b5061050e806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063b99deb0e1161005b578063b99deb0e146100eb578063d3eddcc5146100bc578063ed463367146100bc578063f5743c4c146100fe57600080fd5b80632bd4ed2114610082578063414c3e33146100bc578063a145832a146100d8575b600080fd5b6100aa610090366004610314565b600060208181529281526040808220909352908152205481565b60405190815260200160405180910390f35b6100d66100ca366004610390565b50505050505050505050565b005b6100d66100e6366004610390565b610111565b6100aa6100f936600461045d565b61020f565b6100d661010c36600461049f565b61027d565b85600881901b6101228160006102e1565b6101815760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b50600061018e8c8c61020f565b336000908152602081815260408083206001600160a01b038916845290915290205490915081146102015760405162461bcd60e51b815260206004820152601b60248201527f4e6f6e6365456e666f726365723a696e76616c69642d6e6f6e636500000000006044820152606401610178565b505050505050505050505050565b60006020821461026c5760405162461bcd60e51b815260206004820152602260248201527f4e6f6e6365456e666f726365723a696e76616c69642d7465726d732d6c656e676044820152610e8d60f31b6064820152608401610178565b61027682846104ba565b9392505050565b6001600160a01b038116600081815260208181526040808320338085529083529281902080546001810190915590518181529093917fe02d340254c92bc3ad96f0fceb790db939e11c669c1f4c8a549d248f17130b33910160405180910390a35050565b6001600160f81b0319828116908216145b92915050565b80356001600160a01b038116811461030f57600080fd5b919050565b6000806040838503121561032757600080fd5b610330836102f8565b915061033e602084016102f8565b90509250929050565b60008083601f84011261035957600080fd5b50813567ffffffffffffffff81111561037157600080fd5b60208301915083602082850101111561038957600080fd5b9250929050565b60008060008060008060008060008060e08b8d0312156103af57600080fd5b8a3567ffffffffffffffff808211156103c757600080fd5b6103d38e838f01610347565b909c509a5060208d01359150808211156103ec57600080fd5b6103f88e838f01610347565b909a50985060408d0135975060608d013591508082111561041857600080fd5b506104258d828e01610347565b90965094505060808b0135925061043e60a08c016102f8565b915061044c60c08c016102f8565b90509295989b9194979a5092959850565b6000806020838503121561047057600080fd5b823567ffffffffffffffff81111561048757600080fd5b61049385828601610347565b90969095509350505050565b6000602082840312156104b157600080fd5b610276826102f8565b803560208310156102f257600019602084900360031b1b169291505056fea26469706673582212205626dd2329dbdfa25ba379781a5be6c8fc6ae0eb3a22e9122f5d8207bb7de74564736f6c63430008170033";

// src/formatted/MultiTokenPeriodEnforcer.ts
var MultiTokenPeriodEnforcer_exports = {};
__export(MultiTokenPeriodEnforcer_exports, {
  abi: () => abi77,
  bytecode: () => bytecode77
});
var abi77 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAllTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "tokens_",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "periodAmounts_",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "periodDurations_",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "startDates_",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getAvailableAmount",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_args",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "availableAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "isNewPeriod_",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "currentPeriod_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getHashKey",
    "inputs": [
      {
        "name": "_caller",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_index",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_tokenIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "token_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "periodAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "periodDuration_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startDate_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "periodicAllowances",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "periodAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "periodDuration",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startDate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "lastTransferPeriod",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "transferredInCurrentPeriod",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "TransferredInPeriod",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "token",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "periodAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "periodDuration",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "startDate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "transferredInCurrentPeriod",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "transferTimestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode77 = "0x608060405234801561001057600080fd5b5061148b806100206000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063a145832a11610066578063a145832a1461014b578063d3eddcc5146100c4578063da8081c21461015e578063ed463367146100c4578063f5c7d74e146101c357600080fd5b806319de6ebc14610098578063414c3e33146100c4578063733c0d80146100e05780638572e3191461011d575b600080fd5b6100ab6100a6366004610f6f565b6101e4565b6040516100bb9493929190610fed565b60405180910390f35b6100de6100d2366004611094565b50505050505050505050565b005b6100f36100ee366004611161565b6104b6565b604080516001600160a01b03909516855260208501939093529183015260608201526080016100bb565b61013061012b3660046111ad565b61062a565b604080519384529115156020840152908201526060016100bb565b6100de610159366004611094565b6106fc565b61019b61016c366004611237565b600060208190529081526040902080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016100bb565b6101d66101d1366004611250565b6107de565b6040519081526020016100bb565b6060808080846101f56074826112a8565b15801561020157508015155b6102265760405162461bcd60e51b815260040161021d906112bc565b60405180910390fd5b600061023360748361130d565b90508067ffffffffffffffff81111561024e5761024e611321565b604051908082528060200260200182016040528015610277578160200160208202803683370190505b5095508067ffffffffffffffff81111561029357610293611321565b6040519080825280602002602001820160405280156102bc578160200160208202803683370190505b5094508067ffffffffffffffff8111156102d8576102d8611321565b604051908082528060200260200182016040528015610301578160200160208202803683370190505b5093508067ffffffffffffffff81111561031d5761031d611321565b604051908082528060200260200182016040528015610346578160200160208202803683370190505b50925060005b818110156104aa576000610361826074611337565b905089818a61037182601461134e565b9261037e93929190611361565b6103879161138b565b60601c88838151811061039c5761039c6113c0565b6001600160a01b039092166020928302919091019091015289896103c183601461134e565b906103cd84603461134e565b926103da93929190611361565b6103e3916113d6565b60001c8783815181106103f8576103f86113c0565b6020908102919091010152898961041083603461134e565b9061041c84605461134e565b9261042993929190611361565b610432916113d6565b60001c868381518110610447576104476113c0565b6020908102919091010152898961045f83605461134e565b9061046b84607461134e565b9261047893929190611361565b610481916113d6565b60001c858381518110610496576104966113c0565b60209081029190910101525060010161034c565b50505092959194509250565b60008080808580158015906104d357506104d16074826112a8565b155b6104ef5760405162461bcd60e51b815260040161021d906112bc565b60006104fc60748361130d565b90508087106105505760405162461bcd60e51b815260206004820152602c602482015260008051602061143683398151915260448201526b05ae8ded6cadc5ad2dcc8caf60a31b606482015260840161021d565b600061055d886074611337565b905089818a61056d82601461134e565b9261057a93929190611361565b6105839161138b565b60601c9650898961059583601461134e565b906105a184603461134e565b926105ae93929190611361565b6105b7916113d6565b955089896105c683603461134e565b906105d284605461134e565b926105df93929190611361565b6105e8916113d6565b945089896105f783605461134e565b9061060384607461134e565b9261061093929190611361565b610619916113d6565b60001c935050505093509350935093565b60008060008060008060006106438d8d8d8d8d8d6107f5565b60008481526020818152604091829020825160a081018452815481526001820154928101929092526002810154928201839052600381015460608301526004015460808201529498509296509094509250156106b2576106a28161083c565b97509750975050505050506106f0565b6040805160a0810182528581526020810185905290810183905260006060820181905260808201526106e38161083c565b9850985098505050505050505b96509650969350505050565b856107088160006108d0565b6107545760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d74797065604482015260640161021d565b86600881901b6107658160006108d0565b6107bf5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b606482015260840161021d565b506107d08c8c8c8c8b8b8b8a6108e7565b505050505050505050505050565b60006107ec85858585610e8b565b95945050505050565b60008080808061080786880188611237565b905060006108168a8a846104b6565b91975095509350905061082b8b828e85610e8b565b955050509650965096509692505050565b6000806000836040015142101561085b575060009150819050806108c9565b6020840151604085015161086f90426113f4565b610879919061130d565b61088490600161134e565b9050808460600151141591506000826108a15784608001516108a4565b60005b9050808560000151116108b85760006108c5565b84516108c59082906113f4565b9350505b9193909250565b6001600160f81b0319828116908216145b92915050565b6000806000803660006108fa8a8a610ed5565b935093509350935081819050604403610a0657821561096f5760405162461bcd60e51b8152602060048201526038602482015260008051602061143683398151915260448201527f2d76616c75652d696e2d65726332302d7472616e736665720000000000000000606482015260840161021d565b63a9059cbb60e01b610985600460008486611361565b61098e91611407565b6001600160e01b031916146109e35760405162461bcd60e51b815260206004820152602760248201526000805160206114368339815191526044820152660b5b595d1a1bd960ca1b606482015260840161021d565b92935083926109f6604460248385611361565b6109ff916113d6565b9550610acf565b6000819003610a7f5760008311610a735760405162461bcd60e51b815260206004820152603e602482015260008051602061143683398151915260448201527f2d7a65726f2d76616c75652d696e2d6e61746976652d7472616e736665720000606482015260840161021d565b60009450829550610acf565b60405162461bcd60e51b8152602060048201526031602482015260008051602061143683398151915260448201527005ac6c2d8d85ac8c2e8c25ad8cadccee8d607b1b606482015260840161021d565b5060009250610ae3915050888a018a611237565b9050600080600080610af68f8f876104b6565b9350935093509350836001600160a01b0316866001600160a01b031614610b6f5760405162461bcd60e51b815260206004820152602760248201527f4d756c7469546f6b656e506572696f64456e666f726365723a746f6b656e2d6d6044820152660d2e6dac2e8c6d60cb1b606482015260840161021d565b6000610b7d33888c89610e8b565b60008181526020819052604081206002810154929350919003610d1f5760008311610bf15760405162461bcd60e51b8152602060048201526030602482015260008051602061143683398151915260448201526f2d7a65726f2d73746172742d6461746560801b606482015260840161021d565b60008511610c4b5760405162461bcd60e51b815260206004820152603360248201526000805160206114368339815191526044820152720b5e995c9bcb5c195c9a5bd90b585b5bdd5b9d606a1b606482015260840161021d565b60008411610ca75760405162461bcd60e51b8152602060048201526035602482015260008051602061143683398151915260448201527416bd32b93796b832b934b7b216b23ab930ba34b7b760591b606482015260840161021d565b82421015610d0d5760405162461bcd60e51b815260206004820152602d60248201527f4d756c7469546f6b656e506572696f64456e666f726365723a7472616e73666560448201526c1c8b5b9bdd0b5cdd185c9d1959609a1b606482015260840161021d565b84815560018101849055600281018390555b6000806000610d6a846040518060a00160405290816000820154815260200160018201548152602001600282015481526020016003820154815260200160048201548152505061083c565b925092509250828c1115610dda5760405162461bcd60e51b815260206004820152603160248201527f4d756c7469546f6b656e506572696f64456e666f726365723a7472616e7366656044820152701c8b585b5bdd5b9d0b595e18d959591959607a1b606482015260840161021d565b8115610def5760038401819055600060048501555b8b846004016000828254610e03919061134e565b90915550506004840154604080516001600160a01b038e81168252602082018c90529181018a90526060810189905260808101929092524260a08301528f91908f169033907fb2a345c7f80b4be490c405f4a994faf85384dd05da7d70be0801dc31a8c253af9060c00160405180910390a45050505050505050505050505050505050505050565b604080516001600160a01b03958616602080830191909152949095168582015260608501929092526080808501919091528151808503909101815260a09093019052815191012090565b6000803681610ee76014828789611361565b610ef09161138b565b60601c9350610f03603460148789611361565b610f0c916113d6565b9250610f1b8560348189611361565b949793965094505050565b60008083601f840112610f3857600080fd5b50813567ffffffffffffffff811115610f5057600080fd5b602083019150836020828501011115610f6857600080fd5b9250929050565b60008060208385031215610f8257600080fd5b823567ffffffffffffffff811115610f9957600080fd5b610fa585828601610f26565b90969095509350505050565b60008151808452602080850194506020840160005b83811015610fe257815187529582019590820190600101610fc6565b509495945050505050565b6080808252855190820181905260009060209060a0840190828901845b8281101561102f5781516001600160a01b03168452928401929084019060010161100a565b50505083810360208501526110448188610fb1565b91505082810360408401526110598186610fb1565b9050828103606084015261106d8185610fb1565b979650505050505050565b80356001600160a01b038116811461108f57600080fd5b919050565b60008060008060008060008060008060e08b8d0312156110b357600080fd5b8a3567ffffffffffffffff808211156110cb57600080fd5b6110d78e838f01610f26565b909c509a5060208d01359150808211156110f057600080fd5b6110fc8e838f01610f26565b909a50985060408d0135975060608d013591508082111561111c57600080fd5b506111298d828e01610f26565b90965094505060808b0135925061114260a08c01611078565b915061115060c08c01611078565b90509295989b9194979a5092959850565b60008060006040848603121561117657600080fd5b833567ffffffffffffffff81111561118d57600080fd5b61119986828701610f26565b909790965060209590950135949350505050565b600080600080600080608087890312156111c657600080fd5b863595506111d660208801611078565b9450604087013567ffffffffffffffff808211156111f357600080fd5b6111ff8a838b01610f26565b9096509450606089013591508082111561121857600080fd5b5061122589828a01610f26565b979a9699509497509295939492505050565b60006020828403121561124957600080fd5b5035919050565b6000806000806080858703121561126657600080fd5b61126f85611078565b935061127d60208601611078565b93969395505050506040820135916060013590565b634e487b7160e01b600052601260045260246000fd5b6000826112b7576112b7611292565b500690565b6020808252602d9082015260008051602061143683398151915260408201526c05ae8cae4dae65ad8cadccee8d609b1b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b60008261131c5761131c611292565b500490565b634e487b7160e01b600052604160045260246000fd5b80820281158282048414176108e1576108e16112f7565b808201808211156108e1576108e16112f7565b6000808585111561137157600080fd5b8386111561137e57600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156113b85780818660140360031b1b83161692505b505092915050565b634e487b7160e01b600052603260045260246000fd5b803560208310156108e157600019602084900360031b1b1692915050565b818103818111156108e1576108e16112f7565b6001600160e01b031981358181169160048510156113b85760049490940360031b84901b169092169291505056fe4d756c7469546f6b656e506572696f64456e666f726365723a696e76616c6964a264697066735822122024c53d9970ff849bf9025e90cc5d34bfc99b0f5ee6a61ef6c48512264a9b0a3164736f6c63430008170033";

// src/formatted/NativeBalanceChangeEnforcer.ts
var NativeBalanceChangeEnforcer_exports = {};
__export(NativeBalanceChangeEnforcer_exports, {
  abi: () => abi78,
  bytecode: () => bytecode78
});
var abi78 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceCache",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getHashKey",
    "inputs": [
      {
        "name": "_caller",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "enforceDecrease_",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "recipient_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "isLocked",
    "inputs": [
      {
        "name": "hashKey",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "lock",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode78 = "0x608060405234801561001057600080fd5b50610824806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063b5e544921161005b578063b5e5449214610115578063b99deb0e14610135578063d3eddcc51461016d578063ed463367146100c557600080fd5b806332a16f4e1461008d578063414c3e33146100c5578063a145832a146100e1578063a79a0db5146100f4575b600080fd5b6100b061009b366004610568565b60016020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100df6100d33660046105e6565b50505050505050505050565b005b6100df6100ef3660046105e6565b610180565b6101076101023660046106b3565b6102c6565b6040519081526020016100bc565b610107610123366004610568565b60006020819052908152604090205481565b6101486101433660046106dd565b6102db565b6040805193151584526001600160a01b039092166020840152908201526060016100bc565b6100df61017b3660046105e6565b6103ad565b85600881901b6001600160f81b03198116156101f15760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5060006101fe338661052b565b9050600061020c8d8d6102db565b5060008481526001602052604090205490925060ff161590506102885760405162461bcd60e51b815260206004820152602e60248201527f4e617469766542616c616e63654368616e6765456e666f726365723a656e666f60448201526d1c98d95c8b5a5ccb5b1bd8dad95960921b60648201526084016101e8565b6000918252600160208181526040808520805460ff19169093179092558390529091206001600160a01b039091163190555050505050505050505050565b60006102d2838361052b565b90505b92915050565b60008080603584146103485760405162461bcd60e51b815260206004820152603060248201527f4e617469766542616c616e63654368616e6765456e666f726365723a696e766160448201526f0d8d2c85ae8cae4dae65ad8cadccee8d60831b60648201526084016101e8565b8484600081811061035b5761035b61071f565b909101356001600160f81b0319161515935061037d9050601560018688610735565b6103869161075f565b60601c91506103988460158188610735565b6103a191610794565b60001c90509250925092565b60008060006103bc8d8d6102db565b92509250925060006103ce338861052b565b6000818152600160205260409020805460ff1916905590508315610482576000818152602081905260409020546104069083906107c8565b836001600160a01b031631101561047d5760405162461bcd60e51b815260206004820152603560248201527f4e617469766542616c616e63654368616e6765456e666f726365723a65786365604482015274656465642d62616c616e63652d646563726561736560581b60648201526084016101e8565b61051b565b60008181526020819052604090205461049c9083906107db565b836001600160a01b031631101561051b5760405162461bcd60e51b815260206004820152603960248201527f4e617469766542616c616e63654368616e6765456e666f726365723a696e737560448201527f6666696369656e742d62616c616e63652d696e6372656173650000000000000060648201526084016101e8565b5050505050505050505050505050565b604080516001600160a01b038416602082015290810182905260009060600160405160208183030381529060405280519060200120905092915050565b60006020828403121561057a57600080fd5b5035919050565b60008083601f84011261059357600080fd5b50813567ffffffffffffffff8111156105ab57600080fd5b6020830191508360208285010111156105c357600080fd5b9250929050565b80356001600160a01b03811681146105e157600080fd5b919050565b60008060008060008060008060008060e08b8d03121561060557600080fd5b8a3567ffffffffffffffff8082111561061d57600080fd5b6106298e838f01610581565b909c509a5060208d013591508082111561064257600080fd5b61064e8e838f01610581565b909a50985060408d0135975060608d013591508082111561066e57600080fd5b5061067b8d828e01610581565b90965094505060808b0135925061069460a08c016105ca565b91506106a260c08c016105ca565b90509295989b9194979a5092959850565b600080604083850312156106c657600080fd5b6106cf836105ca565b946020939093013593505050565b600080602083850312156106f057600080fd5b823567ffffffffffffffff81111561070757600080fd5b61071385828601610581565b90969095509350505050565b634e487b7160e01b600052603260045260246000fd5b6000808585111561074557600080fd5b8386111561075257600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff19813581811691601485101561078c5780818660140360031b1b83161692505b505092915050565b803560208310156102d557600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b818103818111156102d5576102d56107b2565b808201808211156102d5576102d56107b256fea2646970667358221220b33a5c188759ed62e28774f4ab95ff422856e7b7a36f7de87da5f14ed435ece964736f6c63430008170033";

// src/formatted/Ownable.ts
var Ownable_exports = {};
__export(Ownable_exports, {
  abi: () => abi79,
  bytecode: () => bytecode79
});
var abi79 = [
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];
var bytecode79 = "0x";

// src/formatted/P256VerifierLib.ts
var P256VerifierLib_exports = {};
__export(P256VerifierLib_exports, {
  abi: () => abi80,
  bytecode: () => bytecode80
});
var abi80 = [];
var bytecode80 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220709bae2a6201f60c7dd916d94e8aed6e76d68870a93207bbf209cbf2ce9581c664736f6c63430008170033";

// src/formatted/IERC721Receiver.ts
var IERC721Receiver_exports = {};
__export(IERC721Receiver_exports, {
  abi: () => abi81,
  bytecode: () => bytecode81
});
var abi81 = [
  {
    "type": "function",
    "name": "onERC721Received",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "nonpayable"
  }
];
var bytecode81 = "0x";

// src/formatted/Initializable.ts
var Initializable_exports = {};
__export(Initializable_exports, {
  abi: () => abi82,
  bytecode: () => bytecode82
});
var abi82 = [
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  }
];
var bytecode82 = "0x";

// src/formatted/Ownable2Step.ts
var Ownable2Step_exports = {};
__export(Ownable2Step_exports, {
  abi: () => abi83,
  bytecode: () => bytecode83
});
var abi83 = [
  {
    "type": "function",
    "name": "acceptOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pendingOwner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "OwnershipTransferStarted",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];
var bytecode83 = "0x";

// src/formatted/IERC7821.ts
var IERC7821_exports = {};
__export(IERC7821_exports, {
  abi: () => abi84,
  bytecode: () => bytecode84
});
var abi84 = [
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "executionData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "supportsExecutionMode",
    "inputs": [
      {
        "name": "mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode84 = "0x";

// src/formatted/Pausable.ts
var Pausable_exports = {};
__export(Pausable_exports, {
  abi: () => abi85,
  bytecode: () => bytecode85
});
var abi85 = [
  {
    "type": "function",
    "name": "paused",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "Paused",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Unpaused",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "EnforcedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExpectedPause",
    "inputs": []
  }
];
var bytecode85 = "0x";

// src/formatted/NativeTokenTransferAmountEnforcer.ts
var NativeTokenTransferAmountEnforcer_exports = {};
__export(NativeTokenTransferAmountEnforcer_exports, {
  abi: () => abi86,
  bytecode: () => bytecode86
});
var abi86 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "allowance_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "spentMap",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "IncreasedSpentMap",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "limit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "spent",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode86 = "0x608060405234801561001057600080fd5b506105cd806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e33146100675780639dd5d9ab14610083578063a145832a146100bd578063b99deb0e146100d0578063d3eddcc514610067578063ed46336714610067575b600080fd5b6100816100753660046103a7565b50505050505050505050565b005b6100ab610091366004610474565b600060208181529281526040808220909352908152205481565b60405190815260200160405180910390f35b6100816100cb3660046103a7565b6100e3565b6100ab6100de36600461049e565b6102c5565b856100ef8160006102da565b6101405760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101518160006102da565b6101ab5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610137565b5060006101b88d8d6102c5565b905060006101c689896102f1565b5050336000908152602081815260408083208c845290915281208054929450909250839183906101f79084906104e0565b92505081905590508281111561026c5760405162461bcd60e51b815260206004820152603460248201527f4e6174697665546f6b656e5472616e73666572416d6f756e74456e666f7263656044820152731c8e985b1b1bddd85b98d94b595e18d95959195960621b6064820152608401610137565b604080518481526020810183905289916001600160a01b0389169133917fc026e493323d526061a052b5dd562495120e2f648797a48be61966d3a6beec8d910160405180910390a4505050505050505050505050505050565b60006102d382840184610501565b9392505050565b6001600160f81b0319828116908216145b92915050565b6000803681610303601482878961051a565b61030c91610544565b60601c935061031f60346014878961051a565b61032891610579565b9250610337856034818961051a565b949793965094505050565b60008083601f84011261035457600080fd5b50813567ffffffffffffffff81111561036c57600080fd5b60208301915083602082850101111561038457600080fd5b9250929050565b80356001600160a01b03811681146103a257600080fd5b919050565b60008060008060008060008060008060e08b8d0312156103c657600080fd5b8a3567ffffffffffffffff808211156103de57600080fd5b6103ea8e838f01610342565b909c509a5060208d013591508082111561040357600080fd5b61040f8e838f01610342565b909a50985060408d0135975060608d013591508082111561042f57600080fd5b5061043c8d828e01610342565b90965094505060808b0135925061045560a08c0161038b565b915061046360c08c0161038b565b90509295989b9194979a5092959850565b6000806040838503121561048757600080fd5b6104908361038b565b946020939093013593505050565b600080602083850312156104b157600080fd5b823567ffffffffffffffff8111156104c857600080fd5b6104d485828601610342565b90969095509350505050565b808201808211156102eb57634e487b7160e01b600052601160045260246000fd5b60006020828403121561051357600080fd5b5035919050565b6000808585111561052a57600080fd5b8386111561053757600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156105715780818660140360031b1b83161692505b505092915050565b803560208310156102eb57600019602084900360031b1b169291505056fea2646970667358221220242bcbb545bdb30c0cc3054c27d7e861e0e03c97037d12e0a3a635b723f4c96064736f6c63430008170033";

// src/formatted/P256SCLVerifierLib.ts
var P256SCLVerifierLib_exports = {};
__export(P256SCLVerifierLib_exports, {
  abi: () => abi87,
  bytecode: () => bytecode87
});
var abi87 = [];
var bytecode87 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220d7aca7990ce9da4d7914667722de1ec02253803fb163d86029328ca9bb504b0164736f6c63430008170033";

// src/formatted/SCL_Wrapper.ts
var SCL_Wrapper_exports = {};
__export(SCL_Wrapper_exports, {
  abi: () => abi88,
  bytecode: () => bytecode88
});
var abi88 = [
  {
    "type": "fallback",
    "stateMutability": "nonpayable"
  }
];
var bytecode88 = "0x608060405234801561001057600080fd5b5061022e806100206000396000f3fe608060405234801561001057600080fd5b50600036606060a0821461004057604080516000602082015201604051602081830303815290604052905061017b565b600061004f6020828587610186565b610058916101b0565b9050600061006a604060208688610186565b610073916101b0565b90506000610085606060408789610186565b61008e916101b0565b905060006100a060806060888a610186565b6100a9916101b0565b905060006100bb60a06080898b610186565b6100c4916101b0565b60405163a1f3128160e01b8152600481018790526024810186905260448101859052606481018490526084810182905290915073__$b8f96b288d4d0429e38b8ed50fd423070f$__9063a1f312819060a401602060405180830381865af4158015610133573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061015791906101cf565b60408051911515602083015201604051602081830303815290604052955050505050505b915050805190602001f35b6000808585111561019657600080fd5b838611156101a357600080fd5b5050820193919092039150565b803560208310156101c957600019602084900360031b1b165b92915050565b6000602082840312156101e157600080fd5b815180151581146101f157600080fd5b939250505056fea26469706673582212203dafaa4c8f34ad767d36775120cdf65742956a98b33a9913f2e11f858baf2d9e64736f6c63430008170033";

// src/formatted/OwnershipTransferEnforcer.ts
var OwnershipTransferEnforcer_exports = {};
__export(OwnershipTransferEnforcer_exports, {
  abi: () => abi89,
  bytecode: () => bytecode89
});
var abi89 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "targetContract_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "event",
    "name": "OwnershipTransferEnforced",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  }
];
var bytecode89 = "0x608060405234801561001057600080fd5b506106af806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a36600461049f565b50505050505050505050565b005b61007661008636600461049f565b6100ba565b61009e61009936600461056c565b6101e7565b6040516001600160a01b03909116815260200160405180910390f35b856100c6816000610252565b6101175760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b610128816000610252565b6101825760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b606482015260840161010e565b5060006101918d8d8a8a610269565b6040516001600160a01b038083168252919250879186169033907f0f026cada0b544ae1cc47ac006f1f4c3d7e94832af22aa0065351de49f9284d79060200160405180910390a450505050505050505050505050565b60006014821461023e5760405162461bcd60e51b815260206004820152602e602482015260008051602061065a83398151915260448201526d0c85ae8cae4dae65ad8cadccee8d60931b606482015260840161010e565b61024882846105ae565b60601c9392505050565b6001600160f81b0319828116908216145b92915050565b60008036600061027986866103e9565b929550935090915050602481146102db5760405162461bcd60e51b8152602060048201526032602482015260008051602061065a8339815191526044820152710c85acaf0cac6eae8d2dedc5ad8cadccee8d60731b606482015260840161010e565b60006102ea60048284866105e3565b6102f39161060d565b90506001600160e01b0319811663f2fde38b60e01b146103545760405162461bcd60e51b8152602060048201526028602482015260008051602061065a833981519152604482015267190b5b595d1a1bd960c21b606482015260840161010e565b60006103608a8a6101e7565b9050846001600160a01b0316816001600160a01b0316146103c45760405162461bcd60e51b815260206004820152602a602482015260008051602061065a833981519152604482015269190b58dbdb9d1c9858dd60b21b606482015260840161010e565b6103d26024600485876105e3565b6103db9161063b565b9a9950505050505050505050565b60008036816103fb60148287896105e3565b610404916105ae565b60601c93506104176034601487896105e3565b6104209161063b565b925061042f85603481896105e3565b949793965094505050565b60008083601f84011261044c57600080fd5b50813567ffffffffffffffff81111561046457600080fd5b60208301915083602082850101111561047c57600080fd5b9250929050565b80356001600160a01b038116811461049a57600080fd5b919050565b60008060008060008060008060008060e08b8d0312156104be57600080fd5b8a3567ffffffffffffffff808211156104d657600080fd5b6104e28e838f0161043a565b909c509a5060208d01359150808211156104fb57600080fd5b6105078e838f0161043a565b909a50985060408d0135975060608d013591508082111561052757600080fd5b506105348d828e0161043a565b90965094505060808b0135925061054d60a08c01610483565b915061055b60c08c01610483565b90509295989b9194979a5092959850565b6000806020838503121561057f57600080fd5b823567ffffffffffffffff81111561059657600080fd5b6105a28582860161043a565b90969095509350505050565b6bffffffffffffffffffffffff1981358181169160148510156105db5780818660140360031b1b83161692505b505092915050565b600080858511156105f357600080fd5b8386111561060057600080fd5b5050820193919092039150565b6001600160e01b031981358181169160048510156105db5760049490940360031b84901b1690921692915050565b8035602083101561026357600019602084900360031b1b169291505056fe4f776e6572736869705472616e73666572456e666f726365723a696e76616c69a2646970667358221220ca5ae6d7f1b90ba5d22d1aa6d07431cba5451fcdcfda2c53ba5014e9bf6c30cc64736f6c63430008170033";

// src/formatted/SafeERC20.ts
var SafeERC20_exports = {};
__export(SafeERC20_exports, {
  abi: () => abi90,
  bytecode: () => bytecode90
});
var abi90 = [
  {
    "type": "error",
    "name": "SafeERC20FailedDecreaseAllowance",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "currentAllowance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "requestedDecrease",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "SafeERC20FailedOperation",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];
var bytecode90 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122088a0aa059cfc49869da70b79266115a887b85b6bf4a5e84a430f64ac0e13ee7c64736f6c63430008170033";

// src/formatted/SenderCreator.ts
var SenderCreator_exports = {};
__export(SenderCreator_exports, {
  abi: () => abi91,
  bytecode: () => bytecode91
});
var abi91 = [
  {
    "type": "function",
    "name": "createSender",
    "inputs": [
      {
        "name": "initCode",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  }
];
var bytecode91 = "0x608060405234801561000f575f80fd5b506101e28061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063570e1a361461002d575b5f80fd5b61004061003b3660046100e4565b61005c565b6040516001600160a01b03909116815260200160405180910390f35b5f8061006b6014828587610150565b61007491610177565b60601c90505f6100878460148188610150565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92018290525084519495509360209350849250905082850182875af190505f519350806100db575f93505b50505092915050565b5f80602083850312156100f5575f80fd5b823567ffffffffffffffff8082111561010c575f80fd5b818501915085601f83011261011f575f80fd5b81358181111561012d575f80fd5b86602082850101111561013e575f80fd5b60209290920196919550909350505050565b5f808585111561015e575f80fd5b8386111561016a575f80fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156101a45780818660140360031b1b83161692505b50509291505056fea264697066735822122078c1aaa9f040f8c523cf2b642dd06415593eec30d2e75021458af7e0c704e6fb64736f6c63430008170033";

// src/formatted/ReentrancyGuard.ts
var ReentrancyGuard_exports = {};
__export(ReentrancyGuard_exports, {
  abi: () => abi92,
  bytecode: () => bytecode92
});
var abi92 = [
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  }
];
var bytecode92 = "0x";

// src/formatted/SafeCast.ts
var SafeCast_exports = {};
__export(SafeCast_exports, {
  abi: () => abi93,
  bytecode: () => bytecode93
});
var abi93 = [
  {
    "type": "error",
    "name": "SafeCastOverflowedIntDowncast",
    "inputs": [
      {
        "name": "bits",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "value",
        "type": "int256",
        "internalType": "int256"
      }
    ]
  },
  {
    "type": "error",
    "name": "SafeCastOverflowedIntToUint",
    "inputs": [
      {
        "name": "value",
        "type": "int256",
        "internalType": "int256"
      }
    ]
  },
  {
    "type": "error",
    "name": "SafeCastOverflowedUintDowncast",
    "inputs": [
      {
        "name": "bits",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "SafeCastOverflowedUintToInt",
    "inputs": [
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  }
];
var bytecode93 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122061ebdeb3510df44a7d9170525bd3fc61f93c656e67274c3f3b4aa33ec92dc13864736f6c63430008170033";

// src/formatted/SignedMath.ts
var SignedMath_exports = {};
__export(SignedMath_exports, {
  abi: () => abi94,
  bytecode: () => bytecode94
});
var abi94 = [];
var bytecode94 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212203d65f4321e18e96a0e0a3e6a8d19e56735de368638fd48b184c923bf46a5170f64736f6c63430008170033";

// src/formatted/ShortStrings.ts
var ShortStrings_exports = {};
__export(ShortStrings_exports, {
  abi: () => abi95,
  bytecode: () => bytecode95
});
var abi95 = [
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  }
];
var bytecode95 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122088910c5f67a05f7b05fc7425f62972b57385080dd0be1e4dea1ea74435bca86f64736f6c63430008170033";

// src/formatted/SimpleFactory.ts
var SimpleFactory_exports = {};
__export(SimpleFactory_exports, {
  abi: () => abi96,
  bytecode: () => bytecode96
});
var abi96 = [
  {
    "type": "function",
    "name": "computeAddress",
    "inputs": [
      {
        "name": "_bytecodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_salt",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "addr_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "deploy",
    "inputs": [
      {
        "name": "_bytecode",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_salt",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "addr_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Deployed",
    "inputs": [
      {
        "name": "addr",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "Create2EmptyBytecode",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Create2FailedDeployment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Create2InsufficientBalance",
    "inputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "SimpleFactoryEmptyContract",
    "inputs": [
      {
        "name": "deployed",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];
var bytecode96 = "0x608060405234801561001057600080fd5b506102ef806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063481286e61461003b5780634af63f021461006a575b600080fd5b61004e6100493660046101cc565b61007d565b6040516001600160a01b03909116815260200160405180910390f35b61004e610078366004610204565b610090565b60006100898284610115565b9392505050565b600061009e60008385610122565b9050806001600160a01b03163b6000036100db576040516301e3495560e61b81526001600160a01b03821660048201526024015b60405180910390fd5b6040516001600160a01b038216907ff40fcec21964ffb566044d083b4073f29f7f7929110ea19e1b3ebe375d89055e90600090a292915050565b60006100898383306101a2565b60008347101561014e5760405163392efb2b60e21b8152476004820152602481018590526044016100d2565b815160000361017057604051631328927760e21b815260040160405180910390fd5b8282516020840186f590506001600160a01b03811661008957604051633a0ba96160e11b815260040160405180910390fd5b6000604051836040820152846020820152828152600b8101905060ff815360559020949350505050565b600080604083850312156101df57600080fd5b50508035926020909101359150565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561021757600080fd5b823567ffffffffffffffff8082111561022f57600080fd5b818501915085601f83011261024357600080fd5b813581811115610255576102556101ee565b604051601f8201601f19908116603f0116810190838211818310171561027d5761027d6101ee565b8160405282815288602084870101111561029657600080fd5b82602086016020830137600060209382018401529896909101359650505050505056fea264697066735822122060b446de0182f6cf23546703f0e9eb0c1da6c4f00138f5d151474f865157cd3164736f6c63430008170033";

// src/formatted/RedeemerEnforcer.ts
var RedeemerEnforcer_exports = {};
__export(RedeemerEnforcer_exports, {
  abi: () => abi97,
  bytecode: () => bytecode97
});
var abi97 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "allowedRedeemers_",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode97 = "0x608060405234801561001057600080fd5b5061064b806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a3660046103ae565b50505050505050505050565b005b6100766100863660046103ae565b6100b4565b61009e61009936600461047b565b6101e8565b6040516100ab91906104bd565b60405180910390f35b85600881901b6100c5816000610332565b6101245760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5060006101318c8c6101e8565b805190915060005b81811015610183578281815181106101535761015361050a565b60200260200101516001600160a01b0316856001600160a01b03160361017b575050506101db565b600101610139565b5060405162461bcd60e51b815260206004820152602660248201527f52656465656d6572456e666f726365723a756e617574686f72697a65642d72656044820152653232b2b6b2b960d11b606482015260840161011b565b5050505050505050505050565b606060008280158015906102045750610202601482610536565b155b61025e5760405162461bcd60e51b815260206004820152602560248201527f52656465656d6572456e666f726365723a696e76616c69642d7465726d732d6c6044820152640cadccee8d60db1b606482015260840161011b565b610269601482610560565b67ffffffffffffffff81111561028157610281610574565b6040519080825280602002602001820160405280156102aa578160200160208202803683370190505b50925060005b81811015610329578581866102c682601461058a565b926102d39392919061059d565b6102dc916105c7565b60601c8484815181106102f1576102f161050a565b6001600160a01b039092166020928302919091019091015282610313816105fc565b9350610322905060148261058a565b90506102b0565b50505092915050565b6001600160f81b0319828116908216145b92915050565b60008083601f84011261035b57600080fd5b50813567ffffffffffffffff81111561037357600080fd5b60208301915083602082850101111561038b57600080fd5b9250929050565b80356001600160a01b03811681146103a957600080fd5b919050565b60008060008060008060008060008060e08b8d0312156103cd57600080fd5b8a3567ffffffffffffffff808211156103e557600080fd5b6103f18e838f01610349565b909c509a5060208d013591508082111561040a57600080fd5b6104168e838f01610349565b909a50985060408d0135975060608d013591508082111561043657600080fd5b506104438d828e01610349565b90965094505060808b0135925061045c60a08c01610392565b915061046a60c08c01610392565b90509295989b9194979a5092959850565b6000806020838503121561048e57600080fd5b823567ffffffffffffffff8111156104a557600080fd5b6104b185828601610349565b90969095509350505050565b6020808252825182820181905260009190848201906040850190845b818110156104fe5783516001600160a01b0316835292840192918401916001016104d9565b50909695505050505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601260045260246000fd5b60008261054557610545610520565b500690565b634e487b7160e01b600052601160045260246000fd5b60008261056f5761056f610520565b500490565b634e487b7160e01b600052604160045260246000fd5b808201808211156103435761034361054a565b600080858511156105ad57600080fd5b838611156105ba57600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156105f45780818660140360031b1b83161692505b505092915050565b60006001820161060e5761060e61054a565b506001019056fea264697066735822122021c89a0ebcdb2523c453552212243b747d81b7c16f2f3e22d20bb9692240f3a364736f6c63430008170033";

// src/formatted/StorageSlot.ts
var StorageSlot_exports = {};
__export(StorageSlot_exports, {
  abi: () => abi98,
  bytecode: () => bytecode98
});
var abi98 = [];
var bytecode98 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212209bac814741dd376ccf59547680acabccb0310545d980db81a1b4c6c7f17cdbc164736f6c63430008170033";

// src/formatted/SpecificActionERC20TransferBatchEnforcer.ts
var SpecificActionERC20TransferBatchEnforcer_exports = {};
__export(SpecificActionERC20TransferBatchEnforcer_exports, {
  abi: () => abi99,
  bytecode: () => bytecode99
});
var abi99 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "termsData_",
        "type": "tuple",
        "internalType": "struct SpecificActionERC20TransferBatchEnforcer.TermsData",
        "components": [
          {
            "name": "tokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "recipient",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "firstTarget",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "firstCalldata",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "usedDelegations",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "used",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "DelegationExecuted",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "delegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  }
];
var bytecode99 = "0x608060405234801561001057600080fd5b50610ccf806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e3314610067578063a145832a14610083578063b99deb0e14610096578063b9cf5249146100bf578063d3eddcc514610067578063ed46336714610067575b600080fd5b610081610075366004610958565b50505050505050505050565b005b610081610091366004610958565b6100fa565b6100a96100a4366004610a25565b6106ce565b6040516100b69190610a67565b60405180910390f35b6100ea6100cd366004610af5565b600060208181529281526040808220909352908152205460ff1681565b60405190151581526020016100b6565b8561010981600160f81b610843565b61015a5760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b61016b816000610843565b6101c55760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610151565b503360009081526020818152604080832088845290915290205460ff1615610245576040805162461bcd60e51b8152602060048201526024810191909152600080516020610c7a83398151915260448201527f456e666f726365723a64656c65676174696f6e2d616c72656164792d757365646064820152608401610151565b336000908152602081815260408083208884529091528120805460ff191660011790553690610274898961085a565b9092509050600281146102dd5760405162461bcd60e51b815260206004820152603b6024820152600080516020610c7a83398151915260448201527f456e666f726365723a696e76616c69642d62617463682d73697a6500000000006064820152608401610151565b60006102e98f8f6106ce565b905080606001516001600160a01b03168383600081811061030c5761030c610b1f565b905060200281019061031e9190610b35565b61032c906020810190610b55565b6001600160a01b031614158061036957508282600081811061035057610350610b1f565b90506020028101906103629190610b35565b6020013515155b806103c757508060800151805190602001208383600081811061038e5761038e610b1f565b90506020028101906103a09190610b35565b6103ae906040810190610b77565b6040516103bc929190610bbe565b604051809103902014155b156104335760405162461bcd60e51b81526020600482015260426024820152600080516020610c7a83398151915260448201527f456e666f726365723a696e76616c69642d66697273742d7472616e736163746960648201526137b760f11b608482015260a401610151565b80516001600160a01b03168383600181811061045157610451610b1f565b90506020028101906104639190610b35565b610471906020810190610b55565b6001600160a01b03161415806104ae57508282600181811061049557610495610b1f565b90506020028101906104a79190610b35565b6020013515155b806104ee5750828260018181106104c7576104c7610b1f565b90506020028101906104d99190610b35565b6104e7906040810190610b77565b9050604414155b80610554575063a9059cbb60e01b8383600181811061050f5761050f610b1f565b90506020028101906105219190610b35565b61052f906040810190610b77565b61053e91600491600091610bce565b61054791610bf8565b6001600160e01b03191614155b806105bf575080602001516001600160a01b03168383600181811061057b5761057b610b1f565b905060200281019061058d9190610b35565b61059b906040810190610b77565b6105aa91602491600491610bce565b6105b391610c28565b6001600160a01b031614155b8061061857508060400151838360018181106105dd576105dd610b1f565b90506020028101906105ef9190610b35565b6105fd906040810190610b77565b61060c91604491602491610bce565b61061591610c28565b14155b156106855760405162461bcd60e51b81526020600482015260436024820152600080516020610c7a83398151915260448201527f456e666f726365723a696e76616c69642d7365636f6e642d7472616e7361637460648201526234b7b760e91b608482015260a401610151565b6040516001600160a01b03881690899033907f76f83a16f9924b51c0c3ad67a44af3e517fbdec68ffa3729776df2ac0f03144090600090a4505050505050505050505050505050565b61071b6040518060a0016040528060006001600160a01b0316815260200160006001600160a01b031681526020016000815260200160006001600160a01b03168152602001606081525090565b605c8210156107805760405162461bcd60e51b815260206004820152603d6024820152600080516020610c7a83398151915260448201527f456e666f726365723a696e76616c69642d7465726d732d6c656e6774680000006064820152608401610151565b61078e601460008486610bce565b61079791610c46565b60601c81526107aa602860148486610bce565b6107b391610c46565b60601c60208201526107c9604860288486610bce565b6107d291610c28565b60408201526107e5605c60488486610bce565b6107ee91610c46565b606090811c9082015261080482605c8186610bce565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250505050608082015292915050565b6001600160f81b0319828116908216145b92915050565b366000833580850160208587010360208201945081359350808460051b8301118360401c17156108925763ba597e7e6000526004601cfd5b83156108e9578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c17156108e05763ba597e7e6000526004601cfd5b5050508261089c575b5050509250929050565b60008083601f84011261090557600080fd5b50813567ffffffffffffffff81111561091d57600080fd5b60208301915083602082850101111561093557600080fd5b9250929050565b80356001600160a01b038116811461095357600080fd5b919050565b60008060008060008060008060008060e08b8d03121561097757600080fd5b8a3567ffffffffffffffff8082111561098f57600080fd5b61099b8e838f016108f3565b909c509a5060208d01359150808211156109b457600080fd5b6109c08e838f016108f3565b909a50985060408d0135975060608d01359150808211156109e057600080fd5b506109ed8d828e016108f3565b90965094505060808b01359250610a0660a08c0161093c565b9150610a1460c08c0161093c565b90509295989b9194979a5092959850565b60008060208385031215610a3857600080fd5b823567ffffffffffffffff811115610a4f57600080fd5b610a5b858286016108f3565b90969095509350505050565b6000602080835260018060a01b038085511660208501528060208601511660408501526040850151606085015280606086015116608085015250608084015160a08085015280518060c086015260005b81811015610ad35782810184015186820160e001528301610ab7565b50600060e0828701015260e0601f19601f830116860101935050505092915050565b60008060408385031215610b0857600080fd5b610b118361093c565b946020939093013593505050565b634e487b7160e01b600052603260045260246000fd5b60008235605e19833603018112610b4b57600080fd5b9190910192915050565b600060208284031215610b6757600080fd5b610b708261093c565b9392505050565b6000808335601e19843603018112610b8e57600080fd5b83018035915067ffffffffffffffff821115610ba957600080fd5b60200191503681900382131561093557600080fd5b8183823760009101908152919050565b60008085851115610bde57600080fd5b83861115610beb57600080fd5b5050820193919092039150565b6001600160e01b03198135818116916004851015610c205780818660040360031b1b83161692505b505092915050565b8035602083101561085457600019602084900360031b1b1692915050565b6bffffffffffffffffffffffff198135818116916014851015610c205760149490940360031b84901b169092169291505056fe5370656369666963416374696f6e45524332305472616e736665724261746368a2646970667358221220e8d1de6d5cca88243b7e7a1d3b3a1ae6b1a75dad78f305486212fafaf9e3ca5264736f6c63430008170033";

// src/formatted/StakeManager.ts
var StakeManager_exports = {};
__export(StakeManager_exports, {
  abi: () => abi100,
  bytecode: () => bytecode100
});
var abi100 = [
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "addStake",
    "inputs": [
      {
        "name": "unstakeDelaySec",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "depositTo",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "deposits",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "deposit",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "staked",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "stake",
        "type": "uint112",
        "internalType": "uint112"
      },
      {
        "name": "unstakeDelaySec",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "withdrawTime",
        "type": "uint48",
        "internalType": "uint48"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDepositInfo",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "info",
        "type": "tuple",
        "internalType": "struct IStakeManager.DepositInfo",
        "components": [
          {
            "name": "deposit",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "staked",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "stake",
            "type": "uint112",
            "internalType": "uint112"
          },
          {
            "name": "unstakeDelaySec",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "withdrawTime",
            "type": "uint48",
            "internalType": "uint48"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "unlockStake",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawStake",
    "inputs": [
      {
        "name": "withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawTo",
    "inputs": [
      {
        "name": "withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Deposited",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalDeposit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeLocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalStaked",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "unstakeDelaySec",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeUnlocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawTime",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeWithdrawn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Withdrawn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
var bytecode100 = "0x";

// src/formatted/Strings.ts
var Strings_exports = {};
__export(Strings_exports, {
  abi: () => abi101,
  bytecode: () => bytecode101
});
var abi101 = [
  {
    "type": "error",
    "name": "StringsInsufficientHexLength",
    "inputs": [
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  }
];
var bytecode101 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220ce1bfc0cd5aac1e748b751339a93cc065f5fd20fd73be10a7844adf26543eb8164736f6c63430008170033";

// src/formatted/WebAuthn.ts
var WebAuthn_exports = {};
__export(WebAuthn_exports, {
  abi: () => abi102,
  bytecode: () => bytecode102
});
var abi102 = [];
var bytecode102 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122089188054053227534294662d666312081d2f72553264bdfc0ce4a353c15e0f6364736f6c63430008170033";

// src/formatted/IERC1822Proxiable.ts
var IERC1822Proxiable_exports = {};
__export(IERC1822Proxiable_exports, {
  abi: () => abi103,
  bytecode: () => bytecode103
});
var abi103 = [
  {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode103 = "0x";

// src/formatted/ValueLteEnforcer.ts
var ValueLteEnforcer_exports = {};
__export(ValueLteEnforcer_exports, {
  abi: () => abi104,
  bytecode: () => bytecode104
});
var abi104 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "value_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode104 = "0x608060405234801561001057600080fd5b506104f8806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a366004610336565b50505050505050505050565b005b610076610086366004610336565b6100b0565b61009e610099366004610403565b6101f8565b60405190815260200160405180910390f35b856100bc816000610269565b61010d5760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b61011e816000610269565b6101785760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610104565b5060006101858888610280565b505091505060006101968e8e6101f8565b9050808211156101e85760405162461bcd60e51b815260206004820152601f60248201527f56616c75654c7465456e666f726365723a76616c75652d746f6f2d68696768006044820152606401610104565b5050505050505050505050505050565b6000602082146102585760405162461bcd60e51b815260206004820152602560248201527f56616c75654c7465456e666f726365723a696e76616c69642d7465726d732d6c6044820152640cadccee8d60db1b6064820152608401610104565b6102628284610445565b9392505050565b6001600160f81b0319828116908216145b92915050565b60008036816102926014828789610463565b61029b9161048d565b60601c93506102ae603460148789610463565b6102b791610445565b92506102c68560348189610463565b949793965094505050565b60008083601f8401126102e357600080fd5b50813567ffffffffffffffff8111156102fb57600080fd5b60208301915083602082850101111561031357600080fd5b9250929050565b80356001600160a01b038116811461033157600080fd5b919050565b60008060008060008060008060008060e08b8d03121561035557600080fd5b8a3567ffffffffffffffff8082111561036d57600080fd5b6103798e838f016102d1565b909c509a5060208d013591508082111561039257600080fd5b61039e8e838f016102d1565b909a50985060408d0135975060608d01359150808211156103be57600080fd5b506103cb8d828e016102d1565b90965094505060808b013592506103e460a08c0161031a565b91506103f260c08c0161031a565b90509295989b9194979a5092959850565b6000806020838503121561041657600080fd5b823567ffffffffffffffff81111561042d57600080fd5b610439858286016102d1565b90969095509350505050565b8035602083101561027a57600019602084900360031b1b1692915050565b6000808585111561047357600080fd5b8386111561048057600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156104ba5780818660140360031b1b83161692505b50509291505056fea26469706673582212201b32f956e1bfeecade9436bbfc83066c0610b5679c49ae7d06d58eaeb4e24ff564736f6c63430008170033";

// src/formatted/UserOperationLib.ts
var UserOperationLib_exports = {};
__export(UserOperationLib_exports, {
  abi: () => abi105,
  bytecode: () => bytecode105
});
var abi105 = [
  {
    "type": "function",
    "name": "PAYMASTER_DATA_OFFSET",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "PAYMASTER_POSTOP_GAS_OFFSET",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "PAYMASTER_VALIDATION_GAS_OFFSET",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode105 = "0x60a7610034600b8282823980515f1a60731461002857634e487b7160e01b5f525f60045260245ffd5b305f52607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106046575f3560e01c806325093e1b14604a578063b29a8ff4146063578063ede3150214606a575b5f80fd5b6051602481565b60405190815260200160405180910390f35b6051601481565b605160348156fea2646970667358221220e3e47e9c438ff94c86dca42d7dcd69637923bbba71e55fc90068fd2fbb4991dc64736f6c63430008170033";

// src/formatted/UUPSUpgradeable.ts
var UUPSUpgradeable_exports = {};
__export(UUPSUpgradeable_exports, {
  abi: () => abi106,
  bytecode: () => bytecode106
});
var abi106 = [
  {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [
      {
        "name": "newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967NonPayable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnsupportedProxiableUUID",
    "inputs": [
      {
        "name": "slot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  }
];
var bytecode106 = "0x";

// src/formatted/TimestampEnforcer.ts
var TimestampEnforcer_exports = {};
__export(TimestampEnforcer_exports, {
  abi: () => abi107,
  bytecode: () => bytecode107
});
var abi107 = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "timestampAfterThreshold_",
        "type": "uint128",
        "internalType": "uint128"
      },
      {
        "name": "timestampBeforeThreshold_",
        "type": "uint128",
        "internalType": "uint128"
      }
    ],
    "stateMutability": "pure"
  }
];
var bytecode107 = "0x608060405234801561001057600080fd5b506104e7806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a36600461033f565b50505050505050505050565b005b61007661008636600461033f565b6100c2565b61009e61009936600461040c565b61023a565b604080516001600160801b0393841681529290911660208301520160405180910390f35b85600881901b6001600160f81b03198116156101335760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b506000806101418d8d61023a565b90925090506001600160801b038216156101b857816001600160801b031642116101b85760405162461bcd60e51b815260206004820152602260248201527f54696d657374616d70456e666f726365723a6561726c792d64656c656761746960448201526137b760f11b606482015260840161012a565b6001600160801b0381161561022b57806001600160801b0316421061022b5760405162461bcd60e51b8152602060048201526024808201527f54696d657374616d70456e666f726365723a657870697265642d64656c6567616044820152633a34b7b760e11b606482015260840161012a565b50505050505050505050505050565b6000806020831461029c5760405162461bcd60e51b815260206004820152602660248201527f54696d657374616d70456e666f726365723a696e76616c69642d7465726d732d6044820152650d8cadccee8d60d31b606482015260840161012a565b6102a9836010818761044e565b6102b291610478565b60801c90506102c560106000858761044e565b6102ce91610478565b60801c91509250929050565b60008083601f8401126102ec57600080fd5b50813567ffffffffffffffff81111561030457600080fd5b60208301915083602082850101111561031c57600080fd5b9250929050565b80356001600160a01b038116811461033a57600080fd5b919050565b60008060008060008060008060008060e08b8d03121561035e57600080fd5b8a3567ffffffffffffffff8082111561037657600080fd5b6103828e838f016102da565b909c509a5060208d013591508082111561039b57600080fd5b6103a78e838f016102da565b909a50985060408d0135975060608d01359150808211156103c757600080fd5b506103d48d828e016102da565b90965094505060808b013592506103ed60a08c01610323565b91506103fb60c08c01610323565b90509295989b9194979a5092959850565b6000806020838503121561041f57600080fd5b823567ffffffffffffffff81111561043657600080fd5b610442858286016102da565b90969095509350505050565b6000808585111561045e57600080fd5b8386111561046b57600080fd5b5050820193919092039150565b6fffffffffffffffffffffffffffffffff1981358181169160108510156104a95780818660100360031b1b83161692505b50509291505056fea2646970667358221220493f1dd46bf21857fc13b6e41e6f29c1c53fbb939ca84fcd1536c7cf1000d18064736f6c63430008170033";

// src/formatted/Proxy.ts
var Proxy_exports = {};
__export(Proxy_exports, {
  abi: () => abi108,
  bytecode: () => bytecode108
});
var abi108 = [
  {
    "type": "fallback",
    "stateMutability": "payable"
  }
];
var bytecode108 = "0x";

// src/formatted/Panic.ts
var Panic_exports = {};
__export(Panic_exports, {
  abi: () => abi109,
  bytecode: () => bytecode109
});
var abi109 = [];
var bytecode109 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122034801a6b4534dfc9cfe9c8b31e018c344c3329b6bf478762f2158ce5781d2b7a64736f6c63430008170033";

// src/formatted/MultiSigDeleGator.ts
var MultiSigDeleGator_exports = {};
__export(MultiSigDeleGator_exports, {
  abi: () => abi110,
  bytecode: () => bytecode110
});
var abi110 = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "contract IDelegationManager"
      },
      {
        "name": "_entryPoint",
        "type": "address",
        "internalType": "contract IEntryPoint"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "DOMAIN_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_NUMBER_OF_SIGNERS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "NAME",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "PACKED_USER_OP_TYPEHASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addDeposit",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "addSigner",
    "inputs": [
      {
        "name": "_newSigner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "delegationManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDelegationManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "disableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "enableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "entryPoint",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IEntryPoint"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_execution",
        "type": "tuple",
        "internalType": "struct Execution",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "executeFromExecutor",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "returnData_",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getDeposit",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDomainHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInitializedVersion",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "_key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationTypedDataHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSigners",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSignersCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getThreshold",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      {
        "name": "_signers",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "_threshold",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isDelegationDisabled",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isSigner",
    "inputs": [
      {
        "name": "_addr",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "_hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "magicValue_",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155BatchReceived",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC721Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "redeemDelegations",
    "inputs": [
      {
        "name": "_permissionContexts",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "_modes",
        "type": "bytes32[]",
        "internalType": "ModeCode[]"
      },
      {
        "name": "_executionCallDatas",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "reinitialize",
    "inputs": [
      {
        "name": "_version",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "_signers",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "_threshold",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_clearSigners",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeSigner",
    "inputs": [
      {
        "name": "_oldSigner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "replaceSigner",
    "inputs": [
      {
        "name": "_oldSigner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_newSigner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "_interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "updateMultiSigParameters",
    "inputs": [
      {
        "name": "_signers",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "_threshold",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_clearSigners",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateThreshold",
    "inputs": [
      {
        "name": "_threshold",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [
      {
        "name": "_newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCallAndRetainStorage",
    "inputs": [
      {
        "name": "_newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "validateUserOp",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_missingAccountFunds",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "validationData_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawDeposit",
    "inputs": [
      {
        "name": "_withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "_withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AddedSigner",
    "inputs": [
      {
        "name": "signer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ClearedStorage",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RemovedSigner",
    "inputs": [
      {
        "name": "signer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ReplacedSigner",
    "inputs": [
      {
        "name": "oldSigner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newSigner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SentPrefund",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "success",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDelegationManager",
    "inputs": [
      {
        "name": "newDelegationManager",
        "type": "address",
        "indexed": true,
        "internalType": "contract IDelegationManager"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetEntryPoint",
    "inputs": [
      {
        "name": "entryPoint",
        "type": "address",
        "indexed": true,
        "internalType": "contract IEntryPoint"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TryExecuteUnsuccessful",
    "inputs": [
      {
        "name": "batchExecutionindex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "result",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UpdatedThreshold",
    "inputs": [
      {
        "name": "threshold",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "AlreadyASigner",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureLength",
    "inputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureS",
    "inputs": [
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967NonPayable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExecutionFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientSigners",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidSignerAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidThreshold",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotASigner",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotDelegationManager",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPoint",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPointOrSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "TooManySigners",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnsupportedProxiableUUID",
    "inputs": [
      {
        "name": "slot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedCallType",
    "inputs": [
      {
        "name": "callType",
        "type": "bytes1",
        "internalType": "CallType"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedExecType",
    "inputs": [
      {
        "name": "execType",
        "type": "bytes1",
        "internalType": "ExecType"
      }
    ]
  }
];
var bytecode110 = "0x6101c0604052306080523480156200001657600080fd5b506040516200492838038062004928833981016040819052620000399162000392565b81816040518060400160405280601181526020017026bab63a34a9b4b3a232b632a3b0ba37b960791b815250604051806040016040528060018152602001603160f81b8152508181620000976000836200021f60201b90919060201c565b61014052620000a88160016200021f565b61016052815160208084019190912061010052815190820120610120524660c052620001386101005161012051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60a05250503060e0526200014b62000258565b6001600160a01b038085166101808190529084166101a0526040517fb2e8eb88b584ae71ef4e854c10847f4d39bd93e52599f147bfb4dcc8de52014d90600090a26040516001600160a01b038416907fee8699dc0e27105da2653bdba54be0edcaadc3e33890a3ad705517ffe9bf0a9990600090a2505050506000620001d66200030c60201b60201c565b600019600282018190556040519081529091507f78c34957a47c9ef62a6f6f2f8720f71e2394a6438100e7e20d139c3cbe774d039060200160405180910390a1505050620005ba565b60006020835110156200023f57620002378362000330565b905062000252565b816200024c848262000478565b5060ff90505b92915050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000900460ff1615620002a95760405163f92ee8a960e01b815260040160405180910390fd5b80546001600160401b0390811614620003095780546001600160401b0319166001600160401b0390811782556040519081527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50565b7fb005e320c74f68de39b3d9025549122b8b117c48474f537aac49c12147b61c0090565b600080829050601f8151111562000367578260405163305a27a960e01b81526004016200035e919062000544565b60405180910390fd5b8051620003748262000595565b179392505050565b6001600160a01b03811681146200030957600080fd5b60008060408385031215620003a657600080fd5b8251620003b3816200037c565b6020840151909250620003c6816200037c565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600181811c90821680620003fc57607f821691505b6020821081036200041d57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111562000473576000816000526020600020601f850160051c810160208610156200044e5750805b601f850160051c820191505b818110156200046f578281556001016200045a565b5050505b505050565b81516001600160401b03811115620004945762000494620003d1565b620004ac81620004a58454620003e7565b8462000423565b602080601f831160018114620004e45760008415620004cb5750858301515b600019600386901b1c1916600185901b1785556200046f565b600085815260208120601f198616915b828110156200051557888601518255948401946001909101908401620004f4565b5085821015620005345787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60006020808352835180602085015260005b81811015620005745785810183015185820160400152820162000556565b506000604082860101526040601f19601f8301168501019250505092915050565b805160208083015191908110156200041d5760001960209190910360031b1b16919050565b60805160a05160c05160e05161010051610120516101405161016051610180516101a051614235620006f3600039600081816106d8015281816109cd01528181610c2d01528181610cb701528181610d3501528181610e9901528181610f4e01528181610fd90152818161115e0152818161124e015281816113010152818161137301528181611523015281816115a20152818161169d0152818161195501528181611a4b01528181611c6101528181611e64015281816120da0152612d0d01526000818161084a01528181610d9801528181610e1b01528181610efc0152818161160501526116e1015260006129970152600061296a015260006122be01526000612296015260006121f10152600061221b0152600061224501526000818161214801528181612171015261267101526142356000f3fe6080604052600436106102815760003560e01c806394cf795e1161014f578063cef6d209116100c1578063e9ae5c531161007a578063e9ae5c5314610825578063ea4d3c9b14610838578063eb12d61e1461086c578063ed8101b51461088c578063f23a6e61146108ac578063ffa1ad74146108cc57600080fd5b8063cef6d2091461075c578063d087d2881461077c578063d691c96414610791578063d7d7442f146107b1578063e3d9109f146107d1578063e75235b8146107f157600080fd5b8063acb8cc4911610113578063acb8cc4914610668578063ad3cb1cc14610695578063b0d691fe146106c6578063b3c65015146106fa578063bc197c8114610727578063c399ec881461074757600080fd5b806394cf795e1461059a578063a0c1deb4146105bc578063a24c8f32146105de578063a3f4df7e146105f1578063aaf10f421461063b57600080fd5b806349934047116101f357806365ee81d8116101ac57806365ee81d8146104b757806378979a80146104d75780637df73e27146104f75780637f07bfdc1461053d57806383ebb7711461055d57806384b0196e1461057257600080fd5b806349934047146104345780634a58db19146104545780634f1ef2861461045c57806352d1902d1461046f5780635c1c6dcd1461048457806360b5bb3f1461049757600080fd5b806319822f7c1161024557806319822f7c1461036b5780632b3afd991461038b5780633e1b0812146103bf5780633ed01015146103df578063445140b8146103ff5780634891161f1461041f57600080fd5b806301ffc9a71461028d57806306394d67146102c25780630e316ab7146102f0578063150b7a02146103125780631626ba7e1461034b57600080fd5b3661028857005b600080fd5b34801561029957600080fd5b506102ad6102a8366004613309565b6108fd565b60405190151581526020015b60405180910390f35b3480156102ce57600080fd5b506102e26102dd36600461334c565b61098d565b6040519081526020016102b9565b3480156102fc57600080fd5b5061031061030b36600461339d565b6109c2565b005b34801561031e57600080fd5b5061033261032d36600461346f565b610be6565b6040516001600160e01b031990911681526020016102b9565b34801561035757600080fd5b50610332610366366004613522565b610c01565b34801561037757600080fd5b506102e261038636600461356d565b610c20565b34801561039757600080fd5b506102e27fbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc1881565b3480156103cb57600080fd5b506102e26103da3660046135ba565b610c90565b3480156103eb57600080fd5b506103106103fa3660046135e3565b610d2a565b34801561040b57600080fd5b506102ad61041a36600461361d565b610e02565b34801561042b57600080fd5b506102e2601e81565b34801561044057600080fd5b5061031061044f3660046135e3565b610e8e565b610310610f31565b61031061046a366004613636565b610f9b565b34801561047b57600080fd5b506102e2610fb1565b610310610492366004613685565b610fce565b3480156104a357600080fd5b506103106104b2366004613703565b61103e565b3480156104c357600080fd5b506103106104d236600461375c565b611153565b3480156104e357600080fd5b506103106104f23660046137ba565b6111bc565b34801561050357600080fd5b506102ad61051236600461339d565b6001600160a01b031660009081526000805160206141c0833981519152602052604090205460ff1690565b34801561054957600080fd5b50610310610558366004613836565b6112f6565b34801561056957600080fd5b506102e26113d3565b34801561057e57600080fd5b506105876113e2565b6040516102b997969594939291906138b2565b3480156105a657600080fd5b506105af611428565b6040516102b9919061394b565b3480156105c857600080fd5b506000805160206141a0833981519152546102e2565b6103106105ec366004613636565b610fa3565b3480156105fd57600080fd5b5061062e6040518060400160405280601181526020017026bab63a34a9b4b3a232b632a3b0ba37b960791b81525081565b6040516102b99190613998565b34801561064757600080fd5b5061065061149b565b6040516001600160a01b0390911681526020016102b9565b34801561067457600080fd5b5061062e604051806040016040528060018152602001603160f81b81525081565b3480156106a157600080fd5b5061062e604051806040016040528060058152602001640352e302e360dc1b81525081565b3480156106d257600080fd5b506106507f000000000000000000000000000000000000000000000000000000000000000081565b34801561070657600080fd5b5061070f6114bc565b6040516001600160401b0390911681526020016102b9565b34801561073357600080fd5b50610332610742366004613a2a565b6114ef565b34801561075357600080fd5b506102e261150b565b34801561076857600080fd5b50610310610777366004613ad7565b611597565b34801561078857600080fd5b506102e261167e565b6107a461079f366004613522565b6116d4565b6040516102b99190613b70565b3480156107bd57600080fd5b506103106107cc36600461361d565b61194a565b3480156107dd57600080fd5b506103106107ec366004613bd4565b611a40565b3480156107fd57600080fd5b507fb005e320c74f68de39b3d9025549122b8b117c48474f537aac49c12147b61c02546102e2565b610310610833366004613522565b611c56565b34801561084457600080fd5b506106507f000000000000000000000000000000000000000000000000000000000000000081565b34801561087857600080fd5b5061031061088736600461339d565b611e59565b34801561089857600080fd5b506102e26108a736600461334c565b611fdf565b3480156108b857600080fd5b506103326108c7366004613c0d565b612121565b3480156108d857600080fd5b5061062e604051806040016040528060058152602001640312e332e360dc1b81525081565b600061090761213d565b6001600160e01b031982166335a4725960e21b148061093657506001600160e01b03198216630a85bd0160e11b145b8061095157506001600160e01b03198216630271189760e51b145b8061096c57506001600160e01b031982166301ffc9a760e01b145b8061098757506001600160e01b03198216630b135d3f60e11b145b92915050565b600061098761099a6121e4565b6109a384611fdf565b60405161190160f01b8152600281019290925260228201526042902090565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906109fb5750333014155b15610a1957604051630796d94560e01b815260040160405180910390fd5b6001600160a01b03811660009081526000805160206141c0833981519152602081905260409091205460ff16610a625760405163da0357f760e01b815260040160405180910390fd5b600181015460028201548103610a8b576040516361774dcf60e11b815260040160405180910390fd5b60005b610a99600183613c8b565b811015610b6357836001600160a01b0316836001018281548110610abf57610abf613c9e565b6000918252602090912001546001600160a01b031603610b5b5782600101600183610aea9190613c8b565b81548110610afa57610afa613c9e565b6000918252602090912001546001840180546001600160a01b039092169183908110610b2857610b28613c9e565b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550610b63565b600101610a8e565b5081600101805480610b7757610b77613cb4565b60008281526020808220830160001990810180546001600160a01b03191690559092019092556001600160a01b038516808352908490526040808320805460ff191690555190917fb0073c14ccc2332b5b461c0d2fb94366f38d3954a82745e74827aa0811c9f98191a2505050565b6000610bf061213d565b50630a85bd0160e11b949350505050565b6000610c0b61213d565b610c1684848461230f565b90505b9392505050565b6000336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610c6b57604051636b31ba1560e11b815260040160405180910390fd5b610c7361213d565b610c8584610c808661098d565b6124ae565b9050610c19826124f6565b604051631aab3f0d60e11b81523060048201526001600160c01b03821660248201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906335567e1a90604401602060405180830381865afa158015610d06573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109879190613cca565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610d635750333014155b15610d8157604051630796d94560e01b815260040160405180910390fd5b604051633ed0101560e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690633ed0101590610dcd908490600401613e12565b600060405180830381600087803b158015610de757600080fd5b505af1158015610dfb573d6000803e3d6000fd5b5050505050565b6040516316a0682960e11b8152600481018290526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632d40d05290602401602060405180830381865afa158015610e6a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109879190613eed565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610ec75750333014155b15610ee557604051630796d94560e01b815260040160405180910390fd5b604051634993404760e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690634993404790610dcd908490600401613e12565b610f3961213d565b60405163b760faf960e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063b760faf99034906024016000604051808303818588803b158015610de757600080fd5b610fa361258e565b610fad828261264b565b5050565b6000610fbb612666565b506000805160206141e083398151915290565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461101757604051636b31ba1560e11b815260040160405180910390fd5b610fad611027602083018361339d565b60208301356110396040850185613f0a565b6126af565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff1615906001600160401b03166000811580156110835750825b90506000826001600160401b0316600114801561109f5750303b155b9050811580156110ad575080155b156110cb5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156110f557845460ff60401b1916600160401b1785555b61110288888860006126e5565b831561114957845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2906020015b60405180910390a15b5050505050505050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480159061118c5750333014155b156111aa57604051630796d94560e01b815260040160405180910390fd5b6111b6848484846126e5565b50505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054869190600160401b900460ff1680611204575080546001600160401b03808416911610155b156112225760405163f92ee8a960e01b815260040160405180910390fd5b805468ffffffffffffffffff19166001600160401b03831617600160401b178155336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480159061127c5750333014155b1561129a57604051630796d94560e01b815260040160405180910390fd5b6112a6868686866126e5565b805460ff60401b191681556040516001600160401b03831681527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a150505050505050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480159061132f5750333014155b1561134d57604051630796d94560e01b815260040160405180910390fd5b60405163040b850f60e31b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063205c287890604401600060405180830381600087803b1580156113b757600080fd5b505af11580156113cb573d6000803e3d6000fd5b505050505050565b60006113dd6121e4565b905090565b6000606080600080600060606113f6612963565b6113fe612990565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b606060006000805160206141c08339815191526001810180546040805160208084028201810190925282815293945083018282801561149057602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611472575b505050505091505090565b60006113dd6000805160206141e0833981519152546001600160a01b031690565b60006113dd7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00546001600160401b031690565b60006114f961213d565b5063bc197c8160e01b95945050505050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a08231906024015b602060405180830381865afa158015611573573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113dd9190613cca565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906115d05750333014155b156115ee57604051630796d94560e01b815260040160405180910390fd5b60405163cef6d20960e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cef6d2099061164490899089908990899089908990600401613fb1565b600060405180830381600087803b15801561165e57600080fd5b505af1158015611672573d6000803e3d6000fd5b50505050505050505050565b604051631aab3f0d60e11b8152306004820152600060248201819052907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906335567e1a90604401611556565b6060336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461171f57604051630692ce8160e21b815260040160405180910390fd5b83600881901b61173382600160f81b6129bd565b156117b95736600061174587876129cf565b90925090506117558360006129bd565b1561176b576117648282612a68565b94506117b2565b61177983600160f81b6129bd565b15611788576117648282612b29565b6040516308c3ee0360e11b81526001600160f81b0319841660048201526024015b60405180910390fd5b5050611941565b6117c48260006129bd565b1561191c576000803660006117d98989612c56565b6040805160018082528183019092529498509296509094509250816020015b60608152602001906001900390816117f8579050509650600061181b86826129bd565b1561184f5761182c858585856126af565b8860008151811061183f5761183f613c9e565b6020026020010181905250611912565b61185d86600160f81b6129bd565b156118ed5761186e85858585612ca7565b8960008151811061188157611881613c9e565b60209081029190910101529050806118e8577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb76000896000815181106118c9576118c9613c9e565b60200260200101516040516118df92919061401a565b60405180910390a15b611912565b6040516308c3ee0360e11b81526001600160f81b0319871660048201526024016117a9565b5050505050611941565b604051632e5bf3f960e21b81526001600160f81b0319831660048201526024016117a9565b50509392505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906119835750333014155b156119a157604051630796d94560e01b815260040160405180910390fd5b806000036119c25760405163aabd5a0960e01b815260040160405180910390fd5b6000805160206141a0833981519152546000805160206141c083398151915290821115611a025760405163aabd5a0960e01b815260040160405180910390fd5b600281018290556040518281527f78c34957a47c9ef62a6f6f2f8720f71e2394a6438100e7e20d139c3cbe774d039060200160405180910390a15050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590611a795750333014155b15611a9757604051630796d94560e01b815260040160405180910390fd5b6001600160a01b0381161580611ab657506001600160a01b0381163b15155b15611ad457604051634501a91960e01b815260040160405180910390fd5b6001600160a01b03821660009081526000805160206141c0833981519152602081905260409091205460ff16611b1d5760405163da0357f760e01b815260040160405180910390fd5b6001600160a01b03821660009081526020829052604090205460ff1615611b5757604051631985f4ab60e31b815260040160405180910390fd5b600181015460005b81811015611bf157846001600160a01b0316836001018281548110611b8657611b86613c9e565b6000918252602090912001546001600160a01b031603611be95783836001018281548110611bb657611bb6613c9e565b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550611bf1565b600101611b5f565b506001600160a01b03808516600081815260208590526040808220805460ff199081169091559387168083528183208054909516600117909455517f53a7b6f060162826746b07f3ff5cc66b83afad3bc9a57c9f34d7802901c6e8299190a350505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611c9f57604051636b31ba1560e11b815260040160405180910390fd5b82600881901b611cb382600160f81b6129bd565b15611d0e57366000611cc586866129cf565b9092509050611cd58360006129bd565b15611cea57611ce48282612a68565b50611d07565b611cf883600160f81b6129bd565b1561178857611ce48282612b29565b5050610dfb565b611d198260006129bd565b1561191c57600080366000611d2e8888612c56565b9350935093509350611d4485600060f81b6129bd565b15611d5b57611d55848484846126af565b50611e50565b611d6985600160f81b6129bd565b15611e2b57604080516001808252818301909252600091816020015b6060815260200190600190039081611d855790505090506000611daa86868686612ca7565b83600081518110611dbd57611dbd613c9e565b6020908102919091010152905080611e24577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb7600083600081518110611e0557611e05613c9e565b6020026020010151604051611e1b92919061401a565b60405180910390a15b5050611e50565b6040516308c3ee0360e11b81526001600160f81b0319861660048201526024016117a9565b50505050610dfb565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590611e925750333014155b15611eb057604051630796d94560e01b815260040160405180910390fd5b6001600160a01b0381161580611ecf57506001600160a01b0381163b15155b15611eed57604051634501a91960e01b815260040160405180910390fd5b6000805160206141a0833981519152546000805160206141c083398151915290601d1901611f2e57604051630dc92ed360e11b815260040160405180910390fd5b6001600160a01b03821660009081526020829052604090205460ff1615611f6857604051631985f4ab60e31b815260040160405180910390fd5b6001818101805480830182556000918252602080832090910180546001600160a01b0319166001600160a01b038716908117909155808352908490526040808320805460ff191690941790935591517f82b74755d483f0688b80354268454667c377a5684e64a4dbb6820fc11a6276d49190a25050565b60007fbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc1861200f602084018461339d565b60208401356120216040860186613f0a565b60405161202f929190614033565b6040519081900390206120456060870187613f0a565b604051612053929190614033565b604051908190039020608087013560a088013560c089013561207860e08b018b613f0a565b604051612086929190614033565b60408051918290038220602083019a909a526001600160a01b03988916908201526060810196909652608086019490945260a085019290925260c084015260e08301526101008201526101208101929092527f00000000000000000000000000000000000000000000000000000000000000001661014082015261016001604051602081830303815290604052805190602001209050919050565b600061212b61213d565b5063f23a6e6160e01b95945050505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614806121c457507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166121b86000805160206141e0833981519152546001600160a01b031690565b6001600160a01b031614155b156121e25760405163703e46dd60e11b815260040160405180910390fd5b565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561223d57507f000000000000000000000000000000000000000000000000000000000000000046145b1561226757507f000000000000000000000000000000000000000000000000000000000000000090565b6113dd604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b7fb005e320c74f68de39b3d9025549122b8b117c48474f537aac49c12147b61c02546000906000805160206141c08339815191529061235090604190614043565b831461236757506001600160e01b03199050610c19565b600061237460418561405a565b600283015490915060008080805b858110156124965760008a8a612399604185614043565b9060416123a786600161407c565b6123b19190614043565b926123be9392919061408f565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092935061240292508e9150839050612cd8565b9350846001600160a01b0316846001600160a01b031611158061243e57506001600160a01b03841660009081526020899052604090205460ff16155b1561245c57506001600160e01b03199750610c199650505050505050565b82612466816140b9565b9350508583106124885750630b135d3f60e11b9750610c199650505050505050565b509192508291600101612382565b506001600160e01b03199a9950505050505050505050565b6000806124c8836124c3610100870187613f0a565b61230f565b90506374eca2c160e11b6001600160e01b03198216016124ec576000915050610987565b5060019392505050565b801561258b57604051600090339060001990849084818181858888f193505050503d8060008114612543576040519150601f19603f3d011682016040523d82523d6000602084013e612548565b606091505b505060408051848152821515602082015291925033917fa427c7d47f24d01b170779a7600b1d4c0d7cdbabaa0f19c4f0e6182053ffc931910160405180910390a2505b50565b6000805160206141a0833981519152546000805160206141c08339815191529060005b81811015612608578260000160008460010183815481106125d4576125d4613c9e565b60009182526020808320909101546001600160a01b031683528201929092526040019020805460ff191690556001016125b1565b506126176001830160006132d7565b6000600283018190556040517feb09d532980c3cc73dcad99b80e264204a667a54cbb7b63ec8d68dcb1c7096be9190a15050565b61265361213d565b61265c82612d02565b610fad8282612d59565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146121e25760405163703e46dd60e11b815260040160405180910390fd5b60405181838237600038838387895af16126cc573d6000823e3d81fd5b3d8152602081013d6000823e3d01604052949350505050565b6000805160206141a08339815191525483906000805160206141c08339815191529060008461271d57612718828561407c565b61271f565b835b905085158061272d57508086115b1561274b5760405163aabd5a0960e01b815260040160405180910390fd5b601e81111561276d57604051630dc92ed360e11b815260040160405180910390fd5b84156128015760005b828110156127f257600084600101828154811061279557612795613c9e565b60009182526020808320909101546001600160a01b0316808352908790526040808320805460ff191690555190925082917fb0073c14ccc2332b5b461c0d2fb94366f38d3954a82745e74827aa0811c9f98191a250600101612776565b506128016001840160006132d7565b60005b8481101561292b57600089898381811061282057612820613c9e565b9050602002016020810190612835919061339d565b6001600160a01b03811660009081526020879052604090205490915060ff161561287257604051631985f4ab60e31b815260040160405180910390fd5b6001600160a01b038116158061289157506001600160a01b0381163b15155b156128af57604051634501a91960e01b815260040160405180910390fd5b6001858101805480830182556000918252602080832090910180546001600160a01b0319166001600160a01b038616908117909155808352908890526040808320805460ff191690941790935591517f82b74755d483f0688b80354268454667c377a5684e64a4dbb6820fc11a6276d49190a250600101612804565b50600283018690556040518681527f78c34957a47c9ef62a6f6f2f8720f71e2394a6438100e7e20d139c3cbe774d0390602001611140565b60606113dd7f00000000000000000000000000000000000000000000000000000000000000006000612e1b565b60606113dd7f00000000000000000000000000000000000000000000000000000000000000006001612e1b565b6001600160f81b031990811691161490565b366000833580850160208587010360208201945081359350808460051b8301118360401c1715612a075763ba597e7e6000526004601cfd5b8315612a5e578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715612a555763ba597e7e6000526004601cfd5b50505082612a11575b5050509250929050565b606081806001600160401b03811115612a8357612a836133ba565b604051908082528060200260200182016040528015612ab657816020015b6060815260200190600190039081612aa15790505b50915060005b81811015612b215736858583818110612ad757612ad7613c9e565b9050602002810190612ae991906140d2565b9050612afb611027602083018361339d565b848381518110612b0d57612b0d613c9e565b602090810291909101015250600101612abc565b505092915050565b606081806001600160401b03811115612b4457612b446133ba565b604051908082528060200260200182016040528015612b7757816020015b6060815260200190600190039081612b625790505b50915060005b81811015612b215736858583818110612b9857612b98613c9e565b9050602002810190612baa91906140d2565b90506000612bd5612bbe602084018461339d565b6020840135612bd06040860186613f0a565b612ca7565b868581518110612be757612be7613c9e565b6020908102919091010152905080612c4c577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb783868581518110612c2d57612c2d613c9e565b6020026020010151604051612c4392919061401a565b60405180910390a15b5050600101612b7d565b6000803681612c68601482878961408f565b612c71916140f2565b60601c9350612c8460346014878961408f565b612c8d91614125565b9250612c9c856034818961408f565b949793965094505050565b604051600090828482376000388483888a5af191503d8152602081013d6000823e3d81016040525094509492505050565b600080600080612ce88686612ec6565b925092509250612cf88282612f13565b5090949350505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590612d3b5750333014155b1561258b57604051630796d94560e01b815260040160405180910390fd5b816001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015612db3575060408051601f3d908101601f19168201909252612db091810190613cca565b60015b612ddb57604051634c9c8ce360e01b81526001600160a01b03831660048201526024016117a9565b6000805160206141e08339815191528114612e0c57604051632a87526960e21b8152600481018290526024016117a9565b612e168383612fcc565b505050565b606060ff8314612e3557612e2e83613022565b9050610987565b818054612e4190614143565b80601f0160208091040260200160405190810160405280929190818152602001828054612e6d90614143565b8015612eba5780601f10612e8f57610100808354040283529160200191612eba565b820191906000526020600020905b815481529060010190602001808311612e9d57829003601f168201915b50505050509050610987565b60008060008351604103612f005760208401516040850151606086015160001a612ef288828585613061565b955095509550505050612f0c565b50508151600091506002905b9250925092565b6000826003811115612f2757612f27614177565b03612f30575050565b6001826003811115612f4457612f44614177565b03612f625760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115612f7657612f76614177565b03612f975760405163fce698f760e01b8152600481018290526024016117a9565b6003826003811115612fab57612fab614177565b03610fad576040516335e2f38360e21b8152600481018290526024016117a9565b612fd582613130565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a280511561301a57612e168282613195565b610fad61320b565b6060600061302f8361322a565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a084111561309c5750600091506003905082613126565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa1580156130f0573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661311c57506000925060019150829050613126565b9250600091508190505b9450945094915050565b806001600160a01b03163b60000361316657604051634c9c8ce360e01b81526001600160a01b03821660048201526024016117a9565b6000805160206141e083398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6060600080846001600160a01b0316846040516131b2919061418d565b600060405180830381855af49150503d80600081146131ed576040519150601f19603f3d011682016040523d82523d6000602084013e6131f2565b606091505b5091509150613202858383613252565b95945050505050565b34156121e25760405163b398979f60e01b815260040160405180910390fd5b600060ff8216601f81111561098757604051632cd44ac360e21b815260040160405180910390fd5b60608261326757613262826132ae565b610c19565b815115801561327e57506001600160a01b0384163b155b156132a757604051639996b31560e01b81526001600160a01b03851660048201526024016117a9565b5080610c19565b8051156132be5780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b508054600082559060005260206000209081019061258b91905b8082111561330557600081556001016132f1565b5090565b60006020828403121561331b57600080fd5b81356001600160e01b031981168114610c1957600080fd5b6000610120828403121561334657600080fd5b50919050565b60006020828403121561335e57600080fd5b81356001600160401b0381111561337457600080fd5b61338084828501613333565b949350505050565b6001600160a01b038116811461258b57600080fd5b6000602082840312156133af57600080fd5b8135610c1981613388565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156133f8576133f86133ba565b604052919050565b600082601f83011261341157600080fd5b81356001600160401b0381111561342a5761342a6133ba565b61343d601f8201601f19166020016133d0565b81815284602083860101111561345257600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000806080858703121561348557600080fd5b843561349081613388565b935060208501356134a081613388565b92506040850135915060608501356001600160401b038111156134c257600080fd5b6134ce87828801613400565b91505092959194509250565b60008083601f8401126134ec57600080fd5b5081356001600160401b0381111561350357600080fd5b60208301915083602082850101111561351b57600080fd5b9250929050565b60008060006040848603121561353757600080fd5b8335925060208401356001600160401b0381111561355457600080fd5b613560868287016134da565b9497909650939450505050565b60008060006060848603121561358257600080fd5b83356001600160401b0381111561359857600080fd5b6135a486828701613333565b9660208601359650604090950135949350505050565b6000602082840312156135cc57600080fd5b81356001600160c01b0381168114610c1957600080fd5b6000602082840312156135f557600080fd5b81356001600160401b0381111561360b57600080fd5b820160c08185031215610c1957600080fd5b60006020828403121561362f57600080fd5b5035919050565b6000806040838503121561364957600080fd5b823561365481613388565b915060208301356001600160401b0381111561366f57600080fd5b61367b85828601613400565b9150509250929050565b60006020828403121561369757600080fd5b81356001600160401b038111156136ad57600080fd5b820160608185031215610c1957600080fd5b60008083601f8401126136d157600080fd5b5081356001600160401b038111156136e857600080fd5b6020830191508360208260051b850101111561351b57600080fd5b60008060006040848603121561371857600080fd5b83356001600160401b0381111561372e57600080fd5b61373a868287016136bf565b909790965060209590950135949350505050565b801515811461258b57600080fd5b6000806000806060858703121561377257600080fd5b84356001600160401b0381111561378857600080fd5b613794878288016136bf565b9095509350506020850135915060408501356137af8161374e565b939692955090935050565b6000806000806000608086880312156137d257600080fd5b85356001600160401b0380821682146137ea57600080fd5b9095506020870135908082111561380057600080fd5b5061380d888289016136bf565b9095509350506040860135915060608601356138288161374e565b809150509295509295909350565b6000806040838503121561384957600080fd5b823561385481613388565b946020939093013593505050565b60005b8381101561387d578181015183820152602001613865565b50506000910152565b6000815180845261389e816020860160208601613862565b601f01601f19169290920160200192915050565b60ff60f81b881681526000602060e060208401526138d360e084018a613886565b83810360408501526138e5818a613886565b606085018990526001600160a01b038816608086015260a0850187905284810360c08601528551808252602080880193509091019060005b818110156139395783518352928401929184019160010161391d565b50909c9b505050505050505050505050565b6020808252825182820181905260009190848201906040850190845b8181101561398c5783516001600160a01b031683529284019291840191600101613967565b50909695505050505050565b602081526000610c196020830184613886565b600082601f8301126139bc57600080fd5b813560206001600160401b038211156139d7576139d76133ba565b8160051b6139e68282016133d0565b9283528481018201928281019087851115613a0057600080fd5b83870192505b84831015613a1f57823582529183019190830190613a06565b979650505050505050565b600080600080600060a08688031215613a4257600080fd5b8535613a4d81613388565b94506020860135613a5d81613388565b935060408601356001600160401b0380821115613a7957600080fd5b613a8589838a016139ab565b94506060880135915080821115613a9b57600080fd5b613aa789838a016139ab565b93506080880135915080821115613abd57600080fd5b50613aca88828901613400565b9150509295509295909350565b60008060008060008060608789031215613af057600080fd5b86356001600160401b0380821115613b0757600080fd5b613b138a838b016136bf565b90985096506020890135915080821115613b2c57600080fd5b613b388a838b016136bf565b90965094506040890135915080821115613b5157600080fd5b50613b5e89828a016136bf565b979a9699509497509295939492505050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b82811015613bc757603f19888603018452613bb5858351613886565b94509285019290850190600101613b99565b5092979650505050505050565b60008060408385031215613be757600080fd5b8235613bf281613388565b91506020830135613c0281613388565b809150509250929050565b600080600080600060a08688031215613c2557600080fd5b8535613c3081613388565b94506020860135613c4081613388565b9350604086013592506060860135915060808601356001600160401b03811115613c6957600080fd5b613aca88828901613400565b634e487b7160e01b600052601160045260246000fd5b8181038181111561098757610987613c75565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b600060208284031215613cdc57600080fd5b5051919050565b6000808335601e19843603018112613cfa57600080fd5b83016020810192503590506001600160401b03811115613d1957600080fd5b80360382131561351b57600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60008383855260208086019550808560051b830101846000805b88811015613e0457858403601f19018a52823536899003605e19018112613d90578283fd5b880160608135613d9f81613388565b6001600160a01b03168652613db682880183613ce3565b8289890152613dc88389018284613d28565b925050506040613dda81840184613ce3565b935087830382890152613dee838583613d28565b9d89019d97505050938601935050600101613d6b565b509198975050505050505050565b6020815260008235613e2381613388565b6001600160a01b0390811660208481019190915284013590613e4482613388565b80821660408501525050604083013560608301526060830135601e19843603018112613e6f57600080fd5b83016020810190356001600160401b03811115613e8b57600080fd5b8060051b3603821315613e9d57600080fd5b60c06080850152613eb260e085018284613d51565b915050608084013560a0840152613ecc60a0850185613ce3565b848303601f190160c0860152613ee3838284613d28565b9695505050505050565b600060208284031215613eff57600080fd5b8151610c198161374e565b6000808335601e19843603018112613f2157600080fd5b8301803591506001600160401b03821115613f3b57600080fd5b60200191503681900382131561351b57600080fd5b6000838385526020808601955060208560051b8301018460005b87811015613fa457848303601f19018952613f858288613ce3565b613f90858284613d28565b9a86019a9450505090830190600101613f6a565b5090979650505050505050565b606081526000613fc560608301888a613f50565b8281036020848101919091528682528791810160005b88811015613ff757833582529282019290820190600101613fdb565b50848103604086015261400b818789613f50565b9b9a5050505050505050505050565b828152604060208201526000610c166040830184613886565b8183823760009101908152919050565b808202811582820484141761098757610987613c75565b60008261407757634e487b7160e01b600052601260045260246000fd5b500490565b8082018082111561098757610987613c75565b6000808585111561409f57600080fd5b838611156140ac57600080fd5b5050820193919092039150565b6000600182016140cb576140cb613c75565b5060010190565b60008235605e198336030181126140e857600080fd5b9190910192915050565b6bffffffffffffffffffffffff198135818116916014851015612b215760149490940360031b84901b1690921692915050565b8035602083101561098757600019602084900360031b1b1692915050565b600181811c9082168061415757607f821691505b60208210810361334657634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052602160045260246000fd5b600082516140e881846020870161386256feb005e320c74f68de39b3d9025549122b8b117c48474f537aac49c12147b61c01b005e320c74f68de39b3d9025549122b8b117c48474f537aac49c12147b61c00360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbca26469706673582212205fc6fdc85503c31560366339056f5ba5c2624d0697f326aa98f14cda48fe6f7164736f6c63430008170033";

// src/formatted/SCL_RIP7212.ts
var SCL_RIP7212_exports = {};
__export(SCL_RIP7212_exports, {
  abi: () => abi111,
  bytecode: () => bytecode111
});
var abi111 = [
  {
    "type": "function",
    "name": "verify",
    "inputs": [
      {
        "name": "message",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "r",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "s",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "qx",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "qy",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
];
var bytecode111 = "0x610c9761003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100355760003560e01c8063a1f312811461003a575b600080fd5b61004d610048366004610bf0565b610061565b604051901515815260200160405180910390f35b600084158061007e5750600080516020610c428339815191528510155b80610087575083155b806100a05750600080516020610c428339815191528410155b156100ad5750600061020a565b6100fe600160601b63ffffffff60c01b03196bfffffffffffffffffffffffd63ffffffff60c01b03197f5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b8686610213565b151560000361010f5750600061020a565b600061011a856102be565b90506000600080516020610c4283398151915282890990506000600080516020610c42833981519152838909905060006040518060c00160405280888152602001878152602001600160601b63ffffffff60c01b031981526020016bfffffffffffffffffffffffd63ffffffff60c01b031981526020017f6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c29681526020017f4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5815250905060006101ea828585610337565b509050600080516020610c428339815191528a8103820815955050505050505b95945050505050565b600082158015610221575081155b8061022c5750858310155b806102375750858210155b156102445750600061020a565b6000868061025457610254610c2b565b83840990506000878061026957610269610c2b565b888061027757610277610c2b565b888709898061028857610288610c2b565b878b8061029757610297610c2b565b898a090908905087806102ac576102ac610c2b565b86820891909114979650505050505050565b600060405160208152602080820152602060408201528260608201527fffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc63254f6080820152600080516020610c4283398151915260a082015260208160c0836005600019fa610330576107fe60405260206040fd5b5192915050565b600080600160ff1b8415801561034b575083155b1561035d576000809250925050610be8565b60008061080060405101604052604088015161082060405101526108206040510151610466565b6000806000808886600209898182098a8188098b82840992508b8c8d8c8d098f098d8e8b8c096003090895508b8b840993508b8a830994508b8c8260028f03098d8889090896508b8c828e03890887099150508a818c8a8509089450505082890392509650965096509692505050565b9086039086828186890908955086818803888588090894506000806000808a898a0993508a89850992508a84880991508a83890990508a84860996508a8b8860028e03098c858e038e8e8f09080893508a8a8c868e038a080994508a8b84880986089250975097509750979350505050565b60a0898101516080808c01516040519182015291820152600160c0820181905260e0909101526104a760608a01518260018060a08e015160808f0151610384565b95509350955095506104d683838789610100604051019081526020810191909152604081019190915260600152565b6104ed8160a08b015160808c015186868a8c6103f4565b955093509550955061051c83838789610180604051019081526020810191909152604081019190915260600152565b61054c60018060208c015160008d0151610200604051019081526020810191909152604081019190915260600152565b6080890151955060a089015194506105728160208b015160008c01516001808a8c6103f4565b95509350955095506105a183838789610280604051019081526020810191909152604081019190915260600152565b6105b88160a08b015160808c015186868a8c6103f4565b95509350955095506105e783838789610300604051019081526020810191909152604081019190915260600152565b6105fe8160a08b015160808c015186868a8c6103f4565b955093509550955061062d83838789610380604051019081526020810191909152604081019190915260600152565b600089015195506020890151945061064e60608a015182600180898b610384565b955093509550955061067d83838789610400604051019081526020810191909152604081019190915260600152565b6106948160a08b015160808c015186868a8c6103f4565b95509350955095506106c383838789610480604051019081526020810191909152604081019190915260600152565b6106da8160a08b015160808c015186868a8c6103f4565b955093509550955061070983838789610500604051019081526020810191909152604081019190915260600152565b6107208160a08b015160808c015186868a8c6103f4565b955093509550955061074f83838789610580604051019081526020810191909152604081019190915260600152565b6104006040510151955061042060405101519450610440604051015191506104606040510151925061078e8160208b015160008c015186868a8c6103f4565b95509350955095506107bd83838789610600604051019081526020810191909152604081019190915260600152565b6107d48160a08b015160808c015186868a8c6103f4565b955093509550955061080383838789610680604051019081526020810191909152604081019190915260600152565b61081a8160a08b015160808c015186868a8c6103f4565b955093509550955061084983838789610700604051019081526020810191909152604081019190915260600152565b6108608160a08b015160808c015186868a8c6103f4565b95509350955095505061089082828688610780604051019081526020810191909152604081019190915260600152565b600091505b816108d5578286161560010360031b8360011c87161560010360021b018388161560010360011b8460011c891615600103010191508260021c9250610895565b506040805160079290921b82018051602082015192820151606090920151610820850151919750929550919290915b8415610b7d5780866002098181820982818a09838284099250838487880960608f015109848186878e8f09600309089050848885099750848784099650600285039a508485838d0986838409089a5084858387038d088209925050508281848a850908830397508291508790506002098181820982818a09838284099250838487880960608f015109848186878e8f09600309089050848885099750848784099650600285039a508485838d0986838409089a5084858387038d088209925050508281848a850908975050508488161560010360031b8560011c89161560010360021b01858a161560010360011b8660011c8b1615600103010180610a0d575094850394610b72565b60071b828101805160609091015161086085015284610a48579083016020810151604082015160609092015192995097509094509250610b72565b82836108608601518a09848885602001880151090861084085015290830160400151908280838b0984038487840908610840850151610b005780610b005783896002860309925083838409905083818b09610840860152838184099250838487880960608f0151099150838285868d8e09600309089150838784099650838682099550838461084087015160028703098584850908995083848b8603610840880151088309905083848a850982089850505050610b72565b83818209915083818309905083838584890909955083838b0992508361086086015185838a09099650838485846002880309850985838703876108408a01516108408b01510908089950838284099150838482866108608901518d090985610840880151878e89038708090898505050505b8460021c9450610904565b61088060408190526108e085905260208082526108a08190526108c08190526001198301610900526109208390529092508260c0816005600019fa610bc8576107ff60405260206040fd5b808251870995508082518409925080838409925080838809965050505050505b935093915050565b600080600080600060a08688031215610c0857600080fd5b505083359560208501359550604085013594606081013594506080013592509050565b634e487b7160e01b600052601260045260246000fdfeffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551a26469706673582212202032a0a92437c4c7498b5f3dbbeea2851a22a8974a563aed836730aa07e1cdda64736f6c63430008170033";
















































































































exports.Address = Address_exports; exports.AllowedCalldataEnforcer = AllowedCalldataEnforcer_exports; exports.AllowedMethodsEnforcer = AllowedMethodsEnforcer_exports; exports.AllowedTargetsEnforcer = AllowedTargetsEnforcer_exports; exports.ArgsEqualityCheckEnforcer = ArgsEqualityCheckEnforcer_exports; exports.Base64 = Base64_exports; exports.Base64URL = Base64URL_exports; exports.BitMaps = BitMaps_exports; exports.BlockNumberEnforcer = BlockNumberEnforcer_exports; exports.CaveatEnforcer = CaveatEnforcer_exports; exports.Context = Context_exports; exports.Create2 = Create2_exports; exports.DeleGatorCore = DeleGatorCore_exports; exports.DelegationManager = DelegationManager_exports; exports.DelegationMetaSwapAdapter = DelegationMetaSwapAdapter_exports; exports.DeployedEnforcer = DeployedEnforcer_exports; exports.ECDSA = ECDSA_exports; exports.EIP712 = EIP712_exports; exports.EIP7702DeleGatorCore = EIP7702DeleGatorCore_exports; exports.EIP7702StatelessDeleGator = EIP7702StatelessDeleGator_exports; exports.ERC1155BalanceChangeEnforcer = ERC1155BalanceChangeEnforcer_exports; exports.ERC1271Lib = ERC1271Lib_exports; exports.ERC165 = ERC165_exports; exports.ERC1967Proxy = ERC1967Proxy_exports; exports.ERC1967Utils = ERC1967Utils_exports; exports.ERC20BalanceChangeEnforcer = ERC20BalanceChangeEnforcer_exports; exports.ERC20PeriodTransferEnforcer = ERC20PeriodTransferEnforcer_exports; exports.ERC20StreamingEnforcer = ERC20StreamingEnforcer_exports; exports.ERC20TransferAmountEnforcer = ERC20TransferAmountEnforcer_exports; exports.ERC721BalanceChangeEnforcer = ERC721BalanceChangeEnforcer_exports; exports.ERC721TransferEnforcer = ERC721TransferEnforcer_exports; exports.EncoderLib = EncoderLib_exports; exports.EntryPoint = EntryPoint_exports; exports.ExactCalldataBatchEnforcer = ExactCalldataBatchEnforcer_exports; exports.ExactCalldataEnforcer = ExactCalldataEnforcer_exports; exports.ExactExecutionBatchEnforcer = ExactExecutionBatchEnforcer_exports; exports.ExactExecutionEnforcer = ExactExecutionEnforcer_exports; exports.Exec = Exec_exports; exports.ExecutionHelper = ExecutionHelper_exports; exports.ExecutionLib = ExecutionLib_exports; exports.HybridDeleGator = HybridDeleGator_exports; exports.IAccount = IAccount_exports; exports.IAccountExecute = IAccountExecute_exports; exports.IAggregator = IAggregator_exports; exports.IBeacon = IBeacon_exports; exports.ICaveatEnforcer = ICaveatEnforcer_exports; exports.IDeleGatorCore = IDeleGatorCore_exports; exports.IDelegationManager = IDelegationManager_exports; exports.IERC1155 = IERC1155_exports; exports.IERC1155Receiver = IERC1155Receiver_exports; exports.IERC1271 = IERC1271_exports; exports.IERC1363 = IERC1363_exports; exports.IERC165 = IERC165_exports; exports.IERC173 = IERC173_exports; exports.IERC1822Proxiable = IERC1822Proxiable_exports; exports.IERC20 = IERC20_exports; exports.IERC5267 = IERC5267_exports; exports.IERC721 = IERC721_exports; exports.IERC721Receiver = IERC721Receiver_exports; exports.IERC7579Account = IERC7579Account_exports; exports.IERC7821 = IERC7821_exports; exports.IEntryPoint = IEntryPoint_exports; exports.IMetaSwap = IMetaSwap_exports; exports.INonceManager = INonceManager_exports; exports.IPaymaster = IPaymaster_exports; exports.IStakeManager = IStakeManager_exports; exports.IdEnforcer = IdEnforcer_exports; exports.Initializable = Initializable_exports; exports.LimitedCallsEnforcer = LimitedCallsEnforcer_exports; exports.LogicalOrWrapperEnforcer = LogicalOrWrapperEnforcer_exports; exports.Math = Math_exports; exports.MessageHashUtils = MessageHashUtils_exports; exports.MockCaveatEnforcer = MockCaveatEnforcer_exports; exports.MockFailureCaveatEnforcer = MockFailureCaveatEnforcer_exports; exports.ModeLib = ModeLib_exports; exports.MultiSigDeleGator = MultiSigDeleGator_exports; exports.MultiTokenPeriodEnforcer = MultiTokenPeriodEnforcer_exports; exports.NativeBalanceChangeEnforcer = NativeBalanceChangeEnforcer_exports; exports.NativeTokenPaymentEnforcer = NativeTokenPaymentEnforcer_exports; exports.NativeTokenPeriodTransferEnforcer = NativeTokenPeriodTransferEnforcer_exports; exports.NativeTokenStreamingEnforcer = NativeTokenStreamingEnforcer_exports; exports.NativeTokenTransferAmountEnforcer = NativeTokenTransferAmountEnforcer_exports; exports.NonceEnforcer = NonceEnforcer_exports; exports.NonceManager = NonceManager_exports; exports.Ownable = Ownable_exports; exports.Ownable2Step = Ownable2Step_exports; exports.OwnershipTransferEnforcer = OwnershipTransferEnforcer_exports; exports.P256SCLVerifierLib = P256SCLVerifierLib_exports; exports.P256VerifierLib = P256VerifierLib_exports; exports.Panic = Panic_exports; exports.Pausable = Pausable_exports; exports.Proxy = Proxy_exports; exports.RedeemerEnforcer = RedeemerEnforcer_exports; exports.ReentrancyGuard = ReentrancyGuard_exports; exports.SCL_RIP7212 = SCL_RIP7212_exports; exports.SCL_Wrapper = SCL_Wrapper_exports; exports.SafeCast = SafeCast_exports; exports.SafeERC20 = SafeERC20_exports; exports.SenderCreator = SenderCreator_exports; exports.ShortStrings = ShortStrings_exports; exports.SignedMath = SignedMath_exports; exports.SimpleFactory = SimpleFactory_exports; exports.SpecificActionERC20TransferBatchEnforcer = SpecificActionERC20TransferBatchEnforcer_exports; exports.StakeManager = StakeManager_exports; exports.StorageSlot = StorageSlot_exports; exports.Strings = Strings_exports; exports.TimestampEnforcer = TimestampEnforcer_exports; exports.UUPSUpgradeable = UUPSUpgradeable_exports; exports.UserOperationLib = UserOperationLib_exports; exports.ValueLteEnforcer = ValueLteEnforcer_exports; exports.WebAuthn = WebAuthn_exports;
//# sourceMappingURL=index.js.map