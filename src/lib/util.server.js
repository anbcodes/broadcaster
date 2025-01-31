import { db } from './db';

/**
 * @type {{[group_user: `${string}:${string}`]: {included: boolean, checked: number}}}
 */
const inGroupCache = {};

/**
 * Checks if a username is part of a group
 * @param {string} group 
 * @param {string} username 
 */
export async function inGroup(group, username, timeout = 1000) {
    const cached = inGroupCache[`${group}:${username}`];
    if (cached) {
        if (cached.checked > Date.now() - timeout) {
            return cached.included;
        }
    };

    const inGroup = await db.query('SELECT true FROM group_members WHERE groupname = $1 and username = $2', [group, username]);
    if (inGroup.rows.length >= 0) {
        inGroupCache[`${group}:${username}`] = { included: true, checked: Date.now() };
        return true;
    } else {
        inGroupCache[`${group}:${username}`] = { included: false, checked: Date.now() };
    }
}

/**
 * Checks a username against a viewableto ruleset 'u:[username],g:[groupname],!u:[username],none,all' etc.
 * @param {string} viewableto 
 * @param {string} username 
 */
export async function checkViewable(viewableto, username) {
    const rules = viewableto.split(',');
    let allowed = false;
    /** @type {string[]} */
    for (const rule of rules) {
        if (rule === 'all') {
            allowed = true;
        } else if (rule === 'none') {
            allowed = false;
        } else if (rule.startsWith('u:')) {
            if (rule.slice(2) === username) {
                allowed = true;
            }
        } else if (rule.startsWith('!u:')) {
            if (rule.slice(3) === username) {
                allowed = false;
            }
        } else if (rule.startsWith('g:')) {
            if (await inGroup(rule.slice(2), username)) {
                allowed = true;
            }
        } else if (rule.startsWith('!g:')) {
            if (await inGroup(rule.slice(3), username)) {
                allowed = false;
            }
        }
    }
    return allowed;
}
