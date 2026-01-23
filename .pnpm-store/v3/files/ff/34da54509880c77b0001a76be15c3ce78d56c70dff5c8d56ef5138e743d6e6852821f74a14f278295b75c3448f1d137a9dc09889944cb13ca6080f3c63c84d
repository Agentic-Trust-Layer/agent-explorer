import { CredentialJwtOrJSON, Status, StatusMethod, StatusResolver } from '../index'

import { DIDDocument } from 'did-resolver'
import { ES256KSigner, createJWT, hexToBytes } from 'did-jwt'

const privateKey = 'a285ab66393c5fdda46d6fbad9e27fafd438254ab72ad5acb681a0e9f20f5d7b'
const signerAddress = '0x2036c6cd85692f0fb2c26e6c6b2eced9e4478dfd'
const issuer = `did:ethr:${signerAddress}`
const signer = ES256KSigner(hexToBytes(privateKey))

const referenceDoc = {
  '@context': 'https://w3id.org/did/v1',
  id: issuer,
  publicKey: [
    {
      id: `${issuer}#owner`,
      type: 'Secp256k1VerificationKey2018',
      ethereumAddress: signerAddress,
    },
  ],
} as DIDDocument

describe('credential-status', () => {
  describe('API', () => {
    it('should be able to instantiate Status', () => {
      expect(new Status()).not.toBeNull()
    })

    it('should be able to call checkStatus', () => {
      const checker = new Status()
      expect(typeof checker.checkStatus).toEqual('function')
    })

    it('should pass through credential with no status requirement', async () => {
      expect.assertions(1)
      const token = await createJWT({}, { issuer, signer })
      const checker = new Status()
      const statusEntry = await checker.checkStatus(token, referenceDoc)
      expect(statusEntry).toEqual({
        revoked: false,
        message: 'credentialStatus property was not set on the original credential',
      })
    })

    it('sample StatusResolver with easy registration', async () => {
      class CustomStatusChecker implements StatusResolver {
        checkStatus: StatusMethod = async (credential: CredentialJwtOrJSON, doc: DIDDocument) => {
          return { revoked: false }
        }
        asStatusMethod = { CustomStatusChecker: this.checkStatus }
      }

      const checker = new Status({
        ...new CustomStatusChecker().asStatusMethod,
      })

      const token = await createJWT(
        { credentialStatus: { type: 'CustomStatusChecker', id: 'something something' } },
        { issuer, signer },
      )
      const statusEntry = await checker.checkStatus(token, referenceDoc)
      expect(statusEntry).toStrictEqual({ revoked: false })
    })
  })

  describe('with unknown status method', () => {
    it('in legacy JWT payload', async () => {
      expect.assertions(1)
      const checker = new Status()
      const token = await createJWT(
        { credentialStatus: { type: 'UnknownMethod', id: 'something something' } },
        { issuer, signer },
      )
      await expect(checker.checkStatus(token, referenceDoc)).rejects.toThrow(
        /unknown_method: credentialStatus method UnknownMethod unknown. Validity can not be determined./,
      )
    })

    it('in JWT.vc payload', async () => {
      expect.assertions(1)
      const checker = new Status()
      const token = await createJWT(
        { vc: { credentialStatus: { type: 'UnknownMethod', id: 'something something' } } },
        { issuer, signer },
      )
      await expect(checker.checkStatus(token, referenceDoc)).rejects.toThrow(
        /unknown_method: credentialStatus method UnknownMethod unknown. Validity can not be determined./,
      )
    })

    it('in JWT.vp payload', async () => {
      expect.assertions(1)
      const checker = new Status()
      const token = await createJWT(
        { vp: { credentialStatus: { type: 'UnknownMethod', id: 'something something' } } },
        { issuer, signer },
      )
      await expect(checker.checkStatus(token, referenceDoc)).rejects.toThrow(
        /unknown_method: credentialStatus method UnknownMethod unknown. Validity can not be determined./,
      )
    })

    it('in plain JSON credential', async () => {
      expect.assertions(1)
      const checker = new Status()
      await expect(
        checker.checkStatus(
          {
            credentialStatus: {
              type: 'UnknownMethod',
              id: 'something something',
            },
          },
          referenceDoc,
        ),
      ).rejects.toThrow(
        /unknown_method: credentialStatus method UnknownMethod unknown. Validity can not be determined./,
      )
    })

    it('in serialized JSON credential', async () => {
      expect.assertions(1)
      const checker = new Status()
      await expect(
        checker.checkStatus(
          JSON.stringify({
            credentialStatus: {
              type: 'UnknownMethod',
              id: 'something something',
            },
          }),
          referenceDoc,
        ),
      ).rejects.toThrow(
        /unknown_method: credentialStatus method UnknownMethod unknown. Validity can not be determined./,
      )
    })
  })

  describe('with malformed input', () => {
    it('should reject credentialStatus entry with bad type', async () => {
      expect.assertions(2)
      const checker = new Status()

      await expect(
        checker.checkStatus(
          {
            credentialStatus: true,
          } as any,
          referenceDoc,
        ),
      ).rejects.toThrow(
        /bad_request: credentialStatus entry is not formatted correctly. Validity can not be determined./,
      )

      await expect(
        checker.checkStatus(
          {
            credentialStatus: 'this is not revoked, believe me',
          } as any,
          referenceDoc,
        ),
      ).rejects.toThrow(
        /bad_request: credentialStatus entry is not formatted correctly. Validity can not be determined./,
      )
    })

    it('should reject malformed credentialStatus entry', async () => {
      expect.assertions(1)
      const checker = new Status()
      await expect(
        checker.checkStatus(
          {
            credentialStatus: {
              revoked: false,
              message: 'believe me',
            },
          } as any,
          referenceDoc,
        ),
      ).rejects.toThrow(
        /bad_request: credentialStatus entry is not formatted correctly. Validity can not be determined./,
      )
    })

    it('should reject credentialStatus entry with no type', async () => {
      expect.assertions(1)
      const checker = new Status()
      await expect(
        checker.checkStatus(
          {
            credentialStatus: {
              notMyType: 'foo',
              id: 'bar',
            },
          } as any,
          referenceDoc,
        ),
      ).rejects.toThrow(
        /bad_request: credentialStatus entry is not formatted correctly. Validity can not be determined./,
      )
    })
  })

  describe('with known status method', () => {
    it('for legacy JWT.payload.credentialStatus', async () => {
      const checkStatus: StatusMethod = async () => {
        return { revoked: false, 'custom method works': true }
      }
      const checker = new Status({ CustomStatusChecker: checkStatus })
      const token = await createJWT(
        { credentialStatus: { type: 'CustomStatusChecker', id: 'something something' } },
        { issuer, signer },
      )
      const statusEntry = await checker.checkStatus(token, referenceDoc)
      expect(statusEntry).toStrictEqual({ revoked: false, 'custom method works': true })
    })

    it('for JWT.payload.vc.credentialStatus', async () => {
      const checkStatus: StatusMethod = async () => {
        return { revoked: false, 'custom method works': true }
      }
      const checker = new Status({ CustomStatusChecker: checkStatus })
      const token = await createJWT(
        { vc: { credentialStatus: { type: 'CustomStatusChecker', id: 'something something' } } },
        { issuer, signer },
      )
      const statusEntry = await checker.checkStatus(token, referenceDoc)
      expect(statusEntry).toStrictEqual({ revoked: false, 'custom method works': true })
    })

    it('for JWT.payload.vp.credentialStatus', async () => {
      const checkStatus: StatusMethod = async () => {
        return { revoked: false, 'custom method works': true }
      }
      const checker = new Status({ CustomStatusChecker: checkStatus })
      const token = await createJWT(
        { vp: { credentialStatus: { type: 'CustomStatusChecker', id: 'something something' } } },
        { issuer, signer },
      )
      const statusEntry = await checker.checkStatus(token, referenceDoc)
      expect(statusEntry).toStrictEqual({ revoked: false, 'custom method works': true })
    })

    it('for plain JSON with credentialStatus', async () => {
      const checkStatus: StatusMethod = async () => {
        return { revoked: false, 'custom method works': true }
      }
      const checker = new Status({ CustomStatusChecker: checkStatus })
      const statusEntry = await checker.checkStatus(
        {
          credentialStatus: {
            type: 'CustomStatusChecker',
            id: 'something something',
          },
        },
        referenceDoc,
      )
      expect(statusEntry).toStrictEqual({ revoked: false, 'custom method works': true })
    })

    it('for serialized JSON with credentialStatus', async () => {
      const checkStatus: StatusMethod = async () => {
        return { revoked: false, 'custom method works': true }
      }
      const checker = new Status({ CustomStatusChecker: checkStatus })
      const statusEntry = await checker.checkStatus(
        JSON.stringify({
          credentialStatus: {
            type: 'CustomStatusChecker',
            id: 'something something',
          },
        }),
        referenceDoc,
      )
      expect(statusEntry).toStrictEqual({ revoked: false, 'custom method works': true })
    })

    it('should prefer vc.credentialStatus for JWT credential', async () => {
      const checkStatus: StatusMethod = async () => {
        return { revoked: false, 'custom method works': true }
      }
      const checker = new Status({ CustomStatusChecker: checkStatus })
      const token = await createJWT(
        {
          credentialStatus: { type: 'Unknown', id: 'nope' },
          vc: { credentialStatus: { type: 'CustomStatusChecker', id: 'something something' } },
        },
        { issuer, signer },
      )
      const statusEntry = await checker.checkStatus(token, referenceDoc)
      expect(statusEntry).toStrictEqual({ revoked: false, 'custom method works': true })
    })
  })
})
