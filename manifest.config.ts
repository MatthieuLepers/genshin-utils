import { env } from 'node:process'
import type { ManifestV3Export } from '@crxjs/vite-plugin'
import packageJson from './package.json'

const { version, name } = packageJson
const [major, minor, patch, label = '0'] = version
  .replace(/[^\d.-]+/g, '')
  .split(/[.-]/)
;

export default {
  name: env.mode === 'staging' ? `[INTERNAL] ${name}` : name,
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  manifest_version: 3,
  action: {
    default_popup: 'src/index.html',
    default_title: 'Genshin Utils',
    default_icon: {
      19: 'icons/19.png',
      38: 'icons/38.png',
    },
  },
  background: {
    service_worker: 'src/background.ts',
    type: 'module',
  },
  offline_enabled: true,
  permissions: ['storage'],
  icons: {
    16: 'icons/16.png',
    48: 'icons/48.png',
    128: 'icons/128.png'
  },
} as ManifestV3Export