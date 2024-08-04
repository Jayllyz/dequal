const has = Object.prototype.hasOwnProperty;

function find(iter, tar) {
    for (const key of iter.keys()) {
        if (dequal(key, tar)) return key;
    }
}

export function dequal(foo, bar) {
    if (foo === bar) return true;
    if (!foo || !bar || typeof foo !== 'object' || typeof bar !== 'object') return foo !== foo && bar !== bar;

    const ctor = foo.constructor;
    if (ctor !== bar.constructor) return false;

    if (ctor === Date) return foo.getTime() === bar.getTime();
    if (ctor === RegExp) return foo.toString() === bar.toString();

		let len;
    if (ctor === Array) {
        if ((len = foo.length) !== bar.length) return false;
        while (len-- && dequal(foo[len], bar[len]));
        return len === -1;
    }

    if (ctor === Set) {
        if (foo.size !== bar.size) return false;
        for (len of foo) {
            let tmp = len;
            if (tmp && typeof tmp === 'object') {
                tmp = find(bar, tmp);
                if (!tmp) return false;
            }
            if (!bar.has(tmp)) return false;
        }
        return true;
    }

    if (ctor === Map) {
        if (foo.size !== bar.size) return false;
        for (len of foo) {
            let tmp = len[0];
            if (tmp && typeof tmp === 'object') {
                tmp = find(bar, tmp);
                if (!tmp) return false;
            }
            if (!dequal(len[1], bar.get(tmp))) return false;
        }
        return true;
    }

    if (ctor === ArrayBuffer) {
        foo = new Uint8Array(foo);
        bar = new Uint8Array(bar);
    } else if (ctor === DataView) {
        if ((len = foo.byteLength) === bar.byteLength) {
            while (len-- && foo.getInt8(len) === bar.getInt8(len));
        }
        return len === -1;
    }

    if (ArrayBuffer.isView(foo)) {
        if ((len = foo.byteLength) === bar.byteLength) {
            while (len-- && foo[len] === bar[len]);
        }
        return len === -1;
    }

    len = 0;
    for (const key in foo) {
        if (has.call(foo, key)) {
            if (!has.call(bar, key)) return false;
            if (!dequal(foo[key], bar[key])) return false;
            len++;
        }
    }
    return Object.keys(bar).length === len;
}
