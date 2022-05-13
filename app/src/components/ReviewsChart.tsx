import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

class ReviewsChart extends React.Component {
  data = [
    {
      ID: "30f15697-8c12-41cf-83d9-a9ccfe07c43e",
      name: "Mommy's Flavor",
      "1-star": 2,
      "2-star": 3,
      "3-star": 30,
      "4-star": 20,
      "5-star": 10,
    },
    {
      ID: "3531910e-e3e9-4b8b-9a31-d9a55448b956",
      name: "Magical Pizza",
      "1-star": 4,
      "2-star": 11,
      "3-star": 31,
      "4-star": 29,
      "5-star": 31,
    },
    {
      ID: "da1e30f8-f47f-4520-985c-f88d07690337",
      name: "Kerala's Kitchen",
      "1-star": 2,
      "2-star": 3,
      "3-star": 48,
      "4-star": 35,
      "5-star": 20,
    },
    {
      ID: "21e0878a-3378-449f-abce-82dbf1145ab6",
      name: "Cafe Yum",
      "1-star": 3,
      "2-star": 5,
      "3-star": 10,
      "4-star": 30,
      "5-star": 30,
    },
    {
      ID: "3becace8-89f5-4bc6-9379-8f84e891cd1d",
      name: "Yeh&Yeh",
      "1-star": 3,
      "2-star": 6,
      "3-star": 30,
      "4-star": 20,
      "5-star": 20,
    },
    {
      ID: "ec54fe44-f045-4f89-bbb2-e65278032a78",
      name: "Greek Dish",
      "1-star": 6,
      "2-star": 7,
      "3-star": 59,
      "4-star": 33,
      "5-star": 29,
    },
    {
      ID: "4b77070b-a507-4a63-90b1-115fa3f6d658",
      name: "Pho Oah",
      "1-star": 8,
      "2-star": 9,
      "3-star": 38,
      "4-star": 28,
      "5-star": 20,
    },
    {
      ID: "46b9c2c3-ca38-4409-b292-2f84c44d6b07",
      name: "Sunny's Fish Ball",
      "1-star": 5,
      "2-star": 10,
      "3-star": 20,
      "4-star": 10,
      "5-star": 10,
    },
    {
      ID: "d2f3bba7-7e1c-4125-a5d5-7c2677f9978b",
      name: "Alpile Sandwitch",
      "1-star": 7,
      "2-star": 8,
      "3-star": 32,
      "4-star": 64,
      "5-star": 47,
    },
    {
      ID: "0b2f894d-280d-47bb-870d-c92786b1b77e",
      name: "T&T ramen",
      "1-star": 6,
      "2-star": 8,
      "3-star": 39,
      "4-star": 43,
      "5-star": 28,
    },
  ];

  render() {
    return (
      <BarChart width={1200} height={500} data={this.data}>
        /* <CartesianGrid strokeDasharray="3 3" />
        */
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="1-star" fill="#FF6347" />
        <Bar dataKey="2-star" fill="#0000FF" />
        <Bar dataKey="3-star" fill="#FF00FF" />
        <Bar dataKey="4-star" fill="#4B0082" />
        <Bar dataKey="5-star" fill="#FFA500" />
      </BarChart>
    );
  }
}

export default ReviewsChart;
