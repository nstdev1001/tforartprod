import useControlGold from "./useControlGold";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DojiGoldItem, PnjGoldItem, SjcGoldItem } from "@/types/goldDataType";
import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const formatPrice = (price: number | undefined): string => {
  if (!price || price === 0) return "—";
  return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
};

const formatShortPrice = (price: number | undefined): string => {
  if (!price || price === 0) return "—";
  const million = price / 1_000_000;
  if (Number.isInteger(million)) {
    return `${million}tr`;
  }
  return `${million.toFixed(2)}tr`;
};

/* ───────────── SJC Table ───────────── */
function SjcTable({ data }: { data: SjcGoldItem[] }) {
  if (data.length === 0) {
    return (
      <p className="text-gray-400 text-center py-8">
        Không có dữ liệu SJC hiện tại.
      </p>
    );
  }

  const item = data[0];

  const rows = [
    { label: "Vàng miếng SJC 1L", buy: item.buy_1l, sell: item.sell_1l },
    { label: "Vàng miếng SJC 1c", buy: item.buy_1c, sell: item.sell_1c },
    {
      label: "Nữ trang 99.99%",
      buy: item.buy_nhan1c,
      sell: item.sell_nhan1c,
    },
    {
      label: "Trang sức 49.99%",
      buy: item.buy_trangsuc49,
      sell: item.sell_trangsuc49,
    },
  ].filter((r) => r.buy || r.sell);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm md:text-base">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400">
            <th className="text-left py-3 px-4 font-medium">Loại vàng</th>
            <th className="text-right py-3 px-4 font-medium">Mua vào</th>
            <th className="text-right py-3 px-4 font-medium">Bán ra</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
            >
              <td className="py-4 px-4 font-medium">{row.label}</td>
              <td className="py-4 px-4 text-right">
                <span className="text-green-400 font-semibold">
                  {formatPrice(row.buy)}
                </span>
                <span className="block text-xs text-gray-500 md:hidden">
                  {formatShortPrice(row.buy)}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="text-red-400 font-semibold">
                  {formatPrice(row.sell)}
                </span>
                <span className="block text-xs text-gray-500 md:hidden">
                  {formatShortPrice(row.sell)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────── DOJI / PNJ Table ───────────── */
function RegionalTable({ data }: { data: (DojiGoldItem | PnjGoldItem)[] }) {
  if (data.length === 0) {
    return (
      <p className="text-gray-400 text-center py-8">
        Không có dữ liệu hiện tại.
      </p>
    );
  }

  const item = data[0];

  const rows = [
    { label: "Hồ Chí Minh", buy: item.buy_hcm, sell: item.sell_hcm },
    { label: "Hà Nội", buy: item.buy_hn, sell: item.sell_hn },
  ].filter((r) => r.buy || r.sell);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm md:text-base">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400">
            <th className="text-left py-3 px-4 font-medium">Khu vực</th>
            <th className="text-right py-3 px-4 font-medium">Mua vào</th>
            <th className="text-right py-3 px-4 font-medium">Bán ra</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
            >
              <td className="py-4 px-4 font-medium">{row.label}</td>
              <td className="py-4 px-4 text-right">
                <span className="text-green-400 font-semibold">
                  {formatPrice(row.buy)}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="text-red-400 font-semibold">
                  {formatPrice(row.sell)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────── Main Page ───────────── */
export default function GoldPricePage() {
  const {
    provider,
    setProvider,
    sjcData,
    dojiData,
    pnjData,
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
            Giá Vàng Hôm Nay
          </h1>
          <p className="text-lg text-gray-400">
            Cập nhật giá vàng SJC, DOJI, PNJ trong nước nhanh chóng và chính
            xác.
            <br />
            <span className="font-extralight">
              Dữ liệu được cung cấp bởi VNAppMob Open API.
            </span>
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
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
            onValueChange={(v) => setProvider(v as "sjc" | "doji" | "pnj")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-gray-700 mb-6">
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
            </TabsList>

            {/* SJC Tab */}
            <TabsContent value="sjc">
              <Card className="bg-transparent border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                    Giá vàng SJC
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SjcTable data={sjcData} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* DOJI Tab */}
            <TabsContent value="doji">
              <Card className="bg-transparent border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                    Giá vàng DOJI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RegionalTable data={dojiData} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* PNJ Tab */}
            <TabsContent value="pnj">
              <Card className="bg-transparent border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                    Giá vàng PNJ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RegionalTable data={pnjData} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Summary Cards */}
        {!loading && !error && sjcData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <Card className="bg-gray-950 border-gray-700 hover:bg-gray-900 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">
                  SJC 1L — Mua vào
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-400">
                  {formatShortPrice(sjcData[0]?.buy_1l)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-gray-700 hover:bg-gray-900 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">
                  SJC 1L — Bán ra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-400">
                  {formatShortPrice(sjcData[0]?.sell_1l)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-gray-700 hover:bg-gray-900 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">
                  Chênh lệch mua — bán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-400">
                  {sjcData[0]?.sell_1l && sjcData[0]?.buy_1l
                    ? formatShortPrice(sjcData[0].sell_1l - sjcData[0].buy_1l)
                    : "—"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer note */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Dữ liệu giá vàng được cung cấp bởi{" "}
            <Link
              className="underline"
              target="_blank"
              to="https://vapi.vnappmob.com"
            >
              VNAppMob Open API
            </Link>
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Giá vàng chỉ mang tính chất tham khảo.
          </p>
        </footer>
      </div>
    </Layout>
  );
}
