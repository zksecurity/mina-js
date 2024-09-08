import { PublicKeySchema } from "@mina-js/shared";
import { z } from "zod";

export const KlesiaNetwork = z.enum(["devnet", "mainnet", "zeko_devnet"]);
export const PublicKeyParamsSchema = z.array(PublicKeySchema).length(1);
export const EmptyParamsSchema = z.array(z.string()).length(0).optional();
export const SendTransactionSchema = z.array(z.any(), z.string()).length(2);

export const RpcMethod = z.enum([
	"mina_getTransactionCount",
	"mina_getBalance",
	"mina_blockHash",
	"mina_chainId",
	"mina_sendTransaction",
	"mina_getAccount",
]);
export type RpcMethodType = z.infer<typeof RpcMethod>;

export const RpcMethodSchema = z.discriminatedUnion("method", [
	z.object({
		method: z.literal(RpcMethod.enum.mina_getTransactionCount),
		params: PublicKeyParamsSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_getBalance),
		params: PublicKeyParamsSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_blockHash),
		params: EmptyParamsSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_chainId),
		params: EmptyParamsSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_sendTransaction),
		params: SendTransactionSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_getAccount),
		params: PublicKeyParamsSchema,
	}),
]);

export const JsonRpcResponse = z.object({
	jsonrpc: z.literal("2.0"),
});

export const RpcError = z.object({
	code: z.number(),
	message: z.string(),
});

export type RpcErrorType = z.infer<typeof RpcError>;

export const ErrorSchema = JsonRpcResponse.extend({
	error: RpcError,
});

export const RpcResponseSchema = z.union([
	z.discriminatedUnion("method", [
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_getTransactionCount),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_getBalance),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_blockHash),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_chainId),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_sendTransaction),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_getAccount),
			result: z.object({
				nonce: z.string(),
				balance: z.string(),
			}),
		}),
	]),
	ErrorSchema,
]);

export type RpcResponseType = z.infer<typeof RpcResponseSchema>;
