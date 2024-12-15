import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  try {
    const product_category = await getCategoryByHandle(params.category)

    const title = product_category.name

    const description = product_category.description ?? `${title} category.`

    return {
      title: `${title} | Electropedia`,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export async function generateStaticParams() {
  try {
    const regions = await listRegions().catch(() => null)
    const countryCodes = regions
      ?.map((r) => r.countries?.map((c) => c.iso_2))
      .flat()
      .filter(Boolean) as string[]

    if (!countryCodes || countryCodes.length === 0) {
      console.warn("No country codes found, falling back to default")
      return [{ countryCode: "id", category: ["all"] }]
    }

    const categories = await listCategories().catch(() => [])
    
    if (!categories || categories.length === 0) {
      console.warn("No categories found, falling back to default")
      return countryCodes.map(countryCode => ({
        countryCode,
        category: ["all"]
      }))
    }

    const params = countryCodes
      .map((countryCode) =>
        categories.map((category) => {
          const handle = category.handle || ""
          return {
            countryCode,
            category: handle.split("/"),
          }
        })
      )
      .flat()
      .filter(param => param.category.length > 0)

    return params
  } catch (error) {
    console.error("Error generating static params:", error)
    return [{ countryCode: "id", category: ["all"] }]
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const categories = await listCategories()

  const currentCategory = categories.find(
    (category) => category.handle === params.category.join("/")
  )

  if (!currentCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      categories={categories}
      currentCategory={currentCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
