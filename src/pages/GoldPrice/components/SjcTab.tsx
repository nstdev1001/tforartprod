import { formatPrice, formatShortPrice } from "./priceFormatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import type { SjcGoldItem } from "@/types/goldDataType";

type SjcTabProps = {
  data: SjcGoldItem[];
};

export default function SjcTab({ data }: SjcTabProps) {
  if (data.length === 0) {
    return (
      <TabsContent value="sjc">
        <Card className="bg-transparent border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
              Giá vàng SJC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center py-8">
              Không có dữ liệu SJC hiện tại.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
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
  ].filter((row) => row.buy || row.sell);

  return (
    <TabsContent value="sjc">
      <Card className="bg-transparent border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
            Giá vàng SJC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="text-sm md:text-base">
            <TableHeader>
              <TableRow className="border-gray-700 text-gray-400 hover:bg-transparent">
                <TableHead className="py-3 px-4 font-medium text-left text-gray-400">
                  Loại vàng
                </TableHead>
                <TableHead className="py-3 px-4 font-medium text-right text-gray-400">
                  Mua vào
                </TableHead>
                <TableHead className="py-3 px-4 font-medium text-right text-gray-400">
                  Bán ra
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  className="border-gray-800 hover:bg-gray-900/50 transition-colors"
                >
                  <TableCell className="py-4 px-4 font-medium">
                    {row.label}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-right">
                    <span className="text-green-400 font-semibold">
                      {formatPrice(row.buy)}
                    </span>
                    <span className="block text-xs text-gray-500 md:hidden">
                      {formatShortPrice(row.buy)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-right">
                    <span className="text-red-400 font-semibold">
                      {formatPrice(row.sell)}
                    </span>
                    <span className="block text-xs text-gray-500 md:hidden">
                      {formatShortPrice(row.sell)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <Card className="bg-gray-950 border-gray-700 hover:bg-gray-900 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">
              SJC 1L — Mua vào
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">
              {formatShortPrice(item.buy_1l)}
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
              {formatShortPrice(item.sell_1l)}
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
              {item.sell_1l && item.buy_1l
                ? formatShortPrice(item.sell_1l - item.buy_1l)
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
