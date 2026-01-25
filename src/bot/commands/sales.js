const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const salesTracker = require('../modules/salesTracker');

const ITEMS_PER_PAGE = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sales')
        .setDescription('View recent sales')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of sales to show (10-100)')
                .setMinValue(10)
                .setMaxValue(100)
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

        // Pagination setup
        let currentPage = 0;
        const totalPages = Math.ceil(sales.length / ITEMS_PER_PAGE);

        // Function to create embed for a specific page
        const createEmbed = (page) => {
            const start = page * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const pageSales = sales.slice(start, end);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`Recent Sales (${filter === 'all' ? 'All Time' : filter === 'today' ? 'Today' : 'This Week'})`)
                .setDescription(`Showing ${sales.length} most recent transaction${sales.length > 1 ? 's' : ''}`)
                .setTimestamp();

            pageSales.forEach((sale, index) => {
                let title, value;
                const date = new Date(sale.date).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const globalIndex = start + index + 1;

                if (sale.type === 'sale') {
                    title = `${globalIndex}. Sale - $${sale.amount.toFixed(2)}`;
                    value = `**Product:** ${sale.products}\n**Customer:** ${sale.customer}\n**Date:** ${date}`;
                    if (sale.coupon) {
                        value += `\n**Coupon:** ${sale.coupon} (-$${sale.discount.toFixed(2)})`;
                    }
                } else if (sale.type === 'refund') {
                    title = `${globalIndex}. Refund - $${sale.amount.toFixed(2)}`;
                    value = `**Product:** ${sale.products}\n**Customer:** ${sale.customer}\n**Date:** ${date}`;
                } else if (sale.type === 'subscription_created') {
                    title = `${globalIndex}. Subscription Started`;
                    value = `**Product:** ${sale.product}\n**Plan:** ${sale.plan}\n**Customer:** ${sale.customer}\n**Date:** ${date}`;
                } else if (sale.type === 'subscription_cancelled') {
                    title = `${globalIndex}. Subscription Cancelled`;
                    value = `**Product:** ${sale.product}\n**Plan:** ${sale.plan}\n**Customer:** ${sale.customer}\n**Date:** ${date}`;
                }

                embed.addFields({ name: title, value: value, inline: false });
            });

            // Get total count from database
            const totalCount = salesTracker.db.prepare('SELECT COUNT(*) as count FROM sales').get().count;
            embed.setFooter({ text: `Page ${page + 1}/${totalPages} • Total tracked transactions: ${totalCount}` });

            return embed;
        };

        // Function to create buttons
        const createButtons = (page) => {
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('first')
                        .setLabel('First')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === totalPages - 1),
                    new ButtonBuilder()
                        .setCustomId('last')
                        .setLabel('Last')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === totalPages - 1)
                );
        };

        // Send initial message
        const message = await interaction.reply({
            embeds: [createEmbed(currentPage)],
            components: totalPages > 1 ? [createButtons(currentPage)] : [],
            fetchReply: true
        });

        // If only one page, no need for collector
        if (totalPages <= 1) return;

        // Create collector for button interactions
        const collector = message.createMessageComponentCollector({
            time: 300000 // 5 minutes
        });

        collector.on('collect', async i => {
            // Only allow the command user to use the buttons
            if (i.user.id !== interaction.user.id) {
                return i.reply({
                    content: 'These buttons are not for you!',
                    ephemeral: true
                });
            }

            // Update current page based on button clicked
            if (i.customId === 'first') currentPage = 0;
            else if (i.customId === 'prev') currentPage = Math.max(0, currentPage - 1);
            else if (i.customId === 'next') currentPage = Math.min(totalPages - 1, currentPage + 1);
            else if (i.customId === 'last') currentPage = totalPages - 1;

            // Update the message
            await i.update({
                embeds: [createEmbed(currentPage)],
                components: [createButtons(currentPage)]
            });
        });

        collector.on('end', () => {
            // Disable all buttons when collector expires
            message.edit({
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('first')
                                .setLabel('First')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('prev')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('last')
                                .setLabel('Last')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true)
                        )
                ]
            }).catch(() => {});
        });
    },
};
