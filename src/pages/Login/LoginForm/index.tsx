import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";

const FormContent = () => {
  const { form, isAuthLoading, onSubmit, loginError } = useAuth();

  return (
    <div className="border-stone-700 p-10 border-[1px] rounded-md w-[400px] bg-black">
      <div className="header_form">
        <h3 className="flex justify-center items-center gap-2 text-2xl font-semibold">
          <span>Sign in to</span>
          <img className="w-[80px]" src="/logobrand/tforart.png" alt="" />
        </h3>
        <p className="text-center text-gray-400">Welcome to Tforart admin!</p>
        <div className="third_party flex gap-2 justify-center mt-8">
          <Button variant="outline" className="flex items-center gap-2 w-full">
            <i className="fa-brands fa-google"></i>
            Google
          </Button>
          <Button variant="outline" className="flex items-center gap-2 w-full">
            <i className="fa-brands fa-facebook-f"></i>
            Facebook
          </Button>
        </div>
        <div className="mt-5 flex justify-center items-center gap-2">
          <hr className="border-t border-gray-700 w-full" />
          <span>or</span>
          <hr className="border-t border-gray-700 w-full" />
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit(onSubmit)();
          }}
          className="space-y-8 mt-5"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Type your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Type your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginError && <p className="text-red-600 text-sm">{loginError}</p>}

          <Button disabled={isAuthLoading} className="w-full" type="submit">
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormContent;
