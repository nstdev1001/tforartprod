export interface SjcGoldItem {
  buy_1l: number;
  sell_1l: number;
  buy_1c?: number;
  sell_1c?: number;
  buy_nhan1c?: number;
  sell_nhan1c?: number;
  buy_trangsuc49?: number;
  sell_trangsuc49?: number;
}

export interface DojiGoldItem {
  buy_hcm: number;
  sell_hcm: number;
  buy_hn: number;
  sell_hn: number;
}

export interface PnjGoldItem {
  buy_hcm: number;
  sell_hcm: number;
  buy_hn: number;
  sell_hn: number;
}

export interface BtmcGoldItem {
  name: string;
  gold_content: string;
  kara_content: string;
  buy: number;
  sell: number;
  updated_at: string;
}

export interface BtmcSilverItem {
  name: string;
  buy: number;
  sell: number;
  updated_at: string;
}

export interface BtmcApiResponse {
  gold: BtmcGoldItem[];
  silver: BtmcSilverItem[];
}

export interface GoldApiResponse<T> {
  results: T[];
}

export type GoldProvider = "sjc" | "doji" | "pnj" | "btmc";
