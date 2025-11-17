import style from './style.module.css';
export function Loader8() {
	return (
		<div className={style['progress-bar']}>
			<div className={style['progress-fill']}></div>
			<div className={style['progress-fill2']}></div>
		</div>
	);
}
