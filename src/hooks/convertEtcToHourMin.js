const convertEtcToHourMin = (etc) => {
	if (etc >= 60) {
		const hour = Math.floor(etc/60)
		const min = ((etc/60) - hour) * 60
		if (min == 0) {
			return hour + ' hour'
		} else {
			return hour + ' hour ' + min + ' min'
		}
	} else {
		return etc + ' min'
	}
}

export default convertEtcToHourMin;