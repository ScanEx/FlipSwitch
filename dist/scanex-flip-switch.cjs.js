'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function noop() {}

function assign(tar, src) {
	for (var k in src) {
		tar[k] = src[k];
	}return tar;
}

function addLoc(element, file, line, column, char) {
	element.__svelte_meta = {
		loc: { file: file, line: line, column: column, char: char }
	};
}

function run(fn) {
	fn();
}

function append(target, node) {
	target.appendChild(node);
}

function insert(target, node, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations, detach) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detach);
	}
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setData(text, data) {
	text.data = '' + data;
}

function blankObject() {
	return Object.create(null);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = noop;

	this._fragment.d(detach !== false);
	this._fragment = null;
	this._state = {};
}

function destroyDev(detach) {
	destroy.call(this, detach);
	this.destroy = function () {
		console.warn('Component was already destroyed');
	};
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || typeof a === 'function';
}

function fire(eventName, data) {
	var handlers = eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			try {
				handler.__calling = true;
				handler.call(this, data);
			} finally {
				handler.__calling = false;
			}
		}
	}
}

function flush(component) {
	component._lock = true;
	callAll(component._beforecreate);
	callAll(component._oncreate);
	callAll(component._aftercreate);
	component._lock = false;
}

function get$1() {
	return this._state;
}

function init(component, options) {
	component._handlers = blankObject();
	component._slots = blankObject();
	component._bind = options._bind;
	component._staged = {};

	component.options = options;
	component.root = options.root || component;
	component.store = options.store || component.root.store;

	if (!options.root) {
		component._beforecreate = [];
		component._oncreate = [];
		component._aftercreate = [];
	}
}

