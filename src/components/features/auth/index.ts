/**
 * Auth feature exports
 */
export { default as PasswordProtection } from "./PasswordProtection.astro";
export { default as Encryptor } from "./Encryptor.astro";
export type { PasswordProtectionProps, EncryptorProps } from "./types";
export type {
	DecryptResult,
	ValidationMessages,
	UnlockCallbacks,
	CopyCodeOptions,
} from "./types/auth";
