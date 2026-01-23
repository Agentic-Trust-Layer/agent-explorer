import { decodeMessage, encodeMessage, enumeration, message } from 'protons-runtime';
export var IpnsEntry;
(function (IpnsEntry) {
    let ValidityType;
    (function (ValidityType) {
        ValidityType["EOL"] = "EOL";
    })(ValidityType = IpnsEntry.ValidityType || (IpnsEntry.ValidityType = {}));
    let __ValidityTypeValues;
    (function (__ValidityTypeValues) {
        __ValidityTypeValues[__ValidityTypeValues["EOL"] = 0] = "EOL";
    })(__ValidityTypeValues || (__ValidityTypeValues = {}));
    (function (ValidityType) {
        ValidityType.codec = () => {
            return enumeration(__ValidityTypeValues);
        };
    })(ValidityType = IpnsEntry.ValidityType || (IpnsEntry.ValidityType = {}));
    let _codec;
    IpnsEntry.codec = () => {
        if (_codec == null) {
            _codec = message((obj, w, opts = {}) => {
                if (opts.lengthDelimited !== false) {
                    w.fork();
                }
                if (obj.value != null) {
                    w.uint32(10);
                    w.bytes(obj.value);
                }
                if (obj.signatureV1 != null) {
                    w.uint32(18);
                    w.bytes(obj.signatureV1);
                }
                if (obj.validityType != null) {
                    w.uint32(24);
                    IpnsEntry.ValidityType.codec().encode(obj.validityType, w);
                }
                if (obj.validity != null) {
                    w.uint32(34);
                    w.bytes(obj.validity);
                }
                if (obj.sequence != null) {
                    w.uint32(40);
                    w.uint64(obj.sequence);
                }
                if (obj.ttl != null) {
                    w.uint32(48);
                    w.uint64(obj.ttl);
                }
                if (obj.pubKey != null) {
                    w.uint32(58);
                    w.bytes(obj.pubKey);
                }
                if (obj.signatureV2 != null) {
                    w.uint32(66);
                    w.bytes(obj.signatureV2);
                }
                if (obj.data != null) {
                    w.uint32(74);
                    w.bytes(obj.data);
                }
                if (opts.lengthDelimited !== false) {
                    w.ldelim();
                }
            }, (reader, length, opts = {}) => {
                const obj = {};
                const end = length == null ? reader.len : reader.pos + length;
                while (reader.pos < end) {
                    const tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1: {
                            obj.value = reader.bytes();
                            break;
                        }
                        case 2: {
                            obj.signatureV1 = reader.bytes();
                            break;
                        }
                        case 3: {
                            obj.validityType = IpnsEntry.ValidityType.codec().decode(reader);
                            break;
                        }
                        case 4: {
                            obj.validity = reader.bytes();
                            break;
                        }
                        case 5: {
                            obj.sequence = reader.uint64();
                            break;
                        }
                        case 6: {
                            obj.ttl = reader.uint64();
                            break;
                        }
                        case 7: {
                            obj.pubKey = reader.bytes();
                            break;
                        }
                        case 8: {
                            obj.signatureV2 = reader.bytes();
                            break;
                        }
                        case 9: {
                            obj.data = reader.bytes();
                            break;
                        }
                        default: {
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                }
                return obj;
            });
        }
        return _codec;
    };
    IpnsEntry.encode = (obj) => {
        return encodeMessage(obj, IpnsEntry.codec());
    };
    IpnsEntry.decode = (buf, opts) => {
        return decodeMessage(buf, IpnsEntry.codec(), opts);
    };
})(IpnsEntry || (IpnsEntry = {}));
//# sourceMappingURL=ipns.js.map