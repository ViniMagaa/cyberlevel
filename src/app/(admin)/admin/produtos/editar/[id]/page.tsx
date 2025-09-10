import { ProductForm } from "@/components/product-form";
import { getProductById } from "../../actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return <p>Produto não encontrado</p>;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Editar Produto</h1>
      <div className="w-full max-w-md">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
