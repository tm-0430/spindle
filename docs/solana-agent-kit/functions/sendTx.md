[**Documentation v2.0.0-beta.11**](../../README.md)

***

[Documentation](../../README.md) / [solana-agent-kit](../README.md) / sendTx

# Function: sendTx()

> **sendTx**(`agent`, `instructions`, `otherKeypairs?`, `feeTier?`): `Promise`\<`string`\>

Defined in: [packages/core/src/utils/send\_tx.ts:132](https://github.com/michaelessiet/solana-agent-kit/blob/d01565d8314c89261231d701336a71dcba5f4bf6/packages/core/src/utils/send_tx.ts#L132)

Send a transaction with priority fees

## Parameters

### agent

[`SolanaAgentKit`](../classes/SolanaAgentKit.md)

SolanaAgentKit instance

### instructions

`TransactionInstruction`[]

### otherKeypairs?

`Keypair`[]

### feeTier?

`"min"` | `"mid"` | `"max"`

## Returns

`Promise`\<`string`\>

Transaction ID
