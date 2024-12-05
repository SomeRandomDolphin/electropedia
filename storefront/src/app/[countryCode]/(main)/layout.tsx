import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { ArrowUpRightMini, ExclamationCircleSolid } from "@medusajs/icons"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import { NavigationHeader } from "@modules/layout/templates/nav"
import { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer().catch(() => null)
  const cart = await retrieveCart()

  return (
    <>
      <NavigationHeader />
      <div className="flex items-center text-neutral-50 justify-center small:p-4 p-2 text-center bg-neutral-900 small:gap-2 gap-1 text-sm">
        <div className="flex flex-col small:flex-row small:gap-2 gap-1 items-center">
          <span className="flex items-center gap-1">
            <ExclamationCircleSolid className="inline" color="#A1A1AA" />
            This website is still in development. Some features may not work as expected.
          </span>
        </div>
      </div>

      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {props.children}
      <Footer />
    </>
  )
}
