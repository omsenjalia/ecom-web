# India Post Integration Plan

Integrating India Post for ecommerce deliveries involves several steps, as India Post operates both as a traditional postal service and increasingly as an ecommerce logistics provider.

Below is an overview of how we can integrate India Post into the Ram Chashma Ghar platform.

## 1. Understanding India Post's E-Commerce Offerings
India Post provides specific services for ecommerce, primarily under the "Business Parcel" and "Express Parcel" categories. They also offer a Cash on Delivery (COD) service where the postman collects cash from the customer and remits it to the seller via e-Payment.

## 2. Integration Approaches

### Approach A: Direct India Post API Integration
India Post provides a track and trace API, but gaining access to their modern APIs (like booking and manifest generation) often requires a formal business tie-up and navigating significant bureaucratic procedures.

**Pros:** Direct relationship, potentially lowest shipping costs.
**Cons:** Poor developer experience, slow onboarding process, limited direct support, complex API documentation.

### Approach B: Using an Aggregator (Recommended)
The standard and far more robust way to integrate India Post into a modern tech stack (like Next.js) is via a shipping aggregator like **Shiprocket**, **Delhivery**, or **Shyplite**. These aggregators have direct tie-ups with India Post.

**Pros:**
- Single API for India Post + 10 other couriers (BlueDart, Delhivery, Expressbees).
- Modern REST APIs with Webhooks.
- Automatic Airway Bill (AWB) generation.
- Real-time tracking updates pushed to our database.
- Handles COD remittance smoothly.

## 3. Implementation Steps (Aggregator Approach)

If we proceed with the recommended aggregator approach (e.g., using Shiprocket API, which supports India Post):

### Step 1: Database Updates
- Modify the `orders` table to include tracking data:
  - `awb_number` (String)
  - `courier_partner` (String, e.g., 'India Post')
  - `tracking_url` (String)

### Step 2: Shipping API Integration
- Create an API route (`/api/shipping/create-shipment`) that triggers when an order is moved from `confirmed` to `processing` by an admin.
- This endpoint will send order details (address, weight, dimensions, COD amount) to the aggregator API, specifically requesting "India Post".
- The aggregator returns an AWB number and a tracking link.

### Step 3: Webhook Setup
- Set up a webhook listener endpoint (`/api/webhooks/shipping`).
- The aggregator will send real-time status updates (Out for Delivery, Delivered) to this webhook.
- The webhook updates the `order_status` in our Supabase database automatically.

### Step 4: UI Updates
- Update the `/order/[id]` page to display the `awb_number`, `courier_partner` (India Post), and a clickable tracking link.
- Display real-time tracking events if mapped to our timeline UI.

## Next Steps needed from the User

1. **Decide on the Approach:** Do you want to attempt the direct India Post API, or use a shipping aggregator (like Shiprocket) that provides India Post as a service?
2. **Business Registration:** If using an aggregator, you will need to create an account and complete KYC to get API keys.

---
> [!IMPORTANT]
> Let me know which approach you prefer so we can finalize the technical architecture and begin implementation.
