export type Article = {
  title: string;
  slug: string;
};

export async function notifyTelegram(article: Article) {
  const message = `📝 New Article Published

${article.title}

🔗 https://www.sridharprakash.in/articles/${article.slug}`;

  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
      }),
    }
  );
}
