"use client";

import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from "@/app/(admin)/admin/produtos/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";
import { AspectRatio } from "./ui/aspect-ratio";
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

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatório"),
  price: z.number("O preço é obrigatório").min(0.01, {
    message: "O preço deve ser maior que 0",
  }),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "O tamanho máximo é 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Apenas .jpg, .png e .webp são suportados",
    )
    .optional(),
  active: z.boolean("Indique se o produto está disponível"),
}); // com File

type TProductFormSchema = z.infer<typeof productSchema>;

type TProductContent = Omit<TProductFormSchema, "image"> & {
  imageUrl?: string;
};

type ProductFormProps = {
  product?: Product;
};

export function ProductForm({ product }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | undefined>(
    product?.imageUrl ?? undefined,
  );

  const form = useForm<TProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: Number(product?.price) ?? undefined,
      image: undefined,
      active:
        typeof product?.active === "boolean"
          ? product.active
          : (undefined as unknown as boolean),
    },
  });

  function onSubmit(data: TProductFormSchema) {
    startTransition(async () => {
      try {
        let imageUrl = product?.imageUrl;

        // Se o usuário selecionar um arquivo novo, faz o upload
        if (data.image) {
          imageUrl = await uploadProductImage(data.image, "products");
        }

        // Monta o payload que será salvo no JSON
        const newProductData: TProductContent = {
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: imageUrl ?? undefined, // <- URL pública do Supabase
          active: data.active,
        };

        if (product && product.id) {
          await updateProduct(product.id, newProductData);
          toast.success("Produto atualizado");
        } else {
          await createProduct(newProductData);
          toast.success("Produto criado");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar produto");
      }
      redirect("/admin/produtos");
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex grow flex-col justify-between gap-4"
      >
        {/* Nome */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Descrição do produto"
                  className="max-h-80 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preço */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <NumericFormat
                  placeholder="Preço do produto"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  allowNegative={false}
                  customInput={Input}
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.floatValue ?? undefined);
                  }}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Imagem (arquivo) */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreview(url);
                    } else {
                      setPreview(undefined);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
              {preview && (
                <AspectRatio ratio={1 / 1}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Pré-visualização"
                    className="h-full w-full rounded-md object-cover"
                  />
                </AspectRatio>
              )}
            </FormItem>
          )}
        />

        {/* Disponível? */}
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex-auto">
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
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
                    <SelectValue placeholder="Selecione a disponibilidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Disponível</SelectItem>
                  <SelectItem value="false">Indisponível</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap justify-between gap-4">
          <Button type="button" variant="link" className="px-0" asChild>
            <Link href="/admin/produtos">
              <ArrowLeft />
              Voltar
            </Link>
          </Button>
          <Button
            type="submit"
            variant="default"
            className="ml-auto disabled:opacity-50"
            disabled={isPending}
          >
            {product ? "Atualizar" : "Criar"}
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
