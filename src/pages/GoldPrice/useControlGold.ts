import {
  DojiGoldItem,
  GoldApiResponse,
  GoldProvider,
  PnjGoldItem,
  SjcGoldItem,
} from "@/types/goldDataType";
import { useCallback, useEffect, useState } from "react";

type BtmcGoldItem = {
  name: string;
  gold_content: string;
  kara_content: string;
  buy: number;
  sell: number;
  updated_at: string;
};

type BtmcSilverItem = {
  name: string;
  buy: number;
  sell: number;
  updated_at: string;
};

type BtmcApiResponse = {
  gold: BtmcGoldItem[];
  silver: BtmcSilverItem[];
};

const useControlGold = () => {
  const [provider, setProvider] = useState<GoldProvider>("sjc");
  const [sjcData, setSjcData] = useState<SjcGoldItem[]>([]);
  const [dojiData, setDojiData] = useState<DojiGoldItem[]>([]);
  const [pnjData, setPnjData] = useState<PnjGoldItem[]>([]);
  const [btmcGoldData, setBtmcGoldData] = useState<BtmcGoldItem[]>([]);
  const [btmcSilverData, setBtmcSilverData] = useState<BtmcSilverItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchGoldData = useCallback(
    async <T>(type: GoldProvider): Promise<GoldApiResponse<T>> => {
      const response = await fetch(
        `/api/gold?provider=${encodeURIComponent(type)}`,
      );
      if (!response.ok) {
        throw new Error(
          `Không thể lấy dữ liệu giá vàng ${type.toUpperCase()} (HTTP ${
            response.status
          })`,
        );
      }
      return response.json() as Promise<GoldApiResponse<T>>;
    },
    [],
  );

  const fetchBtmcData = useCallback(async (): Promise<BtmcApiResponse> => {
    const response = await fetch(`/api/gold?provider=btmc`);
    if (!response.ok) {
      throw new Error(
        `Không thể lấy dữ liệu giá vàng BTMC (HTTP ${response.status})`,
      );
    }
    return response.json() as Promise<BtmcApiResponse>;
  }, []);

  const fetchAllGoldPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sjcRes, dojiRes, pnjRes, btmcRes] = await Promise.all([
        fetchGoldData<SjcGoldItem>("sjc").catch(() => null),
        fetchGoldData<DojiGoldItem>("doji").catch(() => null),
        fetchGoldData<PnjGoldItem>("pnj").catch(() => null),
        fetchBtmcData().catch(() => null),
      ]);

      if (sjcRes) {
        setSjcData(sjcRes.results ?? []);
      }
      if (dojiRes) {
        setDojiData(dojiRes.results ?? []);
      }
      if (pnjRes) {
        setPnjData(pnjRes.results ?? []);
      }
      if (btmcRes) {
        setBtmcGoldData(btmcRes.gold ?? []);
        setBtmcSilverData(btmcRes.silver ?? []);
      }

      // Check if all failed
      if (!sjcRes && !dojiRes && !pnjRes && !btmcRes) {
        throw new Error(
          "Không thể kết nối đến máy chủ giá vàng. Vui lòng thử lại sau.",
        );
      }

      setLastUpdated(new Date());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setLoading(false);
    }
  }, [fetchGoldData, fetchBtmcData]);

  useEffect(() => {
    void fetchAllGoldPrices();
  }, [fetchAllGoldPrices]);

  return {
    provider,
    setProvider,
    sjcData,
    dojiData,
    pnjData,
    btmcGoldData,
    btmcSilverData,
    loading,
    error,
    lastUpdated,
    refetch: fetchAllGoldPrices,
  };
};

export default useControlGold;
