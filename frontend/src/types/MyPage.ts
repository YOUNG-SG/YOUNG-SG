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
export type MeetingData = {
  meetingId: number;
  createdDay: number;
  folderTitle: string;
  roomTitle: string;
};
// {
//   meetingId: 3,
//   createdDay: 3,
//   folderTitle: "폴더테스트1",
//   roomTitle: "회의테스트3",
// }

export type MonthData = {
  [month: string]: MeetingData[];
};
// "5": [
//   {
//     meetingId: 3,
//     createdDay: 3,
//     folderTitle: "폴더테스트1",
//     roomTitle: "회의테스트3",
//   },
//   {
//     meetingId: 2,
//     createdDay: 1,
//     folderTitle: "폴더테스트1",
//     roomTitle: "회의테스트3",
//   },
// ]

export type YearData = {
  [year: string]: MonthData;
};
// "2024": {
//   "5": [
//     {
//       meetingId: 3,
//       createdDay: 3,
//       folderTitle: "폴더테스트1",
//       roomTitle: "회의테스트3",
//     },
//   ],
//   "4": [
//     {
//       meetingId: 2,
//       createdDay: 10,
//       folderTitle: "폴더테스트1",
//       roomTitle: "회의테스트2",
//     },
//   ],
// }

export type TimelineProps = {
  timeline: YearData;
};

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

const timeline = {
  "2024": {
    "5": [
      {
        meetingId: 3,
        createdDay: 3,
        folderTitle: "폴더테스트1",
        roomTitle: "회의테스트3",
      },
    ],
    "4": [
      {
        meetingId: 2,
        createdDay: 10,
        folderTitle: "폴더테스트1",
        roomTitle: "회의테스트2",
      },
    ],
  },
  "2023": {
    "12": [
      {
        meetingId: 1,
        createdDay: 30,
        folderTitle: "폴더테스트1",
        roomTitle: "회의테스트1",
      },
    ],
  },
};
