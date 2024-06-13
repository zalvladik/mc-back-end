import { ApiProperty } from '@nestjs/swagger'

export class GetProfileResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'France' })
  realname: string

  @ApiProperty({ example: '3294756312' })
  lastlogin: string
}

export class TexturesSkin {
  @ApiProperty({
    example: {
      url: 'http://textures.minecraft.net/texture/f9669f757cecda1cc2d918a976117703c6129688e7f7ff9a79a728483d1804f8',
    },
  })
  SKIN: {
    url: string
  }

  @ApiProperty({
    example: {
      url: 'http://textures.minecraft.net/texture/2340c0e03dd24a11b15a8b33c2a7e9e32abb2051b2481d0ba7defd635ca7a933',
    },
  })
  CAPE: {
    url: string
  }
}

export class GetUserSkinRsponseDto {
  @ApiProperty({ example: 1716569888216 })
  timestamp: number

  @ApiProperty({ example: 'd563eb4d0a884a60bd09ac4a0e46657f' })
  profileId: string

  @ApiProperty({ example: 'Madara05233' })
  profileName: string

  @ApiProperty({ example: true })
  signatureRequired: boolean

  @ApiProperty({ example: TexturesSkin })
  textures: TexturesSkin
}