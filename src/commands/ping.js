const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('يختبر استجابة البوت'),
  async execute(interaction) {
    try {
      await interaction.reply({ content: '🏓 جاري حساب التأخير...', fetchReply: true });
      const latency = Date.now() - interaction.createdTimestamp;
      await interaction.editReply(`🏓 تم الاتصال — التأخير: ${latency} مللي ثانية`);
    } catch (error) {
      console.error('خطأ في أمر ping:', error);
      if (!interaction.replied) await interaction.reply({ content: 'حدث خطأ أثناء تنفيذ أمر ping.', ephemeral: true });
    }
  },
};
