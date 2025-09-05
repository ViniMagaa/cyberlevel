import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { ProductCard } from "./_components/product-card";

export default async function Products() {
  const [products, orders] = await Promise.all([
    db.product.findMany({
      orderBy: { name: "asc" },
    }),
    db.order.findMany({
      include: {
        address: true,
        items: true,
        user: true,
      },
    }),
  ]);

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex w-full flex-wrap justify-between gap-4">
        <h1 className="text-4xl font-bold">Produtos</h1>
        <Button type="button" asChild>
          <Link href="/admin/produtos/criar">Criar produto</Link>
        </Button>
      </div>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, price: Number(product.price) }}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum produto criado.
          </p>
        )}
      </section>
      <section>
        <h2 className="text-3xl font-semibold">Últimos pedidos</h2>
        {orders.length > 0 ? (
          <div>{/* {orders} */}</div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum pedido registrado.
          </p>
        )}
      </section>
    </div>
  );
}
