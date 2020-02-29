const applyCSS = ($el, x, y) => {
	if ((window.CSSTransformValue, window.CSSTranslate)) {
		$el.attributeStyleMap.set(
			'transform',
			new window.CSSTransformValue([
				new window.CSSTranslate(CSS.px(x), CSS.px(y)),
			])
		);
	} else {
		console.log('no houdini boo');
		$el.style.transform = `translateX(${x}px) translateY(${y}px)`;
	}
};

export default applyCSS;
