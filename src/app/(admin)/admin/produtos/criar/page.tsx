import { ProductForm } from "@/components/product-form";

export default async function CreateProductsPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Criar Produto</h1>
      <div className="w-full max-w-md">
        <ProductForm />
      </div>
    </div>
  );
}
