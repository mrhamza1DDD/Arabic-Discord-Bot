const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('يسرد الأوامر المتاحة ويشرح كيفية إضافة أو تعديل الأوامر'),
  async execute(interaction) {
    try {
      const commands = Array.from(interaction.client.commands.values());

      let lines = ['**الأوامر المتاحة:**'];
      for (const cmd of commands) {
        const data = cmd.data && (typeof cmd.data.toJSON === 'function' ? cmd.data.toJSON() : cmd.data);
        lines.push(`• /${data.name} — ${data.description || 'لا وصف'}`);
      }

      lines.push('\n**كيفية إضافة أو تحديث أمر في src/commands/**');
      lines.push('1. أنشئ ملفًا جديدًا داخل `src/commands/`، مثلاً `mycommand.js`.');
      lines.push('2. صدّر `data` من `SlashCommandBuilder()` وصدّر دالة `execute(interaction)`، مثال:');
      lines.push('```js');
      lines.push("const { SlashCommandBuilder } = require('@discordjs/builders');");
      lines.push('module.exports = {');
      lines.push('  data: new SlashCommandBuilder().setName(\'mycommand\').setDescription(\'وصف الأمر\'),');
      lines.push('  async execute(interaction) { /* تنفيذ الأمر */ }');
      lines.push('};');
      lines.push('```');

      lines.push('\n**تسجيل الأوامر (عند بدء التشغيل):**');
      lines.push('ملف `src/index.js` يقوم تلقائياً ببناء مصفوفة التعريفات (`commands`) ثم يستدعي REST:');
      lines.push('```js');
      lines.push('await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });');
      lines.push('```');
      lines.push('أعد تشغيل البوت (`npm start`) بعد إضافة ملف جديد ليتم تسجيل الأمر.');

      lines.push('\n**تسجيل للأغراض الاختبارية (ظهور فوري في سيرفر اختباري):**');
      lines.push('لتسريع ظهور الأوامر أثناء التطوير بدلاً من التسجيل العالمي، غيّر السطر أعلاه إلى:');
      lines.push('```js');
      lines.push('// تسجيل أوامر مخصّصة لسيرفر (guild) فوراً — استبدل GUILD_ID بمعرّف السيرفر');
      lines.push('await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });');
      lines.push('```');

      lines.push('\n**ملاحظة:** تأكد من وجود المتغيرين البيئيين `DISCORD_TOKEN` و`CLIENT_ID`، وأعد تشغيل التطبيق أو إعادة نشره (على Render أو أي خدمة) بعد التغييرات.');

      await interaction.reply({ content: lines.join('\n'), ephemeral: true });
    } catch (error) {
      console.error('خطأ في أمر help:', error);
      if (!interaction.replied) await interaction.reply({ content: 'حدث خطأ أثناء تنفيذ أمر help.', ephemeral: true });
    }
  },
};
