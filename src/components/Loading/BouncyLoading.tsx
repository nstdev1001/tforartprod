import { bouncy } from "ldrs";

const BouncyLoading = () => {
  bouncy.register();
  return <l-bouncy size="45" speed="1.75" color="white"></l-bouncy>;
};

export default BouncyLoading;
