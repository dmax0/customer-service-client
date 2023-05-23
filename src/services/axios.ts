import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import localConfig from '@/config';
import { selectToken } from '@/store/reducer/userSlice';
import { store, persistor } from '@/store';
import { message } from '@/hooks/useGlobalTips';
import { downloadStreamFile } from '@/utils/utils';

type HttpStatusCode = keyof typeof localConfig.api.status; // 服务端自定义的一套状态码 config.ts

/**
 * ResponseDto: Data Transfer Object
 * 用于接口返回数据的类型约束
 * @interface ResponseDto 通用接口返回数据类型
 * @template ResDataType
 * @property {HttpStatusCode} code 服务端自定义的一套状态码 
 * @property {ResDataType} data 服务端返回的数据
 * @property {string} message 服务端返回的消息
 * @property {boolean} success 服务端返回的请求是否成功
 */   
export interface ResponseDto<ResDataType = any> {
  code: HttpStatusCode;
  data: ResDataType;
  message: string | undefined;
  success: boolean;
}

class Request {
  private instance: AxiosInstance;

  private baseConfig: AxiosRequestConfig = {
    baseURL: localConfig.api.baseUrl,
    timeout: localConfig.api.timeout
  };

  public constructor(config: AxiosRequestConfig = {}) {
    // 创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config));
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        
        // const token = selectToken(store.getState()); // 从redux中获取token
        // console.log("token", token)
        const token = localStorage.getItem('Authorization');
        if (token) {
          config.headers![localConfig.api.sessionKey] = token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseDto>) => {
        const { headers, data } = response;
        if (headers['content-type']?.includes('application/json')) { 

          if (data.code !== 200) {
            const errorText =
              data.message ||
              localConfig.api.status[data.code as HttpStatusCode] ||
              '未知错误';
            data.code === 401 && persistor.purge(); // persistor.purge() 清除持久化数据
            message.error(errorText); // 全局提示错误信息
            return Promise.reject(errorText);
          }
        }
        return response;
      },
      (error) => {
        // 这里处理http状态码错误
        

        message.error(`${error.message}, 网络错误`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get 请求
   * @param url
   * @param config
   * @returns {ResponseDto.data} 直接返回数据部分 return response.data.data
   */
  public get<ResData = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResData> {
    return this.instance
      .get<ResponseDto<ResData>>(url, config)
      .then(({ data }) => data.data);
  }

  /**
   * Post 请求
   * @param url
   * @param data
   * @param config
   * @returns {ResponseDto.data} 直接返回数据部分 return response.data.data
   */
  public post<Params = any, ResData = any>(
    url: string,
    data: Params,
    config?: AxiosRequestConfig
  ): Promise<ResData> {
    return this.instance
      .post<ResponseDto<ResData>>(url, data, config)
      .then(({ data }) => data.data);
  }

  /**
   * Put 请求
   * @param url
   * @param data
   * @param config
   * @returns {ResponseDto.data} 直接返回数据部分 return response.data.data
   */
  public put<Params = any, ResData = any>(
    url: string,
    data: Params,
    config?: AxiosRequestConfig
  ): Promise<ResData> {
    return this.instance
      .put<ResponseDto<ResData>>(url, data, config)
      .then(({ data }) => data.data);
  }

  /**
   * Delete 请求
   * @param url
   * @param config
   * @returns {ResponseDto.data} 直接返回数据部分 return response.data.data
   * */
  public delete<ResData = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResData> {
    return this.instance
      .delete<ResponseDto<ResData>>(url, config)
      .then(({ data }) => data.data);
  }


  /**
   * 获取Blob数据
   * @param url
   * @param data
   * @param config
   * @returns 
   */
  public getBlob<Params = any>(
    url: string,
    data: Params,
    config?: AxiosRequestConfig
  ): Promise<{
    blob: Blob;
    filename?: string;
    fileType?: string;
  }> {
    return this.post(url, data, { responseType: 'blob', ...config }).then(
      (res) => {
        const { data, headers } = res;
        // if (headers['content-type'] === 'application/octet-stream') {}
        const fileType = headers['content-type'];
        const filename = headers['content-disposition'].split('=')[1];
        return { blob: data, filename: decodeURIComponent(filename), fileType };
      }
    );
  }

  /**
   * 请求流数据文件并直接下载
   * @param url
   * @param data
   * @param config
   * @returns
   */
  public async getStreamFileToDownload<Params = any>(
    url: string,
    data: Params,
    config?: AxiosRequestConfig
  ) {
    const { blob, filename, fileType } = await this.getBlob(url, data, config);
    downloadStreamFile(blob, filename, fileType);
    return { blob, filename, fileType };
  }

  /**
   * 应对其他情况的请求方法，如: 需要返回整个response.data 等。
   * @param {AxiosRequestConfig} config
   * @returns {AxiosResponse.data} return response.data
   */
  public request<ResData = any>(config: AxiosRequestConfig) {
    return this.instance
      .request<ResponseDto<ResData>>(config)
      .then((response) => response.data);
  }
}

export default new Request();
