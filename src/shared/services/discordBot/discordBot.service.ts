import type { OnModuleInit } from '@nestjs/common'
import { Injectable, ConflictException } from '@nestjs/common'
import { Client, GatewayIntentBits } from 'discord.js'
import { addMonths, isBefore } from 'date-fns'
import { InjectRepository } from '@nestjs/typeorm'
import { Whitelist } from 'src/entities/whitelist.entity'
import { Repository } from 'typeorm'
import { getKievTime } from 'src/shared/helpers/getKievTime'

@Injectable()
export class DiscordBotService implements OnModuleInit {
  private client: Client

  private TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID

  private ROLE_ID = process.env.ROLE_ID

  private DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

  constructor(
    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,
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
      time: getKievTime(),
    })

    await this.whitelistRepository.save(newUserInWhitelist)
  }

  async onModuleInit(): Promise<void> {
    this.client.once('ready', () => {})

    this.client.on('messageCreate', async message => {
      if (message.author.bot) return

      if (message.channel.id !== this.TARGET_CHANNEL_ID) return

      try {
        const accountCreationDate = message.author.createdAt
        const twoMonthsAgo = addMonths(new Date(), -2)

        if (isBefore(accountCreationDate, twoMonthsAgo)) {
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
              await member.roles.add(this.ROLE_ID)
            }

            await message.react('✅')
            await message.author.send(
              `> Вітаю, вас добавлено в **whitelist**! :tada: :partying_face: :tada:`,
            )
          } catch (error) {
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
            `Попасти в whitelist можна тільки, якщо ваш ДС аккаунт має більше 2 місяців.`,
          )
        }
      } catch (error) {
        // console.log('error')
      }
    })

    this.client.login(this.DISCORD_BOT_TOKEN)
  }
}
