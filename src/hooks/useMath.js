const roundUpFirstDec = (number) => {
	const roundedUpNum = (Math.round(number * 10) / 10).toFixed(1);
	return roundedUpNum;
};

export { roundUpFirstDec }