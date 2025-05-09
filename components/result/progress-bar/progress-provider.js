import { useEffect, useState } from 'react';

export default function ProgressProvider({valueStart, valueEnd, children}) {
	const [value, setValue] = useState(valueStart);

	useEffect(() => {
		setValue(valueEnd);
	}, [valueEnd]);

	return children(value);
}
