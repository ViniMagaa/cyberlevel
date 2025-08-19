import { TFakeNewsForm } from "@/components/fake-news-form";
import { TPostOrNotForm } from "@/components/post-or-not-form";
import { TQuizForm } from "@/components/quiz-form";

export type TFakeNewsContent = Omit<TFakeNewsForm, "image"> & {
  imageUrl?: string;
};

export type TPostOrNotContent = Omit<TPostOrNotForm, "image"> & {
  imageUrl?: string;
};

export type TQuizContent = TQuizForm;
