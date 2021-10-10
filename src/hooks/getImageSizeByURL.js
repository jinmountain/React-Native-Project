export default () => {
	const getImageSizePromise = new Promise ((res, rej) => {
		Image.getSize(
			imageUri, 
			(width, height) => {
				const size = {
					"width": width,
					"height": height
				}
				res(size);
			},
			(error) => {
				console.log("Error occured during getting the photo size: ", error);
			}
		);
	});

	return [getImageSizePromise];
};