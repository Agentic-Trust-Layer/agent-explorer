import { getBytes, Transaction } from 'ethers';
import * as u8a from 'uint8arrays';
/**
 * This base abstract class should be extended to provide cryptographic functions to other Veramo plugins.
 *
 * @public
 */
export class AbstractKeyManagementSystem {
    /**@deprecated please use `sign({key, alg: 'eth_signTransaction', data: arrayify(serialize(transaction))})` instead */
    async signEthTX({ key, transaction }) {
        const { v, r, s, from, ...tx } = transaction;
        const serializedTx = Transaction.from(tx).unsignedSerialized;
        const data = getBytes(serializedTx);
        const algorithm = 'eth_signTransaction';
        const signedTxHexString = this.sign({ keyRef: key, data, algorithm });
        return signedTxHexString;
    }
    /**@deprecated please use `sign({key, data})` instead, with `Uint8Array` data */
    async signJWT({ key, data }) {
        let dataBytes;
        if (typeof data === 'string') {
            try {
                // TODO: Make sure this works as we removed the options from arrayify
                if (data && data.substring(0, 2) !== "0x") {
                    data = "0x" + data;
                }
                dataBytes = getBytes(data);
            }
            catch (e) {
                dataBytes = u8a.fromString(data, 'utf-8');
            }
        }
        else {
            dataBytes = data;
        }
        return this.sign({ keyRef: key, data: dataBytes });
    }
}
//# sourceMappingURL=abstract-key-management-system.js.map