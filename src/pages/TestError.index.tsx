import BuggyComponent from "../components/BuggyComponent/BuggyComponent";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

const TestError = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <h2>Test Error Boundary</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1, padding: "20px", border: "1px solid #333" }}>
          <h3>With Error Boundary</h3>
          <ErrorBoundary>
            <BuggyComponent />
          </ErrorBoundary>
        </div>

        <div style={{ flex: 1, padding: "20px", border: "1px solid #333" }}>
          <h3>Without Error Boundary</h3>
          <BuggyComponent />
        </div>
      </div>
    </div>
  );
};

export default TestError;
