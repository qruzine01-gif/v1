const nodemailer = require("nodemailer")
const { orderConfirmationTemplate, statusUpdateTemplate, restaurantCredentialsTemplate } = require("./emailTemplates")

// Create transporter
const createTransporter = () => {
  const useService = (process.env.EMAIL_SERVICE || "").trim()
  const portEnv = Number(process.env.EMAIL_PORT) || 587
  const secureEnv = String(process.env.EMAIL_SECURE || "").toLowerCase() === "true"
  const allowSelfSigned = String(process.env.EMAIL_ALLOW_SELF_SIGNED || "").toLowerCase() === "true"

  const commonOptions = {
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Connection pooling + timeouts to reduce ETIMEDOUT issues
    pool: true,
    maxConnections: Number(process.env.EMAIL_MAX_CONNECTIONS) || 3,
    maxMessages: Number(process.env.EMAIL_MAX_MESSAGES) || 50,
    connectionTimeout: Number(process.env.EMAIL_CONN_TIMEOUT) || 15000, // 15s
    greetingTimeout: Number(process.env.EMAIL_GRT_TIMEOUT) || 10000, // 10s
    socketTimeout: Number(process.env.EMAIL_SOCK_TIMEOUT) || 20000, // 20s
    debug: String(process.env.EMAIL_DEBUG || "").toLowerCase() === "true",
  }

  if (useService) {
    return nodemailer.createTransport({
      service: useService,
      secure: secureEnv, // depends on provider; set via env if needed
      tls: allowSelfSigned ? { rejectUnauthorized: false } : undefined,
      ...commonOptions,
    })
  }

  const port = portEnv
  const secure = secureEnv || port === 465

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure, // true for 465, false otherwise
    tls: allowSelfSigned ? { rejectUnauthorized: false } : undefined,
    ...commonOptions,
  })
}

// Verify email configuration (for health checks)
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    return { configured: true }
  } catch (err) {
    return { configured: false, error: err?.message || String(err) }
  }
}

// Send order confirmation email
const sendOrderConfirmation = async (orderData) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"Restaurant Ordering System" <${process.env.EMAIL_USER}>`,
      to: orderData.customer.email,
      subject: `Order Confirmation - ${orderData.orderID}`,
      html: orderConfirmationTemplate(orderData),
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Order confirmation email sent:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return { success: false, error: error.message }
  }
}

// Send restaurant credentials email
const sendRestaurantCredentials = async (restaurantData, credentials) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"Restaurant Management System" <${process.env.EMAIL_USER}>`,
      to: restaurantData.contactInfo?.email,
      subject: "Restaurant Admin Account Created - Login Credentials",
      html: restaurantCredentialsTemplate(restaurantData, credentials),
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Restaurant credentials email sent:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending restaurant credentials email:", error)
    return { success: false, error: error.message }
  }
}

// Send order status update email
const sendOrderStatusUpdate = async (orderData, newStatus) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"Restaurant Ordering System" <${process.env.EMAIL_USER}>`,
      to: orderData.customer.email,
      subject: `Order Update: ${newStatus} - ${orderData.orderID}`,
      html: statusUpdateTemplate(orderData, newStatus),
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Order status update email sent:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending order status update email:", error)
    return { success: false, error: error.message }
  }
}

// Send bulk notification to restaurant admins
const sendBulkNotification = async (recipients, subject, htmlContent) => {
  try {
    const transporter = createTransporter()
    const results = []

    for (const recipient of recipients) {
      const mailOptions = {
        from: `"Restaurant Management System" <${process.env.EMAIL_USER}>`,
        to: recipient.email,
        subject: subject,
        html: htmlContent,
      }

      try {
        const result = await transporter.sendMail(mailOptions)
        results.push({ email: recipient.email, success: true, messageId: result.messageId })
      } catch (error) {
        results.push({ email: recipient.email, success: false, error: error.message })
      }
    }

    return { success: true, results }
  } catch (error) {
    console.error("Error sending bulk notification:", error)
    return { success: false, error: error.message }
  }
}

// Send daily summary email to restaurant
const sendDailySummary = async (restaurantData, summaryData) => {
  try {
    const transporter = createTransporter()

    const summaryHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Daily Summary - ${restaurantData.name}</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c5aa0;">Daily Summary - ${new Date().toLocaleDateString()}</h2>
        <h3>${restaurantData.name}</h3>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>Today's Performance</h4>
          <p><strong>Total Orders:</strong> ${summaryData.totalOrders}</p>
          <p><strong>Completed Orders:</strong> ${summaryData.completedOrders}</p>
          <p><strong>Total Revenue:</strong> ₹${summaryData.totalRevenue.toFixed(2)}</p>
          <p><strong>Average Order Value:</strong> ₹${summaryData.averageOrderValue.toFixed(2)}</p>
        </div>

        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>Popular Items</h4>
          ${summaryData.popularItems
            .map(
              (item) => `
            <p>${item.name}: ${item.quantity} orders</p>
          `,
            )
            .join("")}
        </div>

        <p>Keep up the great work!</p>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"Restaurant Analytics" <${process.env.EMAIL_USER}>`,
      to: restaurantData.contactInfo?.email,
      subject: `Daily Summary - ${restaurantData.name} - ${new Date().toLocaleDateString()}`,
      html: summaryHTML,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Daily summary email sent:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending daily summary email:", error)
    return { success: false, error: error.message }
  }
}

module.exports = {
  sendOrderConfirmation,
  sendRestaurantCredentials,
  sendOrderStatusUpdate,
  sendBulkNotification,
  sendDailySummary,
  verifyEmailConfig,
}
