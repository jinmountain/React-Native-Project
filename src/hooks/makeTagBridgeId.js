const makeTagBridgeId = (firstTag, secondTag) => {
  return new Promise ((res, rej) => {
    const tagArr = [firstTag, secondTag];
    const sortedArr = tagArr.sort();
    const smallFirstTag = sortedArr[0].toLowerCase();
    const smallSecondTag = sortedArr[1].toLowerCase();

    res(smallFirstTag + '-' + smallSecondTag);
  });
};

export default makeTagBridgeId;