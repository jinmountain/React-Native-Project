import Firebase from '../../firebase/config'
// import { navigate } from '../../navigationRef';

const getTagsHotFire = () => {
	return new Promise ((res, rej) => {
		const tagsRef = Firebase.firestore().collection("tags");
		tagsRef
		.orderBy("heat", "desc")
		.limit(10)
		.get()
    .then((querySnapshot) => {
    	const trendingTags = []
      querySnapshot.forEach(function(doc) {
        const tag = doc.data();
        trendingTags.push(
        	tag
        );
      });
      res(trendingTags);
    })
    .catch(function(error) {
      console.log("Error occured during fetching tredning tags: ", error);
    });
	})
};

export default { getTagsHotFire };