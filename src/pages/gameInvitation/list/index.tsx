import * as React from 'react'
import { memo } from 'react'
import { InvitationList } from '../components'

export interface InvitationListPageProps {}

const InvitationListPage: React.FC<InvitationListPageProps> = () => {
  return <InvitationList />
}

export default memo(InvitationListPage)
