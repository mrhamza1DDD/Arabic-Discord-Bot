'use strict';
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

// لو كنت تعمل محلياً يمكن استخدام dotenv (اختياري)
if (process.env.NODE_ENV !== 'production') {
  try { require('dotenv').config(); } catch (e) { /* لا شيء */ }
}

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || !CLIENT_ID) {
  console.error('الرجاء تعيين المتغيرات البيئية DISCORD_TOKEN و CLIENT_ID');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath, { recursive: true });
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (!command.data || !command.execute) {
    console.warn(`تخطي الملف غير الصحيح: ${file}`);
    continue;
  }
  commands.push(command.data.toJSON ? command.data.toJSON() : command.data);
  client.commands.set(command.data.name || (command.data.toJSON && command.data.toJSON().name), command);
}

(async () => {
  try {
    console.log('تسجيل أوامر الشلّاش (Slash Commands) في Discord...');
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('تم تسجيل الأوامر بنجاح.');
  } catch (error) {
    console.error('فشل تسجيل الأوامر:', error);
  }

  client.once('ready', () => {
    console.log(`البوت جاهز ✅ — تسجيل الدخول باسم: ${client.user.tag}`);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply({ content: 'حدث خطأ: الأمر غير معروف.', ephemeral: true });
      return;
    }
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error('خطأ في تنفيذ الأمر:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'حدث خطأ أثناء تنفيذ الأمر.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'حدث خطأ أثناء تنفيذ الأمر.', ephemeral: true });
      }
    }
  });

  client.login(TOKEN);
})();
