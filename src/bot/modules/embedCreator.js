const { EmbedBuilder } = require("discord.js");
const config = require('../../config/config.json');
const { newSale: saleColor, subscription: subscriptionColor, refund: refundColor } = config.embedColors;

/**
 * This function creates a Discord embed message with the provided details.
 * @param {Object} data - Webhook data from Payhip.
 * @returns {EmbedBuilder} - The constructed Discord embed message.
 */

function createEmbed(eventType, data) {
  const embed = new EmbedBuilder().setTimestamp(new Date());

  switch (eventType) {
    case "paid": // New Sale
      const paymentType =
        data.payment_type === "card" ? "stripe" : data.payment_type;
      const vatApplied = data.vat_applied ? "Yes" : "No";

      // Build products list
      let productsList = "";
      if (data.items && data.items.length > 0) {
        productsList = data.items.map((item, index) => {
          let productName = item.product_name;
          if (item.on_sale) {
            productName += " (SALE)";
          }
          return productName + ",";
        }).join("\n");
      } else {
        productsList = "N/A";
      }

      // Check if any coupons were used
      let couponUsed = "No";
      if (data.coupons && data.coupons.length > 0) {
        const totalDiscount = data.coupons.reduce((sum, coupon) => sum + (coupon.amount || 0), 0);
        const couponCode = data.coupons[0].code;
        const percentage = data.coupons[0].percentage;
        couponUsed = `Yes (Code: ${couponCode}, ${percentage}%, -$${(totalDiscount / 100).toFixed(2)})`;
      }

      const description = [
        `**Products:**\n${productsList}`,
        `**Total Price:** $${data.price ? (data.price / 100).toFixed(2) : "0.00"} ${data.currency || "USD"}`,
        `**Payment Type:** ${paymentType}`,
        `**VAT Applied:** ${vatApplied}`,
        `**Coupon Used:** ${couponUsed}`,
        `**Transaction ID:** ${data.id || "N/A"}`,
      ].join("\n");

      embed
        .setTitle("New Sale Completed")
        .setDescription(description)
        .setColor(saleColor);
      break;

    case "subscription.created": // New Subscription
      const subStartDate = data.date_subscription_started ? new Date(data.date_subscription_started * 1000).toLocaleString() : "N/A";
      const customerName = `${data.customer_first_name || ""} ${data.customer_last_name || ""}`.trim() || "N/A";

      const subCreatedDescription = [
        `**Customer:** ${customerName}`,
        //`**Email:** ${data.customer_email || "N/A"}`,
        `**Email: "HIDDEN FOR PRIVACY"`,
        `**Product:** ${data.product_name || "N/A"}`,
        `**Plan:** ${data.plan_name || "N/A"}`,
        `**Status:** ${data.status || "N/A"}`,
        `**Started:** ${subStartDate}`,
        `**Subscription ID:** ${data.subscription_id || "N/A"}`,
      ].join("\n");

      embed
        .setTitle("New Subscription Created")
        .setDescription(subCreatedDescription)
        .setColor(subscriptionColor);
      break;

    case "subscription.deleted": // Subscription Canceled
      const subDeleteStartDate = data.date_subscription_started ? new Date(data.date_subscription_started * 1000).toLocaleString() : "N/A";
      const subDeleteEndDate = data.date_subscription_deleted ? new Date(data.date_subscription_deleted * 1000).toLocaleString() : "N/A";
      const customerDeleteName = `${data.customer_first_name || ""} ${data.customer_last_name || ""}`.trim() || "N/A";

      const subDeletedDescription = [
        `**Customer:** ${customerDeleteName}`,
        //`**Email:** ${data.customer_email || "N/A"}`,
        `**Email: "HIDDEN FOR PRIVACY"`,
        `**Product:** ${data.product_name || "N/A"}`,
        `**Plan:** ${data.plan_name || "N/A"}`,
        `**Status:** ${data.status || "N/A"}`,
        `**Started:** ${subDeleteStartDate}`,
        `**Canceled:** ${subDeleteEndDate}`,
        `**Subscription ID:** ${data.subscription_id || "N/A"}`,
      ].join("\n");

      embed
        .setTitle("Subscription Canceled")
        .setDescription(subDeletedDescription)
        .setColor(subscriptionColor);
      break;

    case "refunded": // Refund Issued
      const refundPaymentType = data.payment_type === "card" ? "stripe" : data.payment_type;
      const refundVatApplied = data.vat_applied ? "Yes" : "No";

      let refundProductsList = "";
      if (data.items && data.items.length > 0) {
        refundProductsList = data.items.map((item) => {
          let productName = item.product_name;
          if (item.on_sale) {
            productName += " (SALE)";
          }
          return productName + ",";
        }).join("\n");
      } else {
        refundProductsList = "N/A";
      }

      const refundAmount = data.amount_refunded || data.price;

      const dateCreated = data.date_created ? new Date(data.date_created * 1000).toLocaleString() : "N/A";
      const dateRefunded = data.date_refunded ? new Date(data.date_refunded * 1000).toLocaleString() : "N/A";

      const refundDescription = [
        `**Products:**\n${refundProductsList}`,
        `**Refund Amount:** $${refundAmount ? (refundAmount / 100).toFixed(2) : "0.00"} ${data.currency || "USD"}`,
        `**Payment Type:** ${refundPaymentType}`,
        `**VAT Applied:** ${refundVatApplied}`,
        `**Original Purchase:** ${dateCreated}`,
        `**Refund Date:** ${dateRefunded}`,
        `**Transaction ID:** ${data.id || "N/A"}`,
      ].join("\n");

      embed
        .setTitle("Refund Issued")
        .setDescription(refundDescription)
        .setColor(refundColor);
      break;
    default:
      embed
        .setTitle("Unknown Event")
        .setDescription("An unknown event type was received.")
        .setColor(0x808080);
      break;
  }
  return embed;
}

module.exports = createEmbed;