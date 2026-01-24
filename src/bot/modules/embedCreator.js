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
  }
  return embed;
}

module.exports = createEmbed;