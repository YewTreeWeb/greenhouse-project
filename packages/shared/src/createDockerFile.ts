import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { formatErrorMsg } from "./errorHandler.js";

export interface DockerOptions {
	buildArgs?: Record<string, string>;
	context?: string;
	dockerfile?: string;
	name: string;
	port?: number;
}

export function buildDockerImage(options: DockerOptions) {
	const {
		buildArgs = {},
		context = ".",
		dockerfile = "Dockerfile",
		name,
	} = options;

	console.log(`🐳 Building Docker image: ${name}`);

	const args = ["build", "-t", name, "-f", dockerfile, context];
	for (const [key, val] of Object.entries(buildArgs)) {
		args.push("--build-arg", `${key}=${val}`);
	}

	const result = spawnSync("docker", args, { stdio: "inherit" });

	if (result.status !== 0) {
		console.error(formatErrorMsg(result.error));
		throw new Error("Docker build failed!");
	}

	console.log(`✅ Docker image '${name}' built successfully.`);
}

export function runDockerContainer(options: DockerOptions) {
	const { name, port } = options;
	console.log(`🌱 Starting container from image: ${name}`);

	const args = ["run", "--rm", "-d"];
	if (port) args.push("-p", `${port}:${port}`);
	args.push("--name", name, name);

	const result = spawnSync("docker", args, { stdio: "inherit" });

	if (result.status !== 0) {
		console.error(formatErrorMsg(result.error));
		throw new Error("Failed to start Docker container!");
	}

	console.log(
		`🚀 Container '${name}' is now running${port ? ` on port ${port}` : ""}.`,
	);
}

export function stopDockerContainer(name: string) {
	console.log(`🪴 Stopping container '${name}'...`);
	spawnSync("docker", ["stop", name], { stdio: "inherit" });
	console.log(`🧹 Container '${name}' stopped and removed.`);
}

export function generateDefaultDockerfile(projectDir: string) {
	const dockerfilePath = path.join(projectDir, "Dockerfile");
	if (fs.existsSync(dockerfilePath)) {
		console.log("🪵 Dockerfile already exists, skipping generation.");
		return;
	}

	const dockerfileContent = `
# 🌱 Greenhouse Sandbox Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install
CMD ["pnpm", "dev"]
  `.trim();

	fs.writeFileSync(dockerfilePath, dockerfileContent);
	console.log("📦 Default Dockerfile created for project.");
}
