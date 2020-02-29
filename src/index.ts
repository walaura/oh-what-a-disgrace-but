import BezierEasing from 'bezier-easing';
import applyCSS from './applyCSS';

const $button = document.createElement('button');
const $action = document.createElement('button');

type UserlandForce = {
	strength: XYCoordinates;
	decay: number;
};

type Force = UserlandForce & {
	appliedStrength: XYCoordinates;
	easing: (t: number) => number;
};

let forces: Force[] = [];

const easeForce = ({
	easing,
	strength,
	appliedStrength,
}: Force): XYCoordinates => {
	let ease = new XYCoordinates(
		appliedStrength.x ? easing(appliedStrength.x / strength.x) : 0,
		appliedStrength.y ? easing(appliedStrength.y / strength.y) : 0
	);
	return ease;
};
const makeForce = (props: UserlandForce): Force => ({
	...props,
	appliedStrength: new XYCoordinates(props.strength.x, props.strength.y),
	easing: BezierEasing(1, 10, 1, -10),
});

$button.innerText = '🤠';
$action.innerText = 'push!';
document.body.appendChild($button);
document.body.appendChild(document.createElement('hr'));
document.body.appendChild($action);

$action.onclick = () => {
	forces.push(
		makeForce({
			strength: new XYCoordinates(200, 0),
			decay: 1,
		})
	);
};

class XYCoordinates {
	public x: number;
	public y: number;

	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	public map(cb: (value: number, axis: 'x' | 'y') => number): void {
		this.x = cb(this.x, 'x');
		this.y = cb(this.y, 'y');
	}
	public add(other: XYCoordinates) {
		this.map((number, axis) => number + other[axis]);
	}
	public substract(other: XYCoordinates) {
		this.map((number, axis) => number - other[axis]);
	}
	public get combined() {
		return this.x + this.y;
	}
	public applyCSS($el: HTMLElement) {
		applyCSS($el, this.x, this.y);
	}
}

let transform = new XYCoordinates(0, 0);

const loop = () => {
	let motion = new XYCoordinates(0, 0);

	forces = forces
		.map((force) => {
			force.appliedStrength.substract(
				new XYCoordinates(
					force.strength.x && force.decay,
					force.strength.y && force.decay
				)
			);
			if (force.appliedStrength.combined > 0) {
				motion.add(easeForce(force));
				console.log(force, easeForce(force));
				return force;
			}
		})
		.filter(Boolean);
	transform.add(motion);
	transform.applyCSS($button);
	requestAnimationFrame(loop);
};

loop();
