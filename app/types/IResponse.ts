export interface IResponse {
  data: any;
  error: any;
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
}
