import FormContent from "./LoginForm";
import Layout from "@/components/Layout/Layout";

const Login = () => {
  return (
    <Layout>
      <div className="login_container mt-[100px] md:mt-[200px] flex justify-center px-4 md:px-0">
        <FormContent />
      </div>
    </Layout>
  );
};

export default Login;
