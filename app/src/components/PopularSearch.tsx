import React, { useEffect, useState } from "react";
import { usePopularSearchQuery, PopularSearch } from "../api";
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label} from "recharts";

export default function PopularSearch() {
  const { data: popularSearch } = usePopularSearchQuery();
  const [searchInMonth, setSearchInMonth] = useState([] as any);
  useEffect(() => {
    if (popularSearch) {
      let temp = [] as PopularSearch[];
      for (const SearchMonth of popularSearch) {
        let obj = {

          QueryText: SearchMonth.QueryText,
          Month: SearchMonth.Month,
          TotalSearch: SearchMonth.TotalSearch,
        };

        temp.push(obj);
      }
      setSearchInMonth(temp);
    }
  }, [popularSearch]);
  console.log(searchInMonth);

  return (
    <BarChart
      width={600}
      height={400}
      data={searchInMonth}
      layout={"vertical"}
      margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
    >
      <text x={500 / 2} y={20} fill="black" textAnchor="left" dominantBaseline="central">
        <tspan fontSize="20">Top 5 Searches in the last Month</tspan>
      </text >
      <XAxis  type='number' dataKey='TotalSearch' label={{
        value: "Searches",
        position: "insideBottomLeft",
        textAnchor: "middle",
      }}/>

      <YAxis  hide type={'category'} label={{
        value: "Searches",
        angle: -90,
        position: "insideLeft",
        textAnchor: "middle",
      }}/>
      <Tooltip />
      <Legend verticalAlign="top"/>

      <Bar type={'category'}  dataKey={'QueryText'}  />
      <Bar  type={'number'} dataKey={'TotalSearch'} fill="#FF4782" />

    </BarChart>
  );
}
