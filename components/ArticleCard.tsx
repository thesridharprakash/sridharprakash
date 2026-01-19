import Link from "next/link";
import { Article } from "@/types/article";

type Props = {
  article: Article;
};

export default function ArticleCard({ article }: Props) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition bg-white">
      <h3 className="text-lg font-semibold text-blue-900">
        {article.title}
      </h3>

      <p className="mt-2 text-gray-600 text-sm">
        {article.summary}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {article.date}
        </span>

        <Link
          href={`/articles/${article.slug}`}
          className="text-orange-600 text-sm font-medium hover:underline"
        >
          Read full article →
        </Link>
      </div>
    </div>
  );
}
