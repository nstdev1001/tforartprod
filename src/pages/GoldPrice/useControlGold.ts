import {
  DojiGoldItem,
  GoldApiResponse,
  GoldProvider,
  PnjGoldItem,
  SjcGoldItem,
} from "@/types/goldDataType";
import { useCallback, useEffect, useState } from "react";

const useControlGold = () => {
  const [provider, setProvider] = useState<GoldProvider>("sjc");
  const [sjcData, setSjcData] = useState<SjcGoldItem[]>([]);
  const [dojiData, setDojiData] = useState<DojiGoldItem[]>([]);
  const [pnjData, setPnjData] = useState<PnjGoldItem[]>([]);
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

  const fetchAllGoldPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sjcRes, dojiRes, pnjRes] = await Promise.allSettled([
        fetchGoldData<SjcGoldItem>("sjc"),
        fetchGoldData<DojiGoldItem>("doji"),
        fetchGoldData<PnjGoldItem>("pnj"),
      ]);

      if (sjcRes.status === "fulfilled") {
        setSjcData(sjcRes.value.results ?? []);
      }
      if (dojiRes.status === "fulfilled") {
        setDojiData(dojiRes.value.results ?? []);
      }
      if (pnjRes.status === "fulfilled") {
        setPnjData(pnjRes.value.results ?? []);
      }

      // Check if all failed
      if (
        sjcRes.status === "rejected" &&
        dojiRes.status === "rejected" &&
        pnjRes.status === "rejected"
      ) {
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
  }, [fetchGoldData]);

  useEffect(() => {
    void fetchAllGoldPrices();
  }, [fetchAllGoldPrices]);

  return {
    provider,
    setProvider,
    sjcData,
    dojiData,
    pnjData,
    loading,
    error,
    lastUpdated,
    refetch: fetchAllGoldPrices,
  };
};

export default useControlGold;
