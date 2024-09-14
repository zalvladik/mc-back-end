import type { OnModuleInit } from '@nestjs/common'
import { Injectable, ConflictException, Logger } from '@nestjs/common'
import { Client, GatewayIntentBits } from 'discord.js'
import { addMonths, isBefore } from 'date-fns'
import { InjectRepository } from '@nestjs/typeorm'
import { Whitelist } from 'src/entities/whitelist.entity'
import { Repository } from 'typeorm'
import { DsUserLeave } from 'src/entities/ds-user-leave.entity'

@Injectable()
export class DiscordBotService implements OnModuleInit {
  private logger = new Logger('DiscordBotService')

  private client: Client

  private TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID

  private ROLE_NOOB_ID = process.env.ROLE_NOOB_ID

  private ROLE_PLAYER_ID = process.env.ROLE_PLAYER_ID

  private DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

  constructor(
    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,
    @InjectRepository(DsUserLeave)
    private readonly dsUserLeaveRepository: Repository<DsUserLeave>,
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
      where: { discordUserId },
    })

    if (userByDiscordUserId) {
      throw new ConflictException(
        `> Вас уже добавленно в whitelist, ваш нікнейм: **${userByDiscordUserId.user}**`,
      )
    }

    const userByNickName = await this.whitelistRepository.findOne({
      where: { user: nickname },
    })

    if (userByNickName) {
      throw new ConflictException(
        `> Нік **${nickname}** зайнятий, придумайте інший нікнейм.`,
      )
    }

    const newUserInWhitelist = this.whitelistRepository.create({
      user: nickname,
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

        if (user) {
          const newLeaveUser = this.dsUserLeaveRepository.create({
            user: user.user,
            discordUserId: member.id,
            UUID: user.UUID ?? null,
          })

          await this.dsUserLeaveRepository.save(newLeaveUser)

          await this.whitelistRepository.remove(user)

          await member.send(
            `> Вас **видалено** з **whitelist**! :x:
            Щоб знову зайти на сервер, вам потрібно вернутись на діскрод сервер UK-land!`,
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
        const userInLeave = await this.dsUserLeaveRepository.findOne({
          where: { discordUserId: member.id },
        })

        if (userInLeave) {
          const newUserInWhitelist = this.whitelistRepository.create({
            user: userInLeave.user,
            discordUserId: member.id,
            UUID: userInLeave.UUID ?? null,
          })

          await this.whitelistRepository.save(newUserInWhitelist)

          await this.dsUserLeaveRepository.remove(userInLeave)

          const { guild } = member

          if (guild) {
            await member.roles.add(this.ROLE_NOOB_ID)
            await member.roles.add(this.ROLE_PLAYER_ID)
          }

          member.setNickname(userInLeave.user)

          await member.send(
            `> Вітаю, вам **відновленно** доступ в **whitelist**! :tada: :partying_face: :tada:
            Правила майнкрафт-серверу: https://discord.com/channels/991308923581779988/1268922823045546025
            Вам варто дізнатись про функції на сервері: https://discord.com/channels/991308923581779988/1280103451522633799`,
          )
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
            await message.author.send(
              '> :x: Хибний набір символів для нікнейму.',
            )

            return
          }

          if (message.content.length < 3) {
            await message.delete()
            await message.author.send(
              '> :x: Мінімальна кількість символів **3**',
            )

            return
          }

          if (message.content.length > 16) {
            await message.delete()
            await message.author.send(
              '> :x: Максимальна кількість символів **16**',
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

            await message.author.send(
              `> Вітаю, вас добавлено в **whitelist**! :tada: :partying_face: :tada:
              Правила майнкрафт-серверу: https://discord.com/channels/991308923581779988/1268922823045546025
              Вам варто дізнатись про функції на сервері: https://discord.com/channels/991308923581779988/1280103451522633799`,
            )

            try {
              await message.delete()
            } catch (error) {
              this.logger.error(`Не вдалось видалити повідомлення: ${error}`)
            }
          } catch (error) {
            this.logger.error(error)

            if (error instanceof ConflictException) {
              await message.delete()
              await message.author.send(error.message)
            } else {
              await message.delete()
              await message.author.send(
                'Сталась помилка при добавленні гравця в **whitelist**',
              )
            }
          }
        } else {
          await message.delete()
          await message.author.send(
            `Попасти в whitelist можна тільки, якщо ваш ДС аккаунт має більше 3 місяців.`,
          )
        }
      } catch (error) {
        this.logger.error(error)
      }
    })

    this.client.login(this.DISCORD_BOT_TOKEN)
  }
}
