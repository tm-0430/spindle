[**Documentation v2.0.0-beta.11**](../../README.md)

***

[Documentation](../../README.md) / [solana-agent-kit](../README.md) / getComputeBudgetInstructions

# Function: getComputeBudgetInstructions()

> **getComputeBudgetInstructions**(`agent`, `instructions`, `feeTier`): `Promise`\<\{ `computeBudgetLimitInstruction`: `TransactionInstruction`; `computeBudgetPriorityFeeInstructions`: `TransactionInstruction`; \}\>

Defined in: [packages/core/src/utils/send\_tx.ts:25](https://github.com/michaelessiet/solana-agent-kit/blob/d01565d8314c89261231d701336a71dcba5f4bf6/packages/core/src/utils/send_tx.ts#L25)

Get priority fees for the current block

## Parameters

### agent

[`SolanaAgentKit`](../classes/SolanaAgentKit.md)

### instructions

`TransactionInstruction`[]

### feeTier

`"min"` | `"mid"` | `"max"`

## Returns

`Promise`\<\{ `computeBudgetLimitInstruction`: `TransactionInstruction`; `computeBudgetPriorityFeeInstructions`: `TransactionInstruction`; \}\>

Priority fees statistics and instructions for different fee levels
