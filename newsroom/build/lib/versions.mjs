// The release history: newsroom/versions.json, written by CI (newsroom/build/tag_release.sh), never by hand.
import { readJSON } from './config.mjs'
export const loadVersions = () => readJSON('newsroom/versions.json')
