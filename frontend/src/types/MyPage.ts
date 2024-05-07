// 폴더
export type FolderType = {
  folderId: number;
  title: string;
  createAt: string;
};

export type FolderMeetingType = {
  detailId: number;
  title: string;
  createAt: string;
  commentCnt: number;
  participantCnt: number;
  totalTime: string;
};

// 타임라인
export type TimelineDayType = {
  meetingId: number;
  createdDay: number;
  folderTitle: string;
  roomTitle: string;
};

export type TimelineMonthsType = {
  [month: string]: TimelineDayType[];
};
