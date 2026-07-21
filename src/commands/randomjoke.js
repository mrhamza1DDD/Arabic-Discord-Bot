const { SlashCommandBuilder } = require('@discordjs/builders');

const jokes = [
  'مرة واحد ذهب إلى السوق واشتري سريراً... قالوا له: لماذا؟ قال: لأني كنت أحلم بأنني نائم.',
  'مرة سأل المعلم طالباً: ما هو جمال؟ قال: عندما أجيب صح وأخذ تقييم جيد.',
  'مرة دجاجة عبرت الطريق فلماذا؟ لأنها أرادت أن ترى الجانب الآخر. 😄'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomjoke')
    .setDescription('يعطيك نكتة عشوائية باللغة العربية'),
  async execute(interaction) {
    try {
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      await interaction.reply({ content: joke });
    } catch (error) {
      console.error('خطأ في أمر randomjoke:', error);
      if (!interaction.replied) await interaction.reply({ content: 'حدث خطأ أثناء تنفيذ أمر randomjoke.', ephemeral: true });
    }
  },
};
