export const emojis = {
  bloom: '🌼',
  branch: '🌳',
  bud: '🌸',
  check: '✅',
  compost: '🪱',
  cultivate: '🌾',
  docker: '🐳',
  error: '❌',
  fertilize: '🧪',
  grow: '🌿',
  harvest: '🍂',
  orchard: '🍎',
  planter: '🪴',
  prune: '✂️',
  seed: '🌱',
  sprout: '🌱',
  sunroom: '🌞',
  warn: '⚠️',
  water: '💧',
}

export function logWithEmoji(emoji: keyof typeof emojis, message: string) {
  console.log(`${emojis[emoji]}  ${message}`)
}

export function randomPlantEmoji() {
  const keys = Object.keys(emojis).filter((k) => ['bloom', 'bud', 'grow', 'seed', 'sprout', 'water'].includes(k))
  const random = keys[Math.floor(Math.random() * keys.length)]
  return emojis[random as keyof typeof emojis]
}
