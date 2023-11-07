const spliter = '||';

function has(input: {[key: string]: boolean}): string {
	let res: string = '';

	Object.keys(input).forEach((key) => {
		const hasFalseVal = key.includes(spliter);
		const splited = (hasFalseVal ? key.split(spliter) : [])
		res += (input[key] ? (hasFalseVal ? splited[0] : key) : (hasFalseVal ? splited[1] : '')) + ' ';
	});
	return res;
}

export default {
	has
}