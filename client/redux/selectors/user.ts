import { UserObject } from './../../models/user'
import { createSelector, createIdSelector } from 'redux-views'
import { RootStateOrAny } from 'react-redux'

export const helpers = {
  getUser: (state: any) => state.user.currentUser,
  getUserId: createIdSelector((user: any) => user?.id),
}

export const selectors = {}
