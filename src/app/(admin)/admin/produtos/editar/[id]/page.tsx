import { ProductForm } from "@/components/product-form";
import { db } from "@/lib/prisma";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const productData = await db.product.findUnique({
    where: { id },
  });

  if (!productData) return <p>Produto não encontrado</p>;

  const product = { ...productData, price: Number(productData.price) };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Editar Produto</h1>
      <div className="w-full max-w-md">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
