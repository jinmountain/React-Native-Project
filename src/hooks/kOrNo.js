const kOrNo = (likeCount) => {
  if (likeCount > 1000) {
    const roundedToFirst = Math.round((likeCount/1000) * 10) / 10
    return roundedToFirst + "k"
  } 
  else if (!likeCount) {
  	return 0
  }
  else {
    return likeCount
  }
}

export { kOrNo };