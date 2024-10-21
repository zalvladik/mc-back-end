import type { OnModuleInit } from '@nestjs/common'
import { Injectable, ConflictException, Logger } from '@nestjs/common'
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'
import { addMonths, isBefore } from 'date-fns'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Whitelist } from 'src/entities/whitelist.entity'
import { User } from 'src/entities/user.entity'

@Injectable()
export class DiscordBotService implements OnModuleInit {
  private logger = new Logger('DiscordBotService')

  private client: Client

  private TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID

  private COMMUNION_CHANNEL_ID = process.env.COMMUNION_CHANNEL_ID

  private ROLE_NOOB_ID = process.env.ROLE_NOOB_ID

  private ROLE_PRO_ID = process.env.ROLE_PRO_ID

  private ROLE_PLAYER_ID = process.env.ROLE_PLAYER_ID

  private DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

  private GUILD_ID = process.env.GUILD_ID

  constructor(
    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
      ],
    })
  }

  async sendErrorMessage(member: any, message: string): Promise<void> {
    try {
      const embed = new EmbedBuilder()
        .setDescription(message)
        .setColor('#FF0000')

      await member.send({ embeds: [embed] })
    } catch (error) {
      if (error.code === 50007) {
        this.logger.verbose(`User ID ${member.id} error send message`)
      } else {
        this.logger.error(`Error send message: ${error.message}`)
      }
    }
  }

  async pingUserInChannel(discordUserId: string): Promise<void> {
    const channel = await this.client.channels.fetch(this.COMMUNION_CHANNEL_ID)

    const guild = await this.client.guilds.fetch(this.GUILD_ID)
    const member = await guild.members.fetch(discordUserId)

    if (member) {
      await member.roles.remove(this.ROLE_NOOB_ID)
      await member.roles.add(this.ROLE_PRO_ID)
    } else {
      this.logger.error(`Користувача з ID ${discordUserId} не знайдено`)
    }

    if (channel?.isTextBased()) {
      await channel.send(`<@${discordUserId}>`)

      const embed = new EmbedBuilder()
        .setDescription(
          `Вітаю, ви награли більше **48 годин**!
Вам добавлена роль в діскорді - <@&${this.ROLE_PRO_ID}>

Тепер у вас є можливість:
\`\`\`- Відмітити територію на онлайн-карті
- Доступ до серверу з креативом
- Доступ до гілки з ідеями\`\`\`
Дякую що проводиш час на сервері **Vinland** :heart:
Хорошої гри і мирного неба !!!`,
        )
        .setColor('#ee7303')

      await channel.send({ embeds: [embed] })
    }
  }

  async addUser({
    nickname,
    discordUserId,
  }: {
    nickname: string
    discordUserId: string
  }): Promise<void> {
    const userByDiscordUserId = await this.whitelistRepository.findOne({
      where: { discordUserId, isTwink: false },
    })

    if (userByDiscordUserId) {
      throw new ConflictException(
        `Вас уже добавлено в whitelist, ваш нікнейм: **${userByDiscordUserId.username}**`,
      )
    }

    const userByNickName = await this.whitelistRepository.findOne({
      where: { username: nickname },
    })

    if (userByNickName) {
      throw new ConflictException(
        `Нік **${nickname}** зайнятий, придумайте інший нікнейм.`,
      )
    }

    const newUserInWhitelist = this.whitelistRepository.create({
      username: nickname,
      discordUserId,
    })

    await this.whitelistRepository.save(newUserInWhitelist)
  }

  async onModuleInit(): Promise<void> {
    this.client.once('ready', () => {})

    this.client.on('guildMemberRemove', async member => {
      try {
        const user = await this.whitelistRepository.findOne({
          where: { discordUserId: member.id, isTwink: false },
        })

        this.logger.log(user)

        if (user) {
          const discordUserRoles = member.roles.cache
            .filter(
              role =>
                role.id === this.ROLE_NOOB_ID || role.id === this.ROLE_PRO_ID,
            )
            .map(role => role.id)
            .join(',')

          await this.whitelistRepository.update(
            {
              discordUserId: user.discordUserId,
            },
            { isExistInDsServer: false },
          )

          await this.whitelistRepository.update(
            {
              discordUserId: user.discordUserId,
              isTwink: false,
            },
            { discordUserRoles },
          )

          await this.userRepository.update(
            { username: user.username },
            { refreshToken: null },
          )

          await this.sendErrorMessage(
            member,
            `> Щоб знову зайти на майнкрафт сервер, 
вам потрібно вернутись на діскорд сервер Vinland!`,
          )
        }
      } catch (error) {
        this.logger.error(
          `Помилка при видаленні гравця з whitelist: ${error.message}`,
        )
      }
    })

    this.client.on('guildMemberAdd', async member => {
      try {
        const isExistUserInWl = await this.whitelistRepository.findOne({
          where: { discordUserId: member.id, isExistInDsServer: false },
        })

        if (!isExistUserInWl) {
          try {
            const embed = new EmbedBuilder()
              .setDescription(
                `> Вітаю, щоб попасти на сервер, просто напишіть в цей канал свій нікНейм: https://discord.com/channels/991308923581779988/1284457173723775063

Правила майнкрафт-серверу: https://discord.com/channels/991308923581779988/1268922823045546025
Функції функції на сервері: https://discord.com/channels/991308923581779988/1280103451522633799
                
>>> :globe_with_meridians: **Версія**: 1.21
:link: **IP**: vinlad.space
:desktop: **Сайт**: https://vinland-trade.vercel.app/
:map: **Карта**: https://map.vinlad.space/`,
              )
              .setColor('#097FED')
            await member.send({ embeds: [embed] })
          } catch (e) {
            this.logger.verbose('Користувач не приймає повідомлення в ПП')
          }
        }

        if (isExistUserInWl) {
          await this.whitelistRepository.update(
            {
              discordUserId: member.id,
            },
            { isExistInDsServer: true },
          )

          const { guild } = member

          if (guild) {
            const rolesToRestore = isExistUserInWl.discordUserRoles?.split(',')

            if (rolesToRestore) {
              await Promise.all(
                rolesToRestore.map(async roleId => {
                  const role = guild.roles.cache.get(roleId)

                  if (role) {
                    await member.roles.add(role)
                  }
                }),
              )

              await member.roles.add(this.ROLE_PLAYER_ID)
            }
          }

          member.setNickname(isExistUserInWl.username)

          try {
            const embed = new EmbedBuilder()
              .setDescription(
                `> Вітаю, вам **відновленно** доступ в **whitelist**! :tada: :partying_face: :tada:

Правила майнкрафт-серверу: https://discord.com/channels/991308923581779988/1268922823045546025
Функції функції на сервері: https://discord.com/channels/991308923581779988/1280103451522633799
                  
>>> :globe_with_meridians: **Версія**: 1.21
:link: **IP**: vinland.space
:desktop: **Сайт**: https://vinland-trade.vercel.app/
:map: **Карта**: https://map.vinland.space/`,
              )
              .setColor('#00FF00')
            await member.send({ embeds: [embed] })
          } catch (e) {
            this.logger.verbose('Користувач не приймає повідомлення в ПП')
          }
        }
      } catch (error) {
        this.logger.error(
          `Помилка при відновленні гравця в whitelist: ${error.message}`,
        )
      }
    })

    this.client.on('messageCreate', async message => {
      if (message.author.bot) return

      if (message.channel.id !== this.TARGET_CHANNEL_ID) return

      try {
        const accountCreationDate = message.author.createdAt
        const threeMonthsAgo = addMonths(new Date(), -3)

        if (isBefore(accountCreationDate, threeMonthsAgo)) {
          const newUsername = message.content
          const validPattern = /^[a-zA-Z0-9_.-]+$/

          await this.sendErrorMessage(
            message.author,
            'Хибний набір символів для нікнейму. :x:',
          )

          if (!validPattern.test(newUsername)) {
            await message.delete()

            await this.sendErrorMessage(
              message.author,
              'Хибний набір символів для нікнейму. :x:',
            )

            return
          }

          if (message.content.length < 3) {
            await message.delete()

            await this.sendErrorMessage(
              message.author,
              'Мінімальна кількість символів **3** :x:',
            )

            return
          }

          if (message.content.length > 16) {
            await message.delete()

            await this.sendErrorMessage(
              message.author,
              'Максимальна кількість символів **16** :x:',
            )

            return
          }

          const body = {
            nickname: message.content,
            discordUserId: message.author.id,
          }

          try {
            await this.addUser(body)

            const { guild } = message

            if (guild) {
              const member = await guild.members.fetch(message.author.id)

              await member.setNickname(message.content)
              await member.roles.add(this.ROLE_NOOB_ID)
              await member.roles.add(this.ROLE_PLAYER_ID)
            }

            try {
              const embed = new EmbedBuilder()
                .setDescription(
                  'Вітаю, вас добавлено в **whitelist**! 🎉 🥳 🎉',
                )
                .setColor('#00FF00')
              await message.author.send({ embeds: [embed] })
            } catch (e) {
              this.logger.verbose('Користувач не приймає повідомлення в ПП')
            }

            try {
              await message.delete()
            } catch (error) {
              this.logger.error(`Не вдалось видалити повідомлення: ${error}`)
            }
          } catch (error) {
            try {
              const embed = new EmbedBuilder()
                .setDescription(error.message)
                .setColor('#FF0000')

              message.author.send({ embeds: [embed] })
            } catch (error) {
              this.logger.verbose('Користувач не приймає повідомлення в ПП')
            }

            this.logger.error(error)

            if (error instanceof ConflictException) {
              await message.delete()
            } else {
              await message.delete()
            }
          }
        } else {
          await message.delete()

          await this.sendErrorMessage(
            message.author,
            'Попасти в whitelist можна тільки якщо ваш ДС аккаунт був створений 3 місяців назад.',
          )
        }
      } catch (error) {
        this.logger.error(error)
      }
    })

    this.client.login(this.DISCORD_BOT_TOKEN)
  }
}
