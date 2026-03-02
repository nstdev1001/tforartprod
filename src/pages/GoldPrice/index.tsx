import BtmcTab from "./components/BtmcTab";
import DojiTab from "./components/DojiTab";
import PnjTab from "./components/PnjTab";
import SjcTab from "./components/SjcTab";
import useControlGold from "./useControlGold";
import Layout from "@/components/Layout/Layout";
import BouncyLoading from "@/components/Loading/BouncyLoading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GoldProvider } from "@/types/goldDataType";
import { RefreshCw } from "lucide-react";

export default function GoldPricePage() {
  const {
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
    refetch,
  } = useControlGold();

  return (
    <Layout>
      <div className="gold-container max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[150px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            GIÁ VÀNG HÔM NAY
          </h1>
          <p className="text-lg text-gray-400">
            Cập nhật giá vàng SJC, DOJI, PNJ, BTMC trong nước nhanh chóng và
            chính xác.
          </p>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Cập nhật lúc: {lastUpdated.toLocaleTimeString("vi-VN")},{" "}
              {lastUpdated.toLocaleDateString("vi-VN")}
            </p>
          )}
          <button
            onClick={() => void refetch()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-700 text-sm hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Tải lại
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-5 justify-center items-center h-64">
            <BouncyLoading />
            <p className="text-white">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/60 p-4 rounded-lg text-center mb-8">
            <p className="text-white">Đã xảy ra lỗi: {error}</p>
          </div>
        )}

        {/* Gold Data Tabs */}
        {!loading && (
          <Tabs
            value={provider}
            onValueChange={(value) => setProvider(value as GoldProvider)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-700 mb-6">
              <TabsTrigger
                value="sjc"
                className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
              >
                SJC
              </TabsTrigger>
              <TabsTrigger
                value="doji"
                className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
              >
                DOJI
              </TabsTrigger>
              <TabsTrigger
                value="pnj"
                className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
              >
                PNJ
              </TabsTrigger>
              <TabsTrigger
                value="btmc"
                className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
              >
                BTMC
              </TabsTrigger>
            </TabsList>

            <SjcTab data={sjcData} />
            <DojiTab data={dojiData} />
            <PnjTab data={pnjData} />
            <BtmcTab goldData={btmcGoldData} silverData={btmcSilverData} />
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
