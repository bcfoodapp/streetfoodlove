import React, { useEffect, useState } from "react";
import { NewChart, useNewChartQuery } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

let data = [

  {
    ID: "30f15697-8c12-41cf-83d9-a9ccfe07c43e",
    name: "Stars",
    "1-star": 2,
    "2-star": 3,
  },
];
export default function ReviewsChart() {
  const {data: stars} = useNewChartQuery()
  const [starCount, setStarCount] = useState([] as any)

  useEffect(() => {
    // console.log('adsfasdfad');
    if (stars) {
      let obj = {
        ID: "30f15697-8c12-41cf-83d9-a9ccfe07c43e",
        name: "Stars",
        "1-star": stars.One,
        "2-star": stars.Two,
        "3-star": stars.Three,
        "4-star": stars.Four,
        "5-star": stars.Five
      }

      setStarCount([obj])
    }
  }, [stars])

  return (
      <BarChart width={800} height={500} data={starCount}>
        /* <CartesianGrid strokeDasharray="3 3" />
        */
        <XAxis dataKey="Stars" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="1-star" fill="#FF6347" width={1}/>
        <Bar dataKey="2-star" fill="#0000FF" />
        <Bar dataKey="3-star" fill="#FF00FF" />
        <Bar dataKey="4-star" fill="#4B0082" />
        <Bar dataKey="5-star" fill="#FFA500" />
      </BarChart>

  )

}
