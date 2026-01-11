// Example if ArticlesClient expects a prop called "articles"
import { render, screen } from "@testing-library/react";
import ArticlesClient from "./ArticlesClient";

const mockArticles = [
  { slug: "test-article", title: "Test Article", summary: "Summary", date: "2025-01-01" }
];

test("renders ArticlesClient component", () => {
  render(<ArticlesClient articles={mockArticles} />);
  expect(screen.getByText(/test article/i)).toBeInTheDocument();
});