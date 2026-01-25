const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const config = require("../../config/config.json");

const testPayloads = {
  paid: {
    id: "TEST123",
    email: "test@example.com",
    currency: "USD",
    price: 1500,
    vat_applied: false,
    ip_address: "192.168.1.1",
    coupons: [{ code: "SAVE20", percentage: 20, amount: 300 }],
    items: [
      {
        product_id: "1001",
        product_name: "Test Product",
        product_key: "TEST1",
        product_permalink: "https://payhip.com/b/TEST1",
        quantity: "1",
        on_sale: true,
        used_coupon: true,
        coupon_code: "SAVE20",
        coupon_percentage: 20,
        coupon_amount: 300,
        used_social_discount: false,
        used_cross_sell_discount: false,
        used_upgrade_discount: false,
        promoted_by_affiliate: false,
        has_variant: false,
      },
    ],
    payment_type: "card",
    stripe_fee: 50,
    payhip_fee: 40,
    unconsented_from_emails: false,
    is_gift: false,
    stripe_charge_id: "ch_test123",
    date: Math.floor(Date.now() / 1000),
    type: "paid",
    signature: "test_signature",
  },
  subscription_created: {
    subscription_id: "SUB_TEST123",
    customer_id: "CUST_TEST123",
    status: "active",
    customer_email: "test@example.com",
    plan_name: "Premium Plan",
    product_name: "Test Subscription",
    product_link: "TEST_SUB",
    gdpr_consent: "Yes",
    date_subscription_started: Math.floor(Date.now() / 1000),
    customer_first_name: "Test",
    customer_last_name: "User",
    type: "subscription.created",
    signature: "test_signature",
  },
  subscription_deleted: {
    subscription_id: "SUB_TEST123",
    customer_id: "CUST_TEST123",
    status: "canceled",
    customer_email: "test@example.com",
    plan_name: "Premium Plan",
    product_name: "Test Subscription",
    product_link: "TEST_SUB",
    gdpr_consent: "Yes",
    date_subscription_started: Math.floor(Date.now() / 1000) - 86400,
    date_subscription_deleted: Math.floor(Date.now() / 1000),
    customer_first_name: "Test",
    customer_last_name: "User",
    type: "subscription.deleted",
    signature: "test_signature",
  },
  refunded: {
    id: "REF_TEST123",
    email: "test@example.com",
    currency: "USD",
    price: 900,
    vat_applied: false,
    ip_address: "192.168.1.1",
    items: [
      {
        product_id: "1001",
        product_name: "Refunded Test Product",
        product_key: "REF_TEST",
        product_permalink: "https://payhip.com/b/REF_TEST",
        quantity: "1",
        on_sale: false,
        used_coupon: false,
        used_social_discount: false,
        used_cross_sell_discount: false,
        used_upgrade_discount: false,
        promoted_by_affiliate: false,
        has_variant: false,
      },
    ],
    payment_type: "card",
    stripe_fee: 48,
    payhip_fee: 33,
    unconsented_from_emails: false,
    is_gift: false,
    amount_refunded: 900,
    date_refunded: Math.floor(Date.now() / 1000),
    date_created: Math.floor(Date.now() / 1000) - 3600,
    type: "refunded",
    signature: "test_signature",
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Send a test webhook notification")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of webhook event to test")
        .setRequired(true)
        .addChoices(
          { name: "Paid (Sale)", value: "paid" },
          { name: "Subscription Created", value: "subscription_created" },
          { name: "Subscription Deleted", value: "subscription_deleted" },
          { name: "Refunded", value: "refunded" },
        ),
    ),

  async execute(interaction) {
    if (!interaction.memberPermissions.has("Administrator")) {
      await interaction.reply({
        content: "You must be an administrator to use this command.",
      });
      return;
    }
    const eventType = interaction.options.getString("type");
    const payload = testPayloads[eventType];

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const webhookPort = config.webhookConfig.webhookPort;
      const webhookPath = config.webhookConfig.webhookPath;
      const webhookUrl = `http://localhost:${webhookPort}${webhookPath}`;

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await interaction.editReply(
          `Test webhook sent successfully!\n**Type:** ${eventType}\n**Status:** ${response.status} ${response.statusText}`,
        );
      } else {
        await interaction.editReply(
          `Failed to send test webhook.\n**Status:** ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      await interaction.editReply(
        `Error sending test webhook: ${error.message}`,
      );
    }
  },
};
