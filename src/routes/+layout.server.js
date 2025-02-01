export function load({ cookies }) {
    return {
        theme: cookies.get('theme') || 'system'
    }
}