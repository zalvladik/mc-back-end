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

  private ROLE_NOOB_ID = process.env.ROLE_NOOB_ID

  private ROLE_PRO_ID = process.env.ROLE_PRO_ID

  private ROLE_PLAYER_ID = process.env.ROLE_PLAYER_ID

  private DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

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
        `Вас уже добавленно в whitelist, ваш нікнейм: **${userByDiscordUserId.username}**`,
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
          where: { discordUserId: member.id },
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
            { discordUserRoles, isExistInDsServer: false },
          )

          await this.userRepository.update(
            { username: user.username },
            { refreshToken: null },
          )

          try {
            const embed = new EmbedBuilder()
              .setDescription(
                `> Вас **видалено** з **whitelist**! :x:
Щоб знову зайти на сервер, вам потрібно вернутись на діскрод сервер UK-land!`,
              )
              .setColor('#FF0000')

            member.send({ embeds: [embed] })
          } catch (e) {
            this.logger.verbose('Користувач не приймає повідомлення в ПП')
          }
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
Вам варто дізнатись про функції на сервері: https://discord.com/channels/991308923581779988/1280103451522633799
                
>>> :globe_with_meridians: **Версія**: 1.21
:link: **IP**: uk-land.space
:desktop: **Сайт**: https://uk-land-site.vercel.app/
:map: **Карта**: https://map.uk-land.space/`,
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
            { isExistInDsServer: false },
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
Вам варто дізнатись про функції на сервері: https://discord.com/channels/991308923581779988/1280103451522633799
                  
>>> :globe_with_meridians: **Версія**: 1.21
:link: **IP**: uk-land.space
:desktop: **Сайт**: https://uk-land-site.vercel.app/
:map: **Карта**: https://map.uk-land.space/`,
              )
              .setColor('#00FF00')
            await member.send({ embeds: [embed] })
          } catch (e) {
            this.logger.verbose('Користувач не приймає повідомлення в ПП')
          }
        }
      } catch (error) {
        this.logger.error(
          `Ошибка при восстановлении пользователя в whitelist: ${error.message}`,
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

          if (!validPattern.test(newUsername)) {
            await message.delete()

            try {
              const embed = new EmbedBuilder()
                .setDescription(`Хибний набір символів для нікнейму. :x:`)
                .setColor('#FF0000')

              message.author.send({ embeds: [embed] })
            } catch (e) {
              this.logger.verbose('Користувач не приймає повідомлення в ПП')
            }

            return
          }

          if (message.content.length < 3) {
            await message.delete()

            try {
              const embed = new EmbedBuilder()
                .setDescription(`Мінімальна кількість символів **3** :x:`)
                .setColor('#FF0000')

              message.author.send({ embeds: [embed] })
            } catch (e) {
              this.logger.verbose('Користувач не приймає повідомлення в ПП')
            }

            return
          }

          if (message.content.length > 16) {
            await message.delete()

            try {
              const embed = new EmbedBuilder()
                .setDescription(`Максимальна кількість символів **16** :x:`)
                .setColor('#FF0000')

              message.author.send({ embeds: [embed] })
            } catch (e) {
              this.logger.verbose('Користувач не приймає повідомлення в ПП')
            }

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

          try {
            const embed = new EmbedBuilder()
              .setDescription(
                `Попасти в whitelist можна тільки, якщо ваш ДС аккаунт має більше 3 місяців.`,
              )
              .setColor('#FF0000')

            message.author.send({ embeds: [embed] })
          } catch (e) {
            this.logger.verbose('Користувач не приймає повідомлення в ПП')
          }
        }
      } catch (error) {
        this.logger.error(error)
      }
    })

    this.client.login(this.DISCORD_BOT_TOKEN)
  }
}
