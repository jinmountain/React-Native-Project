const kOrNo = (count) => {
  if (count > 1000) {
    const roundedToFirst = Math.round((count/1000) * 10) / 10
    return roundedToFirst + "k"
  } 
  else if (!count) {
  	return 0
  }
  else {
    return count
  }
};

const likeOrLikes = (count) => {
  if (count <= 1) {
    return "like"
  } else {
    return "likes"
  }
};

const commentOrComments = (count) => {
  if (count <= 1) {
    return "comment"
  } else {
    return "comments"
  }
};

export default { kOrNo, likeOrLikes, commentOrComments };