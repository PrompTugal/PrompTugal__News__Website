// The release history: admin/versions.json, written by CI (admin/build/tag_release.sh), never by hand.
import { readJSON } from './config.mjs'
export const loadVersions = () => readJSON('admin/versions.json')
