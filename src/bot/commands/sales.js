const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const salesTracker = require('../modules/salesTracker');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sales')
        .setDescription('View recent sales')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of sales to show (5-25)')
                .setMinValue(5)
                .setMaxValue(25)
                .setRequired(false))
        .addStringOption(option =>
            option.setName('filter')
                .setDescription('Filter sales by time period')
                .addChoices(
                    { name: 'All Time', value: 'all' },
                    { name: 'Today', value: 'today' },
                    { name: 'This Week', value: 'week' }
                )
                .setRequired(false)),

    async execute(interaction) {
        const count = interaction.options.getInteger('count') || 10;
        const filter = interaction.options.getString('filter') || 'all';

        const sales = salesTracker.getRecentSales(count, filter);

        if (sales.length === 0) {
            return interaction.reply({
                content: `No sales found for the selected filter: **${filter}**`,
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(`📊 Recent Sales (${filter === 'all' ? 'All Time' : filter === 'today' ? 'Today' : 'This Week'})`)
            .setDescription(`Showing ${sales.length} most recent transaction${sales.length > 1 ? 's' : ''}`)
            .setTimestamp();

        sales.forEach((sale, index) => {
            let title, value;
            const date = new Date(sale.date).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            if (sale.type === 'sale') {
                title = `${index + 1}. 💰 Sale - $${sale.amount.toFixed(2)}`;
                value = `**Product:** ${sale.products}\n**Customer:** ${sale.customer}\n**Date:** ${date}`;
                if (sale.coupon) {
                    value += `\n**Coupon:** ${sale.coupon} (-$${sale.discount.toFixed(2)})`;
                }
            } else if (sale.type === 'refund') {
                title = `${index + 1}. ⚠️ Refund - $${sale.amount.toFixed(2)}`;
                value = `**Product:** ${sale.products}\n**Customer:** ${sale.customer}\n**Date:** ${date}`;
            } else if (sale.type === 'subscription_created') {
                title = `${index + 1}. 🔔 Subscription Started`;
                value = `**Product:** ${sale.product}\n**Plan:** ${sale.plan}\n**Customer:** ${sale.customer}\n**Date:** ${date}`;
            } else if (sale.type === 'subscription_cancelled') {
                title = `${index + 1}. 🔕 Subscription Cancelled`;
                value = `**Product:** ${sale.product}\n**Plan:** ${sale.plan}\n**Customer:** ${sale.customer}\n**Date:** ${date}`;
            }

            embed.addFields({ name: title, value: value, inline: false });
        });

        embed.setFooter({ text: `Total tracked transactions: ${salesTracker.data.sales.length}` });

        await interaction.reply({ embeds: [embed] });
    },
};
