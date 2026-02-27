import { formatPrice } from "./priceFormatters";
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
import type { DojiGoldItem } from "@/types/goldDataType";

type DojiTabProps = {
  data: DojiGoldItem[];
};

export default function DojiTab({ data }: DojiTabProps) {
  if (data.length === 0) {
    return (
      <TabsContent value="doji">
        <Card className="bg-transparent border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
              Giá vàng DOJI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center py-8">
              Không có dữ liệu hiện tại.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  const item = data[0];

  const rows = [
    { label: "Hồ Chí Minh", buy: item.buy_hcm, sell: item.sell_hcm },
    { label: "Hà Nội", buy: item.buy_hn, sell: item.sell_hn },
  ].filter((row) => row.buy || row.sell);

  return (
    <TabsContent value="doji">
      <Card className="bg-transparent border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
            Giá vàng DOJI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="text-sm md:text-base">
            <TableHeader>
              <TableRow className="border-gray-700 text-gray-400 hover:bg-transparent">
                <TableHead className="py-3 px-4 font-medium text-left text-gray-400">
                  Khu vực
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
                  </TableCell>
                  <TableCell className="py-4 px-4 text-right">
                    <span className="text-red-400 font-semibold">
                      {formatPrice(row.sell)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
