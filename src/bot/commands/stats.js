const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const salesTracker = require('../modules/salesTracker');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View sales statistics')
        .addStringOption(option =>
            option.setName('period')
                .setDescription('Time period for statistics')
                .addChoices(
                    { name: 'All Time', value: 'all' },
                    { name: 'Today', value: 'today' },
                    { name: 'This Week', value: 'week' },
                    { name: 'This Month', value: 'month' }
                )
                .setRequired(false)),

    async execute(interaction) {
        const period = interaction.options.getString('period') || 'all';
        const stats = salesTracker.getStats(period);
        const topProducts = salesTracker.getTopProducts(5);

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`📈 Sales Statistics`)
            .setDescription(period === 'all' ? 'All Time Statistics' : 
                           period === 'today' ? 'Today\'s Statistics' :
                           period === 'week' ? 'This Week\'s Statistics' :
                           'This Month\'s Statistics')
            .setTimestamp();

        // Overall stats
        if (period === 'all') {
            embed.addFields(
                { 
                    name: '💰 Total Sales', 
                    value: `${stats.totalSales} sales\n$${stats.totalRevenue.toFixed(2)}`, 
                    inline: true 
                },
                { 
                    name: '⚠️ Refunds', 
                    value: `${stats.totalRefunds} refunds\n$${stats.refundedAmount.toFixed(2)}`, 
                    inline: true 
                },
                { 
                    name: '💵 Net Revenue', 
                    value: `$${stats.netRevenue.toFixed(2)}`, 
                    inline: true 
                },
                { 
                    name: '📊 Average Order Value', 
                    value: `$${stats.averageOrderValue.toFixed(2)}`, 
                    inline: true 
                },
                { 
                    name: '📉 Refund Rate', 
                    value: `${stats.refundRate.toFixed(1)}%`, 
                    inline: true 
                },
                { 
                    name: '🔔 Subscriptions', 
                    value: `${stats.subscriptions} active`, 
                    inline: true 
                }
            );
        } else {
            // Period-specific stats
            embed.addFields(
                { 
                    name: '💰 Sales', 
                    value: `${stats.periodSales || 0} sales\n$${(stats.periodRevenue || 0).toFixed(2)}`, 
                    inline: true 
                },
                { 
                    name: '📊 Average Order', 
                    value: stats.periodSales > 0 
                        ? `$${(stats.periodRevenue / stats.periodSales).toFixed(2)}`
                        : '$0.00', 
                    inline: true 
                },
                { 
                    name: '\u200B', 
                    value: '\u200B', 
                    inline: true 
                }
            );

            // Add all-time comparison
            embed.addFields(
                { 
                    name: '📈 All-Time Comparison', 
                    value: `**Total Sales:** ${stats.totalSales}\n**Total Revenue:** $${stats.totalRevenue.toFixed(2)}\n**Net Revenue:** $${stats.netRevenue.toFixed(2)}`, 
                    inline: false 
                }
            );
        }

        // Top products
        if (topProducts.length > 0) {
            const topProductsText = topProducts
                .map((p, i) => `${i + 1}. **${p.product}** - ${p.count} sales`)
                .join('\n');
            embed.addFields({ 
                name: '🏆 Top Products', 
                value: topProductsText, 
                inline: false 
            });
        }

        embed.setFooter({ text: `Data based on ${salesTracker.data.sales.length} tracked transactions` });

        await interaction.reply({ embeds: [embed] });
    },
};
