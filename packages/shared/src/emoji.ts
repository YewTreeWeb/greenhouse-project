export const emojis = {
	bloom: "🌼",
	branch: "🌳",
	bud: "🌸",
	check: "✅",
	compost: "🪱",
	cultivate: "🌾",
	docker: "🐳",
	error: "❌",
	fertilize: "🧪",
	grow: "🌿",
	harvest: "🍂",
	orchard: "🍎",
	planter: "🪴",
	prune: "✂️",
	seed: "🌱",
	sprout: "🌱",
	sunroom: "🌞",
	warn: "⚠️",
	water: "💧",
};

export function logWithEmoji(emoji: keyof typeof emojis, message: string) {
	console.log(`${emojis[emoji]}  ${message}`);
}

const plantEmojiKeys = [
	"bloom",
	"bud",
	"grow",
	"seed",
	"sprout",
	"water",
] as const satisfies readonly (keyof typeof emojis)[];

export function randomPlantEmoji() {
	const key = plantEmojiKeys[Math.floor(Math.random() * plantEmojiKeys.length)];
	return emojis[key];
}
