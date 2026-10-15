export type PortalMember = {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  duesPaid: boolean
  duesUpdatedAt: string | null
  createdAt: string
}

export type PersonRef = {
  id: string | null
  name: string
  avatarUrl: string | null
}

export type CoffeeChat = {
  id: string
  loggedBy: PersonRef & { id: string }
  partner: PersonRef
  date: string
  notes: string
  photoUrl: string | null
  createdAt: string
}

export type AttendanceRecord = {
  memberId: string
  meetingDate: string
}

export type CommunityPhoto = {
  id: string
  url: string
  caption: string | null
  uploadedBy: PersonRef & { id: string }
  createdAt: string
}
