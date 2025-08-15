import { activitySchemas, TFakeNews } from "@/utils/activity-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

type FakeNewsFormProps = {
  fakeNews?: z.output<typeof activitySchemas.FAKE_NEWS>;
  onSubmit: (data: TFakeNews) => void;
};

export function FakeNewsForm({ fakeNews, onSubmit }: FakeNewsFormProps) {
  const form = useForm<TFakeNews>({
    resolver: zodResolver(activitySchemas.FAKE_NEWS),
    defaultValues: fakeNews ?? {
      title: "",
      text: "",
      imageUrl: "",
      source: "",
      isFake: undefined,
      feedback: "",
    },
  });

  async function handleSubmit(data: TFakeNews) {
    const isValid = await form.trigger();

    if (!isValid) return;

    const fakeNewsData = {
      title: data.title,
      text: data.text,
      imageUrl: data.imageUrl,
      source: data.source,
      isFake: data.isFake,
      feedback: data.feedback,
    };
    onSubmit(fakeNewsData);
  }

  return (
    <Form {...form}>
      <form className="flex grow flex-col justify-between gap-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Título da notícia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Text */}
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Texto da notícia"
                  className="max-h-80 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="URL da imagem (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Source */}
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Fonte da notícia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Fake */}
        <FormField
          control={form.control}
          name="isFake"
          render={({ field }) => (
            <FormItem className="flex-auto">
              <Select
                onValueChange={(value) => {
                  form.setValue("isFake", value === "true" ? true : false);
                }}
                defaultValue={
                  field.value === true
                    ? "true"
                    : field.value === false
                      ? "false"
                      : undefined
                }
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a veracidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Falsa</SelectItem>
                  <SelectItem value="false">Verdadeira</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Feedback */}
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Feedback sobre a atividade"
                  className="max-h-80 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            variant="default"
          >
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
}
