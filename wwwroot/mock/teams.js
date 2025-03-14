import { hackathons } from "./hackathons.js";

/**
 * @typedef {Object} Teams
 * @property {number} id
 * @property {string} name
 * @property {string} lead
 * @property {string} image
 * @property {string["Opened", "Closed", "Cancelled"]} status
 * @property {Object} hackathon
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} expiredAt
 */

export const teams = [
    {
        id: 1,
        name: "Team-01",
        lead: "Tom Cassidy",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 2,
        name: "Team-02",
        lead: "John Doe",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[1],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 3,
        name: "Team-01",
        lead: "Tom Cassidy",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 4,
        name: "Team-02",
        lead: "John Doe",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[2],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 5,
        name: "Team-05",
        lead: "Tom Hardy",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[2],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 6,
        name: "Team-06",
        lead: "John Doey",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 7,
        name: "Team-07",
        lead: "Alice Johnson",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[1],
        createdAt: "2025-01-26",
        updatedAt: "2025-02-02",
        expiredAt: "2025-02-06",
    },
    {
        id: 8,
        name: "Team-08",
        lead: "Bob Smith",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-01-27",
        updatedAt: "2025-02-03",
        expiredAt: "2025-02-07",
    },
    {
        id: 9,
        name: "Team-09",
        lead: "Charlie Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[2],
        createdAt: "2025-01-28",
        updatedAt: "2025-02-04",
        expiredAt: "2025-02-08",
    },
    {
        id: 10,
        name: "Team-10",
        lead: "Diana Prince",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[3],
        createdAt: "2025-01-29",
        updatedAt: "2025-02-05",
        expiredAt: "2025-02-09",
    },
    {
        id: 11,
        name: "Team-11",
        lead: "Eve Adams",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[0],
        createdAt: "2025-01-30",
        updatedAt: "2025-02-06",
        expiredAt: "2025-02-10",
    },
    {
        id: 12,
        name: "Team-12",
        lead: "Frank White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[1],
        createdAt: "2025-01-31",
        updatedAt: "2025-02-07",
        expiredAt: "2025-02-11",
    },
    {
        id: 13,
        name: "Team-13",
        lead: "Grace Lee",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-01",
        updatedAt: "2025-02-08",
        expiredAt: "2025-02-12",
    },
    {
        id: 14,
        name: "Team-14",
        lead: "Hank Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-02-02",
        updatedAt: "2025-02-09",
        expiredAt: "2025-02-13",
    },
    {
        id: 15,
        name: "Team-15",
        lead: "Ivy Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-02-03",
        updatedAt: "2025-02-10",
        expiredAt: "2025-02-14",
    },
    {
        id: 16,
        name: "Team-16",
        lead: "Jack Black",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[1],
        createdAt: "2025-02-04",
        updatedAt: "2025-02-11",
        expiredAt: "2025-02-15",
    },
    {
        id: 17,
        name: "Team-17",
        lead: "Karen White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-05",
        updatedAt: "2025-02-12",
        expiredAt: "2025-02-16",
    },
    {
        id: 18,
        name: "Team-18",
        lead: "Leo King",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[3],
        createdAt: "2025-02-06",
        updatedAt: "2025-02-13",
        expiredAt: "2025-02-17",
    },
    {
        id: 19,
        name: "Team-19",
        lead: "Mia Scott",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[0],
        createdAt: "2025-02-07",
        updatedAt: "2025-02-14",
        expiredAt: "2025-02-18",
    },
    {
        id: 20,
        name: "Team-20",
        lead: "Nina Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[1],
        createdAt: "2025-02-08",
        updatedAt: "2025-02-15",
        expiredAt: "2025-02-19",
    },
    {
        id: 21,
        name: "Team-21",
        lead: "Oscar Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-09",
        updatedAt: "2025-02-16",
        expiredAt: "2025-02-20",
    },
    {
        id: 22,
        name: "Team-22",
        lead: "Paul White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-02-10",
        updatedAt: "2025-02-17",
        expiredAt: "2025-02-21",
    },
    {
        id: 23,
        name: "Team-23",
        lead: "Quinn Black",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-02-11",
        updatedAt: "2025-02-18",
        expiredAt: "2025-02-22",
    },
    {
        id: 24,
        name: "Team-24",
        lead: "Rachel Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[1],
        createdAt: "2025-02-12",
        updatedAt: "2025-02-19",
        expiredAt: "2025-02-23",
    },
    {
        id: 25,
        name: "Team-25",
        lead: "Sam Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-13",
        updatedAt: "2025-02-20",
        expiredAt: "2025-02-24",
    },
    {
        id: 26,
        name: "Team-26",
        lead: "Tina White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[3],
        createdAt: "2025-02-14",
        updatedAt: "2025-02-21",
        expiredAt: "2025-02-25",
    },
    {
        id: 27,
        name: "Team-27",
        lead: "Uma Black",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[0],
        createdAt: "2025-02-15",
        updatedAt: "2025-02-22",
        expiredAt: "2025-02-26",
    },
    {
        id: 28,
        name: "Team-28",
        lead: "Vince Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[1],
        createdAt: "2025-02-16",
        updatedAt: "2025-02-23",
        expiredAt: "2025-02-27",
    },
    {
        id: 29,
        name: "Team-29",
        lead: "Wendy Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-17",
        updatedAt: "2025-02-24",
        expiredAt: "2025-02-28",
    },
    {
        id: 30,
        name: "Team-30",
        lead: "Xander White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-02-18",
        updatedAt: "2025-02-25",
        expiredAt: "2025-03-01",
    },
    {
        id: 1,
        name: "Team-01",
        lead: "Tom Cassidy",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 2,
        name: "Team-02",
        lead: "John Doe",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[1],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 3,
        name: "Team-01",
        lead: "Tom Cassidy",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 4,
        name: "Team-02",
        lead: "John Doe",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[2],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 5,
        name: "Team-05",
        lead: "Tom Hardy",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[2],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 6,
        name: "Team-06",
        lead: "John Doey",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 7,
        name: "Team-07",
        lead: "Alice Johnson",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[1],
        createdAt: "2025-01-26",
        updatedAt: "2025-02-02",
        expiredAt: "2025-02-06",
    },
    {
        id: 8,
        name: "Team-08",
        lead: "Bob Smith",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-01-27",
        updatedAt: "2025-02-03",
        expiredAt: "2025-02-07",
    },
    {
        id: 9,
        name: "Team-09",
        lead: "Charlie Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[2],
        createdAt: "2025-01-28",
        updatedAt: "2025-02-04",
        expiredAt: "2025-02-08",
    },
    {
        id: 10,
        name: "Team-10",
        lead: "Diana Prince",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[3],
        createdAt: "2025-01-29",
        updatedAt: "2025-02-05",
        expiredAt: "2025-02-09",
    },
    {
        id: 11,
        name: "Team-11",
        lead: "Eve Adams",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[0],
        createdAt: "2025-01-30",
        updatedAt: "2025-02-06",
        expiredAt: "2025-02-10",
    },
    {
        id: 12,
        name: "Team-12",
        lead: "Frank White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[1],
        createdAt: "2025-01-31",
        updatedAt: "2025-02-07",
        expiredAt: "2025-02-11",
    },
    {
        id: 13,
        name: "Team-13",
        lead: "Grace Lee",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-01",
        updatedAt: "2025-02-08",
        expiredAt: "2025-02-12",
    },
    {
        id: 14,
        name: "Team-14",
        lead: "Hank Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-02-02",
        updatedAt: "2025-02-09",
        expiredAt: "2025-02-13",
    },
    {
        id: 15,
        name: "Team-15",
        lead: "Ivy Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-02-03",
        updatedAt: "2025-02-10",
        expiredAt: "2025-02-14",
    },
    {
        id: 16,
        name: "Team-16",
        lead: "Jack Black",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[1],
        createdAt: "2025-02-04",
        updatedAt: "2025-02-11",
        expiredAt: "2025-02-15",
    },
    {
        id: 17,
        name: "Team-17",
        lead: "Karen White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-05",
        updatedAt: "2025-02-12",
        expiredAt: "2025-02-16",
    },
    {
        id: 18,
        name: "Team-18",
        lead: "Leo King",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[3],
        createdAt: "2025-02-06",
        updatedAt: "2025-02-13",
        expiredAt: "2025-02-17",
    },
    {
        id: 19,
        name: "Team-19",
        lead: "Mia Scott",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[0],
        createdAt: "2025-02-07",
        updatedAt: "2025-02-14",
        expiredAt: "2025-02-18",
    },
    {
        id: 20,
        name: "Team-20",
        lead: "Nina Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[1],
        createdAt: "2025-02-08",
        updatedAt: "2025-02-15",
        expiredAt: "2025-02-19",
    },
    {
        id: 21,
        name: "Team-21",
        lead: "Oscar Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-09",
        updatedAt: "2025-02-16",
        expiredAt: "2025-02-20",
    },
    {
        id: 22,
        name: "Team-22",
        lead: "Paul White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-02-10",
        updatedAt: "2025-02-17",
        expiredAt: "2025-02-21",
    },
    {
        id: 23,
        name: "Team-23",
        lead: "Quinn Black",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-02-11",
        updatedAt: "2025-02-18",
        expiredAt: "2025-02-22",
    },
    {
        id: 24,
        name: "Team-24",
        lead: "Rachel Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[1],
        createdAt: "2025-02-12",
        updatedAt: "2025-02-19",
        expiredAt: "2025-02-23",
    },
    {
        id: 25,
        name: "Team-25",
        lead: "Sam Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-13",
        updatedAt: "2025-02-20",
        expiredAt: "2025-02-24",
    },
    {
        id: 26,
        name: "Team-26",
        lead: "Tina White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[3],
        createdAt: "2025-02-14",
        updatedAt: "2025-02-21",
        expiredAt: "2025-02-25",
    },
    {
        id: 27,
        name: "Team-27",
        lead: "Uma Black",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[0],
        createdAt: "2025-02-15",
        updatedAt: "2025-02-22",
        expiredAt: "2025-02-26",
    },
    {
        id: 28,
        name: "Team-28",
        lead: "Vince Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[1],
        createdAt: "2025-02-16",
        updatedAt: "2025-02-23",
        expiredAt: "2025-02-27",
    },
    {
        id: 29,
        name: "Team-29",
        lead: "Wendy Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-17",
        updatedAt: "2025-02-24",
        expiredAt: "2025-02-28",
    },
    {
        id: 30,
        name: "Team-30",
        lead: "Xander White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-02-18",
        updatedAt: "2025-02-25",
        expiredAt: "2025-03-01",
    },
    {
        id: 1,
        name: "Team-01",
        lead: "Tom Cassidy",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 2,
        name: "Team-02",
        lead: "John Doe",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[1],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 3,
        name: "Team-01",
        lead: "Tom Cassidy",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 4,
        name: "Team-02",
        lead: "John Doe",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[2],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 5,
        name: "Team-05",
        lead: "Tom Hardy",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[2],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 6,
        name: "Team-06",
        lead: "John Doey",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-01-25",
        updatedAt: "2025-02-01",
        expiredAt: "2025-02-05",
    },
    {
        id: 7,
        name: "Team-07",
        lead: "Alice Johnson",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[1],
        createdAt: "2025-01-26",
        updatedAt: "2025-02-02",
        expiredAt: "2025-02-06",
    },
    {
        id: 8,
        name: "Team-08",
        lead: "Bob Smith",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-01-27",
        updatedAt: "2025-02-03",
        expiredAt: "2025-02-07",
    },
    {
        id: 9,
        name: "Team-09",
        lead: "Charlie Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[2],
        createdAt: "2025-01-28",
        updatedAt: "2025-02-04",
        expiredAt: "2025-02-08",
    },
    {
        id: 10,
        name: "Team-10",
        lead: "Diana Prince",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[3],
        createdAt: "2025-01-29",
        updatedAt: "2025-02-05",
        expiredAt: "2025-02-09",
    },
    {
        id: 11,
        name: "Team-11",
        lead: "Eve Adams",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[0],
        createdAt: "2025-01-30",
        updatedAt: "2025-02-06",
        expiredAt: "2025-02-10",
    },
    {
        id: 12,
        name: "Team-12",
        lead: "Frank White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[1],
        createdAt: "2025-01-31",
        updatedAt: "2025-02-07",
        expiredAt: "2025-02-11",
    },
    {
        id: 13,
        name: "Team-13",
        lead: "Grace Lee",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-01",
        updatedAt: "2025-02-08",
        expiredAt: "2025-02-12",
    },
    {
        id: 14,
        name: "Team-14",
        lead: "Hank Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-02-02",
        updatedAt: "2025-02-09",
        expiredAt: "2025-02-13",
    },
    {
        id: 15,
        name: "Team-15",
        lead: "Ivy Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-02-03",
        updatedAt: "2025-02-10",
        expiredAt: "2025-02-14",
    },
    {
        id: 16,
        name: "Team-16",
        lead: "Jack Black",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[1],
        createdAt: "2025-02-04",
        updatedAt: "2025-02-11",
        expiredAt: "2025-02-15",
    },
    {
        id: 17,
        name: "Team-17",
        lead: "Karen White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-05",
        updatedAt: "2025-02-12",
        expiredAt: "2025-02-16",
    },
    {
        id: 18,
        name: "Team-18",
        lead: "Leo King",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[3],
        createdAt: "2025-02-06",
        updatedAt: "2025-02-13",
        expiredAt: "2025-02-17",
    },
    {
        id: 19,
        name: "Team-19",
        lead: "Mia Scott",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[0],
        createdAt: "2025-02-07",
        updatedAt: "2025-02-14",
        expiredAt: "2025-02-18",
    },
    {
        id: 20,
        name: "Team-20",
        lead: "Nina Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[1],
        createdAt: "2025-02-08",
        updatedAt: "2025-02-15",
        expiredAt: "2025-02-19",
    },
    {
        id: 21,
        name: "Team-21",
        lead: "Oscar Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-09",
        updatedAt: "2025-02-16",
        expiredAt: "2025-02-20",
    },
    {
        id: 22,
        name: "Team-22",
        lead: "Paul White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-02-10",
        updatedAt: "2025-02-17",
        expiredAt: "2025-02-21",
    },
    {
        id: 23,
        name: "Team-23",
        lead: "Quinn Black",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[0],
        createdAt: "2025-02-11",
        updatedAt: "2025-02-18",
        expiredAt: "2025-02-22",
    },
    {
        id: 24,
        name: "Team-24",
        lead: "Rachel Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[1],
        createdAt: "2025-02-12",
        updatedAt: "2025-02-19",
        expiredAt: "2025-02-23",
    },
    {
        id: 25,
        name: "Team-25",
        lead: "Sam Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-13",
        updatedAt: "2025-02-20",
        expiredAt: "2025-02-24",
    },
    {
        id: 26,
        name: "Team-26",
        lead: "Tina White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[3],
        createdAt: "2025-02-14",
        updatedAt: "2025-02-21",
        expiredAt: "2025-02-25",
    },
    {
        id: 27,
        name: "Team-27",
        lead: "Uma Black",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[0],
        createdAt: "2025-02-15",
        updatedAt: "2025-02-22",
        expiredAt: "2025-02-26",
    },
    {
        id: 28,
        name: "Team-28",
        lead: "Vince Brown",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Opened",
        hackathon: hackathons[1],
        createdAt: "2025-02-16",
        updatedAt: "2025-02-23",
        expiredAt: "2025-02-27",
    },
    {
        id: 29,
        name: "Team-29",
        lead: "Wendy Green",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Cancelled",
        hackathon: hackathons[2],
        createdAt: "2025-02-17",
        updatedAt: "2025-02-24",
        expiredAt: "2025-02-28",
    },
    {
        id: 30,
        name: "Team-30",
        lead: "Xander White",
        image: "https://www.dailytech.in.th/wp-content/uploads/2019/09/Hackathon-event.png",
        status: "Closed",
        hackathon: hackathons[3],
        createdAt: "2025-02-18",
        updatedAt: "2025-02-25",
        expiredAt: "2025-03-01",
    },
];