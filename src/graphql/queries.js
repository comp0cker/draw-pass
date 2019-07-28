// eslint-disable
// this is an auto generated file. This will be overwritten

export const getDeck = `query GetDeck($id: ID!) {
  getDeck(id: $id) {
    id
    title
    list
  }
}
`;
export const listDecks = `query ListDecks(
  $filter: ModelDeckFilterInput
  $limit: Int
  $nextToken: String
) {
  listDecks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      list
    }
    nextToken
  }
}
`;
