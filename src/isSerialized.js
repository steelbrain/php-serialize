// @flow

/**
 * Check value to find if it was serialized.
 * @param { Any } item - Value to check to see if was serialized.
 * @param { Boolean } strict - Whether to be strict about the end of the string. Default value: strict
 */
export default function isSerialized(item: any, strict: Boolean = strict){
    if ( typeof item  !== 'string') return false;

    item = item.replace(/^(\s*)|(\s*)$/g, '');

    if(item === 'N;') return true

    if(item.length < 4) return false

    if(item[1] !== ':') return false

    if(strict) {
        const lastc = item.substr(-1);
        if ( ';' !== lastc && '}' !== lastc ) {
            return false;
        }
    } else {
        const semicolon = item.indexOf(';')
        const brace = item.indexOf('}')
        // Either ; or } must exist.
        if ( false === semicolon && false === brace ) {
            return false;
        }
        // But neither must be in the first X characters.
        if ( false !== semicolon && semicolon < 3 ) {
            return false;
        }
        if ( false !== brace && brace < 4 ) {
            return false;
        }
    }

    const token = item[0];

    switch ( token ) {
        case 's':
            if ( strict ) {
                if ( '"' !== item.substr(-2, 1) ) {
                    return false;
                }
            } else if ( false === item.indexOf('"') ) {
                return false;
            }
            // or else fall through
        case 'a':
        case 'O':
            return item.match(new RegExp("^" + token + ":[0-9]+:", "s")) !== null
        case 'b':
        case 'i':
        case 'd':
            const end = strict ? '$' : '';
            return item.match(new RegExp("^" + token + ":[0-9.E-]+;" + end)) !== null
    }
    return false;
}