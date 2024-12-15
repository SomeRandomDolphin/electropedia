"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  try {
    const next = {
      ...(await getCacheOptions("regions")),
      revalidate: 3600,
    }

    const response = await sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>(
      `/store/regions`,
      {
        method: "GET",
        next,
      }
    )

    return response.regions || []
  } catch (error) {
    console.error("Error listing regions:", error)
    return []
  }
}

export const retrieveRegion = async (id: string) => {
  try {
    const next = {
      ...(await getCacheOptions(["regions", id].join("-"))),
      revalidate: 3600,
    }

    const response = await sdk.client.fetch<{ region: HttpTypes.StoreRegion }>(
      `/store/regions/${id}`,
      {
        method: "GET",
        next,
      }
    )

    return response.region
  } catch (error) {
    console.error("Error retrieving region:", error)
    throw error
  }
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions || regions.length === 0) {
      console.warn("No regions found")
      return null
    }

    regions.forEach((region) => {
      if (region?.countries) {
        region.countries.forEach((country) => {
          if (country?.iso_2) {
            regionMap.set(country.iso_2, region)
          }
        })
      }
    })

    return countryCode ? regionMap.get(countryCode) : regionMap.get("us")
  } catch (error) {
    console.error("Error getting region:", error)
    return null
  }
}