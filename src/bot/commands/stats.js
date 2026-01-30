const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const salesTracker = require("../modules/salesTracker");


/**
 * Formats a number as currency with commas and two decimal places.
 * @param {number} amount - The amount to format.
 * @returns {string} The formatted currency string.
 */
function formatCurrency(amount) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Discord slash command for viewing sales statistics.
 * @type {import('discord.js').SlashCommandBuilder}
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View sales statistics")
    .addStringOption((option) =>
      option
        .setName("period")
        .setDescription("Time period for statistics")
        .addChoices(
          { name: "All Time", value: "all" },
          { name: "Today", value: "today" },
          { name: "This Week", value: "week" },
          { name: "This Month", value: "month" },
        )
        .setRequired(false),
    ),

  /**
   * Executes the stats command, replying with sales statistics for the selected period.
   * @param {import('discord.js').ChatInputCommandInteraction} interaction - The command interaction.
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    if (!interaction.memberPermissions.has("Administrator")) {
      await interaction.reply({
        content: "You must be an administrator to use this command.",
      });
      return;
    }
    const period = interaction.options.getString("period") || "all";
    const stats = salesTracker.getStats(period);
    const topProducts = salesTracker.getTopProducts(5);

    // Get total count from database
    const totalCount = salesTracker.db
      .prepare("SELECT COUNT(*) as count FROM sales")
      .get().count;

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setDescription(
        period === "all"
          ? "All Time Statistics"
          : period === "today"
            ? "Today's Statistics"
            : period === "week"
              ? "This Week's Statistics"
              : "This Month's Statistics",
      )
      .setFooter({
        text: `Data based on ${totalCount} tracked transactions`,
        iconURL: `${interaction.client.user.displayAvatarURL()}`,
      })
      .setTimestamp();

    switch (period) {
      case "today":
        embed.setTitle("Sales Statistics - Today");

        embed.addFields(
          {
            name: `Total Sales for ${new Date().toLocaleDateString()}`,
            value: `${stats.periodSales || 0} sales\n$${formatCurrency(stats.periodRevenue || 0)}`,
            inline: true,
          },
          {
            name: `Total Refunds for ${new Date().toLocaleDateString()}`,
            value: `${stats.periodRefunds || 0} refunds\n$${formatCurrency(stats.periodRefunded || 0)}`,
            inline: true,
          },
          {
            name: `Net Revenue for ${new Date().toLocaleDateString()}`,
            value: `$${formatCurrency((stats.periodRevenue || 0) - (stats.periodRefunded || 0))}`,
            inline: true,
          },
          {
            name: `Average Order Value for ${new Date().toLocaleDateString()}`,
            value:
              stats.periodSales > 0
                ? `$${formatCurrency(stats.periodRevenue / stats.periodSales)}`
                : "$0.00",
            inline: true,
          },
          {
            name: `Refund Rate for ${new Date().toLocaleDateString()}`,
            value:
              stats.periodSales > 0
                ? `${(((stats.periodRefunds || 0) / stats.periodSales) * 100).toFixed(1)}%`
                : "0.0%",
            inline: true,
          },
          {
            name: `Number of Subscriptions for ${new Date().toLocaleDateString()}`,
            value: `${stats.periodSubscriptions || 0} active`,
            inline: true,
          },
        );

        break;
      case "week":
        embed.setTitle("Sales Statistics - This Week");

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);

        embed.addFields(
          {
            name: `Total Sales (Last 7 Days)`,
            value: `${stats.periodSales || 0} sales\n$${formatCurrency(stats.periodRevenue || 0)}`,
            inline: true,
          },
          {
            name: `Total Refunds (Last 7 Days)`,
            value: `${stats.periodRefunds || 0} refunds\n$${formatCurrency(stats.periodRefunded || 0)}`,
            inline: true,
          },
          {
            name: `Net Revenue (Last 7 Days)`,
            value: `$${formatCurrency((stats.periodRevenue || 0) - (stats.periodRefunded || 0))}`,
            inline: true,
          },
          {
            name: `Average Order Value (Last 7 Days)`,
            value:
              stats.periodSales > 0
                ? `$${formatCurrency(stats.periodRevenue / stats.periodSales)}`
                : "$0.00",
            inline: true,
          },
          {
            name: `Refund Rate (Last 7 Days)`,
            value:
              stats.periodSales > 0
                ? `${(((stats.periodRefunds || 0) / stats.periodSales) * 100).toFixed(1)}%`
                : "0.0%",
            inline: true,
          },
          {
            name: `Number of Subscriptions (Last 7 Days)`,
            value: `${stats.periodSubscriptions || 0} new`,
            inline: true,
          },
        );

        break;
      case "month":
        embed.setTitle("Sales Statistics - This Month");

        embed.addFields(
          {
            name: `Total Sales (Last 30 Days)`,
            value: `${stats.periodSales || 0} sales\n$${formatCurrency(stats.periodRevenue || 0)}`,
            inline: true,
          },
          {
            name: `Total Refunds (Last 30 Days)`,
            value: `${stats.periodRefunds || 0} refunds\n$${formatCurrency(stats.periodRefunded || 0)}`,
            inline: true,
          },
          {
            name: `Net Revenue (Last 30 Days)`,
            value: `$${formatCurrency((stats.periodRevenue || 0) - (stats.periodRefunded || 0))}`,
            inline: true,
          },
          {
            name: `Average Order Value (Last 30 Days)`,
            value:
              stats.periodSales > 0
                ? `$${formatCurrency(stats.periodRevenue / stats.periodSales)}`
                : "$0.00",
            inline: true,
          },
          {
            name: `Refund Rate (Last 30 Days)`,
            value:
              stats.periodSales > 0
                ? `${(((stats.periodRefunds || 0) / stats.periodSales) * 100).toFixed(1)}%`
                : "0.0%",
            inline: true,
          },
          {
            name: `Number of Subscriptions (Last 30 Days)`,
            value: `${stats.periodSubscriptions || 0} new`,
            inline: true,
          },
        );

        break;
      default:
        // All time stats
        embed.addFields(
          {
            name: `Total Sales (All Time)`,
            value: `${stats.totalSales || 0} sales\n$${formatCurrency(stats.totalRevenue || 0)}`,
            inline: true,
          },
          {
            name: `Total Refunds (All Time)`,
            value: `${stats.totalRefunds || 0} refunds\n$${formatCurrency(stats.refundedAmount || 0)}`,
            inline: true,
          },
          {
            name: `Net Revenue (All Time)`,
            value: `$${formatCurrency(stats.netRevenue || 0)}`,
            inline: true,
          },
          {
            name: `Average Order Value (All Time)`,
            value: `$${formatCurrency(stats.averageOrderValue || 0)}`,
            inline: true,
          },
          {
            name: `Refund Rate (All Time)`,
            value: `${(stats.refundRate || 0).toFixed(1)}%`,
            inline: true,
          },
          {
            name: `Number of Subscriptions (All Time)`,
            value: `${stats.subscriptions || 0} total`,
            inline: true,
          },
        );

        break;
    }

    if (topProducts.length > 0) {
      const topProductsText = topProducts
        .map((p, i) => `${i + 1}. **${p.product}** - ${p.count} sales`)
        .join("\n");
      embed.addFields({
        name: "Top Products",
        value: topProductsText,
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
