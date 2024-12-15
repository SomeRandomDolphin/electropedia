"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, any>) => {
  try {
    const next = {
      ...(await getCacheOptions("categories")),
      revalidate: 3600,
    }

    const limit = query?.limit || 100

    const response = await sdk.client.fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields: "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
      }
    )

    return response.product_categories || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  try {
    const handle = `${categoryHandle.join("/")}`

    const next = {
      ...(await getCacheOptions("categories")),
      revalidate: 3600,
    }

    const response = await sdk.client.fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
      }
    )

    if (!response.product_categories?.length) {
      throw new Error(`Category not found: ${handle}`)
    }

    return response.product_categories[0]
  } catch (error) {
    console.error("Error fetching category by handle:", error)
    throw error
  }
}