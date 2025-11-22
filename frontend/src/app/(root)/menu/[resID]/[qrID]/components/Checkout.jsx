"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, User, Phone, CheckCircle, X, Calendar, Gift } from "lucide-react"
import api from "../../../../../../lib/api"

export default function Checkout({
  isOpen,
  onClose,
  items,
  total,
  onComplete,
  formData,
  setFormData,
  resID,
  qrID,
}) {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resID || !qrID) return
    try {
      setSubmitting(true)

      const payloadItems = items.map(it => {
        const [menuID, variantName] = String(it.id || it.menuID).split(":")
        return {
          menuID,
          quantity: it.quantity,
          variantName: variantName || undefined,
          specialInstructions: it.specialInstructions || "",
        }
      })

      const phoneDigits = String(formData.phone || "").replace(/\D+/g, "")
      const baseLocal = phoneDigits
        ? phoneDigits
        : String(formData.name || "guest")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-") + "-" + Date.now()

      const computedEmail = `${baseLocal}@guest.qruzine`

      const payload = {
        resID,
        qrID,
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: computedEmail,
          dob: formData.dob || undefined,
          anniversary: formData.anniversary || undefined,
        },
        items: payloadItems,
        specialRequest: formData.specialInstructions || "",
      }

      const resp = await api.placeOrder(payload)
      const data = resp?.data?.data || resp?.data || resp
      if (!data || !data.orderID) throw new Error("Failed to place order")

      const confirmation = {
        orderId: data.orderID,
        customerInfo: {
          name: payload.customer.name,
          phone: payload.customer.phone,
          email: payload.customer.email,
          dob: formData.dob || undefined,
          anniversary: formData.anniversary || undefined,
          specialInstructions: formData.specialInstructions || "",
        },
        items,
        total,
        timestamp: data.createdAt || new Date().toISOString(),
        status: data.status || "Pending",
        estimatedTime:
          typeof data.estimatedTime === "number"
            ? `${data.estimatedTime} mins`
            : data.estimatedTime || "—",
      }

      onComplete(confirmation)
    } catch (err) {
      alert(err?.message || "Order failed")
    } finally {
      setSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.phone

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          
          {/* BACKDROP */}
          <motion.button
            aria-label="Close checkout"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* PANEL */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl max-h-[92vh] md:max-h-[90vh] overflow-hidden border-2 shadow-2xl"
            style={{ backgroundColor: "#FFFAFA", borderColor: "rgb(212,175,55)" }}
            initial={{ y: 32, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.9 }}
          >
            {/* SUBMITTING OVERLAY */}
            {submitting && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/80" />
                <div
                  className="relative z-[61] w-full max-w-sm mx-auto rounded-2xl border-2 p-6 text-center"
                  style={{ backgroundColor: "#FFFAFA", borderColor: "rgb(212,175,55)" }}
                >
                  <div
                    className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-t-transparent animate-spin"
                    style={{ borderColor: "rgb(212,175,55)", borderTopColor: "transparent" }}
                  />
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">Placing your order...</h3>
                  <p className="text-sm text-gray-700">Please wait a moment while we confirm your order.</p>
                </div>
              </div>
            )}

            {/* SCROLLABLE CONTENT */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(92vh-64px)] md:max-h-[calc(90vh-80px)]">

              {/* HEADER */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold flex items-center text-gray-900">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Checkout
                </h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="rounded-md hover:bg-gray-100 p-2 text-gray-900"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* FORM START */}
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">

                  {/* CUSTOMER INFO */}
                  <h3 className="text-base font-semibold text-gray-900">Customer Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-2 text-gray-900">
                        <User className="h-4 w-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-900 focus:outline-none focus:ring-2"
                        style={{ borderColor: "rgb(212,175,55)" }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-2 text-gray-900">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-900 focus:outline-none focus:ring-2"
                        style={{ borderColor: "rgb(212,175,55)" }}
                        placeholder="WhatsApp number for e-bill"
                      />
                      <p className="mt-1 text-[11px] text-gray-600">To get e-bill, add your WhatsApp number.</p>
                    </div>
                  </div>

                  {/* BDAY / ANNIVERSARY */}
                  <div
                    className="mt-2 p-4 rounded-xl border-2"
                    style={{ borderColor: "rgb(212,175,55)", backgroundColor: "rgba(212,175,55,0.08)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="h-5 w-5" style={{ color: "rgb(212,175,55)" }} />
                      <h4 className="text-xs font-semibold" style={{ color: "rgb(212,175,55)" }}>
                        Want birthday/anniversary offers? Fill below (optional)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: "rgb(212,175,55)" }}>
                          <Calendar className="h-4 w-4 inline mr-2" />
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={formData.dob || ""}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-900"
                          style={{ borderColor: "rgb(212,175,55)" }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: "rgb(212,175,55)" }}>
                          <Calendar className="h-4 w-4 inline mr-2" />
                          Anniversary
                        </label>
                        <input
                          type="date"
                          value={formData.anniversary || ""}
                          onChange={(e) => setFormData({ ...formData, anniversary: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-900"
                          style={{ borderColor: "rgb(212,175,55)" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SPECIAL INSTRUCTIONS */}
                  <div>
                    <label className="block text-xs font-medium mb-2 text-gray-900">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-900"
                      style={{ borderColor: "rgb(212,175,55)" }}
                      placeholder="Any special requests or dietary preferences..."
                    />
                  </div>

                  <hr style={{ borderColor: "rgb(212,175,55)" }} />

                  {/* ORDER SUMMARY */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-900">Order Summary</h3>
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-900">{item.quantity}x {item.name}</span>
                          <span className="text-gray-900 font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <hr style={{ borderColor: "rgb(212,175,55)" }} />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* NOTE ADDED */}
                  <p className="mt-2 text-[11px] text-gray-500 text-center">
                    Images are for illustration only. Original food may vary.
                  </p>

                  {/* SPACER */}
                  <div className="h-4"></div>

                </div>
              </form>
              {/* FORM END */}
            </div>

            {/* STICKY ACTION BAR */}
            <div
              className="sticky bottom-0 inset-x-0 p-4 border-t-2"
              style={{ backgroundColor: "rgba(212,175,55,0.1)", borderColor: "rgb(212,175,55)" }}
            >
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-6 rounded-lg border-2 font-medium hover:bg-gray-100"
                  style={{ borderColor: "rgb(212,175,55)", backgroundColor: "white", color: "rgb(55,65,81)" }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  form="checkout-form"
                  disabled={!isFormValid || submitting}
                  className="flex-1 py-3 px-6 rounded-lg border-2 font-medium text-white disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #800020 0%, #000000 100%)",
                    borderColor: "rgb(212,175,55)",
                  }}
                >
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  {submitting ? "Placing..." : "Place Order"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
