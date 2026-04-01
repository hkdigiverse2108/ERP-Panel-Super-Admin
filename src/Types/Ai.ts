export interface DetectedItem {
  name: string;
  price: number;
  quantity: number;
  matched: boolean;
  sku_code: string;
}

export interface AnalyzeTablePayload {
  imageBase64: string;
}

export interface AnalyzeTableResponse {
  data: DetectedItem[];
}