function on(eventName, handler) {
	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function cancel() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set$1(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	flush(this.root);
}

function _set(newState) {
	var oldState = this._state,
	    changed = {},
	    dirty = false;

	newState = assign(this._staged, newState);
	this._staged = {};

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _stage(newState) {
	assign(this._staged, newState);
}

function setDev(newState) {
	if ((typeof newState === 'undefined' ? 'undefined' : _typeof(newState)) !== 'object') {
		throw new Error(this._debugName + '.set was called without an object of data key-values to update.');
	}

	this._checkReadOnly(newState);
	set$1.call(this, newState);
}

function callAll(fns) {
	while (fns && fns.length) {
		fns.shift()();
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

var protoDev = {
	destroy: destroyDev,
	get: get$1,
	fire: fire,
	on: on,
	set: setDev,
	_recompute: noop,
	_set: _set,
	_stage: _stage,
	_mount: _mount,
	_differs: _differs
};

/* src\FlipSwitch.html generated by Svelte v2.13.4 */

function count(_ref) {
	var items = _ref.items;

	return items.length;
}

function frameIndex(_ref2) {
	var current = _ref2.current,
	    items = _ref2.items,
	    size = _ref2.size,
	    count = _ref2.count;

	if (Array.isArray(items) && count > 0 && 0 <= size && size <= count) {
		return Math.floor(current / size) * size;
	} else {
		return null;
	}
}

function indexInFrame(_ref3) {
	var current = _ref3.current,
	    frameIndex = _ref3.frameIndex;

	return current - frameIndex;
}

function frame(_ref4) {
	var frameIndex = _ref4.frameIndex,
	    items = _ref4.items,
	    size = _ref4.size,
	    count = _ref4.count;

	if (0 <= frameIndex && frameIndex <= count) {
		return items.slice(frameIndex, frameIndex + size);
	} else {
		return [];
	}
}

function data() {
	return {
		items: [],
		size: 0,
		current: null,
		format: function format(x) {
			return x;
		}
	};
}
var methods = {
	next: function next() {
		var _get = this.get(),
		    count = _get.count,
		    current = _get.current;

		if (current != null && current < count - 1) {
			this.set({ current: current + 1 });
		}
	},
	forward: function forward() {
		var _get2 = this.get(),
		    count = _get2.count,
		    current = _get2.current,
		    size = _get2.size;

		if (current != null && current + size < count) {
			this.set({ current: current + size });
		}
	},
	prev: function prev() {
		var _get3 = this.get(),
		    count = _get3.count,
		    current = _get3.current;

		if (current != null && current > 0) {
			this.set({ current: current - 1 });
		}
	},
	back: function back() {
		var _get4 = this.get(),
		    count = _get4.count,
		    current = _get4.current,
		    size = _get4.size;

		if (current != null && current - size >= 0) {
			this.set({ current: current - size });
		}
	}
};

var file = "src\\FlipSwitch.html";

function create_main_fragment(component, ctx) {
	var div, i, text, text_1, i_1, text_2, text_3, text_4, i_2, text_5, text_6, i_3, text_7, current;

	function click_handler(event) {
		component.back();
	}

	function click_handler_1(event) {
		component.prev();
	}

	var each_value = ctx.frame;

	var each_blocks = [];

	for (var i_4 = 0; i_4 < each_value.length; i_4 += 1) {
		each_blocks[i_4] = create_each_block(component, get_each_context(ctx, each_value, i_4));
	}

	function click_handler_2(event) {
		component.next();
	}

	function click_handler_3(event) {
		component.forward();
	}

	return {
		c: function create() {
			div = createElement("div");
			i = createElement("i");
			text = createText("<<");
			text_1 = createText("\r\n    ");
			i_1 = createElement("i");
			text_2 = createText("<");
			text_3 = createText("\r\n    ");

			for (var i_4 = 0; i_4 < each_blocks.length; i_4 += 1) {
				each_blocks[i_4].c();
			}

			text_4 = createText("\r\n    ");
			i_2 = createElement("i");
			text_5 = createText(">");
			text_6 = createText("\r\n    ");
			i_3 = createElement("i");
			text_7 = createText(">>");
			addListener(i, "click", click_handler);
			i.className = "flip-switch svelte-3nsugw";
			addLoc(i, file, 1, 4, 47);
			addListener(i_1, "click", click_handler_1);
			i_1.className = "flip-switch svelte-3nsugw";
			addLoc(i_1, file, 2, 4, 106);
			addListener(i_2, "click", click_handler_2);
			i_2.className = "flip-switch svelte-3nsugw";
			addLoc(i_2, file, 6, 4, 328);
			addListener(i_3, "click", click_handler_3);
			i_3.className = "flip-switch svelte-3nsugw";
			addLoc(i_3, file, 7, 4, 383);
			div.className = "scanex-flip-switch noselect svelte-3nsugw";
			addLoc(div, file, 0, 0, 0);
		},

		m: function mount(target, anchor) {
			insert(target, div, anchor);
			append(div, i);
			append(i, text);
			append(div, text_1);
			append(div, i_1);
			append(i_1, text_2);
			append(div, text_3);

			for (var i_4 = 0; i_4 < each_blocks.length; i_4 += 1) {
				each_blocks[i_4].m(div, null);
			}

			append(div, text_4);
			append(div, i_2);
			append(i_2, text_5);
			append(div, text_6);
			append(div, i_3);
			append(i_3, text_7);
			current = true;
		},

		p: function update(changed, ctx) {
			if (changed.indexInFrame || changed.frameIndex || changed.format || changed.frame) {
				each_value = ctx.frame;

				for (var i_4 = 0; i_4 < each_value.length; i_4 += 1) {
					var child_ctx = get_each_context(ctx, each_value, i_4);

					if (each_blocks[i_4]) {
						each_blocks[i_4].p(changed, child_ctx);
					} else {
						each_blocks[i_4] = create_each_block(component, child_ctx);
						each_blocks[i_4].c();
						each_blocks[i_4].m(div, text_4);
					}
				}

				for (; i_4 < each_blocks.length; i_4 += 1) {
					each_blocks[i_4].d(1);
				}
				each_blocks.length = each_value.length;
			}
		},

		i: function intro(target, anchor) {
			if (current) return;

			this.m(target, anchor);
		},

		o: run,

		d: function destroy$$1(detach) {
			if (detach) {
				detachNode(div);
			}

			removeListener(i, "click", click_handler);
			removeListener(i_1, "click", click_handler_1);

			destroyEach(each_blocks, detach);

			removeListener(i_2, "click", click_handler_2);
			removeListener(i_3, "click", click_handler_3);
		}
	};
}

// (4:4) {#each frame as f, i}
function create_each_block(component, ctx) {
	var span,
	    text_value = ctx.format(ctx.f),
	    text,
	    span_class_value;

	return {
		c: function create() {
			span = createElement("span");
			text = createText(text_value);
			span._svelte = { component: component, ctx: ctx };

			addListener(span, "click", click_handler);
			span.className = span_class_value = "cell " + (ctx.i === ctx.indexInFrame ? 'current' : '') + " svelte-3nsugw";
			addLoc(span, file, 4, 8, 192);
		},

		m: function mount(target, anchor) {
			insert(target, span, anchor);
			append(span, text);
		},

		p: function update(changed, ctx) {
			if ((changed.format || changed.frame) && text_value !== (text_value = ctx.format(ctx.f))) {
				setData(text, text_value);
			}

			span._svelte.ctx = ctx;
			if (changed.indexInFrame && span_class_value !== (span_class_value = "cell " + (ctx.i === ctx.indexInFrame ? 'current' : '') + " svelte-3nsugw")) {
				span.className = span_class_value;
			}
		},

		d: function destroy$$1(detach) {
			if (detach) {
				detachNode(span);
			}

			removeListener(span, "click", click_handler);
		}
	};
}

function get_each_context(ctx, list, i) {
	var child_ctx = Object.create(ctx);
	child_ctx.f = list[i];
	child_ctx.each_value = list;
	child_ctx.i = i;
	return child_ctx;
}

function click_handler(event) {
	var _svelte = this._svelte,
	    component = _svelte.component,
	    ctx = _svelte.ctx;


	component.set({ current: ctx.frameIndex + ctx.i });
}

function FlipSwitch(options) {
	this._debugName = '<FlipSwitch>';
	if (!options || !options.target && !options.root) throw new Error("'target' is a required option");
	init(this, options);
	this._state = assign(data(), options.data);
	this._recompute({ items: 1, current: 1, size: 1, count: 1, frameIndex: 1 }, this._state);
	if (!('items' in this._state)) console.warn("<FlipSwitch> was created without expected data property 'items'");
	if (!('current' in this._state)) console.warn("<FlipSwitch> was created without expected data property 'current'");
	if (!('size' in this._state)) console.warn("<FlipSwitch> was created without expected data property 'size'");

	if (!('format' in this._state)) console.warn("<FlipSwitch> was created without expected data property 'format'");
	this._intro = !!options.intro;

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}

	this._intro = true;
}

assign(FlipSwitch.prototype, protoDev);
assign(FlipSwitch.prototype, methods);

FlipSwitch.prototype._checkReadOnly = function _checkReadOnly(newState) {
	if ('count' in newState && !this._updatingReadonlyProperty) throw new Error("<FlipSwitch>: Cannot set read-only property 'count'");
	if ('frameIndex' in newState && !this._updatingReadonlyProperty) throw new Error("<FlipSwitch>: Cannot set read-only property 'frameIndex'");
	if ('indexInFrame' in newState && !this._updatingReadonlyProperty) throw new Error("<FlipSwitch>: Cannot set read-only property 'indexInFrame'");
	if ('frame' in newState && !this._updatingReadonlyProperty) throw new Error("<FlipSwitch>: Cannot set read-only property 'frame'");
};

FlipSwitch.prototype._recompute = function _recompute(changed, state) {
	if (changed.items) {
		if (this._differs(state.count, state.count = count(state))) changed.count = true;
	}

	if (changed.current || changed.items || changed.size || changed.count) {
		if (this._differs(state.frameIndex, state.frameIndex = frameIndex(state))) changed.frameIndex = true;
	}

	if (changed.current || changed.frameIndex) {
		if (this._differs(state.indexInFrame, state.indexInFrame = indexInFrame(state))) changed.indexInFrame = true;
	}

	if (changed.frameIndex || changed.items || changed.size || changed.count) {
		if (this._differs(state.frame, state.frame = frame(state))) changed.frame = true;
	}
};

module.exports = FlipSwitch;
