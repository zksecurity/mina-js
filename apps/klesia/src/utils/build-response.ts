import type { RpcErrorType } from "../schema";

export const buildResponse = ({
	result,
	error,
}: { result?: unknown; error?: RpcErrorType }) => {
	if (error) {
		return {
			jsonrpc: "2.0",
			error,
		};
	}
	return { jsonrpc: "2.0", result };
};
