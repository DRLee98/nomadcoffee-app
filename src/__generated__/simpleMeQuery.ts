/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: simpleMeQuery
// ====================================================

export interface simpleMeQuery_me {
  __typename: "User";
  id: number;
  username: string;
  avatarURL: string | null;
}

export interface simpleMeQuery {
  me: simpleMeQuery_me | null;
}
