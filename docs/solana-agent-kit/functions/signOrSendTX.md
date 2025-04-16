[**Documentation v2.0.0-beta.11**](../../README.md)

***

[Documentation](../../README.md) / [solana-agent-kit](../README.md) / signOrSendTX

# Function: signOrSendTX()

> **signOrSendTX**(`agent`, `instructionsOrTransaction`, `otherKeypairs?`, `feeTier?`): `Promise`\<`string` \| `VersionedTransaction` \| `Transaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Defined in: [packages/core/src/types/wallet.ts:82](https://github.com/michaelessiet/solana-agent-kit/blob/d01565d8314c89261231d701336a71dcba5f4bf6/packages/core/src/types/wallet.ts#L82)

## Parameters

### agent

[`SolanaAgentKit`](../classes/SolanaAgentKit.md)

### instructionsOrTransaction

`TransactionInstruction`[] | `VersionedTransaction` | `Transaction` | `Transaction`[] | `VersionedTransaction`[]

### otherKeypairs?

`Keypair`[]

### feeTier?

`"min"` | `"mid"` | `"max"`

## Returns

`Promise`\<`string` \| `VersionedTransaction` \| `Transaction` \| `Transaction`[] \| `VersionedTransaction`[]\>
