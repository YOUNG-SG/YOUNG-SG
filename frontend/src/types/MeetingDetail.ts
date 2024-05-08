export type Participant = {
  nickName: string;
  profile: string;
};

export type MeetingDetailData = {
  detailId: number;
  summary: string;
  participantInfoDtoList: Participant[];
  fileUrl: string;
  preMeetingId: number | null;
  nextMeetingId: number | null;
  date: string;
  title: string; // 회의명
  name: string; // 파일명
};

export type MeetingNavigationBoxProps = {
  prev: number | null;
  cur: string;
  next: number | null;
  date: string;
  title: string;
};

export type MeetingNavigationInfoProps = {
  move: [number | null, string][]; // prev or next
  cur: string;
  date: string;
  title: string;
};

export type ArrowButtonProps = {
  prev: number | null;
  next: number | null;
};
