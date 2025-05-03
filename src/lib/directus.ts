import { createDirectus, rest } from '@directus/sdk';

export const directus = createDirectus('http://192.168.178.32:8055').with(rest());
