import { Suspense } from "react";
import LineSpinerLoading from "./LineSpinerLoading";

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <LineSpinerLoading />
      </div>
    }
  >
    {children}
  </Suspense>
);

export default SuspenseWrapper;
