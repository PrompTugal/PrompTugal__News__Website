// The 404 page: served from any depth, so its links are absolute; not in the sitemap or llms.txt.
export const order = 99

export function pages() {
    return [{
        rel: '404.html', title: 'Not found', summary: 'There is no page at this address.', type: 'site',
        md: 'Try [the newsroom](index.md) or [llms.txt](llms.txt).', section: '', crumbs: [], absolute: true, listed: false,
    }]
}
