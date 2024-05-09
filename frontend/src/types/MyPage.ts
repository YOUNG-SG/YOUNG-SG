/* 폴더 */
export type FolderType = {
  folderId: number;
  title: string;
  createAt: string;
};

export type FolderMeetingData = {
  detailId: number;
  title: string;
  participantCnt: number;
  commentCnt: number;
  date: string;
  totalTime: string;
};

export type FolderMeetingProps = {
  meeting: FolderMeetingData;
};

/* 타임라인 */
// timeline 타입
export type MeetingData = {
  meetingId: number;
  createdDay: number;
  folderTitle: string;
  roomTitle: string;
};

export type MonthData = {
  [month: string]: MeetingData[];
};

export type YearData = {
  [year: string]: MonthData;
};

// props 타입
export type TimelineYearProps = {
  year: string;
  months: MonthData;
};

export type TimelineMonthProps = {
  month: string;
  days: MeetingData[];
};

export type TimelineMeetingProps = {
  month: string;
  day: MeetingData;
};

/*
{
  // YearData - year: MonthData
  "2024": {
    // MonthData - month: MeetingData[]
    "5": [
      // MeetingData
      {
        meetingId: 3,
        createdDay: 3,
        folderTitle: "폴더테스트1",
        roomTitle: "회의테스트3",
      },
      {}, {}, {}, ...
    ],
    "4": [], "3": [], ...
  },
  "2023": {}, "2022": {}, ...
}
*/
