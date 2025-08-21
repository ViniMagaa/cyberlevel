import { Plus, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TFakeChatForm } from "./fake-chat-form";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type FakeChatFormItemProps = {
  mIndex: number;
  onRemove: () => void;
};

export function FakeChatFormItem({ mIndex, onRemove }: FakeChatFormItemProps) {
  const { control } = useFormContext<TFakeChatForm>();

  const optionsField = useFieldArray({
    control,
    name: `messages.${mIndex}.options`,
  });

  return (
    <Card>
      <CardContent className="space-y-4">
        {/* Mensagem da personagem */}
        <FormField
          control={control}
          name={`messages.${mIndex}.characterMessage`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={`${mIndex + 1}ª mensagem da personagem`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Opções */}
        <ul className="list-disc space-y-4">
          {optionsField.fields.map((opt, oIndex) => (
            <li key={opt.id} className="ml-6 list-item">
              <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                {/* Texto */}
                <FormField
                  control={control}
                  name={`messages.${mIndex}.options.${oIndex}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder={`Opção ${oIndex + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* É seguro? */}
                <FormField
                  control={control}
                  name={`messages.${mIndex}.options.${oIndex}.isSafe`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Seguro
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Excluir */}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => optionsField.remove(oIndex)}
                  disabled={optionsField.fields.length <= 2}
                >
                  <Trash className="h-4 w-4" />
                </Button>

                {/* Feedback */}
                <FormField
                  control={control}
                  name={`messages.${mIndex}.options.${oIndex}.feedback`}
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <Textarea
                          placeholder="Feedback para esta opção"
                          className="max-h-40 resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </li>
          ))}

          {/* Adicionar opção */}
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              optionsField.append({
                text: "",
                feedback: "",
                isSafe: false,
              })
            }
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Adicionar opção
          </Button>
        </ul>
      </CardContent>

      {/* Remover mensagem */}
      <CardFooter className="flex justify-end">
        <Button type="button" variant="destructive" onClick={onRemove}>
          Remover mensagem
        </Button>
      </CardFooter>
    </Card>
  );
}
