import type { Crystal } from 'src/entities/crystal.entity'

export type OpenCrystalLootBoxResponseDto = Omit<Crystal, 'user'>
