const has = Object.prototype.hasOwnProperty;

export function dequal(foo, bar) {
	let ctor, len;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();

		if (ctor === Array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor)) {
					if (!has.call(bar, ctor) || !dequal(foo[ctor], bar[ctor])) return false;
					len++;
				}
			}
			return Object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}
