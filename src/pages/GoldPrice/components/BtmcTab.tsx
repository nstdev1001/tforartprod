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
import type { BtmcGoldItem } from "@/types/goldDataType";

type BtmcSilverDataItem = {
  name: string;
  buy: number;
  sell: number;
  updated_at: string;
};

type BtmcTabProps = {
  goldData: BtmcGoldItem[];
  silverData: BtmcSilverDataItem[];
};

function BtmcGoldTable({ data }: { data: BtmcGoldItem[] }) {
  if (data.length === 0) {
    return (
      <p className="text-gray-400 text-center py-8">
        Không có dữ liệu vàng BTMC hiện tại.
      </p>
    );
  }

  const firstItem = data[0];

  return (
    <div>
      <Table className="text-sm md:text-base">
        <TableHeader>
          <TableRow className="border-gray-700 text-gray-400 hover:bg-transparent">
            <TableHead className="py-3 px-4 font-medium text-center text-gray-400 min-w-[200px]">
              <div className="flex flex-col items-center leading-tight">
                <span>Loại vàng</span>
                <span className="italic font-extralight">(type of gold)</span>
              </div>
            </TableHead>
            <TableHead className="py-3 px-4 font-medium text-center text-gray-400">
              <div className="flex flex-col items-center leading-tight">
                <span>Hàm lượng vàng</span>
                <span className="italic font-extralight">(content)</span>
              </div>
            </TableHead>
            <TableHead className="py-3 px-4 font-medium text-center text-gray-400 min-w-[125px]">
              <div className="flex flex-col items-center leading-tight">
                <span>Mua vào</span>
                <span className="italic font-extralight">(buy)</span>
              </div>
            </TableHead>
            <TableHead className="py-3 px-4 font-medium text-center text-gray-400">
              <div className="flex flex-col items-center leading-tight min-w-[125px]">
                <span>Bán ra</span>
                <span className="italic font-extralight">(sell)</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={`${item.name}-${index}`}
              className="border-gray-800 hover:bg-gray-900/50 transition-colors"
            >
              <TableCell className="py-4 px-4 font-medium">
                {item.name}
              </TableCell>
              <TableCell className="py-4 px-4 text-gray-300">
                <div className="flex flex-col items-center">
                  <span>{item.gold_content || "—"}</span>
                  <span>({item.kara_content || "—"})</span>
                </div>
              </TableCell>
              <TableCell className="py-4 px-4 text-center">
                <span className="text-green-400 font-semibold">
                  {formatPrice(item.buy)}
                </span>
                <span className="block text-xs text-gray-500 md:hidden">
                  {formatShortPrice(item.buy)}
                </span>
              </TableCell>
              <TableCell className="py-4 px-4 text-center">
                <span className="text-red-400 font-semibold">
                  {formatPrice(item.sell)}
                </span>
                <span className="block text-xs text-gray-500 md:hidden">
                  {formatShortPrice(item.sell)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {firstItem?.updated_at && (
        <p className="text-xs text-gray-500 mt-3 text-right">
          Cập nhật: {firstItem.updated_at}
        </p>
      )}
    </div>
  );
}

function BtmcSilverTable({ data }: { data: BtmcSilverDataItem[] }) {
  if (data.length === 0) {
    return (
      <p className="text-gray-400 text-center py-8">
        Không có dữ liệu bạc BTMC hiện tại.
      </p>
    );
  }

  const firstItem = data[0];

  return (
    <div>
      <Table className="text-sm md:text-base">
        <TableHeader>
          <TableRow className="border-gray-700 text-gray-400 hover:bg-transparent">
            <TableHead className="py-3 px-4 font-medium text-gray-400 text-center min-w-[200px]">
              <div className="flex flex-col items-center leading-tight">
                <span>Tên sản phẩm</span>
                <span className="italic font-extralight">
                  (brand of silver)
                </span>
              </div>
            </TableHead>
            <TableHead className="py-3 px-4 font-medium text-gray-400 text-center">
              <div className="flex flex-col items-center leading-tight min-w-[125px]">
                <span>Mua vào</span>
                <span className="italic font-extralight">(buy)</span>
              </div>
            </TableHead>
            <TableHead className="py-3 px-4 font-medium text-gray-400 text-center">
              <div className="flex flex-col items-center leading-tight min-w-[125px]">
                <span>Bán ra</span>
                <span className="italic font-extralight">(sell)</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: BtmcSilverDataItem, index: number) => (
            <TableRow
              key={`${item.name}-${index}`}
              className="border-gray-800 hover:bg-gray-900/50 transition-colors text-center"
            >
              <TableCell className="py-4 px-4 font-medium text-left min-w-[200px]">
                {item.name}
              </TableCell>
              <TableCell className="py-4 px-4">
                <span className="text-green-400 font-semibold">
                  {formatPrice(item.buy)}
                </span>
                <span className="block text-xs text-gray-500 md:hidden">
                  {formatShortPrice(item.buy)}
                </span>
              </TableCell>
              <TableCell className="py-4 px-4">
                <span className="text-red-400 font-semibold">
                  {formatPrice(item.sell)}
                </span>
                <span className="block text-xs text-gray-500 md:hidden">
                  {formatShortPrice(item.sell)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {firstItem?.updated_at && (
        <p className="text-xs text-gray-500 mt-3 text-right">
          Cập nhật: {firstItem.updated_at}
        </p>
      )}
    </div>
  );
}

export default function BtmcTab({ goldData, silverData }: BtmcTabProps) {
  return (
    <TabsContent value="btmc">
      <Card className="bg-transparent border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
            Giá vàng Bảo Tín Minh Châu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BtmcGoldTable data={goldData} />
        </CardContent>
      </Card>

      <Card className="bg-transparent border-gray-700 mt-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-400"></span>
            Giá bạc Bảo Tín Minh Châu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BtmcSilverTable data={silverData} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
