"use client";

import { useEffect } from "react";
import { createArticleView } from "../actions";

const DELAY = 5000; // 5 segundos

type ArticleViewTrackerProps = {
  articleId: string;
  userId: string;
};

export function ArticleViewTracker({
  articleId,
  userId,
}: ArticleViewTrackerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      createArticleView(articleId, userId);
    }, DELAY);

    return () => clearTimeout(timer);
  }, [articleId, userId]);

  return null;
}
