import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import useControlEmail from "@/hooks/useControlEmail";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  DollarSign as DollarIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CustomForm = () => {
  const { form, onSubmit, isLoading } = useControlEmail();
  const [date, setDate] = useState<Date>();

  const handleClearDate = () => {
    setDate(undefined);
    form.setValue("date", "");
  };

  return (
    <div className="form-container p-7 rounded-lg border border-gray-700">
      <Form {...form}>
        <form
          className="flex flex-col gap-5"
          id="customForm"
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
            // handleClearDate();
          }}
        >
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>
                    <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Họ và tên *"
                      className="rounded-sm"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>
                    <MailIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="rounded-sm"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>
                    <PhoneIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Số điện thoại liên hệ *"
                      className="rounded-sm"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                          )}
                        >
                          {date ? (
                            format(date, "dd/MM/yyyy")
                          ) : (
                            <span>Ngày thực hiện dự án</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            if (!selectedDate) return;
                            setDate(selectedDate);
                            field.onChange(format(selectedDate, "dd/MM/yyyy"));
                          }}
                        />
                        <div className="p-2 border-t">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClearDate}
                            className="w-full"
                          >
                            Clear Date
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Budget Field */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel>
                  <DollarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Chi phí dự kiến của bạn (không bắt buộc)"
                    className="rounded-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Text Field */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Thông tin dự án</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập thông tin chi tiết về dự án của bạn"
                    className="rounded-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            className="group w-full rounded-full"
            type="submit"
            variant="outline"
            disabled={isLoading}
          >
            Gửi thông tin
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <div className="text-center text-sm text-gray-500">
            Bằng cách nhấp vào nút gửi, bạn đồng ý với{" "}
            <Link
              to="/privacy-policy"
              target="_blank"
              className="text-gray-300 underline"
            >
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link
              to="/privacy-policy"
              target="_blank"
              className="text-gray-300 underline"
            >
              Chính sách bảo mật
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CustomForm;
