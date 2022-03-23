import { createElement, Component } from 'preact';
import style from './style';

export default class App extends Component {
	render() {
		return (
			<iframe class={style.wrapper} src={this.props.children.url}>
			</iframe>
		);
	}
}
