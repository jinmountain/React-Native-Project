const colorByRating = (rating) => {
  // 1-2 (inclusive) red 520F13
  // 2-3 yellow DA9E00
  // 3-4 blue 0C6B94
  // 4-5 purple 6E5BD4
  if (rating >=1 && rating < 2) {
    return "#520F13";
  } 
  else if (rating >= 2 && rating < 3) {
    return "#DA9E00";
  }
  else if (rating >= 3 && rating < 4) {
    return "#0C6B94";
  } else if (rating >= 4 && rating < 5) {
    return "#6E5BD4";
  } else {
    return "#5A646A";
  };
};

export { colorByRating }