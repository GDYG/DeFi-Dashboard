import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';



/**
 * 基础API客户端
 */
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, this.baseUrl)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:7890');
    const _rest = process.env.NODE_ENV === 'production' ? {} : {
      agent: proxyAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    }
    const response = await fetch(url.toString(), {
      ..._rest,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    return response.json() as Promise<T>
  }
}

/**
 * CoinGecko API 服务
 * 🔐 仅用于服务端 - 包含敏感API密钥
 */

// 注意：
// - 以上服务类包含API密钥，仅应在服务端使用
// - 客户端应该使用 ClientApiService 通过内部API路由获取数据
// - 这样可以保护敏感信息不被暴露在客户端代码中 