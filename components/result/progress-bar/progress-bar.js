
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { easeQuadInOut } from 'd3-ease';
import styles from './progress-bar.module.css';
import ProgressProvider from './progress-provider';


export default function ProgressBar({ percentOfCorrectAnswers }) {
    	return (
		<div className={styles.result_progressCircle}>
			<ProgressProvider
				valueStart={0}
				valueEnd={percentOfCorrectAnswers}
				duration={10}
				easingFunction={easeQuadInOut}>
				{(value) => {
					const roundedValue = Math.round(value);
					return (
						<CircularProgressbar
							value={value}
							text={`${roundedValue}%`}
							styles={buildStyles({
								pathTransition: 'none',
								textColor: '#bababa',
								pathColor: '#048c80',
								trailColor: '#bababa',
							})}
						/>
					);
				}}
			</ProgressProvider>
		</div>
	);
}