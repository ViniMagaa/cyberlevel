import { Plus, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TQuizForm } from "./quiz-form";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

type QuestionItemProps = {
  qIndex: number;
  onRemoveQuestion: () => void;
};

export function QuestionItem({ qIndex, onRemoveQuestion }: QuestionItemProps) {
  const { control } = useFormContext<TQuizForm>();

  const optionsField = useFieldArray({
    control,
    name: `questions.${qIndex}.options`,
  });

  return (
    <Card>
      <CardContent className="space-y-4">
        {/* Enunciado */}
        <FormField
          control={control}
          name={`questions.${qIndex}.text`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={`Pergunta ${qIndex + 1}`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Alternativas */}
        <ul className="list-disc space-y-2">
          {optionsField.fields.map((opt, oIndex) => (
            <li key={opt.id} className="ml-6 list-item">
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`questions.${qIndex}.options.${oIndex}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Alternativa ${oIndex + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => optionsField.remove(oIndex)}
                  disabled={optionsField.fields.length <= 2}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
          {/* Adicionar alternativa */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => optionsField.append({ text: "" })}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Adicionar alternativa
          </Button>
        </ul>

        {/* Selecionar resposta correta */}
        <FormField
          control={control}
          name={`questions.${qIndex}.correctIndex`}
          render={({ field }) => (
            <FormItem className="flex gap-2">
              <Label>Correta</Label>
              <Select
                value={String(field.value)}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a resposta correta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {optionsField.fields.map((_, oIndex) => (
                    <SelectItem key={oIndex} value={String(oIndex)}>
                      Alternativa {oIndex + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Feedback */}
        <FormField
          control={control}
          name={`questions.${qIndex}.feedback`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Feedback para esta pergunta"
                  className="max-h-40 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>

      {/* Remover pergunta */}
      <CardFooter className="flex justify-end">
        <Button type="button" variant="destructive" onClick={onRemoveQuestion}>
          Remover pergunta
        </Button>
      </CardFooter>
    </Card>
  );
}
