
import ProductsList from "../pages/ProductsList";
import MarketingList from "../pages/MarketingList";
import OrderList from "../pages/OrderList";
import MediaPlans from "../pages/MediaPlans";
import OfferPricingSKUs from "../pages/OfferPricingSKUs";
import Clients from "../pages/Clients";
import Suppliers from "../pages/Suppliers";
import CustomerSupport from "../pages/CustomerSupport";
import SalesReports from "../pages/SalesReports";
import FinanceAccounting from "../pages/FinanceAccounting";

export const PAGES = {
  productslist: { label: "Products List", Component: ProductsList },
  marketinglist: { label: "Marketing List", Component: MarketingList },
  orderlist: { label: "Order List", Component: OrderList },
  mediaplans: { label: "Media Plans", Component: MediaPlans },
  offerpricingskus: { label: "Offer Pricing SKUs", Component: OfferPricingSKUs },
  clients: { label: "Clients", Component: Clients },
  suppliers: { label: "Suppliers", Component: Suppliers },
  customersupport: { label: "Customer Support", Component: CustomerSupport },
  salesreports: { label: "Sales Reports", Component: SalesReports },
  financeaccounting: { label: "Finance & Accounting", Component: FinanceAccounting },
};
