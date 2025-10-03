"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { formatPrismaError } from "@/lib/format-prisma-error";
import { decimalToNumber } from "@/lib/prisma-helpers";

export async function getActiveProducts() {
  try {
    const products = await db.product.findMany({
      orderBy: { name: "asc" },
      where: { active: true },
    });

    return decimalToNumber(products);
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao buscar produtos ativos:", message);
    throw new Error(`Erro ao buscar produtos ativos: ${message}`);
  }
}

export async function getCart(userId: string) {
  try {
    const cart = await db.shoppingCart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    return cart ? decimalToNumber(cart) : null;
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao buscar carrinho:", message);
    throw new Error(`Erro ao buscar carrinho: ${message}`);
  }
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity = 1,
) {
  try {
    const cart = await db.shoppingCart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const item = await db.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: { increment: quantity } },
    });

    revalidatePath("/");
    return decimalToNumber(item);
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao adicionar item no carrinho:", message);
    throw new Error(`Erro ao adicionar item no carrinho: ${message}`);
  }
}

export async function removeFromCart(userId: string, productId: string) {
  try {
    const cart = await db.shoppingCart.findUnique({ where: { userId } });
    if (!cart) return null;

    const item = await db.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    revalidatePath("/");
    return decimalToNumber(item);
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao remover item do carrinho:", message);
    throw new Error(`Erro ao remover item do carrinho: ${message}`);
  }
}

export async function getWishlist(userId: string) {
  try {
    const wishlist = await db.wishlist.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    return wishlist ? decimalToNumber(wishlist) : null;
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao buscar wishlist:", message);
    throw new Error(`Erro ao buscar wishlist: ${message}`);
  }
}

export async function addToWishlist(
  userId: string,
  productId: string,
  note?: string,
) {
  try {
    const wishlist = await db.wishlist.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const item = await db.wishlistItem.upsert({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
      create: { wishlistId: wishlist.id, productId, note },
      update: { note },
    });

    revalidatePath("/");
    return decimalToNumber(item);
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao adicionar item dos favoritos:", message);
    throw new Error(`Erro ao adicionar item dos favoritos: ${message}`);
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  try {
    const wishlist = await db.wishlist.findUnique({ where: { userId } });
    if (!wishlist) return null;

    const item = await db.wishlistItem.delete({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });

    revalidatePath("/");
    return decimalToNumber(item);
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao remover item dos favoritos:", message);
    throw new Error(`Erro ao remover item dos favoritos: ${message}`);
  }
}

export async function removeAllFromWishlist(userId: string) {
  try {
    const wishlist = await db.wishlist.findUnique({ where: { userId } });
    if (!wishlist) return null;

    await db.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id },
    });

    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao remover todos os itens dos favoritos:", message);
    throw new Error(`Erro ao remover todos os itens dos favoritos: ${message}`);
  }
}
