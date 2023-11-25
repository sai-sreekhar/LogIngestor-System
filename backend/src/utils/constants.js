const constants = {
  DELIVERY_STREAM_NAME_1: "logingestor-firehose",
  DELIVERY_STREAM_NAME_2: "logingestor-firehose-2",
  DELIVERY_STREAM_NAME_3: "logingestor-firehose-3",
  DELIVERY_STREAM_NAME_4: "logingestor-firehose-4",
  DELIVERY_STREAM_NAME_5: "logingestor-firehose-5",
  INDEX_NAME: "logs",
  OPEN_SEARCH_HOST:
    "https://search-logingestor-domain-47zqt6todapeghf27j6qhkxgdy.ap-south-1.es.amazonaws.com",
};

const roles = {
  ADMIN: 0,
  SUB_ADMIN: 1,
};

module.exports = {
  constants,
  roles,
};
