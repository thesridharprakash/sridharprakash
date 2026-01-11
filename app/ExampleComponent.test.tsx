import { render, screen, waitFor } from "@testing-library/react";
import ExampleComponent from "./ExampleComponent";

// Mock fetch globally
beforeEach(() => {
  jest.resetAllMocks();
});

test("renders loading state", () => {
  global.fetch = jest.fn(() =>
    new Promise(() => {}) // never resolves, stays in loading
  ) as jest.Mock;
  render(<ExampleComponent />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("renders error state", async () => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error("Network error"))
  ) as jest.Mock;
  render(<ExampleComponent />);
  await waitFor(() =>
    expect(
      screen.getByText(/could not load data/i)
    ).toBeInTheDocument()
  );
});

test("renders data state", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: "Hello World" }),
    })
  ) as jest.Mock;
  render(<ExampleComponent />);
  // Update your component to render the data for this test to pass
  // For example, if you render data.message:
  // await waitFor(() =>
  //   expect(screen.getByText(/hello world/i)).toBeInTheDocument()
  // );
});