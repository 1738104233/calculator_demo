import { createPromiseClient } from "@bufbuild/connect";
import { createConnectTransport } from "@bufbuild/connect-web";
import { CalculatorService } from "../gen/calculator_connectweb";

// 创建传输层 - 配置与后端的连接
const transport = createConnectTransport({
  baseUrl: "http://localhost:8080", // 后端服务地址
  useBinaryFormat: true, // 使用二进制格式提高效率
  // 添加拦截器用于调试（可选）
  interceptors: [
    (next) => async (req) => {
      console.log("Sending request:", req);
      const response = await next(req);
      console.log("Received response:", response);
      return response;
    }
  ]
});

// 创建客户端实例
export const client = createPromiseClient(CalculatorService, transport);

/**
 * 调用计算服务的辅助函数
 * @param {number} a 第一个操作数
 * @param {number} b 第二个操作数
 * @param {string} operator 运算符（"+", "-", "*", "/"）
 * @returns {Promise<number>} 计算结果
 */
export async function calculate(a, b, operator) {
  try {
    // 调用RPC方法
    const response = await client.calculate({ a, b, operator });
    return response.result;
  } catch (error) {
    // 将ConnectRPC错误转换为标准错误
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("RPC call failed: " + String(error));
    }
  }
}